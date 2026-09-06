document.addEventListener('DOMContentLoaded', () => {
    const formStep = document.getElementById('form-step');
    const reviewStep = document.getElementById('review-step');
    const confirmationStep = document.getElementById('confirmation-step');
    const form = document.getElementById('appointment-form');
    const serviceSelect = document.getElementById('servicio');
    const professionalSelect = document.getElementById('profesional');
    const dateInput = document.getElementById('fecha_solicitada');
    const optionsStatus = document.getElementById('options-status');
    const reviewDetails = document.getElementById('review-details');
    const editButton = document.getElementById('edit-button');
    const confirmButton = document.getElementById('confirm-button');
    const submitStatus = document.getElementById('submit-status');
    let professionals = [];
    let pendingRequest = null;

    dateInput.min = getLocalDate();
    loadOptions();
    serviceSelect.addEventListener('change', renderProfessionalOptions);
    form.addEventListener('submit', showReview);
    editButton.addEventListener('click', showForm);
    confirmButton.addEventListener('click', saveRequest);

    async function loadOptions() {
        try {
            const response = await fetch('./data/products.json');
            if (!response.ok) throw new Error(`No se pudieron cargar las opciones (${response.status}).`);
            const data = await response.json();
            if (!Array.isArray(data)) throw new TypeError('Los datos de profesionales no son válidos.');
            professionals = data.filter((item) => item?.active === true && typeof item.name === 'string' && typeof item.category === 'string');
            if (professionals.length === 0) throw new Error('No hay profesionales disponibles en este momento.');
            ['Cabello', 'Maquillaje', 'Pestañas', 'Uñas'].forEach((service) => serviceSelect.add(new Option(service, service)));
            applyQuerySelection();
            optionsStatus.classList.add('d-none');
            form.classList.remove('d-none');
        } catch (error) {
            console.error('Error al cargar las opciones de cita:', error);
            optionsStatus.textContent = `${error.message} Recarga la página para intentarlo nuevamente.`;
            optionsStatus.className = 'form-status error mb-4';
        }
    }

    function applyQuerySelection() {
        const params = new URLSearchParams(window.location.search);
        const requestedService = params.get('servicio');
        const requestedProfessional = params.get('profesional');
        if (requestedService && [...serviceSelect.options].some((option) => option.value === requestedService)) {
            serviceSelect.value = requestedService;
            renderProfessionalOptions();
        }
        if (requestedProfessional && [...professionalSelect.options].some((option) => option.value === requestedProfessional)) professionalSelect.value = requestedProfessional;
    }

    function renderProfessionalOptions() {
        const selectedService = serviceSelect.value;
        const availableProfessionals = professionals.filter((item) => item.category === selectedService).sort((a, b) => a.name.localeCompare(b.name, 'es'));
        const noProfessionals = Boolean(selectedService) && availableProfessionals.length === 0;
        professionalSelect.replaceChildren(new Option(noProfessionals ? 'No hay profesionales disponibles' : selectedService ? 'Selecciona un profesional' : 'Selecciona primero un servicio', ''));
        availableProfessionals.forEach((item) => professionalSelect.add(new Option(item.name, item.name)));
        professionalSelect.disabled = !selectedService || noProfessionals;
        serviceSelect.setCustomValidity(noProfessionals ? 'No hay profesionales disponibles' : '');
    }

    function showReview(event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const formData = new FormData(form);
        pendingRequest = Object.fromEntries([...formData.entries()].map(([key, value]) => [key, value.trim()]));
        const selectedProfessional = professionals.find((item) => item.name === pendingRequest.profesional && item.category === pendingRequest.servicio);
        if (!selectedProfessional) {
            optionsStatus.textContent = 'Selecciona una combinación válida de profesional y servicio.';
            optionsStatus.className = 'form-status error mb-4';
            optionsStatus.classList.remove('d-none');
            return;
        }
        renderReview(pendingRequest);
        switchStep(formStep, reviewStep, 'review-title');
    }

    function renderReview(request) {
        const values = [['Nombre del cliente', request.nombre_cliente], ['Teléfono', request.telefono], ['Profesional', request.profesional], ['Servicio', request.servicio], ['Fecha solicitada', formatDate(request.fecha_solicitada)], ['Mensaje', request.mensaje || 'Sin mensaje adicional']];
        reviewDetails.replaceChildren();
        values.forEach(([label, value]) => {
            const group = document.createElement('div');
            const term = document.createElement('dt');
            const description = document.createElement('dd');
            term.textContent = label;
            description.textContent = value;
            group.append(term, description);
            reviewDetails.appendChild(group);
        });
    }

    function showForm() {
        submitStatus.classList.add('d-none');
        switchStep(reviewStep, formStep, 'appointment-title');
    }

    async function saveRequest() {
        if (!pendingRequest || confirmButton.disabled) return;
        confirmButton.disabled = true;
        editButton.disabled = true;
        confirmButton.textContent = 'Guardando…';
        submitStatus.textContent = 'Estamos guardando tu solicitud.';
        submitStatus.className = 'form-status loading mb-3';
        try {
            const response = await fetch('/api/solicitudes-cita', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pendingRequest) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                const details = typeof result.details === 'string' ? result.details : result.details?.message;
                throw new Error(details || result.error || 'Intenta nuevamente.');
            }
            if (!result.folio || !result.estado) throw new Error('El servidor no devolvió el folio y el estado.');
            document.getElementById('confirmation-folio').textContent = result.folio;
            document.getElementById('confirmation-status').textContent = result.estado;
            form.reset();
            pendingRequest = null;
            switchStep(reviewStep, confirmationStep, 'confirmation-title');
        } catch (error) {
            submitStatus.textContent = `No pudimos guardar tu solicitud. ${error.message}`;
            submitStatus.className = 'form-status error mb-3';
        } finally {
            confirmButton.disabled = false;
            editButton.disabled = false;
            confirmButton.textContent = 'Confirmar solicitud';
        }
    }

    function switchStep(currentStep, nextStep, headingId) {
        currentStep.classList.add('d-none');
        nextStep.classList.remove('d-none');
        document.getElementById(headingId).focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function getLocalDate() {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        return new Date(today.getTime() - offset).toISOString().slice(0, 10);
    }

    function formatDate(value) {
        return new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
    }
});
