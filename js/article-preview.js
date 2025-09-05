document.addEventListener('DOMContentLoaded', () => {
    const articleLinks = document.querySelectorAll('.article-list a');
    const previewCache = {}; // Cache fetched previews

    // Create a single preview element
    const previewBox = document.createElement('div');
    previewBox.className = 'article-preview';
    document.body.appendChild(previewBox);

    articleLinks.forEach(link => {
        let timeout; // For hover delay

        link.addEventListener('mouseover', async (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                const url = link.getAttribute('href');
                const title = link.querySelector('.article-title').textContent;
                let excerpt = previewCache[url];

                if (!excerpt) {
                    try {
                        const response = await fetch(url);
                        const html = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const content = doc.querySelector('.writing-content');
                        const rawExcerpt = content ? content.querySelector('p:nth-of-type(2)').textContent.trim() : 'Preview not available.';
                        excerpt = rawExcerpt.length > 150 ? rawExcerpt.substring(0, 150) + '...' : rawExcerpt;
                        previewCache[url] = excerpt;
                    } catch (error) {
                        excerpt = 'Error loading preview.';
                    }
                }

                // Show preview with title and excerpt
                previewBox.innerHTML = `
                    <h3>${title}</h3>
                    <p>${excerpt}</p>
                    <span class="preview-more">Read more...</span>
                `;
                previewBox.style.display = 'block';
                previewBox.classList.add('visible'); // For animation

                // Smart positioning: Prefer right, fallback to below
                const rect = link.getBoundingClientRect();
                const previewRect = previewBox.getBoundingClientRect();
                let left = rect.right + 10; // Right of link
                if (left + previewRect.width > window.innerWidth) {
                    left = rect.left; // Align left if no space
                }
                let top = rect.top + window.scrollY - (previewRect.height / 2) + (rect.height / 2); // Center vertically
                if (top + previewRect.height > window.innerHeight + window.scrollY) {
                    top = rect.bottom + window.scrollY + 10; // Below if overflowing bottom
                } else if (top < window.scrollY) {
                    top = rect.top + window.scrollY - previewRect.height - 10; // Above if needed
                }
                previewBox.style.left = `${left}px`;
                previewBox.style.top = `${top}px`;
            }, 300); // 300ms delay to avoid flicker on quick hovers
        });

        link.addEventListener('mouseout', () => {
            clearTimeout(timeout);
            previewBox.style.display = 'none';
            previewBox.classList.remove('visible');
        });

        // Optional: Tap support for mobile (touchstart to show, touchend to hide)
        link.addEventListener('touchstart', (e) => {
            // Trigger the mouseover logic on tap
            link.dispatchEvent(new MouseEvent('mouseover'));
            e.preventDefault(); // Prevent default tap behavior if needed
        });
        link.addEventListener('touchend', () => {
            previewBox.style.display = 'none';
            previewBox.classList.remove('visible');
        });
    });
});

