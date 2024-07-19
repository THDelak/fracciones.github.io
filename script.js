document.addEventListener('DOMContentLoaded', (event) => {
    generateExercises();
});

function generateExercises() {
    const container = document.getElementById('exercise-container');
    container.innerHTML = ''; // Clear previous exercises
    const exercises = [];

    for (let i = 0; i < 10; i++) {
        const numerator1 = getRandomInt(1, 10);
        const denominator1 = getRandomInt(1, 10);
        const numerator2 = getRandomInt(1, 10);
        const denominator2 = getRandomInt(1, 10);
        const operators = ['+', '-', '*', '/'];
        const operator = operators[Math.floor(Math.random() * operators.length)];

        const exercise = {
            numerator1,
            denominator1,
            numerator2,
            denominator2,
            operator
        };
        exercises.push(exercise);

        const exerciseElement = document.createElement('div');
        exerciseElement.classList.add('exercise');
        exerciseElement.innerHTML = `
            <div class="fraction-input">
                <input type="text" value="${numerator1}" readonly>
                <div class="fraction-bar"></div>
                <input type="text" value="${denominator1}" readonly>
            </div>
            <span>${operator}</span>
            <div class="fraction-input">
                <input type="text" value="${numerator2}" readonly>
                <div class="fraction-bar"></div>
                <input type="text" value="${denominator2}" readonly>
            </div>
            <span>=</span>
            <div class="fraction-input">
                <input type="text" class="answer-numerator">
                <div class="fraction-bar"></div>
                <input type="text" class="answer-denominator">
            </div>
        `;
        container.appendChild(exerciseElement);
    }

    // Store exercises in a global variable for evaluation
    window.exercises = exercises;
}

function evaluateExercises() {
    const exerciseElements = document.querySelectorAll('.exercise');
    let score = 0;

    exerciseElements.forEach((exerciseElement, index) => {
        const exercise = window.exercises[index];
        const answerNumeratorElement = exerciseElement.querySelector('.answer-numerator');
        const answerDenominatorElement = exerciseElement.querySelector('.answer-denominator');
        const userNumerator = parseInt(answerNumeratorElement.value, 10);
        const userDenominator = parseInt(answerDenominatorElement.value, 10);

        const correctAnswer = calculateFraction(
            exercise.numerator1,
            exercise.denominator1,
            exercise.operator,
            exercise.numerator2,
            exercise.denominator2
        );

        if (userNumerator === correctAnswer.numerator && userDenominator === correctAnswer.denominator) {
            score++;
            answerNumeratorElement.style.backgroundColor = 'lightgreen';
            answerDenominatorElement.style.backgroundColor = 'lightgreen';
        } else {
            answerNumeratorElement.style.backgroundColor = 'lightcoral';
            answerDenominatorElement.style.backgroundColor = 'lightcoral';
            answerNumeratorElement.value = correctAnswer.numerator;
            answerDenominatorElement.value = correctAnswer.denominator;
        }
    });

    alert(`Tu puntaje es: ${score} de 10`);
}

function calculateFraction(n1, d1, operator, n2, d2) {
    let numerator, denominator;

    switch (operator) {
        case '+':
            numerator = n1 * d2 + n2 * d1;
            denominator = d1 * d2;
            break;
        case '-':
            numerator = n1 * d2 - n2 * d1;
            denominator = d1 * d2;
            break;
        case '*':
            numerator = n1 * n2;
            denominator = d1 * d2;
            break;
        case '/':
            numerator = n1 * d2;
            denominator = d1 * n2;
            break;
    }

    const gcd = getGCD(numerator, denominator);
    return {
        numerator: numerator / gcd,
        denominator: denominator / gcd
    };
}

function getGCD(a, b) {
    if (!b) {
        return a;
    }
    return getGCD(b, a % b);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function calculate() {
    const numerator1 = parseInt(document.getElementById('numerator1').value, 10);
    const denominator1 = parseInt(document.getElementById('denominator1').value, 10);
    const numerator2 = parseInt(document.getElementById('numerator2').value, 10);
    const denominator2 = parseInt(document.getElementById('denominator2').value, 10);
    const operator = document.getElementById('operation').value;

    if (isNaN(numerator1) || isNaN(denominator1) || isNaN(numerator2) || isNaN(denominator2)) {
        alert('Por favor, ingresa todos los valores numéricos.');
        return;
    }

    let result;
    let steps = [];

    switch (operator) {
        case '+':
            steps.push(`${numerator1}/${denominator1} + ${numerator2}/${denominator2}`);
            result = addFractions(numerator1, denominator1, numerator2, denominator2);
            steps.push(`(${numerator1} * ${denominator2} + ${numerator2} * ${denominator1}) / (${denominator1} * ${denominator2})`);
            break;
        case '-':
            steps.push(`${numerator1}/${denominator1} - ${numerator2}/${denominator2}`);
            result = subtractFractions(numerator1, denominator1, numerator2, denominator2);
            steps.push(`(${numerator1} * ${denominator2} - ${numerator2} * ${denominator1}) / (${denominator1} * ${denominator2})`);
            break;
        case '*':
            steps.push(`${numerator1}/${denominator1} * ${numerator2}/${denominator2}`);
            result = multiplyFractions(numerator1, denominator1, numerator2, denominator2);
            steps.push(`(${numerator1} * ${numerator2}) / (${denominator1} * ${denominator2})`);
            break;
        case '/':
            steps.push(`${numerator1}/${denominator1} ÷ ${numerator2}/${denominator2}`);
            result = divideFractions(numerator1, denominator1, numerator2, denominator2);
            steps.push(`(${numerator1} * ${denominator2}) / (${denominator1} * ${numerator2})`);
            break;
    }

    steps.push(`Resultado: ${result.numerator}/${result.denominator}`);

    const gcd = getGCD(result.numerator, result.denominator);
    if (gcd > 1) {
        steps.push(`Simplificación: (${result.numerator} / ${gcd}) / (${result.denominator} / ${gcd})`);
        result.numerator /= gcd;
        result.denominator /= gcd;
        steps.push(`Fracción simplificada: ${result.numerator}/${result.denominator}`);
    }

    document.getElementById('result-steps').innerHTML = steps.join('<br>');
}

function addFractions(n1, d1, n2, d2) {
    const numerator = n1 * d2 + n2 * d1;
    const denominator = d1 * d2;
    return { numerator, denominator };
}

function subtractFractions(n1, d1, n2, d2) {
    const numerator = n1 * d2 - n2 * d1;
    const denominator = d1 * d2;
    return { numerator, denominator };
}

function multiplyFractions(n1, d1, n2, d2) {
    const numerator = n1 * n2;
    const denominator = d1 * d2;
    return { numerator, denominator };
}

function divideFractions(n1, d1, n2, d2) {
    const numerator = n1 * d2;
    const denominator = d1 * n2;
    return { numerator, denominator };
}

function getGCD(a, b) {
    if (!b) {
        return a;
    }
    return getGCD(b, a % b);
}
