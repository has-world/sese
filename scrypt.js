let currentLanguage = 'ru';

const votingData = {
    employees: [
        { 
            id: 1, 
            name: { ru: "Семён Александрович", en: "Semen Aleksandrovich", kk: "Семён Александрулы" }, 
            position: { ru: "Управляющий", en: "Manager", kk: "Менеджер" }, 
            votes: 0, 
            photo: "images/semen.jpg" 
        },
        { 
            id: 2, 
            name: { ru: "Данил Шева", en: "Danil Shewyakov", kk: "Данил Шева" }, 
            position: { ru: "Управляющий", en: "Manager", kk: "Менеджер" }, 
            votes: 0, 
            photo: "images/dan.jpg" 
        },
        { 
            id: 3, 
            name: { ru: "Ольга Угадайка", en: "Olga Ugadaika", kk: "Ольга Угадайка" },
            position: { ru: "Управляющий", en: "Manager", kk: "Менеджер" }, 
            votes: 0, 
            photo: "images/olya.jpg" 
        },
        { 
            id: 4, 
            name: { ru: "Максим Мурнвелл", en: "Maksim Mournvell", kk: "Максим Мурнвелл" }, 
            position: { ru: "Модератор", en: "Moderator", kk: "Модератор" }, 
            votes: 0,
            photo: "images/maks.jpg" 
        },
        {
            id: 5, 
            name: { ru: "Илья Котов", en: "Ilya Kotov", kk: "Илья Котов" }, 
            position: { ru: "Модератор", en: "Moderator", kk: "Модератор" }, 
            votes: 0,
            photo: "images/ilya.jpg" 
        },
        {
            id: 6, 
            name: { ru: "Максим Мистик", en: "Maksim Mistik", kk: "Максим Мистик" }, 
            position: { ru: "Модератор", en: "Moderator", kk: "Модератор" }, 
            votes: 0,
            photo: "images/mistik.jpg" 
        },
        {
            id: 7, 
            name: { ru: "Кристина Люцифер", en: "Kristina Lucifer", kk: "Кристина Люцифер" }, 
            position: { ru: "Модератор", en: "Moderator", kk: "Модератор" }, 
            votes: 0,
            photo: "images/kris.jpg" 
        }
    ]
};

// Простые функции без ошибок
function loadVotingData() {
    const saved = localStorage.getItem('votingData');
    if (saved && saved !== "undefined") {
        try {
            const data = JSON.parse(saved);
            votingData.employees = data.employees;
        } catch (e) {
            localStorage.removeItem('votingData');
        }
    }
}

function saveVotingData() {
    localStorage.setItem('votingData', JSON.stringify(votingData));
}

function renderEmployees() {
    const container = document.getElementById('employeesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    votingData.employees.forEach(employee => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
            <div class="employee-photo" style="background-image: url('${employee.photo}')"></div>
            <div class="employee-name">${employee.name[currentLanguage]}</div>
            <div class="employee-position">${employee.position[currentLanguage]}</div>
            <button class="vote-btn" onclick="voteForEmployee(${employee.id})">Голосовать</button>
        `;
        container.appendChild(card);
    });
}

function voteForEmployee(employeeId) {
    const employee = votingData.employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.votes++;
        saveVotingData();
        renderEmployees();
        renderResults();
    }
}

function renderResults() {
    const container = document.getElementById('resultsContainer');
    if (!container) return;
    
    const sorted = [...votingData.employees].sort((a, b) => b.votes - a.votes);
    const maxVotes = Math.max(...sorted.map(emp => emp.votes));
    
    container.innerHTML = sorted.map(employee => `
        <div class="result-item">
            <span>${employee.name[currentLanguage]}</span>
            <div class="result-bar" style="width: ${maxVotes ? (employee.votes / maxVotes) * 100 : 0}%"></div>
            <span>${employee.votes} голосов</span>
        </div>
    `).join('');
}

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    loadVotingData();
    renderEmployees();
    renderResults();
});
