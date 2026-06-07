const voiceTriggerBtn = document.getElementById('voiceTriggerBtn');
const systemLog = document.getElementById('systemLog');
const assistantAvatar = document.getElementById('assistantAvatar');
const micStatusIcon = document.getElementById('micStatusIcon');

// Check compatibility with Web Speech Recognition Engine
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    // Trigger active speech recognition via UI click event
    voiceTriggerBtn.addEventListener('click', () => {
        try {
            recognition.start();
        } catch (error) {
            console.log("Speech service engine is already executing.");
        }
    });

    // Handle listener active states
    recognition.onstart = () => {
        systemLog.innerText = "Listening...";
        systemLog.style.color = "#00e5ff";
        assistantAvatar.className = "avatar-img active";
        micStatusIcon.className = "fa-solid fa-circle-notch fa-spin"; // Turn mic into processing spinner
    };

    // Parse valid audio input translates to logic parser
    recognition.onresult = (event) => {
        const userSpeechIntent = event.results[0][0].transcript.toLowerCase();
        systemLog.innerText = `You said: "${userSpeechIntent}"`;
        systemLog.style.color = "#ffffff";

        executeAssistantCommand(userSpeechIntent);
    };

    // Reset UI properties when session shuts down
    recognition.onend = () => {
        assistantAvatar.className = "avatar-img idle";
        micStatusIcon.className = "fa-solid fa-microphone";
        if (systemLog.innerText === "Listening...") {
            systemLog.innerText = "Ready to listen";
            systemLog.style.color = "#666";
        }
    };

    recognition.onerror = (err) => {
        systemLog.innerText = "Error capturing speech stream details.";
        systemLog.style.color = "#ff3399";
    };

} else {
    systemLog.innerText = "Speech API platform profiles are unavailable on this interface.";
    voiceTriggerBtn.disabled = true;
    voiceTriggerBtn.style.opacity = "0.4";
}

// Voice Engine Synthesis (TTS Audio Out Output Module)
function generateVoiceReply(responseText) {
    window.speechSynthesis.cancel(); // Clears any stacked voices
    const textToSpeechEngine = new SpeechSynthesisUtterance(responseText);
    textToSpeechEngine.pitch = 1.1;
    textToSpeechEngine.rate = 1.0;

    textToSpeechEngine.onstart = () => {
        assistantAvatar.className = "avatar-img active";
    };
    textToSpeechEngine.onend = () => {
        assistantAvatar.className = "avatar-img idle";
    };

    window.speechSynthesis.speak(textToSpeechEngine);
}

// Processing Input Routing Table
function executeAssistantCommand(processedInput) {
    if (processedInput.includes('hello') || processedInput.includes('hi')) {
        generateVoiceReply("Hello! I am Shifra. How can I assist you today?");
    }
    else if (processedInput.includes('your name')) {
        generateVoiceReply("My name is Shifra, your virtual assistant.");
    }
    else if (processedInput.includes('time')) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        generateVoiceReply(`The time is ${currentTime}`);
    }
    else if (processedInput.includes('open google')) {
        generateVoiceReply("Opening Google Search Engine.");
        window.open('https://www.google.com', '_blank');
    }
    else if (processedInput.includes('open youtube')) {
        generateVoiceReply("Opening YouTube.");
        window.open('https://www.youtube.com', '_blank');
    }
    else {
        generateVoiceReply("Command unmapped. Searching Google for " + processedInput);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(processedInput)}`, '_blank');
    }
}
