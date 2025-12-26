//current number being typed
let currentNumber = "";

//prev number stored for calculation
let previousNumber = "";
//operator seleced
let operator = null;

const display = document.querySelector(".display");

const numberButton = document.querySelectorAll("[data-number]");

numberButton.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;

    currentNumber += number;

    display.textContent = currentNumber;
  });
});

const operatorButtons = document.querySelectorAll("[data-operator]");

operatorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    operator = btn.dataset.operator;
    previousNumber = currentNumber;
    operator;
    console.log(operator);
    console.log(currentNumber);
    console.log(currentNumber);
  });
});
