const SUPABASE_URL = 'https://fpcfvcsuntgxwwatnsny.supabase.co';

const REQUIRED_FIELDS = [
    'nombre_cliente',
    'telefono',
    'profesional',
    'servicio',
    'fecha_solicitada'
];

const MAX_LENGTHS = {
    nombre_cliente: 120,
    telefono: 30,
    profesional: 160,
    servicio: 120,
    mensaje: 1000
};

function sendJson(response, statusCode, body) {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return sendJson(response, 405, { error: 'Method not allowed. Use POST.' });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
        return sendJson(response, 500, {
            error: 'Server configuration error: SUPABASE_SERVICE_KEY is not set.'
        });
    }

    let body;

    try {
        body = typeof request.body === 'string'
            ? JSON.parse(request.body)
            : request.body;
    } catch {
        return sendJson(response, 400, { error: 'Request body must be valid JSON.' });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(response, 400, { error: 'Request body must be a JSON object.' });
    }

    const missingFields = REQUIRED_FIELDS.filter((field) => (
        typeof body[field] !== 'string' || body[field].trim() === ''
    ));

    if (missingFields.length > 0) {
        return sendJson(response, 400, {
            error: 'Faltan campos obligatorios.',
            fields: missingFields
        });
    }

    if (body.mensaje !== undefined && typeof body.mensaje !== 'string') {
        return sendJson(response, 400, { error: 'El mensaje debe ser texto.' });
    }

    const solicitud = {
        ...Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, body[field].trim()])),
        mensaje: typeof body.mensaje === 'string' ? body.mensaje.trim() : ''
    };

    const oversizedFields = Object.entries(MAX_LENGTHS)
        .filter(([field, maximum]) => solicitud[field].length > maximum)
        .map(([field]) => field);

    if (oversizedFields.length > 0) {
        return sendJson(response, 400, {
            error: 'Uno o más campos exceden la longitud permitida.',
            fields: oversizedFields
        });
    }

    if (!/^\+?[0-9 ()-]{8,30}$/.test(solicitud.telefono)) {
        return sendJson(response, 400, { error: 'El teléfono no tiene un formato válido.' });
    }

    const requestedDate = new Date(`${solicitud.fecha_solicitada}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(solicitud.fecha_solicitada)
        || Number.isNaN(requestedDate.getTime())
        || requestedDate.toISOString().slice(0, 10) !== solicitud.fecha_solicitada) {
        return sendJson(response, 400, { error: 'La fecha solicitada no es válida.' });
    }

    try {
        const supabaseResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/solicitudes_cita?select=folio,estado`,
            {
                method: 'POST',
                headers: {
                    apikey: serviceKey,
                    Authorization: `Bearer ${serviceKey}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation'
                },
                body: JSON.stringify(solicitud)
            }
        );

        if (!supabaseResponse.ok) {
            const responseText = await supabaseResponse.text();
            let errorDetails;

            try {
                errorDetails = JSON.parse(responseText);
            } catch {
                errorDetails = responseText || 'Supabase returned an unknown error.';
            }

            return sendJson(response, supabaseResponse.status, {
                error: 'Supabase insert failed.',
                details: errorDetails
            });
        }

        const savedRows = await supabaseResponse.json();
        const savedRequest = Array.isArray(savedRows) ? savedRows[0] : null;

        if (!savedRequest?.folio || !savedRequest?.estado) {
            return sendJson(response, 502, {
                error: 'La solicitud se guardó, pero Supabase no devolvió el folio y el estado.'
            });
        }

        return sendJson(response, 201, {
            success: true,
            folio: savedRequest.folio,
            estado: savedRequest.estado
        });
    } catch (error) {
        return sendJson(response, 500, {
            error: 'Could not connect to Supabase.',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
