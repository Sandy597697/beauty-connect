# Product Requirement Document (PRD)

## Product Name

**BeautyConnect**

---

# 1. Problem Statement

Actualmente, muchas personas tienen dificultades para encontrar profesionales de belleza confiables que ofrezcan servicios de calidad cerca de su ubicación. La información suele encontrarse dispersa entre redes sociales, recomendaciones personales y diferentes plataformas digitales, lo que dificulta comparar opciones, verificar la calidad del servicio y tomar una decisión con confianza.

Por otra parte, muchos profesionales independientes del sector belleza ofrecen servicios de alta calidad, pero cuentan con poca visibilidad digital y dependen principalmente de publicaciones en redes sociales o recomendaciones de sus clientes para conseguir nuevas oportunidades de negocio.

Como consecuencia, existe la necesidad de una plataforma tecnológica que conecte a ambos usuarios en un solo lugar, permitiendo descubrir profesionales, consultar información confiable, comparar opciones y facilitar el primer contacto para la solicitud de una cita.

---

# 2. Target Users

## 2.1 Cliente

Personas que buscan servicios de belleza de forma rápida y confiable. Necesitan comparar opciones y contactar al profesional que mejor se adapte a sus necesidades.

## 2.2 Profesional de belleza

Profesionales independientes o pequeños negocios que desean promocionar sus servicios, mostrar su trabajo y captar nuevos clientes.

---

# 3. User Stories

## 3.1 Cliente

- Como cliente, quiero seleccionar una categoría de servicio para encontrar profesionales.
- Como cliente, quiero visualizar un listado de profesionales para comparar opciones.
- Como cliente, quiero ingresar al perfil de un profesional para conocer su información.
- Como cliente, quiero visualizar fotografías de trabajos realizados para evaluar la calidad del servicio.
- Como cliente, quiero ver si un perfil está verificado para confiar en la información que muestra.
- Como cliente, quiero contactar al profesional para solicitar una cita.

## 3.2 Profesional de belleza

- Como profesional de belleza, quiero que se cree un perfil con mi información para promocionar mis servicios.
- Como profesional de belleza, quiero poder enviar información actualizada para mantener mi perfil vigente.

---

# 4. Core Features

## 4.1 Búsqueda por categoría

Permite al cliente seleccionar una categoría de servicio y visualizar únicamente los profesionales relacionados.

**Incluye:**

- Selección de categoría.
- Listado de profesionales.
- Acceso al perfil.

---

## 4.2 Perfil del profesional

Presenta la información necesaria para ayudar al cliente a tomar una decisión, incluyendo una señal de confianza mediante verificación manual.

**Incluye:**

- Nombre.
- Descripción.
- Servicios.
- Precio desde.
- Fotografías.
- Zona o ubicación aproximada.
- Distintivo **Perfil verificado** (cuando aplique).
- Datos de contacto.

---

## 4.3 Contacto con el profesional

Permite al cliente comunicarse con el profesional para solicitar una cita.

**Incluye:**

- Botón de contacto por WhatsApp.
- Información de contacto.

---

## 4.4 Gestión del perfil (proceso administrativo para el MVP)

Para el MVP, la creación y actualización de perfiles la realiza el equipo de BeautyConnect de forma manual, a partir de la información que el profesional envía (por ejemplo, mediante WhatsApp o un formulario simple). El autoservicio de edición desde una cuenta propia queda fuera del alcance hasta que exista registro de usuarios.

**Incluye:**

- Recepción de información del profesional.
- Carga o actualización manual del perfil.
- Verificación manual antes de publicar o actualizar el distintivo **Perfil verificado**.

---

# 5. Out of Scope

| Funcionalidad | Justificación |
|---------------|---------------|
| Registro e inicio de sesión (clientes y profesionales) | Se implementará en futuras versiones; para el MVP la gestión de perfiles es manual. |
| Filtros avanzados | No son necesarios para validar el MVP. |
| Visualización de horarios en tiempo real | Incrementa la complejidad del desarrollo inicial. |
| Reservas automáticas | El contacto directo por WhatsApp es suficiente para validar el MVP. |
| Calificaciones y reseñas | Se incorporarán cuando exista una base de usuarios. |
| Notificaciones | No son indispensables para validar la propuesta de valor. |
| Chat interno | El contacto directo por WhatsApp es suficiente para el MVP. |
| Pagos en línea | Requieren procesos adicionales que no forman parte de la primera versión. |

---

# 6. Success Criteria

- Al menos un número inicial de profesionales con perfil publicado y verificado antes del lanzamiento del MVP.
- Un cliente puede ir de la pantalla de categorías al contacto por WhatsApp en tres pasos o menos.
- El equipo de BeautyConnect puede publicar o actualizar un perfil manualmente en menos de un día desde que recibe la información.
- Los clientes logran identificar y contactar a un profesional sin necesitar ayuda externa.
- El MVP permite validar si clientes y profesionales encuentran valor en conectarse mediante la plataforma antes de invertir en cuentas de usuario, reservas automáticas o pagos en línea.