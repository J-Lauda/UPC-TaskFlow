# UPC TaskFlow

## 1. Nombre y descripción del proyecto

**UPC TaskFlow** es una aplicación web individual para organizar tareas académicas de distintos cursos. Permite registrar entregas con su fecha y prioridad, consultar su estado y conservar los datos en el navegador.

Este proyecto se desarrolla como parte del examen final individual de Inteligencia Artificial de la UPC.

## 2. Contexto y problemática

Un estudiante puede tener entregas, prácticas y evaluaciones de varios cursos al mismo tiempo. Cuando la información está repartida entre apuntes y recordatorios, puede ser difícil revisar rápidamente qué actividades siguen pendientes. UPC TaskFlow reúne esos datos en una lista sencilla disponible desde una sola página.

## 3. Usuario objetivo

Estudiantes universitarios que llevan varios cursos y quieren llevar un seguimiento personal de sus tareas académicas desde el navegador.

## 4. Objetivo general de la aplicación

Proporcionar una herramienta web simple para registrar, consultar y actualizar tareas académicas, guardando los cambios en el navegador sin requerir una cuenta ni un backend.

## 5. Funcionalidades principales

- Crear tareas con título, curso, fecha de entrega y prioridad alta, media o baja.
- Validar que los campos obligatorios estén completos.
- Editar los datos de una tarea existente usando el mismo formulario, o cancelar la edición.
- Marcar tareas como completadas y volver a ponerlas como pendientes.
- Eliminar tareas con confirmación.
- Filtrar la lista para mostrar todas las tareas, solo las pendientes o solo las completadas.
- Mostrar contadores del total, las pendientes y las completadas.
- Guardar y recuperar las tareas mediante `localStorage`.
- Interpretar como pendientes las tareas guardadas previamente que no tengan el atributo `completed`.
- Mostrar estados vacíos y mensajes cuando no se puedan leer o guardar los datos locales.

## 6. Tecnologías utilizadas

- **HTML:** define la estructura de la página, el formulario, los filtros, los contadores y la lista de tareas. Los controles incluyen etiquetas y atributos accesibles.
- **CSS:** contiene los estilos visuales, estados de los controles, animaciones y reglas responsive para adaptar la interfaz a pantallas estrechas.
- **JavaScript:** implementa validación, creación y edición de tareas, cambios de estado, eliminación, filtros, contadores y eventos de la interfaz.
- **`localStorage`:** guarda las tareas como JSON en el navegador usando la clave `upc-taskflow-tasks`. Es suficiente para este prototipo individual porque no requiere cuentas ni sincronización de datos. Los datos permanecen en el almacenamiento local del navegador y origen utilizados; no se comparten entre dispositivos ni navegadores.

La aplicación es estática y no usa frameworks, bibliotecas externas ni backend. Esta arquitectura mantiene el proyecto sencillo de ejecutar y publicar en GitHub Pages; los datos se gestionan directamente en el navegador.

## 7. Estructura de archivos

```text
UPC-TaskFlow/
├── index.html   # Estructura de la interfaz
├── styles.css   # Estilos y diseño adaptable
├── app.js       # Lógica, eventos y persistencia
└── README.md    # Documentación del proyecto
```

`index.html` enlaza `styles.css` y `app.js` con rutas relativas. El script se carga con `defer`.

## 8. Instrucciones de ejecución local

1. Descarga o clona el proyecto cuando el repositorio esté disponible, o abre la carpeta del proyecto en VS Code.
2. Abre `index.html` directamente en un navegador web.
3. Completa el formulario y selecciona **Agregar tarea** para comenzar.

No se requiere instalar dependencias ni compilar el proyecto. El almacenamiento depende del navegador y del origen desde el que se abra la página; abrirla localmente y publicarla en GitHub Pages puede producir almacenamientos separados.

## 9. Pruebas y validaciones realizadas

### Comprobaciones automáticas realizadas durante el desarrollo con Copilot

- Se comprobó la sintaxis de `app.js` con `node --check`.
- Se verificó que `index.html` enlaza los archivos CSS y JavaScript mediante rutas relativas y que la clave `upc-taskflow-tasks` permanece en el código.
- Se probó la interacción en el navegador: registrar y editar una tarea, cambiar su estado, usar los filtros, cancelar y confirmar una eliminación, y comprobar la persistencia después de recargar.
- Se comprobó que una tarea antigua sin `completed` se interpreta como pendiente.
- Se verificó que los estilos externos se cargan en la página.

Estas son comprobaciones realizadas durante el desarrollo; no constituyen una certificación de compatibilidad con todos los navegadores o dispositivos.

### Pruebas manuales confirmadas por el estudiante

El estudiante confirmó haber probado la aplicación publicada y haber realizado estas acciones:

- Crear actividades.
- Editar la descripción de una actividad.
- Cambiar el estado de una actividad entre pendiente y completada.

No se reportan aquí otras pruebas manuales como realizadas.

## 10. Uso de GitHub Copilot

GitHub Copilot se utilizó como asistente de desarrollo dentro de VS Code durante estas etapas:

1. **Análisis y planificación:** se analizó la problemática, el usuario objetivo y las funcionalidades para una aplicación académica individual. La propuesta se revisó antes de implementar.
2. **Generación inicial:** se creó una primera versión en un único `index.html`, con formulario, listado de tareas y persistencia local.
3. **Ampliación de funcionalidades:** se añadieron edición, eliminación con confirmación, cambio de estado, filtros y contadores, manteniendo compatibilidad con tareas antiguas sin `completed`.
4. **Verificación y correcciones de pruebas:** se revisó la sintaxis y se ejecutaron pruebas de interacción en el navegador para comprobar las funcionalidades y corregir detalles durante el desarrollo.
5. **Refactorización:** se separaron la estructura, los estilos y la lógica en `index.html`, `styles.css` y `app.js`, sin dependencias externas y conservando la clave de almacenamiento.
6. **Documentación:** se revisaron los tres archivos para redactar este README basándose en las funciones presentes.

### Decisiones tomadas durante el desarrollo

- Elegir HTML, CSS y JavaScript sin frameworks para mantener la aplicación sencilla y facilitar su publicación.
- Crear inicialmente una versión en un solo `index.html` y luego separar los estilos y la lógica en `styles.css` y `app.js` para mejorar la organización del código.
- Utilizar `localStorage` porque se trata de una aplicación individual sin backend.
- Mantener la clave `upc-taskflow-tasks` durante la refactorización para conservar las tareas registradas en el mismo almacenamiento del navegador.
- Solicitar pruebas y correcciones antes de publicar el proyecto.

GitHub Copilot ayudó a generar y revisar código; el estudiante debe comprenderlo, realizar las comprobaciones manuales y validar que la documentación refleje el trabajo que presentará.

## 11. Limitaciones y posibles mejoras futuras

### Limitaciones actuales

- Los datos se guardan solo en el almacenamiento local del navegador. No hay sincronización entre dispositivos ni navegadores.
- Si se borra el almacenamiento del navegador o se usa otro origen, las tareas locales pueden no estar disponibles.
- La aplicación no incluye cuentas, colaboración ni respaldo remoto.
- La aplicación no tiene backend ni base de datos central.

### Posibles mejoras futuras

- Permitir exportar e importar una copia de seguridad de las tareas.
- Añadir búsqueda y ordenamiento por fecha o prioridad.
- Incorporar recordatorios o una vista de calendario.
- Considerar sincronización entre dispositivos si el alcance futuro incluye un backend y autenticación.

Estas mejoras son propuestas; no están implementadas en la versión actual.

## 12. Enlaces

- **Repositorio GitHub:** [UPC-TaskFlow](https://github.com/J-Lauda/UPC-TaskFlow)
- **Aplicación en GitHub Pages:** [UPC TaskFlow](https://j-lauda.github.io/UPC-TaskFlow/)
