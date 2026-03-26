const words = [
  "apple", "table", "house", "knife", "dream",
  "crane", "slate", "train", "ghost", "plant",
  "brick", "flame", "grape", "shine", "storm",
  "blank", "charm", "drift", "globe", "haste",
  "jolly", "knelt", "lemon", "mango", "noble",
  "ocean", "pearl", "quiet", "robin", "sugar",
  "tiger", "ultra", "vivid", "wheat", "youth"
];

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

let targetWord = "";
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

const grid = document.getElementById("grid");
const messageEl = document.getElementById("message");

function pickWord() {
  targetWord = words[Math.floor(Math.random() * words.length)];
  console.log("Lucky word:", targetWord);
}

function buildGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < MAX_GUESSES * WORD_LENGTH; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    grid.appendChild(box);
  }
}

function getBox(row, col) {
  const boxes = grid.querySelectorAll(".box");
  return boxes[row * WORD_LENGTH + col];
}

function showMessage(text, persistent = false) {
  messageEl.textContent = text;
  if (!persistent) {
    setTimeout(() => {
      messageEl.textContent = "";
    }, 2000);
  }
}

function showRestartButton(text) {
  messageEl.innerHTML = "";

  const msg = document.createElement("span");
  msg.textContent = text + " ";
  messageEl.appendChild(msg);

  const btn = document.createElement("button");
  btn.textContent = "Play Again";
  btn.classList.add("restart-btn");
  btn.addEventListener("click", restartGame);
  messageEl.appendChild(btn);
}

function restartGame() {
  currentRow = 0;
  currentCol = 0;
  gameOver = false;
  messageEl.innerHTML = "";
  pickWord();
  buildGrid();

  // Reset keyboard colors
  document.querySelectorAll(".key, .large-key").forEach((key) => {
    key.classList.remove("right", "wrong", "empty");
  });
}

function addLetter(letter) {
  if (gameOver || currentCol >= WORD_LENGTH) return;
  const box = getBox(currentRow, currentCol);
  box.textContent = letter;
  box.classList.add("pop");
  currentCol++;
}

function deleteLetter() {
  if (gameOver || currentCol <= 0) return;
  currentCol--;
  const box = getBox(currentRow, currentCol);
  box.textContent = "";
}

function submitGuess() {
  if (gameOver) return;
  if (currentCol < WORD_LENGTH) {
    showMessage("Not enough letters!");
    return;
  }

  // Read the guess from the current row
  let guess = "";
  for (let i = 0; i < WORD_LENGTH; i++) {
    guess += getBox(currentRow, i).textContent.toLowerCase();
  }

  // Check each letter and color the tiles
  const targetLetters = targetWord.split("");
  const result = Array(WORD_LENGTH).fill("empty");

  // First pass: mark correct (green) letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === targetLetters[i]) {
      result[i] = "right";
      targetLetters[i] = null;
    }
  }

  // Second pass: mark wrong-position (yellow) letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "right") continue;
    const idx = targetLetters.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "wrong";
      targetLetters[idx] = null;
    }
  }

  // Apply colors to boxes with flip animation
  for (let i = 0; i < WORD_LENGTH; i++) {
    const box = getBox(currentRow, i);
    setTimeout(() => {
      box.classList.add("flip", result[i]);
    }, i * 300);
  }

  // Update keyboard colors
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess[i].toUpperCase();
    const key = document.querySelector(`[data-key="${letter}"]`);
    if (!key) continue;

    setTimeout(() => {
      if (result[i] === "right") {
        key.className = "key right";
      } else if (result[i] === "wrong" && !key.classList.contains("right")) {
        key.className = "key wrong";
      } else if (!key.classList.contains("right") && !key.classList.contains("wrong")) {
        key.className = "key empty";
      }
    }, i * 300);
  }

  // Check win/lose after animations finish
  const animationTime = WORD_LENGTH * 300 + 500;
  currentRow++;
  currentCol = 0;

  setTimeout(() => {
    if (guess === targetWord) {
      gameOver = true;
      showRestartButton("You win! 🎉");
    } else if (currentRow >= MAX_GUESSES) {
      gameOver = true;
      showRestartButton(`Game over! The word was "${targetWord.toUpperCase()}".`);
    }
  }, animationTime);
}

// Handle on-screen keyboard clicks
document.querySelectorAll(".key, .large-key").forEach((key) => {
  key.addEventListener("click", () => {
    const value = key.getAttribute("data-key");
    if (!value) return;
    if (value === "ENTER") {
      submitGuess();
    } else if (value === "DEL") {
      deleteLetter();
    } else {
      addLetter(value);
    }
  });
});

// Handle physical keyboard input
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === "Enter") {
    submitGuess();
  } else if (e.key === "Backspace") {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  }
});

// Start the game
pickWord();
buildGrid();
