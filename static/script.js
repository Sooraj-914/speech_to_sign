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