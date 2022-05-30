const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operator]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");

calculos = new Array();
class Calculator {
    constructor(previousOperandTextElement,currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    calculate(){
        let result;

        const previusOperandFloat = parseFloat(this.previousOperand);
        const currentOperandFloat = parseFloat(this.currentOperand);

        if(isNaN(previusOperandFloat) || isNaN(currentOperandFloat))
            return;
        
        let calculo = `${previusOperandFloat} ${this.operation} ${currentOperandFloat}`;

        calculo = calculo.replace("÷", "/");
        result = eval(calculo);
        
        calculos.push(`${calculo} = ${result}`); //Para o historico

        this.currentOperand = parseFloat(result);
        this.operation = undefined;
        this.previousOperand = "";
    }

    chooseOperation(operation) {
        if (this.currentOperand == "" && this.previousOperand == "")
            return;

        if (operation == "x²"){
            
            if (this.currentOperand != "" && this.previousOperand == ""){
                calculos.push(`${this.currentOperand}² = ${Math.pow(this.currentOperand, 2)}`); //Para o historico
                this.currentOperand = Math.pow(this.currentOperand, 2);
            }
            
            return;
        }

        if (this.currentOperand == "" && this.previousOperand != ""){
            this.operation = operation;
            this.previousOperand = `${this.previousOperand}`;
            return;
        }


        if (operation == "+/-"){
            this.currentOperand = -1 * this.currentOperand;
            return;
        }

        if (this.previousOperand != "")
            this.calculate();

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    appendNumber(number){
        this.currentOperand = `${this.currentOperand}${number.toString()}`
    }

    formatDisplayNumber(number){
        const stringNumber = number.toString();

        const intergerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split(".")[1];

        let integerDisplay;

        if(isNaN(intergerDigits))
            integerDisplay = "";
        else
            integerDisplay = intergerDigits.toLocaleString("en", {maximumFractionDigits: 0})

        if(decimalDigits != null)
            return `${integerDisplay}.${decimalDigits}`
        else
            return integerDisplay
    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
    }

    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0,-1)
    }

    updateDisplay() {
        this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation || ""}`;
        this.currentOperandTextElement.innerText = this.formatDisplayNumber(this.currentOperand);
    }

    updateHistorico(){
        $(document).ready(function() {
            $('.calculos').empty();
            calculos.forEach(calculo => {
                $('.calculos').append(`<p class="calculo">${calculo}</p>`)
            });
        })
    }
}

const calculator = new Calculator(
    previousOperandTextElement, 
    currentOperandTextElement
);

for (const numberButton of numberButtons){
    numberButton.addEventListener('click', () => {
        calculator.appendNumber(numberButton.innerText);
        calculator.updateDisplay()
    })
}

for (const operationButton of operationButtons){
    operationButton.addEventListener('click', () => {
        calculator.chooseOperation(operationButton.innerText);
        calculator.updateDisplay();
        calculator.updateHistorico();
    })
}

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

equalsButton.addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
    calculator.updateHistorico();
})

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})

/* Eventos de Teclado */

document.addEventListener('keydown', key => {
    let operadores = ['+', '-', '*', '/']
    let comando = key.key;

    if (!isNaN(comando) || key.key == '.')
        calculator.appendNumber(comando);
    else if (operadores.includes(comando))
        calculator.chooseOperation(comando);
    else if (comando == '=' || comando == 'Enter')
        calculator.calculate();
    else if (comando == 'Escape')
        calculator.clear();
    else if (comando == 'Backspace')
        calculator.delete();

    calculator.updateDisplay()
})

