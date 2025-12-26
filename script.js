//current number being typed
let currentNumber = "";

//prev number stored for calculation
let previousNumber = "";
//operator seleced
let operator = null;

const display = document.querySelector(".display");
const numberButton = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

numberButton.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;

    currentNumber += number;

    display.textContent = currentNumber;
  });
});

operatorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    operator = btn.dataset.operator;
    previousNumber = currentNumber;
    currentNumber = "";
    console.log(previousNumber, operator, currentNumber);
  });
});

const equalButton = document.querySelector("[data-equal]");
equalButton.addEventListener("click", () => {
  //convert strings to numbers
  let num1 = Number(previousNumber);
  let num2 = Number(currentNumber);

  //decide calculation logic if it types +=>add // conditional checks
  if (operator == "+") {
    currentNumber = num1 + num2;
  }
  console.log(currentNumber);

  //step 5
});
