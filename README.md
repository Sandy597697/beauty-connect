 # Beauty Connect

Beauty Connect es una plataforma tecnológica que conecta a personas que buscan servicios de belleza con profesionales independientes del sector. Su objetivo es centralizar la información en un solo lugar para facilitar la búsqueda, comparación de opciones y el primer contacto para solicitar una cita.

## The Three Musts

- Buscar profesionales por categoría de servicio.
- Visualizar perfiles con información, fotografías y distintivo de verificación.
- Contactar al profesional mediante WhatsApp.

## Core Features at a Glance

| Feature | Priority |
|---|---|
| Búsqueda por categoría | Must |
| Perfil del profesional | Must |
| Contacto por WhatsApp | Must |


## Aplicación publicada

**Dirección pública oficial:** [https://beauty-connect-eosin.vercel.app](https://beauty-connect-eosin.vercel.app)

El producto permite:

- Seleccionar una categoría de belleza.
- Consultar los profesionales activos disponibles dentro de la categoría seleccionada.
- Abrir el perfil individual de un profesional mediante su tarjeta o la indicación **“Ver perfil →”**.
- Consultar en el perfil la fotografía, nombre, categoría, zona, precio desde, descripción y distintivo **“Perfil verificado”** cuando corresponde.
- Regresar desde el perfil al listado de la categoría seleccionada.
- Contactar al profesional desde su perfil mediante WhatsApp, con un mensaje preparado que incluye su nombre y categoría. Este contacto abre un servicio externo y no constituye un chat interno ni una reserva confirmada.
- Volver desde el listado a la pantalla de categorías.
- Acceder al formulario “Solicitar una cita”.
- Revisar los datos antes de confirmar la solicitud y registrarla en Supabase mediante una función serverless.
- Recibir una confirmación con folio y estado.
- Consultar el chatbot informativo integrado desde el inicio, el perfil y la página de solicitud.
- Regresar desde el formulario al inicio.

## Transacción completa de solicitud de cita

1. Desde las categorías o el listado, seleccionar **“Solicitar una cita”** para abrir `solicitar-cita.html`.
2. Elegir un servicio entre las categorías de profesionales activos de `data/products.json`. El formulario ofrece únicamente las opciones del producto; actualmente Cabello, Maquillaje y Uñas. Pestañas aparece en el inicio, pero no en este selector porque no tiene profesionales activos.
3. Elegir un profesional entre las opciones filtradas por el servicio seleccionado.
4. Completar nombre, teléfono y fecha solicitada. El mensaje adicional es opcional.
5. Pulsar **“Revisar solicitud”** para ver el resumen antes de guardar. **“Regresar y corregir”** permite editar los datos conservados.
6. Pulsar **“Confirmar solicitud”**. `solicitar-cita.js` envía los datos por POST a `/api/solicitudes-cita`; la función serverless `api/solicitudes-cita.mjs` valida los campos e inserta la solicitud en la tabla `solicitudes_cita` de Supabase.
7. Ver **“Recibimos tu solicitud”**, el folio único y el estado inicial **“Solicitud recibida”**. La función devuelve el folio y el estado recibidos de Supabase; su generación y valor inicial dependen de la configuración de la base de datos, cuyo esquema no está incluido en este repositorio.

Si falla el envío, se conservan los datos en la revisión para corregir o reintentar. Una solicitud registrada no equivale a una cita confirmada. El folio funciona como identificador y comprobante de la solicitud. Actualmente no existe una función de consulta automática por folio. Desde el perfil se utiliza **“Contactar por WhatsApp”**, un recorrido externo distinto del formulario de solicitud.

## Chatbot informativo

El botón **“Asistente Beauty Connect”**, integrado mediante `chatbot.js` en `index.html`, `perfil-profesional.html` y `solicitar-cita.html`, permite preguntar por categorías, profesionales publicados, perfiles, precios iniciales, ubicación general, WhatsApp y el procedimiento de solicitud.

El navegador envía `{ mensaje }` a `/api/chatbot`. La función serverless `api/chatbot.mjs` se comunica con Gemini usando `gemini-3.5-flash` y devuelve `{ respuesta }`. Utiliza una instrucción permanente y conocimiento incluido en esa función; no consulta solicitudes en Supabase ni envía el historial de conversación a Gemini.

La instrucción exige respuestas en español y texto plano, limita las respuestas a la información disponible y prohíbe inventar datos, garantizar calidad por la verificación o prometer tiempos de respuesta. El asistente no confirma citas, no consulta folios, no solicita datos privados y no es un chat entre cliente y profesional.

## Variables de entorno

Las funciones serverless leen `SUPABASE_SERVICE_KEY` y `GEMINI_API_KEY` desde las variables de entorno del servidor. Configurar sus valores en el entorno de despliegue de Vercel, sin publicarlos en el repositorio, la documentación ni el código del navegador. La URL de Supabase está definida en la función de solicitudes; no se utiliza una variable `SUPABASE_URL` en el código actual.

`.gitignore` excluye `.env`. No se incluye ni se requiere publicar un archivo `.env` con claves.

## Datos de profesionales

`data/products.json` es la fuente de datos del listado y de los perfiles profesionales. Incluye, entre otros datos, la descripción y el número de WhatsApp de cada profesional.

Para la demostración actual, los perfiles utilizan temporalmente el mismo número empresarial. Este número no representa una cuenta individual definitiva para cada profesional.

## Stack

El MVP de Beauty Connect está implementado con HTML, CSS y JavaScript vanilla, sin framework ni proceso de compilación. Utiliza Bootstrap 5.3.8 desde CDN, un archivo JSON local para los datos de profesionales y Supabase para almacenar las solicitudes de cita. La aplicación está desplegada en Vercel.

## Fuera del alcance actual

- Reserva automática de citas.
- Registro, autenticación e inicio de sesión.
- Pagos en línea.
