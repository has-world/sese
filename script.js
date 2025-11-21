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

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeButton = document.querySelector('.theme-switcher button');
    const t = translations[currentLanguage];
    themeButton.textContent = newTheme === 'dark' ? t.lightTheme : t.darkTheme;
}

function updateThemeButtonText() {
    const t = translations[currentLanguage];
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeButton = document.querySelector('.theme-switcher button');
    themeButton.textContent = currentTheme === 'dark' ? t.lightTheme : t.darkTheme;
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
    renderEmployees();
    renderResults();
    updateLanguageButtons();
    updateThemeButtonText();
}

function applyTranslations() {
    const t = translations[currentLanguage];
    
    document.getElementById('title').textContent = t.title;
    document.getElementById('establishment').textContent = t.establishment;
    document.getElementById('votingPeriod').textContent = t.votingPeriod;
    document.getElementById('prizesTitle').textContent = t.prizesTitle;
    document.getElementById('chooseEmployee').textContent = t.chooseEmployee;
    document.getElementById('currentResults').textContent = t.currentResults;
    
    const prizesList = document.getElementById('prizesList');
    prizesList.innerHTML = t.prizes.map(prize => `<li>${prize}</li>`).join('');
}

function updateLanguageButtons() {
    const buttons = document.querySelectorAll('.language-switcher button');
    buttons.forEach(button => {
        if (button.textContent.toLowerCase().includes(currentLanguage)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

const API_URL = 'https://script.google.com/macros/s/AKfycbwL3kO_t0Nax-W-xBZG_bxLvB0Qk5Zvu9fwTMxCkzMPli9UMu43Iijsuj5nRujV4cKp/exec'; // ТВОЙ URL

function loadVotingData() {
    const saved = localStorage.getItem('votingData');
    if (saved) {
        const data = JSON.parse(saved);
        votingData.employees = data.employees;
    }
}

function saveVotingData() {
    localStorage.setItem('votingData', JSON.stringify(votingData));
}

function renderEmployees() {
    const container = document.getElementById('employeesContainer');
    const t = translations[currentLanguage];
    const hasVotedFlag = hasVoted();
    const votedFor = localStorage.getItem('votedFor');
    
    container.innerHTML = '';

    votingData.employees.forEach(employee => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        const isVotedFor = hasVotedFlag && parseInt(votedFor) === employee.id;
        
        card.innerHTML = `
    <div class="employee-photo" style="background-image: url('${employee.photo}')"></div>
    <div class="employee-name">${employee.name[currentLanguage]}</div>
    <div class="employee-position">${employee.position[currentLanguage]}</div>
    <button class="${isVotedFor ? 'cancel-btn' : 'vote-btn'}" 
            onclick="${isVotedFor ? 'cancelVote()' : 'voteForEmployee(' + employee.id + ')'}">
        ${isVotedFor ? (t.cancelVote || "Отменить голос") : t.voteButton}
    </button>
`;
        container.appendChild(card);
    });
}

function voteForEmployee(employeeId) {
    const t = translations[currentLanguage];
    
    if (hasVoted()) {
        return;
    }

    const employee = votingData.employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.votes++;
        saveVotingData(votingData);

        localStorage.setItem('votedFor', employeeId);
        setVotedCookie();
        
        renderEmployees();
        renderResults();
    }
}

function cancelVote() {
    const t = translations[currentLanguage];
    const votedEmployeeId = localStorage.getItem('votedFor');
    if (!votedEmployeeId) return;
    
    const employee = votingData.employees.find(emp => emp.id === parseInt(votedEmployeeId));
    if (employee && employee.votes > 0) {
        employee.votes--;
        saveVotingData(votingData);
        localStorage.removeItem('hasVoted');
        localStorage.removeItem('votedFor');
        
        renderEmployees();
        renderResults();
    }
}

function hasVoted() {
    return localStorage.getItem('hasVoted') === 'true';
}

function setVotedCookie() {
    localStorage.setItem('hasVoted', 'true');
}

function renderResults() {
    const container = document.getElementById('resultsContainer');
    const t = translations[currentLanguage];
    const sortedEmployees = [...votingData.employees].sort((a, b) => b.votes - a.votes);
    const maxVotes = Math.max(...sortedEmployees.map(emp => emp.votes));

    container.innerHTML = sortedEmployees.map(employee => `
        <div class="result-item">
            <span>${employee.name[currentLanguage]}</span>
            <div class="result-bar" style="width: ${maxVotes ? (employee.votes / maxVotes) * 100 : 0}%"></div>
            <span>${employee.votes} ${t.votes}</span>
        </div>
    `).join('');
}

function openAdminPanel() {
    const password = prompt("Введите пароль:");
    
    // База паролей сотрудников
    const userPasswords = {
        "432432": "Хас",
        "sese4444": "Дэн"
    };
    
    if (password in userPasswords) {
        alert(`Добро пожаловать, ${userPasswords[password]}!`);
        window.location.href = "admin.html";
    } else {
        alert("Неверный пароль! Обратитесь к Хасану.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    loadVotingData();
    
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        changeLanguage(savedLang);
    } else {
        applyTranslations();
        renderEmployees();
        renderResults();
        updateLanguageButtons();
        updateThemeButtonText();
    }
}); 



