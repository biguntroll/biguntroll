let words = [];
let stopRequested = false;

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.neutral_words;
  });

document.getElementById("startButton").addEventListener("click", startLoop);
document.getElementById("stopButton").addEventListener("click", stopShuffle);

async function startLoop() {
  stopRequested = false;

  if (words.length === 0) {
    alert('Word list not loaded yet!');
    return;
  }

  while (!stopRequested) {
    await startShuffle();
    await delay(2000);
  }

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

function stopShuffle() {
  stopRequested = true;
  speechSynthesis.cancel();
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
