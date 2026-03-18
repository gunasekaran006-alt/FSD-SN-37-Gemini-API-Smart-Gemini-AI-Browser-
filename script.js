document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Paste your actual API Key here (Create a new one for safety!)
    const API_KEY = ""; 
    
    // Gemini 1.5 Flash Model URL for fast text generation
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    // DOM Elements
    const button = document.getElementById("askGemini");
    const userInput = document.getElementById("userInput");
    const resultDiv = document.getElementById("result");
    const actionButtons = document.getElementById("actionButtons");
    const micBtn = document.getElementById("micBtn"); // The Microphone button
    
    // Variable to store the AI's response for the copy and share features
    let currentAIResponse = ""; 

    // --- 1. MAIN SEARCH LOGIC (Text) ---
    button.addEventListener("click", async () => {
        const input = userInput.value.trim();

        // Check if the input is empty
        if(!input){
            resultDiv.innerHTML = `
            <div class="alert alert-warning text-center fw-bold mt-4">
                ⚠️ Please enter a topic to search!
            </div>`;
            return;
        }

        // The prompt structure sent to the AI
        const prompt = `
        Provide a comprehensive and easy-to-understand explanation of '${input}'. 
        Please format the response nicely and include:
        - A clear definition
        - Background context or history
        - Key facts or a real-world example
        - Why it matters or where it's used
        - A web reference link to learn more
        Keep the explanation structured with headings and bullet points. Write at least 100 words.
        `;

        // Hide action buttons and show the loading spinner
        actionButtons.classList.add("d-none");
        resultDiv.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center mt-5 text-primary">
            <div class="spinner-border mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
            <span class="fw-semibold">Thinking... Please wait...</span>
        </div>`;

        try {
            // Making the API Call to Gemini
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        { role: "user", parts: [{ text: prompt }] }
                    ]
                })
            });

            // Get the raw data from the API
            const data = await response.json();
            
            // Print the raw data to the console for debugging
            console.log("Raw API Response:", data);

            // 1. Check if Google sent back an explicit error message
            if (data.error) {
                resultDiv.innerHTML = `
                <div class="alert alert-danger mt-4">
                    <strong>Google API Error:</strong> ${data.error.message}
                </div>`;
                actionButtons.classList.add("d-none");
                return; // Stop execution here
            }

            // 2. Safely extract the text response
            const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (outputText) {
                currentAIResponse = outputText; 
                resultDiv.innerHTML = marked.parse(outputText);
                actionButtons.classList.remove("d-none");
                actionButtons.classList.add("d-flex");
            } else {
                // If there's no error, but also no text (e.g., safety block)
                resultDiv.innerHTML = `
                <div class="alert alert-danger mt-4">
                    No text found in response. Open your browser console (Right-click -> Inspect -> Console) for more details.
                </div>`;
            }

        } catch (err) {
            console.error("Fetch Error:", err);
            resultDiv.innerHTML = `
            <div class="alert alert-danger text-center fw-bold mt-4">
                ❌ Network Error connecting to Gemini AI.
            </div>`;
        }
    }); // <-- MISSING BRACKET FIXED HERE

    // Trigger the search when the 'Enter' key is pressed in the input box
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            button.click();
        }
    });

    // --- 2. VOICE SEARCH LOGIC (Web Speech API) ---
    // Check if the browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop listening automatically when the user stops speaking

        // When the microphone starts listening
        recognition.onstart = () => {
            micBtn.classList.replace("btn-outline-secondary", "btn-danger");
            micBtn.innerHTML = "🎙️"; // Change icon
            userInput.placeholder = "Listening... Speak now...";
        };

        // When the speech is successfully converted to text
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript; // Place the recognized text into the input box
            button.click(); // Automatically trigger the search button
        };

        // When the microphone turns off
        recognition.onend = () => {
            micBtn.classList.replace("btn-danger", "btn-outline-secondary");
            micBtn.innerHTML = "🎤"; // Revert icon
            userInput.placeholder = "Ask anything (e.g., What is React?)...";
        };

        // Start listening when the mic button is clicked
        micBtn.addEventListener("click", () => {
            recognition.start();
        });
    } else {
        // Hide the mic button if the browser doesn't support Voice Search
        if (micBtn) micBtn.style.display = "none";
        console.warn("Voice Search is not supported in this browser.");
    }

    // --- 3. COPY BUTTON LOGIC ---
    document.getElementById("copyBtn").addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(currentAIResponse);
            
            // Provide visual feedback
            const copyBtn = document.getElementById("copyBtn");
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = "✅ Copied!";
            copyBtn.classList.replace("btn-outline-secondary", "btn-success");
            
            // Revert button back to normal after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.replace("btn-success", "btn-outline-secondary");
            }, 2000);

        } catch (err) {
            alert("❌ Failed to copy text to clipboard.");
            console.error(err);
        }
    });

    // --- 4. SHARE BUTTON LOGIC ---
    document.getElementById("shareBtn").addEventListener("click", async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this answer from my Gemini Browser!',
                    text: currentAIResponse
                });
            } catch (err) {
                console.log("Share process was cancelled or failed.");
            }
        } else {
            alert("⚠️ Web Share API is not supported in your current browser. Try it on a mobile device!");
        }
    });

});