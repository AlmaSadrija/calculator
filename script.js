const display = document.querySelector(".display");
const numberButton = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("[data-clear]");
const equalButton = document.querySelector("[data-equal]");
const historyList = document.querySelector(".history-list");

//current number being typed
let currentNumber = "";

//prev number stored for calculation
let previousNumber = "";
//operator seleced
let operator = null;
//writing numbers after =:
let justCalculated = false;
let history = []; // stores past calculations like "5 + 3 = 8"

function updateDisplay(value) {
  display.textContent = value;
}


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

// Handle special buttons (+/-, %)
const specialButtons = document.querySelectorAll("[data-special]");
specialButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const special = btn.dataset.special;
    if (special !== "emoji") {
      handleSpecial(special);
    }
  });
});

equalButton.addEventListener("click", handleEqual);

//Clear button
clearButton.addEventListener("click", () => {
  currentNumber = "";
  previousNumber = "";
  operator = null;
  lastOperator = null;
  lastOperand = null;
  //disply it in screen
  updateDisplay("0");
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
  // 1️⃣ Reset after pressing '='
  if (justCalculated) {
    currentNumber = "";
    previousNumber = "";
    operator = null;
    justCalculated = false;
  }

  // 2️⃣ Handle decimal  // 3️⃣ Leading zero rules
  if (
    (number === "." && currentNumber.includes(".")) ||
    (number === "0" && currentNumber === "0") // ignore extra zeros
  ) {
    return;
  }
  // ignore extra dots
  if (number === "." && currentNumber === "") {
    // first decimal in empty number
    currentNumber = "0.";
    updateDisplay(currentNumber);
    return;
  }

  if (currentNumber === "0" && number !== "0" && number !== ".") {
    // replace 0 with 1-9
    currentNumber = number;
    updateDisplay(currentNumber);
    return;
  }

  // 4️⃣ Normal append
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

  if (e.key === "Escape" || e.key === "c" || e.key === "C") {
    clearButton.click();
  }
});

function handleDelete() {
  if (justCalculated) return;

  currentNumber = currentNumber.slice(0, -1);
  updateDisplay(currentNumber || "0");
}

function handleOperator(operatorClicked) {
  // Don't handle +/- and % as regular operators
  if (operatorClicked === "+/-" || operatorClicked === "%") {
    return;
  }

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

// Handle special operations: +/- (negate) and % (percent)
function handleSpecial(special) {
  if (special === "+/-") {
    // Negate the current number
    if (currentNumber === "" || currentNumber === "0") {
      return;
    }
    currentNumber = currentNumber.startsWith("-") 
      ? currentNumber.slice(1) 
      : "-" + currentNumber;
    updateDisplay(currentNumber);
  } else if (special === "%") {
    // Convert to percentage (divide by 100)
    if (currentNumber === "") {
      return;
    }
    const num = Number(currentNumber);
    if (isNaN(num)) return;
    currentNumber = (num / 100).toString();
    updateDisplay(currentNumber);
  }
}

// For repeated = presses
let lastOperator = null;
let lastOperand = null;

function handleEqual() {
  let result;
  let calcString = "";
  
  // Case 1: normal calculation
  if (previousNumber !== "" && currentNumber !== "" && operator) {
    const originalCurrent = currentNumber; // Save before calculation
    result = calculate(previousNumber, currentNumber, operator);

    // Update display and state
    currentNumber = result.toString();
    updateDisplay(currentNumber);

    // Save last operation for repeated =
    lastOperator = operator;
    lastOperand = originalCurrent; // Save the second operand before it becomes result

    // Create history string before clearing previousNumber
    calcString = `${previousNumber} ${operator} ${originalCurrent} = ${result}`;

    previousNumber = "";
    operator = null;
    justCalculated = true;
    
    // Add to history and update
    history.push(calcString);
    updateHistory();
  }
  // Case 2: repeated = press
  else if (
    previousNumber === "" &&
    currentNumber !== "" &&
    lastOperator &&
    lastOperand !== null
  ) {
    const oldCurrent = currentNumber;
    result = calculate(currentNumber, lastOperand, lastOperator);

    currentNumber = result;
    updateDisplay(currentNumber);

    calcString = `${oldCurrent} ${lastOperator} ${lastOperand} = ${result}`;
    history.push(calcString);
    updateHistory();

    justCalculated = true;
  }
  // Case 3: pressing = without enough info → do nothing
}

function updateHistory() {
  historyList.innerHTML = "";
  history.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = entry;
    li.addEventListener("click", () => {
      const result = entry.split("=").pop().trim();
      currentNumber = result;
      updateDisplay(currentNumber);
      justCalculated = true;
    });
    historyList.appendChild(li);
  });
}
