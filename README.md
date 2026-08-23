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

**Despliegue oficial actual en Vercel:** https://beauty-connect-hg5h.vercel.app

El producto permite:

- Seleccionar una categoría de belleza.
- Consultar los profesionales activos disponibles dentro de la categoría seleccionada.
- Abrir el perfil individual de un profesional mediante su tarjeta o la indicación **“Ver perfil →”**.
- Consultar en el perfil la fotografía, nombre, categoría, zona, precio desde, descripción y distintivo **“Perfil verificado”** cuando corresponde.
- Regresar desde el perfil al listado de la categoría seleccionada.
- Contactar al profesional desde su perfil mediante WhatsApp, con un mensaje preparado que incluye su nombre y categoría. Este contacto abre un servicio externo y no constituye un chat interno ni una reserva confirmada.
- Volver desde el listado a la pantalla de categorías.
- Acceder al formulario “Solicitar una cita”.
- Enviar la solicitud a la tabla `solicitudes_cita` de Supabase.
- Regresar desde el formulario al inicio.

## Datos de profesionales

`data/products.json` es la fuente de datos del listado y de los perfiles profesionales. Incluye, entre otros datos, la descripción y el número de WhatsApp de cada profesional.

Para la demostración actual, los perfiles utilizan temporalmente el mismo número empresarial. Este número no representa una cuenta individual definitiva para cada profesional.

## Stack

El MVP de Beauty Connect está implementado con HTML, CSS y JavaScript vanilla, sin framework ni proceso de compilación. Utiliza Bootstrap 5.3.8 desde CDN, un archivo JSON local para los datos de profesionales y Supabase para almacenar las solicitudes de cita. La aplicación está desplegada en Vercel.

## Fuera del alcance actual

- Reserva automática de citas.
- Registro, autenticación e inicio de sesión.
- Pagos en línea.
