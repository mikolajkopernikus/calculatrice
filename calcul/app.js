let display = document.getElementById('display');
let currentValue = '0';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;
let expressionMode = false; // Mode expression libre pour parenthèses

function updateDisplay() {
    // Afficher toujours currentValue, remplacer * par × pour l'affichage
    display.textContent = currentValue.replace(/\*/g, '×');
}

function appendNumber(number) {
    if (shouldResetDisplay && !expressionMode) {
        currentValue = number;
        shouldResetDisplay = false;
    } else {
        if (currentValue === '0' && number !== '.') {
            currentValue = number;
        } else {
            currentValue += number;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (expressionMode) {
        // En mode expression, ajouter l'opérateur directement
        currentValue += op;
        updateDisplay();
        return;
    }
    
    // Mode simple : calculer si nécessaire puis préparer nouvelle opération
    if (operation !== null && previousValue !== '' && !shouldResetDisplay) {
        calculate();
        previousValue = currentValue;
    } else {
        previousValue = currentValue;
    }
    
    currentValue = previousValue + ' ' + op + ' ';
    operation = op;
    shouldResetDisplay = false;
    expressionMode = true; // Passer en mode expression
    updateDisplay();
}

function calculate() {
    try {
        // Remplacer × par * et traiter les pourcentages
        let expression = currentValue.replace(/×/g, '*').replace(/\s+/g, '');
        
        // Remplacer les nombres suivis de % par (nombre/100)
        // Regex pour capturer nombre (entier ou décimal) suivi de %
        expression = expression.replace(/(\d+\.?\d*)%/g, '($1/100)');
        
        let result = eval(expression);
        currentValue = Math.round(result * 100000000) / 100000000;
        currentValue = currentValue.toString();
    } catch (e) {
        currentValue = 'Erreur';
    }
    
    operation = null;
    previousValue = '';
    shouldResetDisplay = true;
    expressionMode = false;
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    expressionMode = false;
    updateDisplay();
}

function deleteChar() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function appendParenthesis(paren) {
    // Activer le mode expression
    expressionMode = true;
    
    // Si on commence à 0, remplacer
    if (currentValue === '0') {
        currentValue = paren;
    } else {
        currentValue += paren;
    }
    
    shouldResetDisplay = false;
    updateDisplay();
}

function calculateSquareRoot() {
    const value = parseFloat(currentValue);
    if (isNaN(value) || value < 0) {
        currentValue = 'Erreur';
    } else {
        currentValue = Math.sqrt(value).toString();
    }
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculatePercentage() {
    // Activer le mode expression et ajouter le symbole %
    expressionMode = true;
    currentValue += '%';
    shouldResetDisplay = false;
    updateDisplay();
}

// Support clavier
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        deleteChar();
    }
});

updateDisplay();
