document.addEventListener('DOMContentLoaded', () => {
    // State to hold professionals data
    let professionals = [];

    // DOM Elements
    const categoryView = document.getElementById('category-view');
    const professionalsView = document.getElementById('professionals-view');
    const categoryButtons = document.querySelectorAll('.category-card-btn');
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
        professionalsView.classList.add('d-none');
        categoryView.classList.remove('d-none');
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
            const emptyStateCol = document.createElement('div');
            emptyStateCol.className = 'col-12 col-md-8';
            emptyStateCol.innerHTML = `
                <div class="empty-state">
                    <p class="empty-state-text m-0 fs-5 fw-medium text-muted">
                        Por el momento no hay profesionales disponibles en esta categoría.
                    </p>
                </div>
            `;
            professionalsGrid.appendChild(emptyStateCol);
        } else {
            // Render professional cards in responsive bootstrap columns
            filtered.forEach(prof => {
                const col = document.createElement('div');
                col.className = 'col-12 col-md-6 col-lg-4 professional-card-outer';

                // Format price
                const formattedPrice = `Desde Q${prof.price_from}`;

                // Build card content
                col.innerHTML = `
                    <div class="professional-card card shadow-sm h-100 p-4 border-0">
                        <div class="card-body p-0 d-flex flex-column justify-content-between">
                            <div>
                                <h3 class="font-heading h5 fw-semibold mb-2">${escapeHTML(prof.name)}</h3>
                                <p class="text-muted small mb-3">
                                    <span class="me-2">📍</span>${escapeHTML(prof.zone)}
                                </p>
                                ${prof.verified ? `
                                <div class="mb-3">
                                    <span class="verified-badge">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                                        </svg>
                                        Perfil verificado
                                    </span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="mt-2">
                                <span class="price-badge">${formattedPrice}</span>
                            </div>
                        </div>
                    </div>
                `;
                professionalsGrid.appendChild(col);
            });
        }

        // Toggle views using bootstrap d-none class
        categoryView.classList.add('d-none');
        professionalsView.classList.remove('d-none');
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
