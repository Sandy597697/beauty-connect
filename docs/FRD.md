# FRD - Beauty Connect

## Funcionalidad 1: Búsqueda por categoría (Core Feature 4.1)

**Objetivo:** permitir que una persona seleccione el servicio de belleza que necesita y consulte un listado de profesionales pertenecientes a esa categoría.

### Pantalla 1: Selección de categoría

**Lo que ve el usuario:**

- Nombre y logotipo de Beauty Connect.
- Título: **"¿Qué servicio de belleza buscas?"**
- Cuatro categorías disponibles:
  - Uñas
  - Cabello
  - Maquillaje
  - Pestañas
- Cada categoría se muestra mediante una tarjeta con su nombre y una imagen representativa.

**Lo que hace el usuario:**

Selecciona una de las cuatro categorías disponibles.

**Datos de entrada:**

- Categoría seleccionada por el usuario.

**Datos de salida:**

- El sistema identifica la categoría y dirige al usuario a la pantalla de profesionales correspondiente.

---

### Pantalla 2: Listado de profesionales

**Lo que ve el usuario:**

- Nombre de la categoría seleccionada.
- Opción **"Volver a categorías"**.
- Listado de profesionales disponibles que ofrecen el servicio seleccionado.
- Cada profesional aparece en una tarjeta con:
  - Nombre.
  - Fotografía principal.
  - Zona o ubicación aproximada.
  - Precio aproximado desde el cual ofrece el servicio.
  - Distintivo **"Perfil verificado"**, cuando corresponda.
  - Opción visible **"Ver perfil →"**.

**Lo que hace el usuario:**

- Revisa y compara las opciones disponibles.
- Selecciona la tarjeta de un profesional para abrir su perfil individual.
- Puede regresar a la pantalla anterior para elegir otra categoría.

**Datos de entrada:**

- Categoría seleccionada en la pantalla anterior.
- Profesional seleccionado mediante su tarjeta.
- Acción de regresar a categorías, si corresponde.

**Datos de salida:**

- Listado de profesionales disponibles de la categoría seleccionada, con su información básica.
- Navegación a `perfil-profesional.html?id={id}&category={categoría}` para el profesional seleccionado.

### Reglas funcionales

- Solo deben mostrarse profesionales con perfiles activos.
- Cada profesional debe estar asociado, como mínimo, con una categoría de servicio.
- El distintivo **"Perfil verificado"** se muestra si el dato del profesional indica que está verificado.
- Los profesionales se muestran en orden alfabético por nombre.

### Estado de carga de profesionales

Mientras se obtiene `data/products.json`, el sistema muestra el título:

**"Buscando profesionales"**

y el mensaje:

**"Estamos preparando las opciones de {categoría}."**

Para lectores de pantalla, el sistema anuncia:

**"Cargando profesionales de {categoría}."**

Durante este estado, el sistema no muestra falsamente la categoría como vacía.

### Estado de error al cargar los profesionales

Si ocurre un error HTTP, el JSON es inválido, la estructura no es un arreglo o falla la lectura de los datos, el sistema muestra el título:

**"No pudimos cargar los profesionales"**

y el mensaje:

**"Intenta nuevamente en unos momentos."**

También muestra un botón **"Volver a categorías"**.

Para lectores de pantalla, el sistema anuncia:

**"No se pudieron cargar los profesionales."**

### Caso borde: categoría sin profesionales disponibles

Si el usuario selecciona una categoría que no tiene profesionales disponibles, el sistema no muestra un listado vacío. En su lugar, presenta el título:

**"Aún no encontramos opciones aquí"**

con el mensaje:

**"Por el momento no hay profesionales disponibles en esta categoría."**

y un botón **"Volver a categorías"** que regresa a la Pantalla 1.

---

## Funcionalidad 2: Perfil del profesional y contacto por WhatsApp

**Objetivo:** permitir que una persona consulte la información individual de un profesional y establezca contacto directo mediante WhatsApp.

### Acceso y navegación

- Desde el listado, toda la tarjeta del profesional funciona como un único enlace accesible e incluye la indicación visible **"Ver perfil →"**.
- Al seleccionar una tarjeta, se abre `perfil-profesional.html` con los parámetros `id` y `category` correspondientes al profesional elegido.
- La página obtiene el `id` desde los parámetros de la URL y muestra únicamente el profesional activo que coincide con ese identificador.
- El enlace **"Volver a profesionales"** regresa a `index.html` con la categoría seleccionada, y el listado de esa categoría se abre nuevamente.

### Pantalla 3: Perfil del profesional

**Lo que ve el usuario:**

- Fotografía principal.
- Nombre del profesional.
- Categoría de servicio.
- Descripción.
- Zona o ubicación aproximada.
- Precio desde el cual ofrece el servicio, o la indicación **"Precio a consultar"** cuando el precio no está disponible.
- Distintivo **"Perfil verificado"**, cuando el dato del profesional indica que está verificado.
- Botón **"Contactar por WhatsApp"** cuando el número es válido.
- Enlace **"Volver a profesionales"**.

**Lo que hace el usuario:**

- Consulta la información individual del profesional.
- Regresa al listado de la categoría seleccionada.
- Abre WhatsApp para consultar directamente por los servicios del profesional.

**Datos de entrada:**

- `id`: identificador del profesional recibido en la URL.
- `category`: categoría recibida en la URL para conservar el contexto de regreso al listado.
- Información de profesionales cargada desde `data/products.json`.

**Datos de salida:**

- Perfil individual del profesional activo correspondiente al `id`.
- Enlace de contacto mediante WhatsApp con un mensaje preparado.

### Fuente de datos del perfil

- `data/products.json` es la única fuente de datos para el listado y los perfiles profesionales.
- No existe un archivo JSON separado para los perfiles.
- El perfil utiliza los campos `image`, `name`, `category`, `description`, `zone`, `price_from`, `verified`, `active` y `whatsapp` del profesional seleccionado.

### Reglas funcionales del perfil

- El `id` debe existir, representar un número entero positivo y corresponder a un profesional activo.
- Si el profesional está verificado, se muestra el distintivo **"Perfil verificado"**.
- Los datos obtenidos del JSON se insertan en el contenido mediante texto y atributos del DOM.
- Mientras se obtiene `data/products.json`, se muestra el estado **"Cargando perfil"**.
- Si el `id` está ausente o no es válido, se muestra **"Perfil no disponible"**.
- Si el profesional no existe o está inactivo, se muestra **"Profesional no encontrado"**.
- Si ocurre un error al leer `data/products.json`, se muestra **"No pudimos cargar el perfil"**.

### Contacto por WhatsApp

- El botón utiliza el número almacenado en el campo `whatsapp` del profesional en `data/products.json`.
- El número debe contener únicamente entre 8 y 15 dígitos para habilitar el enlace de contacto.
- El enlace utiliza `https://wa.me/`, se abre en una pestaña nueva y prepara el mensaje:

**"Hola, vi el perfil de {nombre} en Beauty Connect y quisiera consultar sobre sus servicios de {categoría}."**

- Si el número no es válido, no se muestra el botón y aparece el mensaje **"El número de WhatsApp de este profesional no es válido."**.
- Para la demostración actual, los tres perfiles utilizan temporalmente el mismo número empresarial. Este número no representa una cuenta individual definitiva para cada profesional.

---

## Funcionalidad 3: Solicitar una cita

**Objetivo:** registrar una petición de cita después de que la persona elija opciones del producto, complete sus datos y revise la información. No constituye una reserva automática ni una cita confirmada.

### Acceso y selección

- Desde las categorías o el listado en `index.html`, **“Solicitar una cita”** abre `solicitar-cita.html`. **“Volver al inicio”** regresa a `index.html`.
- El perfil ofrece **“Contactar por WhatsApp”**; no contiene un botón para enviar la solicitud desde el perfil.
- `solicitar-cita.js` carga `data/products.json` y utiliza profesionales activos con nombre y categoría.
- El selector de servicio contiene las categorías de esos profesionales, sin duplicados y en orden alfabético. Actualmente ofrece Cabello, Maquillaje y Uñas; Pestañas no tiene profesionales activos y no se ofrece en el formulario.
- El selector de profesional permanece deshabilitado hasta elegir servicio. Después muestra únicamente los profesionales de ese servicio, ordenados por nombre. Cambiar el servicio reinicia la selección del profesional.
- Si la URL incluye `servicio` y `profesional`, solo se preseleccionan cuando coinciden con las opciones disponibles.

### Paso 1: Datos de la solicitud

**Campos obligatorios:**

- `nombre_cliente`: nombre, hasta 120 caracteres.
- `telefono`: teléfono, entre 8 y 30 caracteres según el patrón admitido: dígitos, espacios, paréntesis, guiones y un signo + inicial opcional.
- `servicio`: selección entre las opciones del producto.
- `profesional`: selección filtrada por servicio.
- `fecha_solicitada`: fecha deseada; el formulario establece como mínimo el día local actual.

**Campo opcional:** `mensaje`, hasta 1000 caracteres.

El botón **“Revisar solicitud”** valida el formulario y la combinación de servicio y profesional, elimina espacios al inicio y final de los valores y abre la revisión. Este paso todavía no registra datos en Supabase.

### Paso 2: Pantalla de revisión

- **“Revisa tu solicitud”** muestra nombre, teléfono, profesional, servicio, fecha y mensaje; si este está vacío, muestra **“Sin mensaje adicional”**.
- **“Regresar y corregir”** vuelve al formulario con los datos conservados. Al pulsar nuevamente **“Revisar solicitud”**, se actualiza el resumen.
- **“Confirmar solicitud”** inicia el envío. Mientras se guarda, ambos botones se deshabilitan, el de confirmación muestra **“Guardando…”** y aparece **“Estamos guardando tu solicitud.”**.

### Registro mediante función serverless

- El navegador envía los cinco campos obligatorios y el mensaje por POST en JSON a `/api/solicitudes-cita`.
- `api/solicitudes-cita.mjs` valida el objeto JSON, campos obligatorios, longitudes, formato del teléfono y validez de la fecha. La selección según el catálogo y la fecha mínima se comprueban en el navegador; la función no contrasta el profesional y servicio con el catálogo ni rechaza por sí misma una fecha pasada válida.
- La función utiliza `SUPABASE_SERVICE_KEY` desde el entorno del servidor e inserta un objeto en la tabla `solicitudes_cita` mediante la API REST de Supabase. El navegador no recibe esa clave.
- No envía manualmente `id`, `created_at`, `folio` ni `estado`. Solicita a Supabase que devuelva `folio` y `estado`.
- Si recibe ambos valores, responde con HTTP 201 y `{ success: true, folio, estado }`.

### Confirmación

Después de una respuesta válida, el formulario se limpia y aparece **“Recibimos tu solicitud”**, con el folio único y el estado inicial **“Solicitud recibida”**, además de **“Volver al inicio”**.

El folio y el estado se muestran tal como los devuelve Supabase. La generación del folio único y el estado inicial dependen de la configuración de la tabla; el repositorio no incluye el esquema SQL para verificar esos valores predeterminados o la restricción de unicidad. La función no los genera ni los fija.

El folio funciona como identificador y comprobante de la solicitud. Actualmente no existe una función de consulta automática por folio ni un flujo implementado para cambiar el estado a **“En revisión”** o **“Confirmada”**.

### Carga y errores

- Durante la carga de opciones se muestra **“Cargando profesionales y servicios…”** y el formulario permanece oculto.
- Si falla la carga o no hay profesionales activos, aparece el detalle junto con **“Recarga la página para intentarlo nuevamente.”**.
- Si falla el envío, se mantiene la revisión y los datos, y se muestra **“No pudimos guardar tu solicitud. {detalle del error}”**. Los botones se habilitan nuevamente para corregir o reintentar.
- Si Supabase guardó la fila pero no devolvió folio y estado, la función responde con un error que indica esa situación. No hay deduplicación de reintentos implementada; deshabilitar los botones evita envíos repetidos mientras la petición está en curso.

---

## Funcionalidad 4: Chatbot informativo

### Acceso y funcionamiento

- `chatbot.js` integra el botón **“Asistente Beauty Connect”** en `index.html` (categorías y listado), `perfil-profesional.html` y `solicitar-cita.html`.
- La persona puede abrir y cerrar el panel y enviar una pregunta de hasta 1000 caracteres. Mientras espera, el campo y el botón se deshabilitan y aparece **“Consultando…”**.
- El navegador envía únicamente `{ mensaje }` por POST a `/api/chatbot`. `api/chatbot.mjs` valida el mensaje y consulta Gemini con la instrucción permanente y el conocimiento incluido en esa función.
- La configuración actual utiliza `gemini-3.5-flash`, `temperature: 0.2`, `maxOutputTokens: 1024` y `thinkingLevel: "MINIMAL"`. La clave se lee de `GEMINI_API_KEY` en el servidor.
- La respuesta exitosa es `{ respuesta }` y se presenta mediante texto del DOM. Los errores se muestran en el panel. El historial visible no se envía a Gemini ni se conserva al navegar a otra página.

### Alcance y límites

La instrucción permanente indica:

- Responder en español, de forma breve y en texto plano, sin Markdown, asteriscos, etiquetas ni entidades HTML.
- Orientar únicamente sobre Beauty Connect: categorías, profesionales publicados, perfiles, precios iniciales, ubicación general, WhatsApp y procedimiento de solicitud.
- Utilizar exclusivamente el conocimiento incluido; reconocer información no disponible y no inventar precios, horarios, disponibilidad, políticas ni características.
- Informar si el perfil está verificado o no, sin calificar al profesional como excelente, confiable, recomendado o mejor. La verificación no garantiza la calidad del servicio.
- Diferenciar **“Contactar por WhatsApp”** desde el perfil y **“Solicitar una cita”** en Beauty Connect, con selección, datos, revisión y confirmación.
- No prometer respuesta inmediata ni tiempos específicos del profesional.
- No confirmar citas, garantizar aceptación de fechas, consultar solicitudes por folio ni presentar una solicitud como reserva confirmada.
- No solicitar ni reproducir claves, credenciales, datos privados, nombres, teléfonos, folios o información de solicitudes; no ofrecer diagnósticos ni recomendaciones sobre procedimientos médicos.
- Orientar al contacto por WhatsApp para confirmar precio final, disponibilidad, dirección, horario, cambios o cancelaciones.

El chatbot no es un chat entre cliente y profesional, no consulta Supabase y no registra solicitudes. Las reglas de respuesta se transmiten al modelo mediante su instrucción; no hay un filtro posterior que garantice su cumplimiento.

---

## Fuera del alcance del prototipo actual

- Reserva automática de citas.
- Registro, autenticación e inicio de sesión de clientes o profesionales.
- Pagos en línea.
