let customTimerInterval;
let customTimerDuration = 180; // 3 хвилини в секундах
let customTimerRunning = false;
let remainingCustomDuration = 0;

// логіка для зчитування параметра "period" з URL
const urlParams = new URLSearchParams(window.location.search);
const periodParam = urlParams.get('period');
if (periodParam) {
    const periodValue = parseInt(periodParam);
    if (!isNaN(periodValue) && periodValue > 0) {
        customTimerDuration = periodValue;
    }
}

function startCustomTimer() {
    if (customTimerRunning) {
        clearInterval(customTimerInterval);
        customTimerRunning = false;
    }

    const inputElement = document.getElementById('durationInput');
    const inputValue = parseFloat(inputElement.value);
    if (!isNaN(inputValue) && inputValue > 0) {
        customTimerDuration = inputValue;
    }
    if (inputValue <= 0) {
        alert('Будь ласка, введіть позитивне число для тривалості.');
        return;
    }

    if (remainingCustomDuration > 0) {
        customTimerDuration = remainingCustomDuration;
        remainingCustomDuration = 0;
    }

    customTimerRunning = true;
    customTimerInterval = setInterval(updateCustomTimer, 1000);
    updateCustomTimer();
}

function pauseCustomTimer() {
    if (customTimerRunning) {
        clearInterval(customTimerInterval);
        customTimerRunning = false;
        remainingCustomDuration = customTimerDuration;
    }
}

function resetCustomTimer() {
    clearInterval(customTimerInterval);
    customTimerRunning = false;
    customTimerDuration = 180; // Скидання тривалості на 3 хвилини
    remainingCustomDuration = 0;
    updateCustomTimer();
}

function updateCustomTimer() {
    const timerElement = document.getElementById('timer');
    const timerEndMessage = document.getElementById('timerEndMessage');
    const hours = Math.floor(customTimerDuration / 3600);
    const minutes = Math.floor((customTimerDuration % 3600) / 60);
    const seconds = customTimerDuration % 60;

    timerElement.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

    document.title = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)} - Онлайн Таймер`;

    if (customTimerDuration <= 0) {
        clearInterval(customTimerInterval);
        customTimerRunning = false;
        showCustomNotification('Час вийшов!');
        timerElement.textContent = '00:00:00';
        timerEndMessage.style.display = 'block'; // Показываем сообщение о завершении таймера
    } else {
        customTimerDuration--;
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function showCustomNotification(message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                const notification = new Notification('Онлайн Таймер', {
                    body: message,
                });
            }
        });
    }
}
