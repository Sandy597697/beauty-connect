# Functional Requirements Document (FRD)

Cada funcionalidad corresponde a un Core Feature del PRD (sección 4) y se describe pantalla por pantalla, con entradas, salidas y al menos un caso borde.

---

# Funcionalidad 1: Búsqueda por categoría (Core Feature 4.1)

## Objetivo

Permitir que una persona seleccione el servicio de belleza que necesita y consulte un listado de profesionales pertenecientes a esa categoría.

---

## Pantalla 1: Selección de categoría

### Lo que ve el usuario

- Nombre y logotipo de BeautyConnect.
- Título: **¿Qué servicio de belleza buscas?**
- Cuatro categorías disponibles:
  - Uñas
  - Cabello
  - Maquillaje
  - Pestañas
- Cada categoría se muestra mediante una tarjeta con su nombre y una imagen representativa.

### Lo que hace el usuario

Selecciona una de las cuatro categorías disponibles.

### Datos de entrada

- Categoría seleccionada por el usuario.

### Datos de salida

- El sistema identifica la categoría seleccionada y dirige al usuario a la pantalla correspondiente.

---

## Pantalla 2: Listado de profesionales

### Lo que ve el usuario

- Nombre de la categoría seleccionada.
- Opción **Volver a categorías**.
- Listado de profesionales activos que ofrecen el servicio seleccionado.
- Cada profesional aparece en una tarjeta con:
  - Nombre.
  - Fotografía principal.
  - Zona o ubicación aproximada.
  - Precio aproximado desde el cual ofrece el servicio.
  - Distintivo **Perfil verificado**, cuando corresponda.

### Lo que hace el usuario

- Revisa y compara las opciones disponibles.
- Puede regresar a la pantalla anterior para elegir otra categoría.
- Puede seleccionar una tarjeta para acceder al perfil del profesional.

### Datos de entrada

- Categoría seleccionada en la pantalla anterior.
- Acción de regresar a categorías, si corresponde.

### Datos de salida

- Listado de profesionales activos de la categoría seleccionada con su información básica.

---

## Reglas funcionales

- Solo deben mostrarse profesionales con perfiles activos.
- Cada profesional debe estar asociado, como mínimo, con una categoría de servicio.
- El distintivo **Perfil verificado** solo debe mostrarse en perfiles previamente revisados y aprobados manualmente por BeautyConnect.
- Los profesionales se muestran en orden alfabético por nombre.
- Esta funcionalidad no incluye filtros avanzados, reservas automáticas, cuentas de usuario, pagos ni chat interno.

---

## Caso borde: Categoría sin profesionales disponibles

Si el usuario selecciona una categoría que no tiene profesionales activos registrados, el sistema presenta el mensaje:

> **"Por el momento no hay profesionales disponibles en esta categoría."**

Además, muestra el botón **Volver a categorías**, que regresa a la Pantalla 1.
---

# Funcionalidad 2: Perfil del profesional (Core Feature 4.2)

## Objetivo

Mostrar al cliente la información necesaria de un profesional para decidir si desea contactarlo.

---

## Pantalla: Perfil del profesional

### Lo que ve el usuario

- Nombre del profesional.
- Descripción breve.
- Lista de servicios que ofrece.
- Precio desde, para cada servicio o de forma general.
- Galería de fotografías de trabajos realizados.
- Zona o ubicación aproximada.
- Distintivo **Perfil verificado**, cuando aplique.
- Botón de contacto (ver Funcionalidad 3).
- Opción para volver al listado de profesionales.

### Lo que hace el usuario

- Revisa la información y las fotografías.
- Decide si contactar al profesional o volver al listado.

### Datos de entrada

- Profesional seleccionado desde el listado (Funcionalidad 1).

### Datos de salida

- Información completa del perfil del profesional seleccionado.

---

## Reglas funcionales

- Solo se muestran perfiles activos.
- Si el profesional no tiene fotografías cargadas, se muestra una imagen genérica de la categoría en su lugar.
- Si no se definió un precio, se muestra el texto **"Precio a consultar"** en vez de un monto.

---

## Caso borde: Perfil incompleto

Si el perfil no tiene descripción o servicios definidos, el sistema muestra igualmente el perfil, ocultando únicamente las secciones sin información, sin mostrar campos vacíos ni mensajes de error.

---

# Funcionalidad 3: Contacto con el profesional (Core Feature 4.3)

## Objetivo

Permitir que el cliente establezca el primer contacto con el profesional seleccionado para solicitar información o coordinar una cita.

---

## Pantalla: Contacto con el profesional

### Lo que ve el usuario

- Botón **Contactar por WhatsApp**.
- Número de contacto del profesional (cuando esté disponible).

### Lo que hace el usuario

- Presiona el botón **Contactar por WhatsApp** para iniciar una conversación con el profesional.

### Datos de entrada

- Profesional seleccionado.
- Número de WhatsApp registrado por el profesional.

### Datos de salida

- El sistema abre WhatsApp o WhatsApp Web con un mensaje predefinido dirigido al profesional.

**Mensaje sugerido:**

> Hola, encontré tu perfil en BeautyConnect y me gustaría recibir más información sobre tus servicios.

---

## Reglas funcionales

- El sistema no envía mensajes automáticamente; únicamente abre el canal de comunicación.
- El mensaje predefinido puede ser editado por el cliente antes de enviarlo.
- El botón solo se muestra cuando el profesional tiene un número de contacto registrado.

---

## Caso borde: Profesional sin medio de contacto

Si el profesional no tiene un número de WhatsApp registrado, el sistema oculta el botón de contacto y muestra el mensaje:

> **"Este profesional aún no tiene un medio de contacto disponible."**

---

# Funcionalidad 4: Gestión del perfil (Core Feature 4.4)

## Objetivo

Permitir la creación y actualización de los perfiles de los profesionales para mantener la información publicada actualizada.

---

## Proceso administrativo de gestión del perfil

### Lo que realiza BeautyConnect

- Recibe la información enviada por el profesional.
- Verifica que la información esté completa.
- Publica o actualiza el perfil dentro de la plataforma.
- Asigna el distintivo **Perfil verificado**, cuando corresponda.

### Datos de entrada

- Nombre del profesional.
- Descripción.
- Servicios ofrecidos.
- Precio desde.
- Zona o ubicación aproximada.
- Fotografías.
- Número de WhatsApp.

### Datos de salida

- Perfil creado o actualizado correctamente.
- Información visible para los clientes dentro de la plataforma.

---

## Reglas funcionales

- Para el MVP, la creación y actualización de perfiles se realiza manualmente por el equipo de BeautyConnect.
- Solo se publican perfiles con la información mínima requerida.
- El distintivo **Perfil verificado** únicamente se asigna después de una revisión manual.

---

## Caso borde: Información incompleta

Si el profesional envía información incompleta, el perfil no se publica hasta que los datos faltantes sean proporcionados.

El sistema mantiene el perfil sin cambios hasta completar la información requerida.