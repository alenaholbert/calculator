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
        //document.querySelector(e.key)
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
            if (isOperator(prevChar) && prevChar != '-') {
                currentTerm = data;
                appendEquation(data);
                clearMainScreen();
                appendMainScreen(data);
                break;
            }
            if (prevChar == '-') {
                currentTerm = currentTerm.substr(0, currentTerm.length-1);
                break;
            }
            else {
                if (currentTerm != "") {
                    equationArr.push(currentTerm);
                }
                equationArr.push(data);
                currentTerm = "0";
                appendEquation(data);
                break;
            }
            
            // if (isNumber(prevChar)) {
            //     if (currentTerm.charAt(0) == "-") {
            //         currentTerm = currentTerm.substr(1);
            //     }
            //     else {
            //         currentTerm = "-" + currentTerm;
            //     }
            //     break;
            // }
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
    if (operator == '+') {
        return num1 + num2;
    }
    if (operator == '-') {
        return num1 - num2;
    }
    if (operator == '*') {
        return num1 * num2;
    }
    if (operator == '/') {
        return num1 / num2;
    }
    if (operator == '^') {
        return exponentiate(num1, num2);
    }
}

function factorialize(num) {
    // console.log("factorializing!!");
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
    //alert ("error! cannot factorialize a decimal")
}

function exponentiate(base, exponent) {
    return base**exponent;
}

//window.addEventListener('mousedown', pressKey);

buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('mouseup', pressKey));

window.addEventListener('keydown', pressKey);