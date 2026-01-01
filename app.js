let display = document.getElementById('display');
let currentValue = '0';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;
let expressionMode = false; // Mode expression libre pour parenthèses

function updateDisplay() {
    // Afficher toujours currentValue, traiter ** pour l'exposant avant de remplacer *
    let displayText = currentValue;
    
    // Remplacer ** par notation en exposant HTML (style LaTeX)
    // Capturer soit un nombre, soit une expression entre parenthèses
    displayText = displayText.replace(/\*\*(\([^)]*\)|[^+\-*/()]+)/g, '<sup style="font-size: 60%; position: relative; top: -0.9em; line-height: 0;">$1</sup>');
    
    // Gérer le cas où ** n'est pas encore suivi d'un nombre ou parenthèse
    if (displayText.endsWith('**')) {
        displayText = displayText.slice(0, -2) + '<sup style="font-size: 60%; position: relative; top: -0.9em; line-height: 0;">▯</sup>';
    }
    
    // Remplacer * par × pour l'affichage (après traitement de **)
    displayText = displayText.replace(/\*/g, '×');
    
    display.innerHTML = displayText;
}

function appendNumber(number) {
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
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
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
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
        // Sauvegarder l'expression actuelle pour l'historique
        let displayExpression = currentValue;
        
        // Ajouter les parenthèses fermantes manquantes
        let openParens = (currentValue.match(/\(/g) || []).length;
        let closeParens = (currentValue.match(/\)/g) || []).length;
        let missingParens = openParens - closeParens;
        if (missingParens > 0) {
            currentValue += ')'.repeat(missingParens);
            displayExpression = currentValue;
        }
        
        // Afficher l'expression dans la zone d'historique AVANT le calcul
        let history = document.getElementById('history');
        // S'assurer que le fond est violet (retirer la classe grey si présente)
        history.classList.remove('history-grey');
        let historyText = displayExpression;
        // Appliquer le même formatage que l'affichage principal
        historyText = historyText.replace(/\*\*(\([^)]*\)|[^+\-*/()]+)/g, '<sup style="font-size: 60%; position: relative; top: -0.9em; line-height: 0;">$1</sup>');
        historyText = historyText.replace(/\*/g, '×');
        history.innerHTML = historyText;
        
        // Remplacer × par * et traiter les pourcentages
        let expression = currentValue.replace(/×/g, '*').replace(/\s+/g, '');
        
        // Remplacer les nombres suivis de % par (nombre/100)
        // Regex pour capturer nombre (entier ou décimal) suivi de %
        expression = expression.replace(/(\d+\.?\d*)%/g, '($1/100)');
        
        // Remplacer 'e' par Math.E et 'π' par Math.PI pour le calcul
        expression = expression.replace(/\be\b/g, Math.E);
        expression = expression.replace(/π/g, Math.PI);
        
        // Normaliser les noms de fonctions (arcsin -> asin, arctg -> atan)
        expression = expression.replace(/arcsin\(/g, 'asin(');
        expression = expression.replace(/arctg\(/g, 'atan(');
        
        // Remplacer √ par Math.sqrt AVANT les autres fonctions
        expression = expression.replace(/√\(/g, 'Math.sqrt(');
        
        // Remplacer les fonctions mathématiques (ordre important: asin avant sin, atan avant tan)
        expression = expression.replace(/asin\(/g, 'Math.asin(');
        expression = expression.replace(/atan\(/g, 'Math.atan(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/(?<!a)sin\(/g, 'Math.sin(');  // Ne pas remplacer asin déjà traité
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/(?<!a)tan\(/g, 'Math.tan(');  // Ne pas remplacer atan déjà traité
        
        let result = eval(expression);
        currentValue = Math.round(result * 1000000000000000) / 1000000000000000;
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
    let history = document.getElementById('history');
    
    // Vérifier si la zone d'historique a du contenu
    if (history.innerHTML !== '') {
        // Vérifier si le fond est gris
        if (history.classList.contains('history-grey')) {
            // Si déjà gris, effacer et repasser en violet
            history.innerHTML = '';
            history.classList.remove('history-grey');
        } else {
            // Si violet, passer en gris sans effacer
            history.classList.add('history-grey');
        }
    }
    
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
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
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
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
    // Ajouter la fonction racine carrée
    expressionMode = true;
    if (currentValue === '0') {
        currentValue = '';
    }
    currentValue += '√(';
    updateDisplay();
}

function calculatePercentage() {
    // Activer le mode expression et ajouter le symbole %
    expressionMode = true;
    currentValue += '%';
    shouldResetDisplay = false;
    updateDisplay();
}

function appendPower() {
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
    // Ajouter l'opérateur puissance x^y
    expressionMode = true;
    if (currentValue === '0') {
        currentValue = '';
    }
    currentValue += '**';
    updateDisplay();
}
function appendFunction(func) {
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
    // Ajouter une fonction mathématique (ln, sin, atan)
    expressionMode = true;
    if (currentValue === '0') {
        currentValue = '';
    }
    currentValue += func + '(';
    updateDisplay();
}

function appendConstant(constant) {
    // Réinitialiser si erreur affichée
    if (currentValue === 'Erreur') {
        currentValue = '0';
        document.getElementById('history').innerHTML = '';
        shouldResetDisplay = false;
        expressionMode = false;
    }
    
    // Ajouter une constante mathématique (e)
    expressionMode = true;
    if (currentValue === '0') {
        currentValue = constant;
    } else {
        currentValue += constant;
    }
    updateDisplay();
}
// Support clavier
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === ' ') {
        e.preventDefault(); // Empêcher le comportement par défaut
        // Ajouter un espace seulement dans l'expression
        expressionMode = true;
        if (currentValue === '0') {
            currentValue = ' ';
        } else {
            currentValue += ' ';
        }
        updateDisplay();
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
