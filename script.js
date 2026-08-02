document.addEventListener('DOMContentLoaded', () => {
    // State to hold professionals data
    let professionals = [];

    // DOM Elements
    const categoryView = document.getElementById('category-view');
    const professionalsView = document.getElementById('professionals-view');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const backBtn = document.getElementById('back-btn');
    const selectedCategoryTitle = document.getElementById('selected-category-title');
    const professionalsGrid = document.getElementById('professionals-grid');

    // Fetch professionals data from products.json
    async function loadProfessionals() {
        try {
            const response = await fetch('./data/products.json');
            if (!response.ok) {
                throw new Error('Error al cargar los datos de los profesionales.');
            }
            professionals = await response.json();
        } catch (error) {
            console.error('Error fetching products.json:', error);
            // Fallback empty array
            professionals = [];
        }
    }

    // Initialize data loading
    loadProfessionals();

    // Event listener for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.getAttribute('data-category');
            showProfessionalsForCategory(selectedCategory);
        });
    });

    // Event listener for back button
    backBtn.addEventListener('click', () => {
        // Toggle view visibility
        professionalsView.classList.add('hidden');
        categoryView.classList.remove('hidden');
    });

    // Filter and show professionals
    function showProfessionalsForCategory(category) {
        // Filter professionals: match category and must be active
        const filtered = professionals.filter(prof => 
            prof.category.toLowerCase() === category.toLowerCase() && prof.active === true
        );

        // Update title with chosen category
        selectedCategoryTitle.textContent = category;

        // Clear previous results
        professionalsGrid.innerHTML = '';

        if (filtered.length === 0) {
            // Show empty state message
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <p class="empty-state-text">Por el momento no hay profesionales disponibles en esta categoría.</p>
            `;
            professionalsGrid.appendChild(emptyState);
        } else {
            // Render professional cards
            filtered.forEach(prof => {
                const card = document.createElement('div');
                card.className = 'professional-card';

                // Format price
                const formattedPrice = `Desde Q${prof.price_from}`;

                // Build card content
                card.innerHTML = `
                    <div class="prof-info">
                        <h3 class="prof-name">${escapeHTML(prof.name)}</h3>
                        <p class="prof-zone">📍 ${escapeHTML(prof.zone)}</p>
                        ${prof.verified ? '<span class="prof-verified">✓ Perfil verificado</span>' : ''}
                    </div>
                    <div class="prof-price">${formattedPrice}</div>
                `;
                professionalsGrid.appendChild(card);
            });
        }

        // Toggle views
        categoryView.classList.add('hidden');
        professionalsView.classList.remove('hidden');
    }

    // Simple helper to prevent HTML injection/XSS when rendering dynamic names/zones
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&#039;');
    }
});
