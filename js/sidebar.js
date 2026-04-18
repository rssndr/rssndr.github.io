document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    // Main menu
    const mainMenu = [
        { icon: 'fas fa-home',     text: 'Home',      href: '/index.html' },
        { icon: 'fa-solid fa-pen', text: 'Writings',  href: '/pages/writing.html' },
        { icon: 'fas fa-user-tie', text: 'About',     href: '/pages/about.html' },
        { icon: 'fas fa-bookmark', text: 'Bookmarks', href: '/pages/bookmarks.html' },
    ];

    // Projects menu (kept as you had it)
    /***
    // Projects menu – assuming you now have .html files here
    const projectsMenu = [
        { icon: 'fa-solid fa-hexagon-nodes', text: 'micrograd.c',      href: '/projects/micrograd-c.html' },
        { icon: 'fa-solid fa-network-wired', text: 'TCP Server',       href: '/projects/tcp-server.html' },
        { icon: 'fa-solid fa-server',        text: 'VPS Hosting Setup', href: '/projects/vps.html' },
    ];
    ***/

    const writingMenu = [
        { icon: 'fa-solid fa-earth-europe', text: 'The Real Enemy of Europe', href: '/posts/20260418-the-real-enemy-of-europe.html' },
    ];

    // Online / social links
    const onlineMenu = [
        { icon: 'fa-brands fa-x-twitter', text: 'X',       href: 'https://x.com/rssndr',        target: '_blank' },
        { icon: 'fa-brands fa-linkedin',  text: 'LinkedIn', href: 'https://www.linkedin.com/in/andrea-rossetti-092161384/', target: '_blank' },
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
                <h1><a class="home-link" href="index.html">Andrea Rossetti</a></h1>
            </div>
        `;
    }

    // Build sidebar
    sidebarHTML += `
        ${generateMenuHTML(mainMenu)}

        <div class="section-title">Writing</div>
        ${generateMenuHTML(writingMenu)}

        <div class="section-title">Online</div>
        ${generateMenuHTML(onlineMenu, 'sub-menu', true)}
    `;

    sidebarPlaceholder.innerHTML = sidebarHTML;

    // Very simple active state — matches current filename
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = sidebarPlaceholder.querySelectorAll('li a');

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Skip external links
        if (href.startsWith('http') || href.startsWith('mailto:')) return;

        if (href === currentFile || href.includes(`?id=${currentFile.replace('.html','')}`)) {
            link.parentElement.classList.add('active');
        }
    });

    // ────────────────────────────────────────────────
    // Mobile header + toggle logic
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

