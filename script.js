let words = [];
let stopRequested = false;
let shuffleLoopRunning = false;
let sessionTimeoutId = null;
let wakeLock = null;

// Load word list
fetch('words.json')
  .then(response => response.json())
  .then(data => {
    words = data.neutral_words;
  });

// Update label when slider changes
document.getElementById("durationSlider").addEventListener("input", function () {
  document.getElementById("durationLabel").textContent = this.value;
});

// Start button logic
document.getElementById("startButton").addEventListener("click", () => {
  if (!shuffleLoopRunning) {
    stopRequested = false;
    shuffleLoopRunning = true;

    const durationMinutes = parseInt(document.getElementById("durationSlider").value);
    const durationMs = durationMinutes * 60 * 1000;

    sessionTimeoutId = setTimeout(() => {
      stopShuffle("Session complete.");
    }, durationMs);

    startLoop();
  }
});

// Stop button logic
document.getElementById("stopButton").addEventListener("click", () => {
  stopShuffle("Shuffle stopped.");
});

// Main loop
async function startLoop() {
  if (words.length === 0) {
    alert('Word list not loaded yet!');
    shuffleLoopRunning = false;
    return;
  }

  await requestWakeLock();

  while (!stopRequested) {
    await startShuffle();
    if (stopRequested) break;
    await delay(2000);
  }

  shuffleLoopRunning = false;
}

// Word shuffle routine
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

// Speech function
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

// Delay with stop check
function delay(ms) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (stopRequested) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, ms);
  });
}

// Stop handler
async function stopShuffle(message) {
  stopRequested = true;
  speechSynthesis.cancel();
  clearTimeout(sessionTimeoutId);
  document.getElementById("prompt").textContent = message;
  shuffleLoopRunning = false;

  // 🔓 Release wake lock
  if (wakeLock !== null) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log("Wake lock released");
    } catch (err) {
      console.warn("Wake lock release failed:", err);
    }
  }
}

// Wake Lock logic
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log("Wake lock acquired");
    }
  } catch (err) {
    console.error("Failed to acquire wake lock:", err);
  }
}

// Re-acquire if released
document.addEventListener("visibilitychange", async () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    await requestWakeLock();
  }
});
