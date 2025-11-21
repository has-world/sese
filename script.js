let currentLanguage = 'ru';

const votingData = {
    employees: [
        { id: 1, name: "Семён Александрович", position: "Управляющий", votes: 0, photo: "images/semen.jpg" },
        { id: 2, name: "Данил Шева", position: "Управляющий", votes: 0, photo: "images/dan.jpg" },
        { id: 3, name: "Ольга Угадайка", position: "Управляющий", votes: 0, photo: "images/olya.jpg" },
        { id: 4, name: "Максим Мурнвелл", position: "Модератор", votes: 0, photo: "images/maks.jpg" },
        { id: 5, name: "Илья Котов", position: "Модератор", votes: 0, photo: "images/ilya.jpg" },
        { id: 6, name: "Максим Мистик", position: "Модератор", votes: 0, photo: "images/mistik.jpg" },
        { id: 7, name: "Кристина Люцифер", position: "Модератор", votes: 0, photo: "images/kris.jpg" }
    ]
};

function renderEmployees() {
    const container = document.getElementById('employeesContainer');
    container.innerHTML = votingData.employees.map(employee => `
        <div class="employee-card">
            <div class="employee-photo" style="background-image: url('${employee.photo}')"></div>
            <div class="employee-name">${employee.name}</div>
            <div class="employee-position">${employee.position}</div>
            <button class="vote-btn" onclick="voteForEmployee(${employee.id})">Голосовать</button>
        </div>
    `).join('');
}

function voteForEmployee(employeeId) {
    const employee = votingData.employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.votes++;
        localStorage.setItem('votingData', JSON.stringify(votingData));
        renderEmployees();
        renderResults();
    }
}

function renderResults() {
    const container = document.getElementById('resultsContainer');
    const sorted = [...votingData.employees].sort((a, b) => b.votes - a.votes);
    const maxVotes = Math.max(...sorted.map(emp => emp.votes));
    
    container.innerHTML = sorted.map(employee => `
        <div class="result-item">
            <span>${employee.name}</span>
            <div class="result-bar" style="width: ${maxVotes ? (employee.votes / maxVotes) * 100 : 0}%"></div>
            <span>${employee.votes} голосов</span>
        </div>
    `).join('');
}

// Загрузка данных
function loadVotingData() {
    const saved = localStorage.getItem('votingData');
    if (saved) {
        const data = JSON.parse(saved);
        votingData.employees = data.employees;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    loadVotingData();
    renderEmployees();
    renderResults();
});
