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
    isNaN(a) ||
    isNaN(b) ||
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

  return "Error"; // fallback for unknown operator
}

function handleOperator(operatorClicked) {
  // if we already have a previous number and a current number → calculate
  if (previousNumber !== "" && currentNumber !== "") {
    const result = calculate(previousNumber, currentNumber, operator);
    currentNumber = result;
    display.textContent = result;
  }

  // store current as previous
  previousNumber = currentNumber;

  // store new operator
  operator = operatorClicked;

  // reset current number
  currentNumber = "";

  // we are no longer in "just calculated" state
  justCalculated = false;
}

function handleNumber(number) {
  // prevent multiple dots
  if (number === "." && currentNumber.includes(".")) return;

  // If the last action was =, and user types a number, start fresh
  if (previousNumber === "" && operator === null && currentNumber !== "") {
    currentNumber = "";
  }

  currentNumber += number;
  updateDisplay(currentNumber);
}
//2
function handleResult(number) {
  if (currentNumber !== "" && previousNumber !== "") {
    // store new operator
    operator = operatorClicked;
    const result = calculate(previousNumber, currentNumber, operator);
    previousNumber = result;
    currentNumber = "";
  }
  if (currentNumber === "") {
    operator = operatorClicked;
  }
}
