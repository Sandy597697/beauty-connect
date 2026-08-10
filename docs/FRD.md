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

**Lo que hace el usuario:**

- Revisa y compara las opciones disponibles.
- Puede regresar a la pantalla anterior para elegir otra categoría.
- Puede seleccionar una tarjeta para acceder al perfil del profesional (ver Funcionalidad 2).

**Datos de entrada:**

- Categoría seleccionada en la pantalla anterior.
- Acción de regresar a categorías, si corresponde.

**Datos de salida:**

- Listado de profesionales disponibles de la categoría seleccionada, con su información básica.

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

## Funcionalidad 2: Perfil del profesional (Core Feature 4.2)

**Objetivo:** mostrar al cliente la información necesaria de un profesional para decidir si desea contactarlo.

### Pantalla: Perfil del profesional

**Lo que ve el usuario:**

- Nombre del profesional.
- Descripción breve.
- Lista de servicios que ofrece.
- Precio desde, para cada servicio o de forma general.
- Galería de fotografías de trabajos realizados.
- Zona o ubicación aproximada.
- Distintivo **"Perfil verificado"**, cuando aplique.
- Botón de contacto (ver Funcionalidad 3).
- Opción para volver al listado de profesionales.

**Lo que hace el usuario:**

- Revisa la información y las fotografías.
- Decide si contactar al profesional o volver al listado.

**Datos de entrada:**

- Profesional seleccionado desde el listado (Funcionalidad 1).

**Datos de salida:**

- Información completa del perfil del profesional seleccionado.

### Reglas funcionales

- Solo se muestran perfiles activos.
- Si no se definió un precio, se muestra el texto **"Precio a consultar"** en vez de un monto.

### Caso borde: perfil incompleto

Si el perfil no tiene descripción o servicios definidos, el sistema muestra igualmente el perfil, ocultando únicamente las secciones sin información, sin mostrar campos vacíos ni mensajes de error.

### Caso borde: fotografías no disponibles

Si el profesional no ha cargado fotografías, el sistema muestra un marcador de posición (**"Imagen no disponible"**) en lugar de la galería, y el resto del perfil se sigue mostrando con normalidad.

### Caso borde: perfil no verificado

Si el profesional aún no ha sido verificado por Beauty Connect, el perfil permanece visible y funcional (incluyendo el botón de contacto), pero no muestra el distintivo **"Perfil verificado"**.
---

## Funcionalidad 3: Contacto con el profesional (Core Feature 4.3)

**Objetivo:** permitir que el cliente contacte directamente al profesional mediante un enlace a WhatsApp.

### Pantalla: Contacto con el profesional

**Lo que ve el usuario:**

- Botón **"Contactar por WhatsApp"** dentro del perfil del profesional.

**Lo que hace el usuario:**

- Presiona el botón de contacto.

**Datos de entrada:**

- Selección del botón **"Contactar por WhatsApp"**.

**Datos de salida:**

- El sistema abre una conversación en WhatsApp con el número registrado del profesional.

### Reglas funcionales

- El botón debe utilizar el número de WhatsApp registrado para el profesional.
- El enlace debe abrir WhatsApp Web o la aplicación instalada en el dispositivo, según corresponda.
- El sistema no almacena conversaciones ni mensajes enviados entre el cliente y el profesional.

### Caso borde: profesional sin número de contacto registrado

Si el profesional no tiene un número de WhatsApp asociado, el botón de contacto no se muestra. En su lugar, el sistema presenta el mensaje:

**"Este profesional aún no tiene un medio de contacto disponible."**
