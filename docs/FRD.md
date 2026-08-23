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

**Objetivo:** permitir que una persona envíe una solicitud de cita con sus datos de contacto, el profesional y el servicio de su interés.

### Acceso y navegación

- Desde la pantalla principal, el usuario accede mediante el enlace **"Solicitar una cita"**.
- El enlace abre la página `solicitar-cita.html`.
- La página incluye el enlace **"Volver al inicio"**, que regresa a la pantalla principal.

### Pantalla: Solicitar una cita

**Lo que ve el usuario:**

- Título **"Solicitar una cita"**.
- Formulario de solicitud con seis campos.
- Botón **"Enviar solicitud"**.

**Lo que hace el usuario:**

- Completa los seis campos del formulario.
- Presiona el botón **"Enviar solicitud"** para enviar la información.

**Datos de entrada:**

- `nombre_cliente`: nombre de la persona que solicita la cita.
- `telefono`: número de teléfono de contacto.
- `profesional`: profesional con quien desea solicitar la cita.
- `servicio`: servicio de belleza solicitado.
- `fecha_solicitada`: fecha deseada para la cita.
- `mensaje`: información adicional proporcionada por la persona.

**Datos de salida:**

- Una sola fila almacenada en la tabla `solicitudes_cita` de Supabase.
- Mensaje de confirmación o mensaje de error, según el resultado del envío.

### Reglas funcionales

- Los seis campos son obligatorios.
- El envío crea una sola fila en la tabla `solicitudes_cita` con los seis campos del formulario.
- La aplicación no envía manualmente los campos `id` ni `created_at`.
- Mientras se procesa la solicitud, el botón queda deshabilitado y muestra el texto **"Enviando…"**.
- Después de un envío exitoso, el formulario se limpia.
- Al finalizar el intento, tanto si fue exitoso como si ocurrió un error, el botón se reactiva y recupera el texto **"Enviar solicitud"**.

### Estado de confirmación

Después de almacenar correctamente la solicitud, el sistema muestra el mensaje:

**"¡Gracias! Tu solicitud de cita fue enviada correctamente."**

### Estado de error

Si Supabase devuelve un error o falla el envío, el formulario conserva los datos ingresados y el sistema muestra:

**"No pudimos enviar tu solicitud. {detalle del error}"**

Si no existe un detalle de error disponible, utiliza el texto **"Intenta nuevamente."**. Después del intento, el botón vuelve a estar habilitado y muestra nuevamente **"Enviar solicitud"**.

---

## Fuera del alcance del prototipo actual

- Reserva automática de citas.
- Registro, autenticación e inicio de sesión de clientes o profesionales.
- Pagos en línea.
