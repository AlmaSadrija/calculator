const display = document.querySelector(".display");
const numberButton = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("[data-clear]");
const equalButton = document.querySelector("[data-equal]");
const historyList = document.querySelector(".history-list");
const clearHistroy = document.querySelector("[data-clearing]");
const operationDisplay = document.querySelector(".operation-display");
const darkModeBtn = document.querySelector(".dark-mode");

// Debug: Check if elements are found
if (!display) console.error("Display element not found!");
if (!operationDisplay)
  console.warn(
    "Operation display element not found - operator display won't work"
  );
if (operatorButtons.length === 0) console.error("No operator buttons found!");

const state = {
  //current number being typed
  current: "",
  //prev number stored for calculation
  previous: "",
  //operator seleced
  operator: null,
  //writing numbers after =:
  justCalculated: false,
};

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
  state.current = "";
  state.previous = "";
  state.operator = null;
  lastOperator = null;
  lastOperand = null;
  state.justCalculated = false;
  //display it on screen
  updateCalculatorDisplay();
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
  if (state.justCalculated) {
    state.current = "";
    state.previous = "";
    state.operator = null;
    state.justCalculated = false;
  }

  // 2️⃣ Handle decimal  // 3️⃣ Leading zero rules
  if (
    (number === "." && state.current.includes(".")) ||
    (number === "0" && state.current === "0") // ignore extra zeros
  ) {
    return;
  }
  // ignore extra dots
  if (number === "." && state.current === "") {
    // first decimal in empty number
    state.current = "0.";
    updateCalculatorDisplay();
    return;
  }

  if (state.current === "0" && number !== "0" && number !== ".") {
    // replace 0 with 1-9
    state.current = number;
    updateCalculatorDisplay();
    return;
  }

  // 4️⃣ Normal append
  state.current += number;
  updateCalculatorDisplay();
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
  if (state.justCalculated) return;

  state.current = state.current.slice(0, -1);
  updateCalculatorDisplay();
}

function handleOperator(operatorClicked) {
  // Don't handle +/- and % as regular operators
  if (operatorClicked === "+/-" || operatorClicked === "%") {
    return;
  }

  // if both numbers exist → calculate first (chaining)
  if (state.previous !== "" && state.current !== "") {
    const result = calculate(state.previous, state.current, state.operator);
    state.previous = result.toString(); // result becomes state.previous
    state.current = ""; // ready for next input
    state.operator = operatorClicked; // set the new operator
    state.justCalculated = false;
    updateCalculatorDisplay(); // Update display to show previous + new operator
    return;
  }

  // if state.current is empty → user wants to replace operator
  if (state.current === "" && state.previous !== "") {
    state.operator = operatorClicked; // just replace operator
    updateCalculatorDisplay(); // Update display to show previous + new operator
    return;
  }

  // first operator press or after typing number
  if (state.previous === "") {
    state.previous = state.current || "0"; // Use "0" if current is empty
    state.current = "";
  }

  state.operator = operatorClicked;
  state.justCalculated = false;
  updateCalculatorDisplay(); // Update display to show previous + operator
}

// Handle special operations: +/- (negate) and % (percent)
function handleSpecial(special) {
  if (special === "+/-") {
    // Negate the current number
    if (state.current === "" || state.current === "0") {
      return;
    }
    state.current = state.current.startsWith("-")
      ? state.current.slice(1)
      : "-" + state.current;
    updateCalculatorDisplay();
  } else if (special === "%") {
    // Convert to percentage (divide by 100)
    if (state.current === "") {
      return;
    }
    const num = Number(state.current);
    if (isNaN(num)) return;
    state.current = (num / 100).toString();
    updateCalculatorDisplay();
  }
}

// For repeated = presses
let lastOperator = null;
let lastOperand = null;

function handleEqual() {
  let result;
  let calcString = "";

  // Case 1: normal calculation
  if (state.previous !== "" && state.current !== "" && state.operator) {
    const originalCurrent = state.current; // Save before calculation
    result = calculate(state.previous, state.current, state.operator);
    //  if the number is too long after decimal point cut it
    state.current = result;
    let rounded = state.current.toFixed(2);
    state.current = Number(rounded);
    if (!Number.isInteger(result)) {
      result = Number(result.toFixed(2));
    }
    updateCalculatorDisplay();

    // Create history string before clearing state.previous
    calcString = `${state.previous} ${state.operator} ${originalCurrent} = ${result}`;
    // Add to history and update
    history.push(calcString);
    updateHistory();

    // Save last operation for repeated = presses
    lastOperator = state.operator;
    lastOperand = originalCurrent;

    // Update display and state
    state.current = result.toString();
    state.previous = "";
    state.justCalculated = true;
    state.operator = null;

    updateCalculatorDisplay();
  }
  // Case 2: repeated = press (after a previous calculation)
  else if (
    state.previous === "" &&
    state.current !== "" &&
    lastOperator &&
    lastOperand !== null
  ) {
    const oldCurrent = state.current;
    result = calculate(state.current, lastOperand, lastOperator);

    state.current = result.toString();
    state.justCalculated = true;

    calcString = `${oldCurrent} ${lastOperator} ${lastOperand} = ${result}`;
    history.push(calcString);
    updateHistory();

    updateCalculatorDisplay();
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
      state.current = result;
      updateCalculatorDisplay();
      state.justCalculated = true;
    });
    historyList.appendChild(li);
  });
}

// clearing history
clearHistroy.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all history?")) history = [];
  historyList.innerHTML = "";
});

function updateCalculatorDisplay(value) {
  // If a specific value is provided (for backward compatibility), use it directly
  if (value !== undefined) {
    display.textContent = value;
    // Keep operation display visible if there's an operation
    if (operationDisplay && state.previous !== "" && state.operator) {
      operationDisplay.textContent = `${state.previous} ${state.operator}`;
    } else if (operationDisplay) {
      operationDisplay.textContent = "";
    }
    return;
  }

  // 1️⃣ Top display (operation display): show previous + operator
  if (operationDisplay) {
    if (state.previous !== "" && state.operator) {
      operationDisplay.textContent = `${state.previous} ${state.operator}`;
    } else {
      operationDisplay.textContent = "";
    }
  }

  // 2️⃣ Bottom display (main display): show current number if typing, else show previous or 0
  if (state.current !== "") {
    display.textContent = state.current;
  } else if (state.previous !== "") {
    display.textContent = state.previous;
  } else {
    display.textContent = "0";
  }
}
//Dark mode btn
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (button === true) {
    button.innerHTML = "🌙";
  } else {
    button.innerHTML = "☀️";
  }
});
