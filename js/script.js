"use strict";

// dom references

const durationInput = document.getElementById("durationInput");
const timerDisplay = document.getElementById("timerDisplay");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");

const statusText = document.getElementById("status");
const remainingTime = document.getElementById("remainingTime");
const sessionName = document.getElementById("sessionName");
const progressRing = document.getElementById("progressRing");

// audio

const completionSound = new Audio("./assets/completion.mp3");

completionSound.preload = "auto";

// application state

const timerState = {
    duration: 25 * 60,
    remainingSeconds: 25 * 60,
    timerId: null,
    isRunning: false
};

// progress ring

const ringRadius = 110;
const ringCircumference = 2 * Math.PI * ringRadius;

progressRing.style.strokeDasharray = String(ringCircumference);
progressRing.style.strokeDashoffset = "0";

// untility functions

function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);

    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}


function playCompletionSound() {
    completionSound.currentTime = 0;

    completionSound.play().catch((error) => {
        console.error("Unable to play completion sound:", error);
    });
}

// ui functions

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(
        timerState.remainingSeconds
    );

    const remainingMinutes = Math.ceil(
        timerState.remainingSeconds / 60
    );

    remainingTime.textContent =
        `${remainingMinutes} ${
            remainingMinutes === 1 ? "Minute" : "Minutes"
        }`;

    const progress =
        timerState.duration > 0
            ? timerState.remainingSeconds / timerState.duration
            : 0;

    const safeProgress = Math.max(0, Math.min(1, progress));

    progressRing.style.strokeDashoffset = String(
        ringCircumference * (1 - safeProgress)
    );

    progressRing.setAttribute(
        "aria-valuenow",
        String(Math.round(safeProgress * 100))
    );
}


function updateControls(state) {
    const isRunning = state === "running";
    const isReady = state === "ready";

    startButton.disabled = isRunning;
    pauseButton.disabled = !isRunning;
    resetButton.disabled = isReady;
    durationInput.disabled = isRunning;
}


function updateStatus(status) {
    statusText.textContent = status;

    if (status === "Completed") {
        sessionName.textContent = "Session Complete";
        return;
    }

    sessionName.textContent = "Focus Session";
}

// timer functions

function stopInterval() {
    clearInterval(timerState.timerId);

    timerState.timerId = null;
    timerState.isRunning = false;
}


function completeTimer() {
    stopInterval();

    timerState.remainingSeconds = 0;

    updateTimerDisplay();
    updateStatus("Completed");
    updateControls("completed");

    playCompletionSound();
}


function startTimer() {
    if (timerState.isRunning) {
        return;
    }

    if (timerState.remainingSeconds <= 0) {
        timerState.remainingSeconds = timerState.duration;
        updateTimerDisplay();
    }

    timerState.isRunning = true;

    updateStatus("Running");
    updateControls("running");

    timerState.timerId = setInterval(() => {
        timerState.remainingSeconds -= 1;

        updateTimerDisplay();

        if (timerState.remainingSeconds <= 0) {
            completeTimer();
        }
    }, 1000);
}


function pauseTimer() {
    if (!timerState.isRunning) {
        return;
    }

    stopInterval();

    updateStatus("Paused");
    updateControls("paused");
}


function resetTimer() {
    stopInterval();

    timerState.remainingSeconds = timerState.duration;

    updateTimerDisplay();
    updateStatus("Ready");
    updateControls("ready");
}

// duration funtion

function updateDuration() {
    const inputValue = durationInput.value.trim();

    if (inputValue === "") {
        return;
    }

    const minutes = Number(inputValue);

    if (
        !Number.isFinite(minutes) ||
        minutes < 1 ||
        minutes > 120
    ) {
        return;
    }

    stopInterval();

    timerState.duration = minutes * 60;
    timerState.remainingSeconds = timerState.duration;

    updateTimerDisplay();
    updateStatus("Ready");
    updateControls("ready");
}


function restoreDurationInput() {
    const minutes = Number(durationInput.value);

    if (
        durationInput.value.trim() === "" ||
        !Number.isFinite(minutes) ||
        minutes < 1 ||
        minutes > 120
    ) {
        durationInput.value = timerState.duration / 60;
    }
}

// event listeners

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

durationInput.addEventListener("input", updateDuration);
durationInput.addEventListener("blur", restoreDurationInput);

// initialise 

updateTimerDisplay();
updateStatus("Ready");
updateControls("ready");