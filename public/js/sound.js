const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, type, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); // volume
    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.stop(audioCtx.currentTime + duration);
};

function playEatSound() {
    console.log("Eat sound triggered");
    playSound(660, 'square', 0.15);
}

function playGameOverSound() {
    playSound(120, 'sawtooth', 0.5);
}

function playMove(){
    playSound(330, 'triangle', 0.05);
}


// export instance
window.soundManager = {
    ctx: audioCtx,
    playEatSound: playEatSound,
    playGameOverSound,
    playMove
};