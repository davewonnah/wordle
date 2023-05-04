const words = ["apple", "table", "house", "knife", "dream"];

const randomIndex = Math.floor(Math.random() * words.length);
const randomWord = words[randomIndex];
console.log(randomWord);

// Function to add key text content to boxes starting from the first box
function addKey() {
    const keys = document.querySelectorAll('.key');
    const boxes = document.querySelectorAll('.box');
    let currentIndex = 0;
  
    keys.forEach((key) => {
      key.addEventListener('click', () => {
        if (currentIndex < boxes.length) {
          boxes[currentIndex].textContent = key.textContent;
          currentIndex++;
        }
      });
    });
  }
  
  // Call the function to add key text content to boxes starting from the first box
  addKey();


