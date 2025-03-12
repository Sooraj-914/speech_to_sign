// Function to toggle the menu on smaller screens
function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('show');
}

// Function to convert text to SiGML and send it to CWASA
function convertAndPlay() {
    const textBox = document.querySelector('.text-box');
    const text = textBox.value.trim();

    if (text === "") {
        alert("Please enter some text to convert.");
        return;
    }

    // Replace this with logic to generate or fetch the correct SiGML file
    const sigmlUrl = `https://yourwebsite.com/path/to/${encodeURIComponent(text)}.sigml`;

    // Update the iframe source
    const cwasaFrame = document.getElementById('cwasa-frame');
    cwasaFrame.src = `https://vh.cmp.uea.ac.uk/cwasa/player.html?sigml=${sigmlUrl}`;

    console.log("Sending text to CWASA:", text);
}

// Function to clear the text box in the home page
function clearText() {
    const textBox = document.querySelector('.text-box');
    textBox.value = "";
    console.log("Text box cleared.");
}

// Function to start speech recognition
/*function startSpeechRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognition result:", transcript);
        document.querySelector('.text-box').value = transcript;
        playTranscript(transcript);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error detected: ' + event.error);
    };

    recognition.start();
}*/

// Function to start speech recognition
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            const textBox = document.querySelector('.text-box');
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            
            recognition.onstart = function() {
                console.log("Speech recognition started. Speak now.");
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                textBox.value = transcript; // Display recognized text in the text box
                console.log("Recognized text:", transcript);
            };

            recognition.onerror = function(event) {
                console.error("Speech recognition error:", event.error);
            };

            recognition.onspeechend = function() {
                recognition.stop();
                console.log("Speech recognition stopped.");
            };

            recognition.start();
        })
        .catch(err => alert("Microphone access denied. Please enable it in your browser settings."));
}

// Function to play the transcript
async function playTranscript(transcript) {
    console.log("Transcript received:", transcript);
    const words = transcript.split(' ');
    let sigmlText = '<?xml version="1.0" encoding="utf-8"?><sigml>';

    for (const word of words) {
        console.log("Fetching SiGML for word:", word);
        const sigml = await fetchSiGML(word);
        sigmlText += sigml;
    }

    sigmlText += '</sigml>';
    console.log("Generated SiGML text:", sigmlText);
    document.querySelector('.txtaSiGMLText.av0').value = sigmlText;
    document.querySelector('.bttnPlaySiGMLText.av0').click();
}

// Function to fetch SiGML for a word
async function fetchSiGML(word) {
    try {
        const response = await fetch(`/static/SignFiles/${word}.sigml`);
        if (response.ok) {
            console.log(`Successfully fetched SiGML for word: ${word}`);
            return await response.text();
        } else {
            console.error(`Failed to fetch SiGML for word: ${word}`);
            return '';
        }
    } catch (error) {
        console.error(`Error fetching SiGML for word: ${word}`, error);
        return '';
    }
}

// Function to handle navigation
function navigateTo(page) {
    if (page === "home") {
        window.location.href = "/";
    } else if (page === "feedback") {
        window.location.href = "/feedback";
    } else if (page === "dictionary") {
        window.location.href = "https://www.dictionary.com";
    }
}

// Function to handle the rating system in the feedback page
function rate(value) {
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingText = document.getElementById('ratingText');

    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });

    ratingText.textContent = `You rated: ${value} star(s)`;
    console.log(`Rating submitted: ${value}`);
}

// Function to submit feedback in the feedback page
function submitFeedback() {
    const feedbackText = document.getElementById('feedback').value.trim();
    const ratingText = document.getElementById('ratingText').textContent;

    if (feedbackText === "") {
        alert("Please provide feedback before submitting.");
        return;
    }

    console.log("Feedback submitted:", feedbackText);
    console.log("Rating:", ratingText);
    document.getElementById('feedback').value = "";

    const thankYouMessage = document.getElementById('thankYouMessage');
    thankYouMessage.style.display = "block";
}

// Add event listeners to navigation links
document.addEventListener('DOMContentLoaded', function () {
    const homeLink = document.querySelector('.navbar a[href="/"]');
    const feedbackLink = document.querySelector('.navbar a[href="/feedback"]');
    const dictionaryLink = document.querySelector('.navbar a[href="https://www.dictionary.com"]');

    if (homeLink) {
        homeLink.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo("home");
        });
    }

    if (feedbackLink) {
        feedbackLink.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo("feedback");
        });
    }

    if (dictionaryLink) {
        dictionaryLink.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo("dictionary");
        });
    }
});

