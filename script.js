const display = document.querySelector(".display");
const numberButton = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const clearButton = document.querySelector("[data-clear]");
const equalButton = document.querySelector("[data-equal]");
const historyList = document.querySelector(".history-list");
const clearHistroy = document.querySelector("[data-clearing]");

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
  state.operator = "";
  lastOperator = null;
  lastOperand = null;
  //disply it in screen
  updateDisplay("0");
  state.justCalculated = false;
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
    updateDisplay(state.current);
    return;
  }

  if (state.current === "0" && number !== "0" && number !== ".") {
    // replace 0 with 1-9
    state.current = number;
    updateDisplay(state.current);
    return;
  }

  // 4️⃣ Normal append
  state.current += number;
  updateDisplay(state.current);
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
  updateDisplay(state.current || "0");
}

function handleOperator(operatorClicked) {
  // Don't handle +/- and % as regular operators
  if (operatorClicked === "+/-" || operatorClicked === "%") {
    return;
  }

  // if both numbers exist → calculate first (chaining)
  if (state.previous !== "" && state.current !== "") {
    const result = calculate(state.previous, state.current, state.operator);
    state.previous = result; // result becomes state.previous
    state.current = ""; // ready for next input
    updateDisplay(result);
  }

  // if state.current is empty → user wants to replace operator
  if (state.current === "" && state.previous !== "") {
    state.operator = operatorClicked; // just replace operator
    return;
  }

  // first operator press or after typing number
  if (state.previous === "") {
    state.previous = state.current;
    state.current = "";
  }

  state.operator = operatorClicked;
  justCalculated = false;
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
    updateDisplay(state.current);
  } else if (special === "%") {
    // Convert to percentage (divide by 100)
    if (state.current === "") {
      return;
    }
    const num = Number(state.current);
    if (isNaN(num)) return;
    state.current = (num / 100).toString();
    updateDisplay(state.current);
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

    // Update display and state
    state.current = result.toString();
    updateDisplay(state.current);

    // Save last operation for repeated =
    lastOperator = state.operator;
    lastOperand = originalCurrent; // Save the second operand before it becomes result

    // Create history string before clearing state.previous
    calcString = `${state.previous} ${state.operator} ${originalCurrent} = ${result}`;

    state.previous = "";
    state.operator = null;
    justCalculated = true;

    // Add to history and update
    history.push(calcString);
    updateHistory();
  }
  // Case 2: repeated = press
  else if (
    state.previous === "" &&
    state.current !== "" &&
    lastOperator &&
    lastOperand !== null
  ) {
    const oldCurrent = state.current;
    result = calculate(state.current, lastOperand, lastOperator);

    state.current = result;
    updateDisplay(state.current);

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
      state.current = result;
      updateDisplay(state.current);
      justCalculated = true;
    });
    historyList.appendChild(li);
  });
}

// clearing history
clearHistroy.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all history?")) history = [];
  historyList.innerHTML = "";
});
