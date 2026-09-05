document.addEventListener('DOMContentLoaded', () => {
    const widget = document.createElement('aside');
    widget.className = 'chatbot-widget';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'chatbot-toggle';
    toggleButton.type = 'button';
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-controls', 'chatbot-panel');
    toggleButton.setAttribute('aria-label', 'Abrir Asistente Beauty Connect');
    toggleButton.textContent = 'Asistente Beauty Connect';

    const panel = document.createElement('section');
    panel.id = 'chatbot-panel';
    panel.className = 'chatbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'chatbot-title');
    panel.hidden = true;

    const header = document.createElement('div');
    header.className = 'chatbot-header';

    const headingWrap = document.createElement('div');
    const eyebrow = document.createElement('p');
    eyebrow.className = 'chatbot-eyebrow';
    eyebrow.textContent = 'Orientación informativa';
    const heading = document.createElement('h2');
    heading.id = 'chatbot-title';
    heading.className = 'chatbot-title';
    heading.textContent = 'Asistente Beauty Connect';
    headingWrap.append(eyebrow, heading);

    const closeButton = document.createElement('button');
    closeButton.className = 'chatbot-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Cerrar asistente');
    closeButton.textContent = '×';
    header.append(headingWrap, closeButton);

    const history = document.createElement('div');
    history.className = 'chatbot-history';
    history.setAttribute('role', 'log');
    history.setAttribute('aria-live', 'polite');
    history.setAttribute('aria-relevant', 'additions');

    const status = document.createElement('p');
    status.className = 'chatbot-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const form = document.createElement('form');
    form.className = 'chatbot-form';
    const label = document.createElement('label');
    label.className = 'visually-hidden';
    label.htmlFor = 'chatbot-message';
    label.textContent = 'Escribe tu pregunta sobre Beauty Connect';
    const inputRow = document.createElement('div');
    inputRow.className = 'chatbot-input-row';
    const input = document.createElement('textarea');
    input.id = 'chatbot-message';
    input.className = 'chatbot-input';
    input.name = 'mensaje';
    input.rows = 2;
    input.maxLength = 1000;
    input.placeholder = 'Pregunta por servicios, profesionales o citas';
    input.required = true;
    const sendButton = document.createElement('button');
    sendButton.className = 'chatbot-send';
    sendButton.type = 'submit';
    sendButton.textContent = 'Enviar';
    inputRow.append(input, sendButton);
    form.append(label, inputRow);

    panel.append(header, history, status, form);
    widget.append(panel, toggleButton);
    document.body.appendChild(widget);

    addMessage('assistant', 'Hola, soy el asistente de Beauty Connect. Puedo orientarte sobre servicios, profesionales y cómo enviar una solicitud de cita.');

    toggleButton.addEventListener('click', () => setPanelOpen(panel.hidden));
    closeButton.addEventListener('click', () => setPanelOpen(false));
    form.addEventListener('submit', sendMessage);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) setPanelOpen(false);
    });

    function setPanelOpen(open) {
        panel.hidden = !open;
        toggleButton.setAttribute('aria-expanded', String(open));
        toggleButton.setAttribute('aria-label', `${open ? 'Cerrar' : 'Abrir'} Asistente Beauty Connect`);
        if (open) input.focus();
        else toggleButton.focus();
    }

    async function sendMessage(event) {
        event.preventDefault();
        const message = input.value.trim();
        if (!message || sendButton.disabled) return;

        addMessage('user', message);
        input.value = '';
        setLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: message })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Intenta nuevamente.');
            if (typeof result.respuesta !== 'string' || result.respuesta.trim() === '') {
                throw new Error('El asistente no devolvió una respuesta válida.');
            }
            addMessage('assistant', result.respuesta.trim());
        } catch (error) {
            status.textContent = `No pudimos responder. ${error.message}`;
            status.className = 'chatbot-status chatbot-status-error';
        } finally {
            setLoading(false);
            input.focus();
        }
    }

    function addMessage(author, text) {
        const message = document.createElement('div');
        message.className = `chatbot-message chatbot-message-${author}`;
        const name = document.createElement('span');
        name.className = 'chatbot-message-author';
        name.textContent = author === 'user' ? 'Tú' : 'Beauty Connect';
        const copy = document.createElement('p');
        copy.textContent = text;
        message.append(name, copy);
        history.appendChild(message);
        history.scrollTop = history.scrollHeight;
    }

    function setLoading(loading) {
        input.disabled = loading;
        sendButton.disabled = loading;
        sendButton.textContent = loading ? 'Consultando…' : 'Enviar';
        if (loading) {
            status.textContent = 'El asistente está preparando una respuesta…';
            status.className = 'chatbot-status';
        } else if (!status.classList.contains('chatbot-status-error')) {
            status.textContent = '';
        }
    }
});
