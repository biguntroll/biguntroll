let words = [];

fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.neutral_words;
  });

document.getElementById("startButton").addEventListener("click", startShuffle);

async function startShuffle() {
  if (words.length === 0) {
    alert('Word list not loaded yet!');
    return;
  }

  const word = words[Math.floor(Math.random() * words.length)];
  speak(`Your word is ${word}`);
  await delay(2000);

  for (let letter of word) {
    const message = `Think of words that start with ${letter.toUpperCase()}`;
    document.getElementById("prompt").textContent = message;
    speak(message);
    await delay(10000);
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
