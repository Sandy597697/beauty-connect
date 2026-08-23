document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idParameter = params.get('id');
    const categoryParameter = params.get('category');
    const professionalId = Number(idParameter);
    const profileStatus = document.getElementById('profile-status');
    const profileContent = document.getElementById('profile-content');
    const backLink = document.getElementById('back-to-professionals');

    if (categoryParameter) {
        const backParams = new URLSearchParams({ category: categoryParameter });
        backLink.href = `index.html?${backParams.toString()}`;
    }

    if (idParameter === null || idParameter.trim() === '' || !Number.isInteger(professionalId) || professionalId <= 0) {
        renderState('Perfil no disponible', 'El identificador del profesional está ausente o no es válido.');
        return;
    }

    loadProfessional();

    async function loadProfessional() {
        try {
            const response = await fetch('./data/products.json');

            if (!response.ok) {
                throw new Error(`No se pudo cargar products.json (${response.status}).`);
            }

            const professionals = await response.json();

            if (!Array.isArray(professionals)) {
                throw new TypeError('El archivo products.json no contiene una lista válida.');
            }

            const professional = professionals.find((item) => (
                item
                && item.id === professionalId
                && item.active === true
            ));

            if (!professional) {
                renderState('Profesional no encontrado', 'El perfil solicitado no existe o no está activo.');
                return;
            }

            renderProfile(professional);
        } catch (error) {
            console.error('Error al cargar el perfil profesional:', error);
            renderState('No pudimos cargar el perfil', 'Ocurrió un error al leer la información. Intenta nuevamente en unos momentos.');
        }
    }

    function renderProfile(professional) {
        const image = document.getElementById('profile-image');
        const name = document.getElementById('profile-name');
        const category = document.getElementById('profile-category');
        const description = document.getElementById('profile-description');
        const zone = document.getElementById('profile-zone');
        const price = document.getElementById('profile-price');
        const verified = document.getElementById('profile-verified');

        image.src = professional.image;
        image.alt = `Trabajo de ${professional.name}`;
        name.textContent = professional.name;
        category.textContent = professional.category;
        description.textContent = professional.description;
        zone.textContent = professional.zone || 'Ubicación por confirmar';
        price.textContent = Number.isFinite(professional.price_from)
            ? `Desde Q${professional.price_from.toLocaleString('es-GT')}`
            : 'Precio a consultar';

        if (professional.verified === true) {
            verified.textContent = 'Perfil verificado';
            verified.classList.remove('d-none');
        }

        renderWhatsAppAction(professional);
        document.title = `${professional.name} — Beauty Connect`;
        profileStatus.classList.add('d-none');
        profileContent.classList.remove('d-none');
        name.focus({ preventScroll: true });
    }

    function renderWhatsAppAction(professional) {
        const container = document.getElementById('whatsapp-action');
        const whatsappNumber = String(professional.whatsapp ?? '');

        if (!/^\d{8,15}$/.test(whatsappNumber)) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'whatsapp-error';
            errorMessage.textContent = 'El número de WhatsApp de este profesional no es válido.';
            container.appendChild(errorMessage);
            return;
        }

        const message = `Hola, vi el perfil de ${professional.name} en Beauty Connect y quisiera consultar sobre sus servicios de ${professional.category}.`;
        const whatsappParams = new URLSearchParams({ text: message });
        const whatsappLink = document.createElement('a');
        whatsappLink.className = 'whatsapp-button';
        whatsappLink.href = `https://wa.me/${whatsappNumber}?${whatsappParams.toString()}`;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
        whatsappLink.textContent = 'Contactar por WhatsApp';
        container.appendChild(whatsappLink);
    }

    function renderState(title, message) {
        profileStatus.replaceChildren();

        const panel = document.createElement('div');
        panel.className = 'state-panel';

        const ornament = document.createElement('div');
        ornament.className = 'state-ornament';
        ornament.setAttribute('aria-hidden', 'true');

        const heading = document.createElement('h1');
        heading.className = 'state-title';
        heading.textContent = title;

        const copy = document.createElement('p');
        copy.className = 'state-copy';
        copy.textContent = message;

        panel.append(ornament, heading, copy);
        profileStatus.appendChild(panel);
    }
});
