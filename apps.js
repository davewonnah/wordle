const keys = document.querySelectorAll('.key');
const boxes = document.querySelectorAll('.box');




const words = ["apple", "table", "house", "knife", "dream"];

const randomIndex = Math.floor(Math.random() * words.length);

// Get the random word
const randomWord = words[randomIndex];

console.log(randomWord);


keys.forEach((button, index) => {
  button.addEventListener('click', () => {
    const buttonText = button.textContent;
    boxes[index].textContent = buttonText;
  });
});

console.log(boxes[0]);
