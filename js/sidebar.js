document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    const baseURL = '/';

    // Main menu with clean hrefs
    const mainMenu = [
        { page: 'index.html', icon: 'fas fa-home', text: 'Home', href: '/' },
        { page: 'about.html', icon: 'fas fa-user-tie', text: 'About', href: '/about' },
        /*{ page: 'writing.html', icon: 'fas fa-pencil-alt', text: 'Writing', href: '/writing' },*/
        { page: 'bookmarks.html', icon: 'fas fa-bookmark', text: 'Bookmarks', href: '/bookmarks' },
    ];

    // Projects menu with clean hrefs and IDs
    const projectsMenu = [
        { page: 'project.html', icon: 'fa-solid fa-hexagon-nodes', text: 'micrograd.c', href: '/projects/micrograd-c' },
        { page: 'project.html', icon: 'fa-solid fa-network-wired', text: 'TCP Server', href: '/projects/tcp-server' },
        { page: 'project.html', icon: 'fa-solid fa-server', text: 'VPS Hosting Setup', href: '/projects/vps' },
    ];

    const onlineMenu = [
        { icon: 'fa-brands fa-x-twitter', text: 'X', href: 'https://x.com/rssndr', target: '_blank' },
        { icon: 'fa-brands fa-linkedin', text: 'LinkedIn', href: 'https://www.linkedin.com/in/andrea-rossetti-092161384/', target: '_blank' },
        { icon: 'fab fa-github', text: 'GitHub', href: 'https://github.com/rssndr', target: '_blank' },
        { icon: 'fa-solid fa-envelope', text: 'Email', href: 'mailto:rossettiandrea@proton.me', target: '_blank' },
    ];

    const generateMenuHTML = (items, className = 'menu', isLink = false) => {
        return `<ul class="${className}${isLink ? ' link' : ''}">
            ${items.map(item => `
                <li data-page="${item.page || ''}" data-href="${item.href || ''}">
                    <a href="${item.href}"${item.target ? ` target="${item.target}"` : ''}>
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                </li>
            `).join('')}
        </ul>`;
    };

    const isMobile = window.innerWidth <= 1144;

    let sidebarHTML = '';
    if (!isMobile) {
        sidebarHTML += `
            <div class="sidebar-header">
                <h1><a class="home-link" href="https://andrearossetti.me">Andrea Rossetti</a></h1>
            </div>
        `;
    }
    sidebarHTML += `
        ${generateMenuHTML(mainMenu)}
        <div class="section-title">Projects</div>
        ${generateMenuHTML(projectsMenu, 'sub-menu')}
        <div class="section-title">Online</div>
        ${generateMenuHTML(onlineMenu, 'sub-menu', true)}
    `;

    sidebarPlaceholder.innerHTML = sidebarHTML;

    // Enhanced currentPage detection
    let currentPath = window.location.pathname;
    let currentPage = currentPath.split('/').pop() || 'index.html';
    if (currentPage === '') currentPage = 'index.html';
    if (!currentPage.endsWith('.html') && currentPage !== 'index.html') {
        currentPage += '.html';
    }

    // Set active class based on href match
    const menuItems = sidebarPlaceholder.querySelectorAll('li[data-href]');
    menuItems.forEach(item => {
        const href = item.getAttribute('data-href');
        if (href && (href === currentPath || (currentPath.startsWith(href) && href !== '/'))) {
            item.classList.add('active');
        }
    });

    // Mobile-specific: Insert mobile header if on mobile
    if (isMobile) {
        const mobileHeaderHTML = `
            <header class="mobile-header">
                <span class="mobile-name">Andrea Rossetti</span>
                <button class="mobile-menu-toggle"><i class="fas fa-bars"></i></button>
            </header>
            `;
        document.body.insertAdjacentHTML('afterbegin', mobileHeaderHTML);

        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) {
            mobileHeader.style.display = 'flex';
        }

        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const themeToggle = document.querySelector('#theme-toggle');
        const mainElement = document.querySelector('main');
        const margin = 16;

        const headerHeight = document.querySelector('.mobile-header').offsetHeight;

        if (window.innerWidth <= 1144) {
            if (mainElement) mainElement.style.paddingTop = `${headerHeight}px`;
            if (themeToggle) themeToggle.style.top = `${headerHeight + margin}px`;
        }

        if (menuToggle && sidebar && mainElement && themeToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                sidebar.setAttribute('aria-hidden', !sidebar.classList.contains('open'));

                if (window.innerWidth <= 1144) {
                    if (sidebar.classList.contains('open')) {
                        const sidebarHeight = sidebar.offsetHeight;
                        mainElement.style.paddingTop = `${headerHeight + sidebarHeight}px`;
                        themeToggle.style.top = `${headerHeight + sidebarHeight + margin}px`;
                    } else {
                        mainElement.style.paddingTop = `${headerHeight}px`;
                        themeToggle.style.top = `${headerHeight + margin}px`;
                    }
                }
            });
            sidebar.classList.remove('open');
            sidebar.setAttribute('aria-hidden', 'true');
        }

        if (themeToggle) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > headerHeight) {
                    themeToggle.classList.add('sticky');
                } else {
                    themeToggle.classList.remove('sticky');
                }
            });
        }
    }
});

