equation = document.querySelector("#equation");
mainScreen = document.querySelector("#main-screen");
mainScreen.textContent = "0";
equation.textContent = "0";
equationArr = [];

backspaceButton = document.querySelector("#id");

currentTerm = 0;

function pressKey(e) {
    console.log("equation: " + equation.textContent);
    prevChar = equation.textContent.charAt(equation.textContent.length-1);
    //console.log(prevChar);
    console.log(prevChar);
    let data = '';
    if (e.key === undefined) {
        data = this.id;
    } else {
        data = e.key;
    }
    console.log("DATA: " + data);

    switch (data) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (currentTerm == "0") {
                clearMainScreen();
                currentTerm = "";
            }
            appendMainScreen(data);
            appendEquation(data);
            currentTerm += data;
            break;
        case ".":
            if (mainScreen.textContent.includes(".")) {
                alert ("error! number can only contain one decimal.");
            }
            else {
                appendMainScreen(data);
                appendEquation(data);
                currentTerm += data;
            }
            break;
        case "-":
            if (isOperator(prevChar) && prevChar != '-') { // negating term
                currentTerm = data;
                appendEquation(data);
                clearMainScreen();
                appendMainScreen(data);
                console.log("A");
                break;
            }
            if (prevChar == '-') { // negating a negative
                if (currentTerm == '-'){
                    currentTerm = currentTerm.substr(0, currentTerm.length-1);
                    equation.textContent = equation.textContent.substr(0, equation.textContent.length-1);
                    mainScreen.textContent = mainScreen.textContent.substr(0, mainScreen.textContent.length-1);
                    console.log("B");
                }
                else { // subtracting a negative
                    equationArr.pop();
                    equationArr.push('+');
                    equation.textContent = equation.textContent.substr(0, equation.textContent.length-1);
                    appendEquation('+');
                    console.log("C");
                }
                break;
            }
            if (equationArr.length == 0 && currentTerm == '0') { // as negative sign for first number
                currentTerm = data;
                appendEquation(data);
                appendMainScreen(data);
                console.log("D");
                break;
            }
            if (currentTerm != "") { // as operator
                equationArr.push(currentTerm);
            }
            equationArr.push(data);
            currentTerm = "0";
            appendEquation(data);
            console.log("E");
            break;
        case "+":
        case "*":
        case "/":
            if (isOperator(prevChar)) {
                alert("cannot enter multiple operators in a row");
                break;
            }
            if (currentTerm != "") {
                equationArr.push(currentTerm);
            }
            equationArr.push(data);
            currentTerm = "0";
            appendEquation(data);
            break;
            
        case "Escape":
            if (confirm("Are you sure you want to clear everything?")) {
                clearMainScreen();
                clearEquation();
                currentTerm = "0";
                equationArr = [];
            }
            break;
        case "Enter":
            if (prevChar != '!') {
                equationArr.push(currentTerm);
            }
            currentTerm = "";
            setMainScreen(evaluate());
            break;
        case "!":
            if (isNumber(prevChar)){
                equationArr.push(currentTerm);
                console.log(equationArr);
                equationArr.push(factorialize(Number.parseFloat(equationArr.pop())));
                console.log(equationArr);
                appendEquation(data);
            }
            else {
                alert("factorial ! must come after a number");
            }
            break;
        case "^":
            if (isOperator(prevChar)) {
                alert("must enter a base (number) prior to the exponentiation operator (^)");
                break;
            }
            else {
                equationArr.push(currentTerm);
                equationArr.push(data);
                currentTerm = "0";
                appendEquation(data);
                break;
            }
        case "Tab": // toggle sign
            console.log(prevChar);
            if (isNumber(prevChar)) {
                console.log(currentTerm);
                if (currentTerm.charAt(0) == '-') { // negate negative on this term
                    currentTerm = currentTerm.substr(1);
                    mainScreen.textContent = mainScreen.textContent.substr(1);
                    minus = equation.textContent.lastIndexOf('-');
                    equation.textContent = equation.textContent.substr(0,minus) + equation.textContent.substr(minus+1);
                }
                else { // add negative to this term
                    currentTermLength = currentTerm.length;
                    insertMinusAt = equation.textContent.length-currentTermLength;
                    currentTerm = '-' + currentTerm;
                    mainScreen.textContent = '-' + mainScreen.textContent;
                    console.log("minus index" + insertMinusAt);
                    equation.textContent = equation.textContent.substr(0, insertMinusAt) + '-' + equation.textContent.substr(insertMinusAt);
                }
            }
        // case "Backspace":
        //     if (currentTerm != "0" || currentTerm != "") {
        //         currentTerm = currentTerm.substr(0, currentTerm.length-1)
        //     }
    }
    console.log("equation array: " + equationArr);
}

function isNumber(val) {
    return (val == '0' || val == '1' || val == '2' || val == '3' || val == '4' || val == '5' || val == '6' || 
        val == '7' || val == '8' || val == '9');
}

function isOperator(val) {
    return (val == '+' || val == '-' || val == '*' || val == '/' || val == '^');
}

function appendMainScreen(str) {
    if (mainScreen.textContent == "0" && str != ".") {
        mainScreen.textContent = "";
    }
    mainScreen.textContent += str;
}

function appendEquation(str) {
    if (equation.textContent == "0") {
        equation.textContent = "";
    }
    equation.textContent += str;
}

function setMainScreen(str) {
    mainScreen.textContent = str;
}

function setEquation(str) {
    equation.textContent = str;
}

function clearMainScreen() {
    mainScreen.textContent = "0";
}

function clearEquation() {
    equation.textContent = "0";
}

function evaluate() {
    console.log("EVALUATING: " + equationArr);
    while (equationArr.length > 1) {
        term1 = equationArr[0];
        operator = equationArr[1];
        term2 = equationArr[2];
        // console.log("term 1: " + term1);
        // console.log("term 2: " + term2);
        // console.log("operator: " + operator);
        // console.log("---------------");
        result = evalBinOp(operator, term1, term2);
        console.log("result: " + result);
        equationArr = [result, ...equationArr.slice(3)];
        console.log(equationArr);
    }
    return equationArr[0];
}

function evalBinOp(operator, term1, term2) {

    // console.log("term 1: " + term1);
    // console.log("term 2: " + term2);

    num1 = Number.parseFloat(term1);
    // console.log("num 1: " + num1);
    num2 = Number.parseFloat(term2);
    // console.log("num 2: " + num2);
    switch (operator) {
        case '+':
            return (num1 + num2);
        case '-':
            return (num1 - num2);
        case '*':
            return (num1 * num2);
        case '/':
            return (num1 / num2);
        case '^':
            return num1 ** num2;
    }
}

function factorialize(num) {
    console.log(num%1);
    if (num < 0) {
        alert ("error! cannot factorialize a negative value.");
        return;
    }
    if (num == 0 || num == 1) {
        return 1;
    }
    else if (num%1 == 0) {
        return num * factorialize(num-1);
    }
    else {
        alert("error! cannot factorialize a decimal");
        return;
    }
}

buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('mouseup', pressKey));

window.addEventListener('keydown', pressKey);