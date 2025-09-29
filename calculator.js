let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
let shouldResetBuffer = false; 
const screen = document.querySelector('.calc-screen');
function buttonClick(value) {
    if (isNaN(value) && value !== '.') {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;
}
function handleSymbol(symbol) {
    switch(symbol) {
        case 'C':
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            shouldResetBuffer = false;
            break;

        case '=':
            if (!previousOperator) {
                return;
            }
            flushOperation(parseFloat(buffer));
            previousOperator = null;
            buffer = runningTotal.toString();
            runningTotal = 0;
            shouldResetBuffer = true;
            break;

        case '←':
            if (shouldResetBuffer) {
                buffer = "0";
                shouldResetBuffer = false;
            } else if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
    }
}
function handleMath(symbol) {
    if (buffer === "0" && previousOperator === null) {
        return;
    }
    const intBuffer = parseFloat(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }
    previousOperator = symbol;
    buffer = symbol;
    shouldResetBuffer = true; 
}
function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '−') {
        runningTotal -= intBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        if (intBuffer === 0) {
            alert("Không thể chia cho 0!");
            runningTotal = 0;
            buffer = "0";
            shouldResetBuffer = false;
            return;
        }
        runningTotal /= intBuffer;
    }
}
function handleNumber(numberString) {
    if (shouldResetBuffer) {
        buffer = (numberString === ".") ? "0." : numberString;
        shouldResetBuffer = false;
        return;
    }

    if (numberString === "." && buffer.includes(".")) return;

    if (buffer === "0" && numberString !== ".") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}
function init() {
    document.querySelector('.calc-buttons')
    .addEventListener('click', function(event) {
        if (event.target.tagName === "BUTTON") {
            buttonClick(event.target.innerText);
        }
    });
}
init();