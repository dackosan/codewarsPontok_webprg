const API_BASE = "https://www.codewars.com/api/v1/users/";
const cardsContainer = document.getElementById('cards-container');
const userForm = document.getElementById('user-form');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const clearDataButton = document.querySelector('.clear-data');

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = theme;
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function toggleDarkMode() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    saveTheme(newTheme);
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function renderUserCard(user) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <h2>${user.username}</h2>
    <p><strong>Name:</strong> ${user.name || 'N/A'}</p>
    <p><strong>Clan:</strong> ${user.clan || 'N/A'}</p>
    <p><strong>Languages:</strong> ${user.languages ? user.languages.join(', ') : 'N/A'}</p>
    <p><strong>Honor:</strong> ${user.honor || 'N/A'}</p>
    <p><strong>Rank:</strong> ${user.rank || 'N/A'}</p>
    `;
    cardsContainer.appendChild(card);
}

async function fetchUserData(username) {
    try {
        const response = await fetch(`${API_BASE}${username}`);

        if (!response.ok) {
            throw new Error(`Error fetching user: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            username: data.username,
            name: data.name,
            clan: data.clan,
            languages: Object.keys(data.ranks.languages),
            honor: data.honor,
            rank: data.ranks.overall.name,
        };
    } catch (error) {
        alert(`Failed to fetch user: ${error.message}`);
        return null;
    }
}

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    if (!username) return;

    const userData = await fetchUserData(username);
    if (userData) {
        const users = loadUsers();
        users.push(userData);
        saveUsers(users);
        renderUserCard(userData);
        e.target.reset();
    }
});

darkModeToggle.addEventListener('click', toggleDarkMode);

clearDataButton.addEventListener('click', () => {
    localStorage.removeItem('users');
    cardsContainer.innerHTML = '';
});

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    const users = loadUsers();
    users.forEach(renderUserCard);
});

function toggleDarkMode() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    saveTheme(newTheme);

    // Update the icon based on the new theme
    const iconElement = darkModeToggle.querySelector('i');
    iconElement.textContent = newTheme === 'light' ? 'light_mode' : 'dark_mode';
}
