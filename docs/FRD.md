# Functional Requirements Document (FRD)

## Feature

**Listado de profesionales de belleza organizado por categoría de servicio**

## Objective

Permitir que una persona seleccione el servicio de belleza que necesita y consulte un listado de profesionales pertenecientes a esa categoría.

## Screen 1: Category selection

### What the user sees

- Nombre y logotipo de Beauty Connect.
- Título: “¿Qué servicio de belleza buscas?”
- Cuatro categorías disponibles:
  - Uñas.
  - Cabello.
  - Maquillaje.
  - Pestañas.
- Cada categoría se muestra en una tarjeta con su nombre y una imagen representativa.

### What the user does

- Selecciona una de las cuatro categorías disponibles.

### Data input

- Categoría seleccionada por el usuario.

### Data output

- El sistema identifica la categoría seleccionada.
- El sistema dirige al usuario al listado de profesionales correspondiente.

## Screen 2: Professionals list

### What the user sees

- Nombre de la categoría seleccionada.
- Opción “Volver a categorías”.
- Listado de profesionales activos relacionados con el servicio seleccionado.
- Cada tarjeta muestra:
  - Nombre del profesional.
  - Fotografía principal.
  - Zona o municipio.
  - Precio mínimo con el formato “Desde Q150.00”.
  - Distintivo “Perfil verificado”, cuando corresponda.

### What the user does

- Revisa y compara las opciones disponibles.
- Puede regresar a la pantalla anterior para seleccionar otra categoría.

### Data input

- Categoría seleccionada en la pantalla anterior.
- Acción de regresar a las categorías, cuando corresponda.

### Data output

- Listado de profesionales activos relacionados con la categoría seleccionada.
- Información básica de cada profesional.
- Regreso a la pantalla de categorías cuando el usuario selecciona esa opción.

## Functional rules

- Solo deben mostrarse profesionales con perfiles activos.
- Cada profesional debe pertenecer como mínimo a una categoría.
- El distintivo “Perfil verificado” solo se mostrará en perfiles aprobados manualmente por Beauty Connect.
- Los profesionales se mostrarán en orden alfabético por nombre.
- Toda la tarjeta de categoría será seleccionable.
- Las tarjetas de profesionales serán informativas y no abrirán otra pantalla.
- Esta funcionalidad no incluirá filtros avanzados, reservas automáticas, cuentas de usuario, pagos ni chat interno.

## Error or edge state: No professionals available

Si el usuario selecciona una categoría sin profesionales activos, el sistema mostrará el mensaje:

> “Por el momento no hay profesionales disponibles en esta categoría.”

Debajo aparecerá el botón **“Volver a categorías”**. Cuando el usuario lo seleccione, el sistema regresará a la pantalla de selección de categorías.