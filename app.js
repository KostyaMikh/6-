// Игровой движок приложения
let currentTestIdx = 0, currentQuestionIdx = 0, score = 0, isAnswerChecked = false, selectedQuizOption = null;

function startTest(idx) {
    currentTestIdx = idx; currentQuestionIdx = 0; score = 0;
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('test-screen').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    isAnswerChecked = false; selectedQuizOption = null;
    const test = testsData[currentTestIdx];
    const q = test.questions[currentQuestionIdx];
    
    document.getElementById('progress').style.width = `${(currentQuestionIdx / test.questions.length) * 100}%`;
    document.getElementById('next-btn').innerText = "Проверить";

    let area = document.getElementById('question-area');
    let html = `<div class="question-title">${q.question}</div>`;

    if (q.type === 'quiz') {
        html += '<div class="options-container">';
        q.options.forEach((opt, i) => { html += `<button class="option-btn" onclick="selectOption(this, ${i})">${opt}</button>`; });
        html += '</div>';
    } else if (q.type === 'input') {
        html += '<input type="text" id="blank-input" class="text-input" placeholder="Введи ответ из головы...">';
    } else if (q.type === 'drag') {
        html += '<div class="drag-container">';
        q.pairs.forEach(p => {
            html += `<div class="drag-row"><div class="drag-pic">${p.pic}</div><div class="drop-zone" data-id="${p.id}" ondragover="allowDrop(event)" ondrop="drop(event)"></div></div>`;
        });
        html += '</div><div class="drag-pool" id="dragPool" ondragover="allowDrop(event)" ondrop="drop(event)">';
        [...q.pairs].sort(() => Math.random() - 0.5).forEach((p) => {
            html += `<div class="drag-item" draggable="true" id="item-${p.id}" ondragstart="drag(event)">${p.name}</div>`;
        });
        html += '</div>';
    }
    area.innerHTML = html;
}

function selectOption(btn, idx) {
    if (isAnswerChecked) return;
    document.querySelectorAll('.option-btn').forEach(b => b.style.borderColor = 'var(--glass-border)');
    btn.style.borderColor = 'var(--accent-color)';
    selectedQuizOption = idx;
}

function handleNext() {
    const q = testsData[currentTestIdx].questions[currentQuestionIdx];
    if (!isAnswerChecked) {
        let isCorrect = false;
        if (q.type === 'quiz') {
            if (selectedQuizOption === null) return;
            const btns = document.querySelectorAll('.option-btn');
            if (selectedQuizOption === q.correct) { btns[selectedQuizOption].classList.add('correct'); isCorrect = true; }
            else { btns[selectedQuizOption].classList.add('incorrect'); btns[q.correct].classList.add('correct'); }
        } else if (q.type === 'input') {
            const ans = document.getElementById('blank-input').value.trim().toLowerCase();
            if (!ans) return;
            if (ans === q.correct) { document.getElementById('blank-input').classList.add('correct'); isCorrect = true; }
            else { document.getElementById('blank-input').classList.add('incorrect'); document.getElementById('blank-input').value += ` (Ответ: ${q.correct})`; }
        } else if (q.type === 'drag') {
            let err = false;
            document.querySelectorAll('.drop-zone').forEach(z => {
                const id = z.getAttribute('data-id').trim();
                if(z.firstElementChild && z.firstElementChild.id === `item-${id}`) { z.style.background = 'rgba(52, 199, 89, 0.2)'; }
                else { z.style.background = 'rgba(255, 59, 48, 0.2)'; err = true; }
            });
            if (!err) isCorrect = true;
        }
        if (isCorrect) score++;
        isAnswerChecked = true;
        document.getElementById('next-btn').innerText = "Дальше";
    } else {
        currentQuestionIdx++;
        if (currentQuestionIdx < testsData[currentTestIdx].questions.length) showQuestion();
        else finishTest();
    }
}

function finishTest() {
    document.getElementById('test-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    let grade = score === 3 ? 5 : score === 2 ? 4 : score === 1 ? 3 : 2;
    const view = document.getElementById('score-view');
    view.innerText = grade;
    view.style.background = grade >= 4 ? 'var(--accent-success)' : grade === 3 ? 'var(--accent-color)' : 'var(--accent-error)';
    document.getElementById('result-text').innerText = `Успешно выполнено ${score} из 3 заданий.`;
}

function backToMenu() {
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
}

// Функции перетаскивания (Drag & Drop)
function allowDrop(e) { e.preventDefault(); }
function drag(e) { e.dataTransfer.setData("text", e.target.id); }
function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const el = document.getElementById(data);
    if (e.target.classList.contains('drop-zone') && e.target.children.length === 0) e.target.appendChild(el);
    else if (e.target.id === 'dragPool' || e.target.closest('#dragPool')) document.getElementById('dragPool').appendChild(el);
}
