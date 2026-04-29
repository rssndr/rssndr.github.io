document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const container = document.querySelector('.settings-container');
    const settingsToggle = document.getElementById('settings-toggle');
    const dropdown = document.getElementById('dropdown-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const langToggle = document.getElementById('lang-toggle');

    const body = document.body;

    // ===================== THEME =====================
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // ===================== DROPDOWN =====================
    function toggleDropdown() {
        const isOpen = dropdown.classList.toggle('show');
        container.classList.toggle('active', isOpen);
        settingsToggle.classList.toggle('active', isOpen);
    }

    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();        // Prevent click from bubbling
        toggleDropdown();
    });

    // Close dropdown when clicking anywhere outside
    document.addEventListener('click', () => {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            container.classList.remove('active');
            settingsToggle.classList.remove('active');
        }
    });

    // ===================== THEME TOGGLE =====================
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();        // Prevent closing the menu
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    });

    // ===================== LANGUAGE TOGGLE =====================
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();        // Prevent closing the menu

        const isItalian = window.location.pathname.startsWith('/it');

        if (isItalian) {
            // Go back to English
            window.location.href = window.location.pathname.replace(/^\/it/, '') || '/';
        } else {
            // Go to Italian
            const currentPath = window.location.pathname;
            window.location.href = '/it' + (currentPath === '/' ? '' : currentPath);
        }
    });

    // Optional: Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            container.classList.remove('active');
            settingsToggle.classList.remove('active');
        }
    });
});

