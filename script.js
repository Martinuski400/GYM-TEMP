// script.js

let timer;
let isRunning = false;
let totalSeconds = 0;
let seconds = 0;
let currentRepetition = 0;
let workTime = 30;
let restTime = 10;
let totalRepetitions = 5;
let isResting = false;
let countdownTimer;

// Configuración del gráfico circular
const circle = new ProgressBar.Circle('#circle-container', {
    strokeWidth: 6,
    color: '#ff4500',
    trailColor: '#eee',
    trailWidth: 1,
    text: {
        value: '00:00',
        style: {
            color: '#000',
            position: 'absolute',
            top: '50%',
            left: '50%',
            padding: 0,
            margin: 0,
            transform: {
                prefix: true,
                value: 'translate(-50%, -50%)'
            }
        }
    }
});

const alarmSound = document.getElementById('alarm-sound');

function playAlarm() {
    alarmSound.play();
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    circle.setText(timeString);
    circle.animate(seconds / (isResting ? restTime : workTime));
}

function startCountdown(callback) {
    let countdown = 3;
    document.getElementById('status').textContent = `Comenzando en ${countdown}`;
    countdownTimer = setInterval(() => {
        countdown--;
        document.getElementById('status').textContent = `Comenzando en ${countdown}`;
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            document.getElementById('status').textContent = 'Tiempo de trabajo';
            callback();
        }
    }, 1000);
}

function startTimer() {
    if (!isRunning) {
        startCountdown(() => {
            isRunning = true;
            workTime = parseInt(document.getElementById('work-time').value);
            restTime = parseInt(document.getElementById('rest-time').value);
            totalRepetitions = parseInt(document.getElementById('repetitions').value);
            seconds = 0;
            currentRepetition = 0;
            isResting = false;
            document.querySelector('.config').style.display = 'none';
            document.getElementById('circle-container').classList.add('animate');
            document.getElementById('repetition-counter').textContent = `Repetición: ${currentRepetition + 1}/${totalRepetitions}`;
            updateTimerDisplay();
            timer = setInterval(() => {
                if (!isResting && seconds >= workTime) {
                    seconds = 0;
                    isResting = true;
                    playAlarm(); // Reproducir sonido al finalizar tiempo de trabajo
                    currentRepetition++;
                    if (currentRepetition < totalRepetitions) {
                        document.getElementById('status').textContent = 'Tiempo de descanso';
                        document.getElementById('status').classList.add('rest');
                        document.getElementById('circle-container').classList.replace('work', 'rest');
                        document.getElementById('repetition-counter').textContent = `Repetición: ${currentRepetition + 1}/${totalRepetitions}`;
                    } else {
                        clearInterval(timer);
                        isRunning = false;
                        playAlarm(); // Reproducir sonido al finalizar el temporizador
                        document.getElementById('status').textContent = 'Completado';
                        document.getElementById('repetition-counter').textContent = '';
                        document.querySelector('.config').style.display = 'block';
                        document.getElementById('circle-container').classList.remove('animate');
                        saveToHistory();
                        return;
                    }
                } else if (isResting && seconds >= restTime) {
                    seconds = 0;
                    isResting = false;
                    playAlarm(); // Reproducir sonido al finalizar tiempo de descanso
                    document.getElementById('status').textContent = 'Tiempo de trabajo';
                    document.getElementById('status').classList.remove('rest');
                    document.getElementById('circle-container').classList.replace('rest', 'work');
                }
                seconds++;
                updateTimerDisplay();
            }, 1000);
        });
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(timer);
    clearInterval(countdownTimer);
    seconds = 0;
    totalSeconds = 0;
    currentRepetition = 0;
    isResting = false;
    updateTimerDisplay();
    document.getElementById('status').textContent = 'Tiempo de trabajo';
    document.getElementById('status').classList.remove('rest');
    document.querySelector('.config').style.display = 'block';
    document.getElementById('circle-container').classList.remove('animate');
}

function skipRest() {
    if (isResting) {
        seconds = restTime;
    }
}

function saveToHistory() {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    const date = new Date();
    const totalMinutes = Math.floor(totalSeconds / 60);
    listItem.textContent = `Sesión completada el ${date.toLocaleDateString()} a las ${date.toLocaleTimeString()} - ${totalMinutes} minutos`;
    historyList.appendChild(listItem);
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('skip-rest').addEventListener('click', skipRest);

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
