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

function handleNumber(number) {
  // prevent multiple dots
  if (number === "." && currentNumber.includes(".")) return;

  // if we just calculated and user types a number → start fresh
  if (justCalculated) {
    currentNumber = "";
    previousNumber = "";
    operator = null;
    justCalculated = false;
  }

  currentNumber += number;
  updateDisplay(currentNumber);
}

function handleOperator(operatorClicked) {
  // if both numbers exist → calculate first (chaining)
  if (previousNumber !== "" && currentNumber !== "") {
    const result = calculate(previousNumber, currentNumber, operator);
    previousNumber = result; // result becomes previousNumber
    currentNumber = ""; // ready for next input
    updateDisplay(result);
  }

  // if currentNumber is empty → user wants to replace operator
  if (currentNumber === "" && previousNumber !== "") {
    operator = operatorClicked; // just replace operator
    return;
  }

  // first operator press or after typing number
  if (previousNumber === "") {
    previousNumber = currentNumber;
    currentNumber = "";
  }

  operator = operatorClicked;
  justCalculated = false;
}
