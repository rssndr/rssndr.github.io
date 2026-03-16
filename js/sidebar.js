document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    // Main menu
    const mainMenu = [
        { icon: 'fas fa-home',     text: 'Home',      href: '/' },
        { icon: 'fas fa-user-tie', text: 'About',     href: '/about' },
        /* { icon: 'fas fa-pencil-alt', text: 'Writing', href: '/writing' }, */
        { icon: 'fas fa-bookmark', text: 'Bookmarks', href: '/bookmarks' },
    ];

    // Projects menu
    const projectsMenu = [
        { icon: 'fa-solid fa-hexagon-nodes', text: 'micrograd.c',      href: '/projects/micrograd-c' },
        { icon: 'fa-solid fa-network-wired', text: 'TCP Server',       href: '/projects/tcp-server' },
        { icon: 'fa-solid fa-server',        text: 'VPS Hosting Setup', href: '/projects/vps' },
    ];

    // Online / social links
    const onlineMenu = [
        { icon: 'fa-brands fa-x-twitter', text: 'X',       href: 'https://x.com/rssndr',        target: '_blank' },
        { icon: 'fa-brands fa-linkedin',  text: 'LinkedIn', href: 'https://www.linkedin.com/in/andrea-rossetti-092161384/', target: '_blank' },
        { icon: 'fab fa-github',          text: 'GitHub',  href: 'https://github.com/rssndr',   target: '_blank' },
        { icon: 'fa-solid fa-envelope',   text: 'Email',   href: 'mailto:rossettiandrea@proton.me', target: '_blank' },
    ];

    const generateMenuHTML = (items, className = 'menu', isLink = false) => {
        return `<ul class="${className}${isLink ? ' link' : ''}">
            ${items.map(item => `
                <li>
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
                <h1><a class="home-link" href="/">Andrea Rossetti</a></h1>
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

    // Highlight current page — exact match on pathname
    const currentPath = window.location.pathname;
    const menuItems = sidebarPlaceholder.querySelectorAll('li a');

    menuItems.forEach(link => {
        const href = link.getAttribute('href');
        // Skip external links
        if (href.startsWith('http') || href.startsWith('mailto:')) return;

        // GitHub Pages usually serves index.html as "/", so we normalize
        if ((href === currentPath) ||
            (href === '/' && (currentPath === '' || currentPath === '/'))) {
            link.parentElement.classList.add('active');
        }
    });

    // ────────────────────────────────────────────────
    // Mobile header + toggle logic (unchanged)
    // ────────────────────────────────────────────────
    if (isMobile) {
        const mobileHeaderHTML = `
            <header class="mobile-header">
                <span class="mobile-name">Andrea Rossetti</span>
                <button class="mobile-menu-toggle"><i class="fas fa-bars"></i></button>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', mobileHeaderHTML);

        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) mobileHeader.style.display = 'flex';

        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const themeToggle = document.querySelector('#theme-toggle');
        const mainElement = document.querySelector('main');
        const margin = 16;

        const headerHeight = mobileHeader.offsetHeight;

        if (mainElement) mainElement.style.paddingTop = `${headerHeight}px`;
        if (themeToggle) themeToggle.style.top = `${headerHeight + margin}px`;

        if (menuToggle && sidebar && mainElement && themeToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                sidebar.setAttribute('aria-hidden', !sidebar.classList.contains('open'));

                if (sidebar.classList.contains('open')) {
                    const sidebarHeight = sidebar.offsetHeight;
                    mainElement.style.paddingTop = `${headerHeight + sidebarHeight}px`;
                    themeToggle.style.top = `${headerHeight + sidebarHeight + margin}px`;
                } else {
                    mainElement.style.paddingTop = `${headerHeight}px`;
                    themeToggle.style.top = `${headerHeight + margin}px`;
                }
            });

            // Start closed
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

