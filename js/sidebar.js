document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    // Manually set base URL (update this for your site)
    const baseURL = 'https://rssndr.github.io/'; // Change to your actual base URL

    // Define the sidebar HTML with manual base URL
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

    // Insert the HTML
    sidebarPlaceholder.innerHTML = sidebarHTML;

    // Set active class based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Handles root as index.html
    const menuItems = sidebarPlaceholder.querySelectorAll('li[data-page]');
    menuItems.forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });
});

