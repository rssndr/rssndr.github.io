document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    // Menus
    const mainMenu = [
        { icon: 'fas fa-home',     text: 'Home',      href: '/index.html' },
        { icon: 'fa-solid fa-pen', text: 'Writing',    href: '/pages/writing.html' },
        { icon: 'fas fa-bookmark', text: 'Bookmarks', href: '/pages/bookmarks.html' },
    ];

    const projectsMenu = [
        { icon: 'fa-solid fa-chart-line', text: 'PID controller', href: '/projects/pid-controller.html' },
        { icon: 'fa-solid fa-file-code', text: 'cinit', href: '/projects/cinit.html' },
    ];

    const onlineMenu = [
        { icon: 'fa-brands fa-x-twitter',   text: 'X',          href: 'https://x.com/rssndr',                                   target: '_blank' },
        { icon: 'fa-brands fa-linkedin',    text: 'LinkedIn',   href: 'https://www.linkedin.com/in/andrea-rossetti-092161384/', target: '_blank' },
        { icon: 'fa-brands fa-github',      text: 'GitHub',     href: 'https://github.com/rssndr',                              target: '_blank' },
        { icon: 'fa-solid fa-envelope',     text: 'Email',      href: 'mailto:rossettiandrea@proton.me',                        target: '_blank' },
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
                <h1><a class="home-link" href="/index.html">Andrea Rossetti</a></h1>
            </div>
        `;
    }

    // Main content wrapper
    sidebarHTML += `
        <div class="sidebar-content">
            ${generateMenuHTML(mainMenu)}

            <div class="section-title">Projects</div>
            ${generateMenuHTML(projectsMenu, 'sub-menu')}
        </div>

        <div class="sidebar-bottom">
            <div class="section-title">Online</div>
            ${generateMenuHTML(onlineMenu, 'sub-menu', true)}
        </div>
    `;

    sidebarPlaceholder.innerHTML = sidebarHTML;

    // Active menu highlighting
    const currentPath = window.location.pathname.toLowerCase();
    const menuLinks = document.querySelectorAll('.menu li a, .sub-menu li a');

    menuLinks.forEach(link => {
        let href = link.getAttribute('href').toLowerCase();

        if ((currentPath === '/' || currentPath.endsWith('/index.html')) &&
            (href === '/index.html' || href === 'index.html' || href === '/')) {
            link.parentElement.classList.add('active');
        }
        else if (currentPath.endsWith(href) || currentPath === href) {
            link.parentElement.classList.add('active');
        }
    });

    // Mobile header + toggle logic
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
    }
});

