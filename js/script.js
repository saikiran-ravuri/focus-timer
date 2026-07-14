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

// application state

const timerState = {
    duration: 25 * 60,
    remainingSeconds: 25 * 60,
    timerId: null,
    isRunning: false
};

// timer function

function formatTime(totalSeconds){
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2,"0");
    const formattedSeconds = String(seconds).padStart(2,"0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

//timer function

function startTimer() {
    if (timerState.isRunning) {
        return;
    }

    timerState.isRunning = true;

    statusText.textContent = "Running";

    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;

    timerState.timerId = setInterval(() => {
        timerState.remainingSeconds--;
        updateTimerDisplay();

        if (timerState.remainingSeconds <= 0) {
            clearInterval(timerState.timerId);

            timerState.timerId = null;
            timerState.isRunning = false;

            statusText.textContent = "Completed";

            startButton.disabled = false;
            pauseButton.disabled = true;
            resetButton.disabled = false;
        }
    }, 1000);
}

// pause function

function pauseTimer() {
    clearInterval(timerState.timerId);

    timerState.timerId = null;
    timerState.isRunning = false;

    statusText.textContent = "Paused";

    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = false;
}

// reset function

function resetTimer() {
    clearInterval(timerState.timerId);

    timerState.timerId = null;
    timerState.isRunning = false;

    statusText.textContent = "Ready";

    timerState.remainingSeconds = timerState.duration;

    updateTimerDisplay();

    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
}

// update duration

function updateDuration() {
    const minutes = Number(durationInput.value);

    timerState.duration = minutes * 60;
    timerState.remainingSeconds = timerState.duration;

    updateTimerDisplay();
}

// update display timer

function updateTimerDisplay(){
    timerDisplay.textContent = formatTime(timerState.remainingSeconds);

    remainingTime.textContent =
    `${Math.ceil(timerState.remainingSeconds / 60)} Minutes`;

    const progress =
    timerState.remainingSeconds / timerState.duration;

    progressRing.style.strokeDashoffset =
        ringCircumference * (1 - progress);
}
updateTimerDisplay();

// event listeners

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
durationInput.addEventListener("input", updateDuration);

// circular progress ring

const ringRadius = 110;
const ringCircumference = 2 * Math.PI * ringRadius;

progressRing.style.strokeDasharray = ringCircumference;
progressRing.style.strokeDashoffset = 0;
