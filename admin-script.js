function loadVotingData() {
    
    const saved = localStorage.getItem('votingData');
    if (saved) {
        return JSON.parse(saved);
    }
    
    return {
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
                photo: "images/mournvell.jpg"
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
}

// Обновление статистики
function updateStats() {
    const data = loadVotingData();
    if (!data) return;

    const totalVotes = data.employees.reduce((sum, emp) => sum + emp.votes, 0);
    const totalVoters = localStorage.getItem('hasVoted') ? 1 : 0;

    document.getElementById('totalVotes').textContent = totalVotes;
    document.getElementById('totalVoters').textContent = totalVoters;
    document.getElementById('activeEmployees').textContent = data.employees.length;
}

// Загрузка списка сотрудников
function loadEmployees() {
    const data = loadVotingData();
    const tbody = document.querySelector('#employeesTable tbody');
    
    if (!data) return;

    tbody.innerHTML = data.employees.map(employee => `
        <tr>
            <td><div class="employee-photo-small" style="background-image: url('${employee.photo}')"></div></td>
            <td>${employee.name.ru}</td>
            <td>${employee.position.ru}</td>
            <td>${employee.votes}</td>
            <td>
                <button class="action-btn edit" onclick="editEmployee(${employee.id})">✏️</button>
                <button class="action-btn" onclick="resetEmployeeVotes(${employee.id})">🔄</button>
                <button class="action-btn" style="background: #ff6b6b;" onclick="deleteEmployee(${employee.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Сброс всех голосов
function resetAllVotes() {
    if (confirm('Точно сбросить ВСЕ голоса?')) {
        const data = loadVotingData();
        data.employees.forEach(emp => emp.votes = 0);
        localStorage.setItem('votingData', JSON.stringify(data));
        localStorage.removeItem('hasVoted');
        localStorage.removeItem('votedFor');
        
        updateStats();
        loadEmployees();
        alert('Все голоса сброшены!');
    }
}

// Сброс голосов одного сотрудника
function resetEmployeeVotes(employeeId) {
    const data = loadVotingData();
    const employee = data.employees.find(emp => emp.id === employeeId);
    
    if (employee && confirm(`Сбросить голоса для ${employee.name.ru}?`)) {
        employee.votes = 0;
        localStorage.setItem('votingData', JSON.stringify(data));
        updateStats();
        loadEmployees();
    }
}

// Экспорт результатов
function exportResults() {
    const data = loadVotingData();
    const csv = "Имя,Должность,Голоса\n" + data.employees.map(emp => 
        `${emp.name.ru},${emp.position.ru},${emp.votes}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
}

// Редактирование сотрудника
function editEmployee(employeeId) {
    const data = loadVotingData();
    const employee = data.employees.find(emp => emp.id === employeeId);
    
    if (!employee) return;

    const newName = prompt('Новое имя:', employee.name.ru);
    const newPosition = prompt('Новая должность:', employee.position.ru);
    const newPhoto = prompt('Новая ссылка на фото:', employee.photo);
    
    if (newName && newPosition) {
        employee.name = { 
            ru: newName, 
            en: newName,
            kk: newName 
        };
        employee.position = { 
            ru: newPosition, 
            en: newPosition, 
            kk: newPosition 
        };
        
        if (newPhoto) {
            employee.photo = newPhoto;
        }
        
        localStorage.setItem('votingData', JSON.stringify(data));
        loadEmployees();
        alert('Данные сотрудника обновлены!');
    }
}

// Добавление нового сотрудника
function addNewEmployee() {
    const name = prompt('Имя нового сотрудника:');
    const position = prompt('Должность:');
    const photo = prompt('Ссылка на фото (или оставьте пустым для эмодзи):', '👨‍💼');
    
    if (name && position) {
        const data = loadVotingData();
        const newId = Math.max(...data.employees.map(emp => emp.id)) + 1;
        
        const newEmployee = {
            id: newId,
            name: { ru: name, en: name, kk: name },
            position: { ru: position, en: position, kk: position },
            votes: 0,
            photo: photo || '👨‍💼'
        };
        
        data.employees.push(newEmployee);
        localStorage.setItem('votingData', JSON.stringify(data));
        loadEmployees();
        updateStats();
        alert('Сотрудник добавлен!');
    }
}

// Удаление сотрудника
function deleteEmployee(employeeId) {
    if (confirm('Точно удалить этого сотрудника?')) {
        const data = loadVotingData();
        data.employees = data.employees.filter(emp => emp.id !== employeeId);
        localStorage.setItem('votingData', JSON.stringify(data));
        loadEmployees();
        updateStats();
        alert('Сотрудник удалён!');
    }
}

// Загрузка при открытии страницы
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    loadEmployees();
});
