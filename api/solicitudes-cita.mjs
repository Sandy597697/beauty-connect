const SUPABASE_URL = 'https://fpcfvcsuntgxwwatnsny.supabase.co';

const REQUIRED_FIELDS = [
    'nombre_cliente',
    'telefono',
    'profesional',
    'servicio',
    'fecha_solicitada',
    'mensaje'
];

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
            error: 'All six fields are required.',
            fields: missingFields
        });
    }

    const solicitud = Object.fromEntries(
        REQUIRED_FIELDS.map((field) => [field, body[field].trim()])
    );

    try {
        const supabaseResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/solicitudes_cita`,
            {
                method: 'POST',
                headers: {
                    apikey: serviceKey,
                    'Content-Type': 'application/json',
                    Prefer: 'return=minimal'
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

        return sendJson(response, 201, {
            success: true,
            message: 'Solicitud de cita guardada correctamente.'
        });
    } catch (error) {
        return sendJson(response, 500, {
            error: 'Could not connect to Supabase.',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
