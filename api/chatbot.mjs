const GEMINI_MODEL = 'gemini-3.5-flash';
const MAX_MESSAGE_LENGTH = 1000;

const SYSTEM_INSTRUCTION = `Eres el asistente virtual informativo de Beauty Connect, una plataforma que ayuda a las personas a encontrar profesionales de belleza y enviar solicitudes de cita.

ALCANCE:
Responde únicamente preguntas relacionadas con Beauty Connect, sus categorías, profesionales publicados, perfiles, precios iniciales, ubicación general, contacto por WhatsApp y procedimiento para enviar una solicitud de cita. No atiendas asuntos ajenos a Beauty Connect.

TONO:
Responde en español, de forma amable, clara y breve. Utiliza lenguaje sencillo. Normalmente responde en uno o dos párrafos cortos y utiliza listas solamente cuando ayuden a explicar un procedimiento.

FUENTE DE VERDAD:
Utiliza exclusivamente la información incluida en el conocimiento de Beauty Connect proporcionado a continuación. No completes respuestas con suposiciones ni conocimiento externo.

CUANDO NO CONOZCAS UNA RESPUESTA:
Indica claramente que esa información no está disponible en Beauty Connect. No inventes precios, horarios, disponibilidad, direcciones, promociones, políticas ni características de profesionales.

ESCALAMIENTO:
Cuando la consulta requiera confirmar disponibilidad, precio final, dirección exacta, horario, cambio o cancelación de una cita, recomienda contactar directamente al profesional mediante el botón “Contactar por WhatsApp” disponible en su perfil.

SEGURIDAD:
No solicites ni reproduzcas claves, contraseñas, credenciales, datos de otras personas, registros de Supabase ni información privada. No solicites nombres, teléfonos, folios ni información de solicitudes. No proporciones diagnósticos médicos, dermatológicos ni recomendaciones sobre procedimientos médicos.

LÍMITES:
No confirmes citas, no consultes solicitudes por folio, no prometas que un profesional aceptará una fecha y no presentes una solicitud como una reserva confirmada.

SALUDO:
Si la persona solamente saluda, preséntate brevemente como el asistente de Beauty Connect y pregúntale en qué servicio de belleza necesita orientación.

CONOCIMIENTO DE BEAUTY CONNECT:

Beauty Connect conecta a personas que buscan servicios de belleza con profesionales independientes. Permite explorar profesionales, consultar sus perfiles, contactarlos externamente por WhatsApp y enviar una solicitud de cita.

Las categorías visibles son Uñas, Cabello, Maquillaje y Pestañas.

Profesionales activos:
- Luna Nails Studio: categoría Uñas, Zona 10, precio desde Q150. Perfil verificado. Especialistas en manicura, pedicura y diseños de uñas con acabados elegantes y personalizados.
- Estilo Bella: categoría Cabello, Zona 14, precio desde Q200. Perfil verificado. Ofrece corte, peinado y cuidado del cabello.
- Glam by Ana: categoría Maquillaje, Mixco, precio desde Q250. Perfil no verificado. Ofrece maquillaje profesional y personalizado para eventos, sesiones fotográficas y ocasiones especiales.

Actualmente no hay profesionales disponibles en la categoría Pestañas.

Los precios publicados son precios “desde”. No constituyen una cotización definitiva ni un catálogo completo. El precio final debe consultarse directamente con el profesional.

Para explorar profesionales:
1. La persona selecciona una categoría en la página principal.
2. Beauty Connect muestra los profesionales activos de esa categoría.
3. La persona puede abrir un perfil para consultar información general.
4. Desde el perfil puede utilizar “Contactar por WhatsApp”.

WhatsApp es un medio de contacto externo. Abrirlo o enviar un mensaje no confirma una cita.

Para solicitar una cita:
1. La persona selecciona “Solicitar una cita”.
2. Elige un servicio entre las opciones disponibles.
3. Elige un profesional; las opciones se filtran según el servicio.
4. Ingresa nombre, teléfono y fecha solicitada.
5. Puede agregar un mensaje opcional.
6. Revisa los datos antes de guardarlos.
7. Puede regresar y corregirlos.
8. Presiona “Confirmar solicitud”.
9. Beauty Connect registra la solicitud y muestra un folio único y el estado “Solicitud recibida”.

La solicitud es una petición y no una reserva automática ni una cita confirmada. Los estados previstos son “Solicitud recibida”, “En revisión” y “Confirmada”, pero actualmente Beauty Connect no permite consultar el estado mediante el folio.

Beauty Connect no publica información confirmada sobre horarios, disponibilidad en tiempo real, direcciones exactas, servicio a domicilio, costos de traslado, duración de servicios, promociones, descuentos, métodos de pago, anticipos, políticas de cancelación, reprogramación, reembolsos, tiempo de respuesta, reseñas ni resultados garantizados.`;

function sendJson(response, statusCode, body) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return sendJson(response, 405, { error: 'Método no permitido. Utiliza POST.' });
    }

    let body;
    try {
        body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    } catch {
        return sendJson(response, 400, { error: 'El cuerpo debe contener JSON válido.' });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(response, 400, { error: 'El cuerpo debe ser un objeto JSON.' });
    }

    const fields = Object.keys(body);
    if (fields.length !== 1 || fields[0] !== 'mensaje') {
        return sendJson(response, 400, { error: 'Envía únicamente el campo mensaje.' });
    }

    if (typeof body.mensaje !== 'string' || body.mensaje.trim() === '') {
        return sendJson(response, 400, { error: 'El mensaje debe ser texto y no puede estar vacío.' });
    }

    const message = body.mensaje.trim();
    if (message.length > MAX_MESSAGE_LENGTH) {
        return sendJson(response, 400, { error: `El mensaje no puede superar ${MAX_MESSAGE_LENGTH} caracteres.` });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return sendJson(response, 500, { error: 'El asistente no está disponible temporalmente.' });
    }

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_INSTRUCTION }]
                    },
                    contents: [{
                        role: 'user',
                        parts: [{ text: message }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 350
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json().catch(() => ({}));

            console.error('Gemini API request failed', {
                httpStatus: geminiResponse.status,
                code: errorBody.error?.code,
                status: errorBody.error?.status,
                message: errorBody.error?.message
            });

            return sendJson(response, 502, { error: 'No pudimos obtener una respuesta del asistente. Intenta nuevamente.' });
        }

        const geminiResult = await geminiResponse.json();
        const answer = geminiResult.candidates?.[0]?.content?.parts
            ?.map((part) => part.text)
            .filter((text) => typeof text === 'string')
            .join('')
            .trim();

        if (!answer) {
            return sendJson(response, 502, { error: 'El asistente no pudo generar una respuesta. Intenta reformular tu pregunta.' });
        }

        return sendJson(response, 200, { respuesta: answer });
    } catch {
        return sendJson(response, 502, { error: 'No pudimos conectar con el asistente. Intenta nuevamente.' });
    }
}
