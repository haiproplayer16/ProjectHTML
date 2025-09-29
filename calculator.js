let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
let shouldResetBuffer = false; 
let lastAnswer = 0;
let isAnsBuffer = false; // Thêm biến này
const screen = document.querySelector('.calc-screen');

function buttonClick(value) {
    if (value === 'Ans') {
        handleAns();
    } else if (isNaN(value) && value !== '.') {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;
}

function handleAns() {
    buffer = "Ans";
    isAnsBuffer = true;
    shouldResetBuffer = false;
}

function handleSymbol(symbol) {
    switch(symbol) {
        case 'C':
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            shouldResetBuffer = false;
            isAnsBuffer = false;
            break;

        case '=':
            if (!previousOperator) {
                return;
            }
            const result = flushOperation(getBufferValue());
            if (result === false) {
                previousOperator = null;
                runningTotal = 0;
                shouldResetBuffer = true;
                isAnsBuffer = false;
                break;
            }
            previousOperator = null;
            buffer = runningTotal.toString();
            lastAnswer = runningTotal;
            runningTotal = 0;
            shouldResetBuffer = true;
            isAnsBuffer = false;
            break;

        case '←':
            if (shouldResetBuffer) {
                buffer = "0";
                shouldResetBuffer = false;
                isAnsBuffer = false;
            } else if (buffer.length === 1 || buffer === "Ans") {
                buffer = "0";
                isAnsBuffer = false;
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
    if ((buffer === "0" && previousOperator === null) || buffer === "Ans") {
        // Cho phép dùng Ans làm toán hạng đầu tiên
        if (buffer === "Ans") {
            runningTotal = lastAnswer;
        } else {
            return;
        }
    } else {
        const intBuffer = getBufferValue();
        if (runningTotal === 0) {
            runningTotal = intBuffer;
        } else {
            flushOperation(intBuffer);
        }
    }
    previousOperator = symbol;
    buffer = symbol; // Hiển thị dấu lên màn hình
    shouldResetBuffer = true;
    isAnsBuffer = false;
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
            buffer = "Math Error";
            shouldResetBuffer = true;
            isAnsBuffer = false;
            return false;
        }
        runningTotal /= intBuffer;
    }
    return true;
}

function handleNumber(numberString) {
    if (shouldResetBuffer || buffer === "Ans") {
        buffer = (numberString === ".") ? "0." : numberString;
        shouldResetBuffer = false;
        isAnsBuffer = false;
        return;
    }

    if (numberString === "." && buffer.includes(".")) return;

    if (buffer === "0" && numberString !== ".") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
    isAnsBuffer = false;
}

function getBufferValue() {
    // Nếu buffer là "Ans" thì trả về lastAnswer, ngược lại parseFloat(buffer)
    return (buffer === "Ans") ? lastAnswer : parseFloat(buffer);
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