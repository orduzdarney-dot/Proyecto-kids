# 🚌 Kids Routes - Gestión de Rutas Escolares

Kids Routes es una aplicación web moderna y eficiente diseñada para la administración de rutas de transporte escolar. La aplicación permite gestionar conductores, asignar estudiantes a rutas específicas y visualizar información relevante en tiempo real.

## 🚀 Características

- **Navegación SPA (Single Page Application):** Interfaz fluida que permite navegar entre las vistas de Rutas, Directorio de Estudiantes y Conductores sin recargar la página.
- **Gestión de Rutas (CRUD):** Creación, edición y eliminación de rutas escolares con validación de datos.
- **Web Components:** Implementación de componentes personalizados (`<tarjeta-ruta>`) utilizando **Shadow DOM** para encapsular estilos y lógica.
- **Gestión de Estudiantes:** Sistema de edición *inline* que permite agregar, editar o eliminar alumnos directamente en la tarjeta de cada ruta.
- **Integración de Clima:** Consumo de la API de **OpenWeather** para mostrar el estado del tiempo actual en la ciudad de Bucaramanga.
- **Modo Oscuro/Claro:** Soporte nativo para temas visuales con persistencia de preferencia mediante `localStorage`.
- **Persistencia de Datos:** Almacenamiento local de rutas y configuraciones para que la información no se pierda al cerrar el navegador.
- **Diseño Responsivo:** Interfaz adaptada para dispositivos móviles, tablets y escritorio.

## 🛠️ Tecnologías Utilizadas

- **JavaScript :** Lógica de negocio, manipulación del DOM y Fetch API.
- **API:** Uso de `Custom Elements`, `Templates` y `Shadow DOM`.
- **CSS:** Variables dinámicas (`custom properties`), CSS Grid, Flexbox y animaciones.
- **HTML:** Estructura semántica.
- **OpenWeather API:** Servicio externo para datos meteorológicos.

## 📂 Estructura del Proyecto

- `index.html`: Punto de entrada principal y contenedores de las vistas.
- `style.css`: Definición de estilos globales, variables de color y temas (claro/oscuro).
- `main.js`: Orquestador de la aplicación, manejo de navegación, persistencia y eventos globales.
- `tarjeta.js`: Definición del componente web `<tarjeta-ruta>` y su lógica interna.

## ⚙️ Configuración y Uso

1. **API Key:** El proyecto incluye una clave para OpenWeather en `main.js`. Si deseas cambiarla, busca la constante `API_KEY`.
2. **Ejecución:** Simplemente abre el archivo `index.html` en cualquier navegador moderno.
3. **Interacción:**
   - Crea una ruta desde el formulario superior.
   - Haz clic en **"+ Asignar Estudiante"** para abrir el formulario rápido dentro de la tarjeta.
   - Usa la barra de navegación para consultar la lista consolidada de todos los estudiantes y conductores registrados.

## 🎨 Personalización

El sistema de colores es fácilmente editable a través de las variables CSS en el `:root` de `style.css`. El modo oscuro se activa añadiendo la clase `.modo-oscuro` al `body`.

---
**Proyecto-kids** - *Solución inteligente para el transporte escolar.*

