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
const equalButton = document.querySelector("[data-equal]");

function updateDisplay(value) {
  display.textContent = value;
}
updateDisplay("OK");

numberButton.forEach((button) => {
  button.addEventListener("click", () => {
    handleNumber(button.dataset.number);
  });
});

operatorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleOperator(btn.dataset.operator);
  });
});

equalButton.addEventListener("click", handleEqual);

equalButton.addEventListener("click", () => {
  let result = calculate(previousNumber, currentNumber, operator);
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

  if (number === "0" && currentNumber === "0") return;

  if (currentNumber === "0" && number !== 0 && number !== ".") {
    currentNumber = number;
    updateDisplay(currentNumber);
    return;
  }

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

document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) {
    handleNumber(e.key);
  }

  if (e.key === ".") {
    handleNumber(".");
  }

  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    handleOperator(e.key);
  }

  if (e.key === "Enter" || e.key === "=") {
    handleEqual();
  }

  if (e.key === "Backspace") {
    handleDelete();
  }

  if (e.key === "Escape") {
    handleClear();
  }
});

function handleDelete() {
  if (justCalculated) return;

  currentNumber = currentNumber.slice(0, -1);
  updateDisplay(currentNumber || "0");
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

// For repeated = presses
let lastOperator = null;
let lastOperand = null;

function handleEqual() {
  // Case 1: normal calculation
  if (previousNumber !== "" && currentNumber !== "" && operator) {
    const result = calculate(previousNumber, currentNumber, operator);

    // Update display and state
    currentNumber = result;
    updateDisplay(currentNumber);

    // Save last operation for repeated =
    lastOperator = operator;
    lastOperand = currentNumber;

    previousNumber = "";
    operator = null;
    justCalculated = true;
  }
  // Case 2: repeated = press
  else if (
    previousNumber === "" &&
    currentNumber !== "" &&
    lastOperator &&
    lastOperand !== null
  ) {
    const result = calculate(currentNumber, lastOperand, lastOperator);

    currentNumber = result;
    updateDisplay(currentNumber);

    justCalculated = true;
  }
  // Case 3: pressing = without enough info → do nothing
}
