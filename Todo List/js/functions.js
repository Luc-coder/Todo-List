// ================= STORAGE =================

function getStorage() {
    return JSON.parse(localStorage.getItem('todo-data')) || {};
}

function saveStorage(data) {
    localStorage.setItem('todo-data', JSON.stringify(data));
}

function saveCell(cell) {
    const key = cell.dataset.key;
    if (!key) return;

    const data = getStorage();

    data[key] = [];

    cell.querySelectorAll('.task').forEach(task => {
        data[key].push({
            text: task.querySelector('span').innerText,
            done: task.classList.contains('done')
        });
    });

    saveStorage(data);
}

// ================= TASK =================

function createTask(text, cell, done = false) {
    const task = document.createElement('div');
    task.classList.add('task');
    if (done) task.classList.add('done');

    task.innerHTML = `
        <input type="checkbox" ${done ? 'checked' : ''}>
        <span>${text}</span>
        <button class="up">↑</button>
        <button class="down">↓</button>
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
    `;

    // checkbox
    task.querySelector('input').addEventListener('change', e => {
        task.classList.toggle('done', e.target.checked);
        saveCell(cell);
    });

    // mover pra cima
    task.querySelector('.up').addEventListener('click', () => {
        const prev = task.previousElementSibling;
        if (prev && prev.classList.contains('task')) {
            cell.insertBefore(task, prev);
            saveCell(cell);
        }
    });

    // mover pra baixo
    task.querySelector('.down').addEventListener('click', () => {
        const next = task.nextElementSibling;
        if (next && next.classList.contains('task')) {
            cell.insertBefore(next, task);
            saveCell(cell);
        }
    });

    // editar
    task.querySelector('.edit').addEventListener('click', () => {
        const newText = prompt('Editar tarefa:', task.querySelector('span').innerText);
        if (newText) {
            task.querySelector('span').innerText = newText;
            saveCell(cell);
        }
    });

    // excluir
    task.querySelector('.delete').addEventListener('click', () => {
        task.remove();
        saveCell(cell);
    });

    cell.appendChild(task);
    saveCell(cell);
}

// ================= BOTÕES + =================

function bindAddButtons(selector) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', () => {
            const text = prompt('Digite a tarefa:');
            if (!text) return;

            createTask(text, btn.parentElement);
        });
    });
}

bindAddButtons('.add-btn-day');
bindAddButtons('.add-btn-sema');
bindAddButtons('.add-btn-mens');
bindAddButtons('.add-btn-tri');
bindAddButtons('.add-btn-seme');

// ================= LOAD =================

function loadFromStorage() {
    const data = getStorage();

    Object.keys(data).forEach(key => {
        const cell = document.querySelector(`[data-key="${key}"]`);
        if (!cell) return;

        data[key].forEach(task => {
            createTask(task.text, cell, task.done);
        });
    });
}

loadFromStorage();
