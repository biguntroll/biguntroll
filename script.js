let words = [];

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.neutral_words;
  });

document.getElementById("startButton").addEventListener("click", startLoop);

async function startLoop() {
  if (words.length === 0) {
    alert('Word list not loaded yet!');
    return;
  }

  while (true) { // Infinite loop to continuously pick new words
    await startShuffle(); // Wait for the current word loop to complete
    await delay(2000); // Add a small pause between words
  }
}

async function startShuffle() {
  const word = words[Math.floor(Math.random() * words.length)];
  speak(`Your word is ${word}`);
  await delay(2000);

  for (let letter of word) {
    const message = `Think of words that start with ${letter.toUpperCase()}`;
    document.getElementById("prompt").textContent = message;
    speak(message);
    await delay(5000);
  }

  document.getElementById("prompt").textContent = "";
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
