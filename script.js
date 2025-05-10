let words = [];
let stopRequested = false;
let shuffleLoopRunning = false;

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.neutral_words;
  });

document.getElementById("startButton").addEventListener("click", () => {
  if (!shuffleLoopRunning) {
    stopRequested = false;
    shuffleLoopRunning = true;
    startLoop();
  }
});

document.getElementById("stopButton").addEventListener("click", () => {
  stopRequested = true;
  speechSynthesis.cancel();
});

async function startLoop() {
  if (words.length === 0) {
    alert('Word list not loaded yet!');
    shuffleLoopRunning = false;
    return;
  }

  while (!stopRequested) {
    await startShuffle();

    // Break early if stopped during shuffle
    if (stopRequested) break;

    await delay(2000);
  }

  shuffleLoopRunning = false;
  document.getElementById("prompt").textContent = "Shuffle stopped.";
}

async function startShuffle() {
  const word = words[Math.floor(Math.random() * words.length)];
  speak(`Your word is ${word}`);
  await delay(2000);

  for (let letter of word) {
    if (stopRequested) return;

    const message = `Think of words that start with ${letter.toUpperCase()}`;
    document.getElementById("prompt").textContent = message;
    speak(message);
    await delay(5000);
  }

  document.getElementById("prompt").textContent = "";
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel(); // Cancel any current speech before starting a new one
  speechSynthesis.speak(utterance);
}

function delay(ms) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (stopRequested) {
        clearInterval(interval);
        resolve(); // End the delay early
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, ms);
  });
}
