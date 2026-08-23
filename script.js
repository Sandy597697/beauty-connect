document.addEventListener('DOMContentLoaded', () => {
    const categoryView = document.getElementById('category-view');
    const professionalsView = document.getElementById('professionals-view');
    const categoryButtons = document.querySelectorAll('.category-card-btn');
    const backButton = document.getElementById('back-btn');
    const categoryHeading = document.getElementById('category-heading');
    const selectedCategoryTitle = document.getElementById('selected-category-title');
    const professionalsGrid = document.getElementById('professionals-grid');
    const professionalsStatus = document.getElementById('professionals-status');

    let professionals = [];
    let dataState = 'loading';
    let selectedCategory = '';

    const professionalsRequest = loadProfessionals();

    categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
            showProfessionals(button.dataset.category);
        });
    });

    backButton.addEventListener('click', showCategories);

    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    const matchingCategoryButton = Array.from(categoryButtons).find((button) => (
        typeof requestedCategory === 'string'
        && button.dataset.category.localeCompare(requestedCategory, 'es', { sensitivity: 'base' }) === 0
    ));

    if (matchingCategoryButton) {
        showProfessionals(matchingCategoryButton.dataset.category);
    }

    async function loadProfessionals() {
        dataState = 'loading';

        try {
            const response = await fetch('./data/products.json');

            if (!response.ok) {
                throw new Error(`No se pudo cargar products.json (${response.status}).`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new TypeError('El archivo products.json no contiene una lista válida.');
            }

            professionals = data;
            dataState = 'ready';
        } catch (error) {
            console.error('Error al cargar los profesionales:', error);
            professionals = [];
            dataState = 'error';
        }

        if (selectedCategory) {
            renderProfessionals(selectedCategory);
        }
    }

    function showProfessionals(category) {
        selectedCategory = category;
        selectedCategoryTitle.textContent = category;
        categoryView.classList.add('d-none');
        professionalsView.classList.remove('d-none');

        renderProfessionals(category);
        selectedCategoryTitle.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    }

    function showCategories() {
        selectedCategory = '';
        professionalsView.classList.add('d-none');
        categoryView.classList.remove('d-none');
        professionalsGrid.replaceChildren();
        categoryHeading.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
    }

    function renderProfessionals(category) {
        professionalsGrid.replaceChildren();

        if (dataState === 'loading') {
            renderState({
                type: 'loading',
                title: 'Buscando profesionales',
                message: `Estamos preparando las opciones de ${category.toLowerCase()}.`
            });
            announce(`Cargando profesionales de ${category}.`);
            return;
        }

        if (dataState === 'error') {
            renderState({
                type: 'error',
                title: 'No pudimos cargar los profesionales',
                message: 'Intenta nuevamente en unos momentos.',
                showBackButton: true
            });
            announce('No se pudieron cargar los profesionales.');
            return;
        }

        const filteredProfessionals = professionals
            .filter((professional) => isProfessionalInCategory(professional, category))
            .sort((first, second) => first.name.localeCompare(second.name, 'es', { sensitivity: 'base' }));

        if (filteredProfessionals.length === 0) {
            renderState({
                type: 'empty',
                title: 'Aún no encontramos opciones aquí',
                message: 'Por el momento no hay profesionales disponibles en esta categoría.',
                showBackButton: true
            });
            announce('Por el momento no hay profesionales disponibles en esta categoría.');
            return;
        }

        const fragment = document.createDocumentFragment();

        filteredProfessionals.forEach((professional) => {
            fragment.appendChild(createProfessionalCard(professional));
        });

        professionalsGrid.appendChild(fragment);
        professionalsGrid.setAttribute('aria-busy', 'false');
        announce(`${filteredProfessionals.length} ${filteredProfessionals.length === 1 ? 'profesional disponible' : 'profesionales disponibles'} en ${category}.`);
    }

    function isProfessionalInCategory(professional, category) {
        return professional
            && professional.active === true
            && typeof professional.category === 'string'
            && professional.category.localeCompare(category, 'es', { sensitivity: 'base' }) === 0
            && typeof professional.name === 'string';
    }

    function createProfessionalCard(professional) {
        const column = document.createElement('div');
        column.className = 'col-12 col-md-6 col-lg-4';

        const card = document.createElement('article');
        card.className = 'professional-card';

        const cardLink = document.createElement('a');
        const profileParams = new URLSearchParams({
            id: String(professional.id),
            category: professional.category
        });
        cardLink.className = 'professional-card-link';
        cardLink.href = `perfil-profesional.html?${profileParams.toString()}`;
        cardLink.setAttribute('aria-label', `Ver perfil de ${professional.name}`);

        const imageWrap = document.createElement('div');
        imageWrap.className = 'professional-image-wrap';

        const image = document.createElement('img');
        image.className = 'professional-image';
        image.src = professional.image;
        image.alt = `Trabajo de ${professional.name}`;
        image.width = 900;
        image.height = 600;
        image.loading = 'lazy';
        imageWrap.appendChild(image);

        if (professional.verified === true) {
            imageWrap.appendChild(createVerifiedBadge());
        }

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const name = document.createElement('h3');
        name.className = 'professional-name mb-2';
        name.textContent = professional.name;

        const zone = document.createElement('p');
        zone.className = 'professional-zone';
        zone.appendChild(createLocationIcon());
        const zoneText = document.createElement('span');
        zoneText.textContent = professional.zone || 'Ubicación por confirmar';
        zone.appendChild(zoneText);

        const price = document.createElement('span');
        price.className = 'price-label';
        price.textContent = Number.isFinite(professional.price_from)
            ? `Desde Q${professional.price_from.toLocaleString('es-GT')}`
            : 'Precio a consultar';

        const cardFooter = document.createElement('div');
        cardFooter.className = 'professional-card-footer';

        const profileHint = document.createElement('span');
        profileHint.className = 'professional-profile-hint';
        profileHint.textContent = 'Ver perfil →';

        cardFooter.append(price, profileHint);
        cardBody.append(name, zone, cardFooter);
        card.append(imageWrap, cardBody);
        cardLink.appendChild(card);
        column.appendChild(cardLink);

        return column;
    }

    function createVerifiedBadge() {
        const badge = document.createElement('span');
        badge.className = 'verified-badge';
        badge.innerHTML = '<svg aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/></svg>';
        badge.append('Perfil verificado');
        return badge;
    }

    function createLocationIcon() {
        const namespace = 'http://www.w3.org/2000/svg';
        const icon = document.createElementNS(namespace, 'svg');
        icon.setAttribute('viewBox', '0 0 16 16');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('focusable', 'false');

        const path = document.createElementNS(namespace, 'path');
        path.setAttribute('d', 'M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7.5A2.5 2.5 0 1 1 8 3a2.5 2.5 0 0 1 0 5.5');
        icon.appendChild(path);
        return icon;
    }

    function renderState({ type, title, message, showBackButton = false }) {
        professionalsGrid.setAttribute('aria-busy', type === 'loading' ? 'true' : 'false');

        const column = document.createElement('div');
        column.className = 'col-12';

        const panel = document.createElement('div');
        panel.className = 'state-panel';

        const ornament = document.createElement('div');
        ornament.className = type === 'loading' ? 'loading-mark' : 'state-ornament';
        ornament.setAttribute('aria-hidden', 'true');

        const heading = document.createElement('h3');
        heading.className = 'state-title';
        heading.textContent = title;

        const copy = document.createElement('p');
        copy.className = 'state-copy';
        copy.textContent = message;

        panel.append(ornament, heading, copy);

        if (showBackButton) {
            const stateBackButton = document.createElement('button');
            stateBackButton.className = 'state-action';
            stateBackButton.type = 'button';
            stateBackButton.textContent = 'Volver a categorías';
            stateBackButton.addEventListener('click', showCategories);
            panel.appendChild(stateBackButton);
        }

        column.appendChild(panel);
        professionalsGrid.appendChild(column);
    }

    function announce(message) {
        professionalsStatus.textContent = '';
        window.requestAnimationFrame(() => {
            professionalsStatus.textContent = message;
        });
    }

    function getScrollBehavior() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    }

    void professionalsRequest;
});
