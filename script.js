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

// Configuración del gráfico circular
const circle = new ProgressBar.Circle('#circle-container', {
    strokeWidth: 6,
    color: '#007bff',
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

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    circle.setText(timeString);
    circle.animate(seconds / (isResting ? restTime : workTime));
}

function startTimer() {
    if (!isRunning) {
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
                currentRepetition++;
                if (currentRepetition < totalRepetitions) {
                    document.getElementById('status').textContent = 'Tiempo de descanso';
                    document.getElementById('status').classList.add('rest');
                    document.getElementById('repetition-counter').textContent = `Repetición: ${currentRepetition + 1}/${totalRepetitions}`;
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    document.querySelector('.config').style.display = 'block';
                    document.getElementById('circle-container').classList.remove('animate');
                    return;
                }
            } else if (isResting && seconds >= restTime) {
                seconds = 0;
                isResting = false;
                document.getElementById('status').textContent = 'Tiempo de trabajo';
                document.getElementById('status').classList.remove('rest');
            }
            seconds++;
            updateTimerDisplay();
        }, 1000);
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
    seconds = 0;
    currentRepetition = 0;
    isResting = false;
    circle.set(0);
    updateTimerDisplay();
    document.getElementById('status').textContent = 'Tiempo de trabajo';
    document.getElementById('status').classList.remove('rest');
    document.getElementById('repetition-counter').textContent = `Repetición: 0/${totalRepetitions}`;
    document.querySelector('.config').style.display = 'block';
    document.getElementById('circle-container').classList.remove('animate');
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

updateTimerDisplay();
