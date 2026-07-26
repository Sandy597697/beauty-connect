# FRD — Beauty Connect

## Funcionalidad 1: Búsqueda por categoría (Core Feature 4.1)

### Objetivo

Permitir que una persona seleccione el servicio de belleza que necesita y consulte un listado de profesionales pertenecientes a esa categoría.

---

### Pantalla 1: Selección de categoría

#### Lo que ve el usuario

- Nombre y logotipo de Beauty Connect.
- Título: **“¿Qué servicio de belleza buscas?”**
- Cuatro categorías disponibles:
  - Uñas.
  - Cabello.
  - Maquillaje.
  - Pestañas.
- Cada categoría se muestra mediante una tarjeta con su nombre y una imagen representativa.

#### Lo que hace el usuario

- Selecciona una de las cuatro categorías disponibles.

#### Datos de entrada

- Categoría seleccionada por el usuario.

#### Datos de salida

- El sistema identifica la categoría seleccionada.
- El sistema dirige al usuario a la pantalla de profesionales correspondiente.

---

### Pantalla 2: Listado de profesionales

#### Lo que ve el usuario

- Nombre de la categoría seleccionada.
- Opción **“Volver a categorías”**.
- Listado de profesionales activos que ofrecen el servicio seleccionado.
- Cada profesional aparece en una tarjeta con:
  - Nombre.
  - Fotografía principal.
  - Zona o ubicación aproximada.
  - Precio aproximado desde el cual ofrece el servicio.
  - Distintivo **“Perfil verificado”**, cuando corresponda.

#### Lo que hace el usuario

- Revisa y compara las opciones disponibles.
- Puede regresar a la pantalla anterior para elegir otra categoría.
- Puede seleccionar una tarjeta para acceder al perfil del profesional, descrito en la Funcionalidad 2.

#### Datos de entrada

- Categoría seleccionada en la pantalla anterior.
- Acción de regresar a categorías, si corresponde.

#### Datos de salida

- Listado de profesionales activos de la categoría seleccionada, con su información básica.

### Reglas funcionales

- Solo deben mostrarse profesionales con perfiles activos.
- Cada profesional debe estar asociado, como mínimo, con una categoría de servicio.
- El distintivo **“Perfil verificado”** solo debe mostrarse en perfiles previamente revisados y aprobados manualmente por Beauty Connect.
- Los profesionales se muestran en orden alfabético por nombre.
- Esta funcionalidad no incluye filtros avanzados, reservas automáticas, cuentas de usuario, pagos ni chat interno.

### Caso borde: Categoría sin profesionales disponibles

Si el usuario selecciona una categoría que no tiene profesionales activos registrados, el sistema no muestra un listado vacío.

En su lugar, presenta el mensaje:

> **“Por el momento no hay profesionales disponibles en esta categoría.”**

También muestra un botón **“Volver a categorías”**, que regresa a la Pantalla 1.

---

## Funcionalidad 2: Perfil del profesional (Core Feature 4.2)

### Objetivo

Mostrar al cliente la información necesaria de un profesional para decidir si desea contactarlo.

---

### Pantalla: Perfil del profesional

#### Lo que ve el usuario

- Nombre del profesional.
- Descripción breve.
- Lista de servicios que ofrece.
- Precio desde, para cada servicio o de forma general.
- Galería de fotografías de trabajos realizados.
- Zona o ubicación aproximada.
- Distintivo **“Perfil verificado”**, cuando aplique.
- Botón de contacto, descrito en la Funcionalidad 3.
- Opción para volver al listado de profesionales.

#### Lo que hace el usuario

- Revisa la información y las fotografías.
- Decide si contactar al profesional o volver al listado.

#### Datos de entrada

- Profesional seleccionado desde el listado de la Funcionalidad 1.

#### Datos de salida

- Información completa del perfil del profesional seleccionado.

### Reglas funcionales

- Solo se muestran perfiles activos.
- Si no se definió un precio, se muestra el texto **“Precio a consultar”** en lugar de un monto.

### Caso borde: Perfil incompleto

Si el perfil no tiene descripción o servicios definidos, el sistema muestra igualmente el perfil, ocultando únicamente las secciones sin información, sin mostrar campos vacíos ni mensajes de error.

### Caso borde: Fotografías no disponibles

Si el profesional no ha cargado fotografías, el sistema muestra un marcador de posición **“Imagen no disponible”** en lugar de la galería, y el resto del perfil se sigue mostrando con normalidad.

### Caso borde: Perfil no verificado

Si el profesional aún no ha sido verificado por Beauty Connect, el perfil permanece visible y funcional, incluyendo el botón de contacto, pero no muestra el distintivo **“Perfil verificado”**.

---

## Funcionalidad 3: Contacto con el profesional (Core Feature 4.3)

### Objetivo

Permitir que el cliente inicie una conversación con el profesional para solicitar una cita.

---

### Pantalla: Botón de contacto dentro del perfil del profesional

#### Lo que ve el usuario

- Un botón **“Contactar por WhatsApp”** visible en el perfil del profesional.

#### Lo que hace el usuario

- Presiona el botón de contacto.

#### Datos de entrada

- Número de WhatsApp asociado al profesional.
- Nombre del profesional.

#### Datos de salida

- Se abre WhatsApp o WhatsApp Web con un mensaje preescrito dirigido al profesional.

Ejemplo:

> **“Hola, encontré tu perfil en Beauty Connect y quisiera más información sobre tus servicios.”**

### Reglas funcionales

- El mensaje preescrito debe poder editarse antes de enviarse.
- Beauty Connect no envía el mensaje automáticamente.
- El botón solo se muestra si el profesional tiene un número de contacto registrado.

### Caso borde: Profesional sin número de contacto registrado

Si el profesional no tiene un número de WhatsApp asociado, el botón de contacto no se muestra.

En su lugar, se presenta el mensaje:

> **“Este profesional aún no tiene un medio de contacto disponible.”**

---

## Funcionalidad 4: Gestión del perfil — Proceso administrativo (Core Feature 4.4)

### Objetivo

Mantener actualizada la información de los profesionales publicados en Beauty Connect, sin depender de un sistema de registro e inicio de sesión en el MVP.

Esta funcionalidad no cuenta con una pantalla de autoservicio para el profesional en el MVP. Es un proceso interno del equipo de Beauty Connect, documentado paso a paso.

---

### Paso 1: Recepción de información

#### Quién participa

- Profesional de belleza.
- Equipo de Beauty Connect.

#### Datos de entrada

Información enviada por el profesional, por ejemplo, mediante WhatsApp o un formulario simple:

- Nombre.
- Descripción.
- Servicios.
- Precios.
- Zona.
- Fotografías.
- Número de contacto.

#### Datos de salida

- Información recibida y lista para revisión.

---

### Paso 2: Verificación manual

#### Quién participa

- Equipo de Beauty Connect.

#### Datos de entrada

- Información recibida en el Paso 1.

#### Datos de salida

- Decisión de aprobar y activar el distintivo **“Perfil verificado”**.
- Solicitud de información adicional al profesional, cuando corresponda.

---

### Paso 3: Publicación o actualización del perfil

#### Quién participa

- Equipo de Beauty Connect.

#### Datos de entrada

- Información aprobada en el Paso 2.

#### Datos de salida

- Perfil publicado o actualizado en el archivo de datos de prueba que consumen las Funcionalidades 1 y 2.

### Caso borde: Información incompleta o dudosa

Si la información enviada por el profesional está incompleta o no puede verificarse, por ejemplo, si las fotografías no corresponden al servicio ofrecido, el perfil no se publica ni se marca como verificado hasta que el profesional complete o aclare los datos solicitados.