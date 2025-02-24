let stopwatchInterval;
let seconds = 0;
let minutes = 0;
let isRunning = false;
let isQuoteActive = false;
let currentQuote = "";
let currentQuoteIndex = 0;
let typingInterval;
let isResetting = false;
let cooldownTimer;
let cooldownTime = 10;
let cooldownActive = false;
let isBreakTimeLocked = false; // New flag to track break time lock

const stopwatchDisplay = document.getElementById("stopwatch");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const breakTimeInput = document.getElementById("breakTime");
const breaksDisplay = document.getElementById("breaks");
const quoteText = document.getElementById("quoteText");

const audio = document.getElementById("audioPlayer");
const musicButton = document.getElementById("musicButton");
const musicDropdown = document.getElementById("musicDropdown");
const muteButton = document.getElementById("muteButton");
let isMuted = false;

const quotes = [
  "Hard work never fails.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The best way to predict the future is to create it.",
  "Believe in yourself and all that you are.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Don’t stop when you’re tired. Stop when you’re done."
];

function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startStopwatch() {
  stopwatchInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      minutes++;
      seconds = 0;
    }

    if (minutes > 0 && minutes % 5 === 0 && !isQuoteActive) {
      showRandomQuote();
    }

    stopwatchDisplay.textContent = formatTime(minutes * 60 + seconds);
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
}

function disableButtons() {
  startStopBtn.disabled = true;
  resetBtn.disabled = true;
}

function enableButtons() {
  startStopBtn.disabled = false;
  resetBtn.disabled = false;
}

function startCooldown() {
  cooldownActive = true;
  cooldownTime = 10;
  updateButtonCooldown();
  cooldownTimer = setInterval(() => {
    cooldownTime--;
    updateButtonCooldown();

    if (cooldownTime <= 0) {
      clearInterval(cooldownTimer);
      cooldownActive = false;
      enableButtons();
      updateStartStopButtonText(); // Ensure button text is updated correctly after cooldown
    }
  }, 1000);
}

function updateButtonCooldown() {
  if (isRunning) {
    startStopBtn.textContent = `Stop (${cooldownTime})`;
  } else {
    startStopBtn.textContent = `Start (${cooldownTime})`;
  }
  resetBtn.textContent = `Reset (${cooldownTime})`;
}

// Ensure the button correctly shows "Start" or "Stop" based on stopwatch state
function updateStartStopButtonText() {
  startStopBtn.textContent = isRunning ? "Stop" : "Start";
}

startStopBtn.addEventListener("click", () => {
  if (cooldownActive) return;

  if (!isBreakTimeLocked) {
    // Lock break time input once the timer starts for the first time
    isBreakTimeLocked = true;
    breakTimeInput.disabled = true;
  }

  if (isRunning) {
    stopStopwatch();
  } else {
    startStopwatch();
  }

  isRunning = !isRunning;
  updateStartStopButtonText();

  if (!isQuoteActive) {
    showRandomQuote();
  }

  disableButtons();
  startCooldown();
});

resetBtn.addEventListener("click", () => {
  if (cooldownActive) return;

  stopStopwatch();
  seconds = 0;
  minutes = 0;
  stopwatchDisplay.textContent = "00:00";
  breaksDisplay.textContent = 0;
  isRunning = false;

  updateStartStopButtonText();
  
  // Reset break time input so user can modify it again
  isBreakTimeLocked = false;
  breakTimeInput.disabled = false;

  quoteText.textContent = "Quotes will appear here.";
  isQuoteActive = false;

  disableButtons();
  startCooldown();
});

function showRandomQuote() {
  if (isQuoteActive) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  currentQuote = quotes[randomIndex];
  currentQuoteIndex = 0;

  quoteText.textContent = "";
  isQuoteActive = true;
  typingEffect();
}

function typingEffect() {
  if (currentQuoteIndex < currentQuote.length) {
    quoteText.textContent += currentQuote.charAt(currentQuoteIndex);
    currentQuoteIndex++;
    setTimeout(typingEffect, 100);
  }
}

musicButton.addEventListener("click", () => {
  musicDropdown.style.display = musicDropdown.style.display === "block" ? "none" : "block";
});

document.querySelectorAll(".musicOption").forEach(option => {
  option.addEventListener("click", (e) => {
    const musicFile = e.target.getAttribute("data-music");
    audio.src = musicFile;
    audio.play();
    musicDropdown.style.display = "none";
  });
});

muteButton.addEventListener("click", () => {
  if (isMuted) {
    audio.muted = false;
    muteButton.textContent = "Mute";
  } else {
    audio.muted = true;
    muteButton.textContent = "Unmute";
  }
  isMuted = !isMuted;
});

// Initialize the application
function init() {
  stopwatchDisplay.textContent = "00:00";
  updateStartStopButtonText();
  resetBtn.textContent = "Reset";
  
  // Ensure break time input is enabled at start
  breakTimeInput.disabled = false;
  isBreakTimeLocked = false;

  isRunning = false;
  isQuoteActive = false;
  currentQuote = "";
  currentQuoteIndex = 0;
  isResetting = false;
  cooldownActive = false;
  cooldownTime = 10;
}

init();
