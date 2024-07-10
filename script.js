const lyrics = [
    { time: 3, text: "" },
    { time: 2, text: "" },
    { time: 4, text: "" },
    { time: 8, text: "Jangan lah kau tinggalkan diriku 🙃" },
    { time: 13, text: "Takkan mampu menghadapi semua 😫" },
    { time: 17, text: "Hanya bersamamu ku akan bisa 🤕" },
    { time: 22, text: "Kau adalah darahku ✨" },
    { time: 27, text: "Kau adalah jantungku 💓" },
    { time: 31, text: "Kau adalah hidupku 💫" },
    { time: 34, text: "Lengkapi diriku 😇 " },
    { time: 36, text: "Oh sayangku kau begitu 🤔 " },
    { time: 43, text: "Sempurnaaaaa....😌 " }
];

const lyricsElement = document.getElementById('lyrics');
const audioElement = document.getElementById('myAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressSlider = document.getElementById('progressSlider');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
let currentLine = 0;
let typingInterval = null;

playPauseBtn.addEventListener('click', function() {
    if (audioElement.paused) {
        if (audioElement.currentTime === audioElement.duration) {
            // Replay the song if it has ended
            audioElement.currentTime = 0;
            currentLine = 0;
            displayLyric();
        }
        audioElement.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioElement.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

rewindBtn.addEventListener('click', function() {
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 5);
});

forwardBtn.addEventListener('click', function() {
    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 5);
});

volumeSlider.addEventListener('input', function() {
    audioElement.volume = volumeSlider.value;
});

progressSlider.addEventListener('input', function() {
    audioElement.currentTime = (progressSlider.value / 100) * audioElement.duration;
});

audioElement.addEventListener('timeupdate', function() {
    const currentTime = formatTime(audioElement.currentTime);
    const totalTime = formatTime(audioElement.duration);
    currentTimeElement.textContent = currentTime;
    totalTimeElement.textContent = totalTime;
    progressSlider.value = (audioElement.currentTime / audioElement.duration) * 100;

    const fadeDuration = 5; // seconds before the end to start fading out
    const timeLeft = audioElement.duration - audioElement.currentTime;
    if (timeLeft <= fadeDuration && !audioElement.fading) {
        audioElement.fading = true; // Flag to prevent multiple fades
        fadeOutAudio();
    }
});

audioElement.addEventListener('play', function() {
    displayLyric();
});

audioElement.addEventListener('pause', function() {
    if (typingInterval) {
        clearTimeout(typingInterval);
        typingInterval = null;
    }
});

audioElement.addEventListener('ended', function() {
    playPauseBtn.innerHTML = '<i class="fas fa-redo"></i>'; // Change to replay icon
});

function displayLyric() {
    if (currentLine < lyrics.length) {
        const { time, text } = lyrics[currentLine];
        const currentTime = audioElement.currentTime;

        if (currentTime >= time) {
            typeLyric(text, () => {
                currentLine++;
                displayLyric();
            });
        } else {
            typingInterval = setTimeout(() => {
                displayLyric();
            }, (time - currentTime) * 1000);
        }
    }
}

function typeLyric(text, callback) {
    lyricsElement.innerHTML = ''; 
    let charIndex = 0;
    const typingSpeed = 100; 

    const typeChar = () => {
        if (charIndex < text.length) {
            lyricsElement.innerHTML = text.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
            charIndex++;
            typingInterval = setTimeout(typeChar, typingSpeed);
        } else {
            lyricsElement.innerHTML = text; 
            callback();
        }
    };

    typeChar();
}

function fadeOutAudio() {
    const fadeDuration = 5000; // 5 seconds
    const fadeStep = 100; // 100 milliseconds per step
    const fadeOutStep = audioElement.volume / (fadeDuration / fadeStep);

    const fadeOutInterval = setInterval(() => {
        if (audioElement.volume > fadeOutStep) {
            audioElement.volume -= fadeOutStep;
        } else {
            audioElement.volume = 0;
            clearInterval(fadeOutInterval);
            audioElement.pause();
        }
    }, fadeStep);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
