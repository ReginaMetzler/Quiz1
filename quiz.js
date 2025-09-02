// Coordinate system and slope quiz questions (English, with explanations and drawing info)
const questions = [
    {
        type: 'text',
        question: "1. What are the coordinates of the origin?",
        answer: "0,0",
        points: 1,
        explanation: "The origin is at (0,0) because both x and y are zero at the center of the coordinate system.",
        draw: { grid: true, showNumbers: true }
    },
    {
        type: 'text',
        question: "2. In the point (4,7) which number is the x-coordinate?",
        answer: "4",
        points: 1,
        explanation: "The x-coordinate is always the first number in the pair (x, y).",
        draw: { points: [[4,7]], grid: true, showNumbers: true }
    },
    {
        type: 'slope',
        question: "3. Find the slope between the points (1,2) and (2,4).",
        answer: "2",
        points: 1,
        explanation: "Slope = (4-2)/(2-1) = 2/1 = 2.",
        draw: { points: [[1,2],[2,4]], grid: true, showNumbers: true }
    },
    {
        type: 'text',
        question: "4. What is the slope in this equation: y=5x+3",
        answer: "5",
        points: 1,
        explanation: "The slope is the coefficient of x, which is 5.",
        draw: { line: { m: 5, b: 3 }, grid: true, showNumbers: true }
    },
    {
        type: 'text',
        question: "5. Write the equation of a line with slope 2 that goes through the origin.",
        answer: "y=2x",
        points: 1,
        explanation: "y = mx + b, m = 2, b = 0, so y = 2x.",
        draw: { line: { m: 2, b: 0 }, grid: true, showNumbers: true }
    },
    {
        type: 'text',
        question: "6. What is the y-intercept in the equation y=−2x+6?",
        answer: "6",
        points: 1,
        explanation: "The y-intercept is the constant term, which is 6.",
        draw: { line: { m: -2, b: 6 }, grid: true, showNumbers: true }
    },
    {
        type: 'text',
        question: "7. A line has zero slope. Is it horizontal or vertical?",
        answer: "horizontal",
        points: 1,
        explanation: "A line with zero slope is horizontal.",
        draw: { line: { m: 0, b: 2 }, grid: true, showNumbers: true }
    },
    {
        type: 'text',
        question: "8. If a line goes straight up and down, is the slope zero or undefined?",
        answer: "undefined",
        points: 1,
        explanation: "A vertical line has an undefined slope.",
        draw: { grid: true, showNumbers: true }
    }
];

let currentQuestion = 0;
let userAnswers = [];
let scores = [];

const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const finishBtn = document.getElementById('finish-btn');
const againBtn = document.getElementById('again-btn');
const resultContainer = document.getElementById('result-container');

function showQuestion(index) {
    const q = questions[index];
    let html = `<label>${q.question}</label>`;
    if (q.type === 'plot') {
        html += '<br><canvas id="coord-canvas" width="350" height="350" style="margin-top:10px;border:1px solid #ccc;cursor:crosshair;"></canvas>';
        html += '<div style="margin-top:8px;">Click on the canvas to mark the point.</div>';
    } else {
        html += '<input type="text" id="answer" autocomplete="off" autofocus />';
    }
    questionContainer.innerHTML = html;
    if (q.draw) {
        setTimeout(() => {
            window.drawCoordinateSystem({
                points: q.draw.points || [],
                line: q.draw.line || null,
                grid: q.draw.grid !== false
            });
        }, 10);
    }
    if (q.type === 'plot') {
        setTimeout(() => {
            const canvas = document.getElementById('coord-canvas');
            let userPoint = null;
            canvas.onclick = function(e) {
                const rect = canvas.getBoundingClientRect();
                const x = Math.round((e.clientX - rect.left - canvas.width/2) / 30);
                const y = Math.round((canvas.height/2 - (e.clientY - rect.top)) / 30);
                userPoint = [x, y];
                window.drawCoordinateSystem({
                    points: [],
                    userPoint,
                    grid: true
                });
                // Save answer
                userAnswers[index] = userPoint;
            };
        }, 20);
    }
    if (index < questions.length - 1) {
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
    }
    againBtn.style.display = 'none';
    resultContainer.innerHTML = '';
}

function saveAnswer() {
    const q = questions[currentQuestion];
    if (q.type === 'plot') {
        // answer already saved on click
        return;
    }
    const input = document.getElementById('answer');
    userAnswers[currentQuestion] = input.value.trim();
}

nextBtn.addEventListener('click', () => {
    saveAnswer();
    currentQuestion++;
    showQuestion(currentQuestion);
});

finishBtn.addEventListener('click', () => {
    saveAnswer();
    gradeQuiz();
});

againBtn.addEventListener('click', () => {
    currentQuestion = 0;
    userAnswers = [];
    scores = [];
    showQuestion(0);
});

function gradeQuiz() {
    scores = [];
    let total = 0;
    let max = 0;
    let resultHTML = '<h2>Results</h2>';
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        let point = 0;
        let user = userAnswers[i];
        let correct = q.answer;
        let userDisplay = '';
        if (q.type === 'plot') {
            if (Array.isArray(user) && user[0] === correct[0] && user[1] === correct[1]) {
                point = q.points;
            }
            userDisplay = Array.isArray(user) ? `(${user[0]}, ${user[1]})` : 'No answer';
        } else {
            if ((user || '').replace(/\s/g, '').toLowerCase() === String(correct).replace(/\s/g, '').toLowerCase()) {
                point = q.points;
            }
            userDisplay = user || 'No answer';
        }
        scores[i] = point;
        total += point;
        max += q.points;
        resultHTML += `<div><strong>${q.question}</strong><br>Your answer: ${userDisplay}<br>Score: ${point}/${q.points}<br>`;
        if (point === q.points) {
            resultHTML += `<span style='color:green;'>Correct!</span> <br><em>Explanation: ${q.explanation}</em>`;
        } else {
            resultHTML += `<span style='color:red;'>Incorrect.</span> <br><em>Explanation: ${q.explanation}</em>`;
        }
        resultHTML += '</div><br>';
    }
    resultHTML += `<h3>Total score: ${total}/${max}</h3>`;
    resultContainer.innerHTML = resultHTML;
    questionContainer.innerHTML = '';
    nextBtn.style.display = 'none';
    finishBtn.style.display = 'none';
    againBtn.style.display = 'inline-block';
}

// Start
showQuestion(0);
