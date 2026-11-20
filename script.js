
const display = document.getElementById("display");

let expression = "";

// Display update
function updateDisplay() {
    display.value = expression || "0";
}

// Button input
function appendValue(value) {

    const operators = ["+", "-", "*", "/", "%"];

    if (operators.includes(value)) {

        if (expression === "" && value !== "-") return;

        if (operators.includes(expression.slice(-1))) {
            expression = expression.slice(0, -1);
        }
    }

    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) return;
    }

    expression += value;
    updateDisplay();
}

// Clear all
function clearDisplay() {
    expression = "";
    updateDisplay();
}

// Delete last character
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

// Calculate result
function calculateResult() {

    if (!expression) return;

    try {
        // Allow only calculator characters
        if (!/^[0-9+\-*/%. ]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        // Prevent incomplete expressions
        if (/[+\-*/%.]$/.test(expression)) {
            throw new Error("Incomplete expression");
        }

        // Prevent division by zero
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        expression = String(
            Number.parseFloat(result.toPrecision(12))
        );

        updateDisplay();

    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

// Keyboard support
document.addEventListener("keydown", function(event) {

    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendValue(key);
    }
    else if (["+", "-", "*", "/", "%", "."].includes(key)) {
        appendValue(key);
    }
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    }
    else if (key === "Backspace") {
        deleteLast();
    }
    else if (key === "Escape") {
        clearDisplay();
    }
});

// Initial display
updateDisplay();

console.log("Calculator is working!");
