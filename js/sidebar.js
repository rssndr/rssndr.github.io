document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    const baseURL = '/';

    // Define menu items as arrays for easier expansion
    const mainMenu = [
        { page: 'index.html', icon: 'fas fa-home', text: 'Home', href: `${baseURL}index.html` },
        //{ page: 'writing.html', icon: 'fas fa-pencil-alt', text: 'Writing', href: `${baseURL}pages/writing.html` },
        { page: 'about.html', icon: 'fas fa-user-tie', text: 'About', href: `${baseURL}pages/about.html` },
        { page: 'bookmarks.html', icon: 'fas fa-bookmark', text: 'Bookmarks', href: `${baseURL}pages/bookmarks.html` },
    ];

    const projectsMenu = [
        { page: 'micrograd-c', icon: 'fa-solid fa-hexagon-nodes', text: 'micrograd.c', href: `${baseURL}projects/project.html?id=micrograd-c` },
        { page: 'tcp-server', icon: 'fa-solid fa-network-wired', text: 'TCP Server', href: `${baseURL}projects/project.html?id=tcp-server` },
        { page: 'website', icon: 'fa-solid fa-window-maximize', text: 'Personal Website', href: `${baseURL}projects/project.html?id=website` },
    ];

    const onlineMenu = [
        { icon: 'fa-brands fa-x-twitter', text: 'X', href: 'https://x.com/rssndr', target: '_blank' },
        { icon: 'fa-brands fa-linkedin', text: 'LinkedIn', href: 'https://www.linkedin.com/in/andrea-rossetti-092161384/', target: '_blank' },
        { icon: 'fab fa-github', text: 'GitHub', href: 'https://github.com/rssndr', target: '_blank' },
        { icon: 'fa-solid fa-envelope', text: 'Email', href: 'mailto:rossettiandrea@proton.me', target: '_blank' },
    ];

    // Generate HTML from arrays
    const generateMenuHTML = (items, className = 'menu', isLink = false) => {
        return `<ul class="${className}${isLink ? ' link' : ''}">
            ${items.map(item => `
                <li data-page="${item.page || ''}">
                    <a href="${item.href}"${item.target ? ` target="${item.target}"` : ''}>
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                </li>
            `).join('')}
        </ul>`;
    };

    const isMobile = window.innerWidth <= 1024;

    let sidebarHTML = '';
    if (!isMobile) {
        sidebarHTML += `
            <div class="sidebar-header">
                <h1>Andrea Rossetti</h1>
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

    // Insert the main sidebar
    sidebarPlaceholder.innerHTML = sidebarHTML;

    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active class for main sidebar
    const menuItems = sidebarPlaceholder.querySelectorAll('li[data-page]');
    menuItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === currentPage) {
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

