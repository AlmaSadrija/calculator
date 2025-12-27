//current number being typed
let currentNumber = "";

//prev number stored for calculation
let previousNumber = "";
//operator seleced
let operator = null;
//writing numbers after =:
let justCalculated = false;

const display = document.querySelector(".display");
const numberButton = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("[data-clear]");

numberButton.forEach((button) => {
  button.addEventListener("click", () => {
    if (justCalculated) {
      //wipe currentNumber
      currentNumber = "";
      justCalculated = false;
    }
    const number = button.dataset.number;
    //add clicked digit to currentNumber
    currentNumber += number;

    //update display
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
  let result = calculate(previousNumber, currentNumber, operator);
  /*
  //convert strings to numbers
  let num1 = Number(previousNumber);
  let num2 = Number(currentNumber);

  //decide calculation logic if it types +=>add // conditional checks
  if (operator === "/" && num2 === 0) {
    display.textContent = "Error";
    currentNumber = "";
    return;
  }

  if (operator == "+") {
    currentNumber = num1 + num2;
  } else if (operator == "-") {
    currentNumber = num1 - num2;
  } else if (operator == "*") {
    currentNumber = num1 * num2;
  } else if (operator == "/") {
    currentNumber = num1 / num2;
  }
  //show it in the screen
  display.textContent = currentNumber;
  justCalculated = true;*/
});

//Clear button
clearButton.addEventListener("click", () => {
  currentNumber = "";
  previousNumber = "";
  operator = null;
  //disply it in screen
  display.textContent = "";
  justCalculated = false;
});

function calculate(a, b, operator) {
  a = Number(a);
  b = Number(b);
  if (
    operator === null ||
    a === "" ||
    b === "" ||
    (operator === "/" && b === 0)
  ) {
    return "Error";
  } else if (operator === "+") {
    return a + b;
  } else if (operator === "-") {
    return a - b;
  } else if (operator === "*") {
    return a * b;
  } else if (operator === "/") {
    return a / b;
  }
}
