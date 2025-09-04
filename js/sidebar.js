document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    const baseURL = '/';

    const sidebarHTML = `
        <div class="sidebar-header">
            <h1>Andrea Rossetti</h1>
        </div>
        <ul class="menu">
            <li data-page="index.html"><a href="${baseURL}index.html"><i class="fas fa-home"></i> Home</a></li>
            <li data-page="writing.html"><a href="${baseURL}pages/writing.html"><i class="fas fa-pencil-alt"></i> Writing</a></li>
            <li data-page="about.html"><a href="${baseURL}pages/about.html"><i class="fas fa-user-tie"></i> About</a></li>
            <li data-page="bookmarks.html"><a href="${baseURL}pages/bookmarks.html"><i class="fas fa-bookmark"></i> Bookmarks</a></li>
        </ul>
        <div class="section-title">Projects</div>
        <ul class="sub-menu">
            <li data-page="project1.html"><a href="${baseURL}project1.html"><i class="fas fa-campground"></i> Web Dev Portfolio Site</a></li>
            <li data-page="project2.html"><a href="${baseURL}project2.html"><i class="fas fa-robot"></i> AI Chatbot Prototype</a></li>
            <li data-page="project3.html"><a href="${baseURL}project3.html"><i class="fas fa-chart-bar"></i> Data Analysis Dashboard</a></li>
        </ul>
        <div class="section-title">Online</div>
        <ul class="sub-menu link">
            <li><a href="https://x.com/rssndr" target="_blank"><i class="fa-brands fa-x-twitter"></i> X</a></li>
            <li><a href="https://instagram.com/rssndr05" target="_blank"><i class="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="https://github.com/rssndr" target="_blank"><i class="fab fa-github"></i> GitHub</a></li>
        </ul>
    `;

    // Insert the main sidebar
    sidebarPlaceholder.innerHTML = sidebarHTML;

    // Second sidebar for writing.html
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'writing.html') {
        const articleSidebar = document.createElement('nav');
        articleSidebar.className = 'article-sidebar';
        articleSidebar.innerHTML = `
            <div class="article-sidebar-header">
                <h2>Articles</h2>
            </div>
            <ul class="article-list">
                <li><a href="#article1">The Impact of AI on Politics</a></li>
                <li><a href="#article2">Cultural Shifts in the Digital Age</a></li>
                <li><a href="#article3">NGO Perspectives on Global Issues</a></li>
            </ul>
        `;
        document.body.appendChild(articleSidebar);

        // Highlight active article (basic example; enhance with real URLs or IDs)
        const articleLinks = articleSidebar.querySelectorAll('.article-list a');
        articleLinks.forEach(link => {
            if (window.location.hash === link.getAttribute('href')) {
                link.classList.add('active');
            }
        });
    }

    // Set active class for main sidebar
    const menuItems = sidebarPlaceholder.querySelectorAll('li[data-page]');
    menuItems.forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });
});

