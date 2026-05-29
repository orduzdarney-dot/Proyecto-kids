
import './tarjeta.js';


const API_KEY = `6a5b087b9af897b6d5a45fce26d11803`;
const CIUDAD = 'Bucaramanga';

// el codgo anda cuanda la pagina carga completamente
document.addEventListener('DOMContentLoaded', () => {

    const formularioRuta = document.getElementById('formulario-ruta');
    const contenedorRutas = document.getElementById('contenedor-rutas');
    const infoClima = document.getElementById('info-clima');

    
    let rutas = JSON.parse(localStorage.getItem('rutas_kids')) || [];

    
    if (rutas.length === 0) {
        rutas = [
            { id: 1, nombre: 'Ruta Norte', conductor: 'Juan Pérez', hora: '06:00', estudiantes: ['Ana Sofía', 'Mateo López'] },
            { id: 2, nombre: 'Ruta Sur', conductor: 'María García', hora: '06:30', estudiantes: ['Carlos Ruiz', 'Lucía Torres'] },
            { id: 3, nombre: 'Ruta Centro', conductor: 'Roberto Sosa', hora: '07:00', estudiantes: ['Elena Mar', 'Diego Beltrán'] }
        ];
        localStorage.setItem('rutas_kids', JSON.stringify(rutas));
    }

    
    const navRutas = document.getElementById('nav-rutas');
    const navEstudiantes = document.getElementById('nav-estudiantes');
    const navConductores = document.getElementById('nav-conductores');
    const navRutasNorte = document.getElementById('nav-rutas-norte');
    const navRutasSur = document.getElementById('nav-rutas-sur');
    const RutasCentro = document.getElementById('nav-rutas-centro');


    const vistaRutas = document.getElementById('vista-rutas');
    const vistaEstudiantes = document.getElementById('vista-estudiantes');
    const vistaConductores = document.getElementById('vista-conductores');
    const vistaRutasNorte = document.getElementById('vista-rutas-norte');
    const vistaRutasSur = document.getElementById('vista-rutas-sur');
    const vistaRutasCentro = document.getElementById('vista-rutas-centro');



    const contenedorTodosEstudiantes = document.getElementById('contenedor-todos-estudiantes');
    const contenedorTodosConductores = document.getElementById('contenedor-todos-conductores');

    // cambiar entre las pestañas de rutas, estudiantes y conductores
    const cambiarVista = (vistaActiva, btnActivo) => {
        [vistaRutas, vistaEstudiantes, vistaConductores, vistaRutasNorte, vistaRutasSur, vistaRutasCentro].forEach(v => {
            if (v) { v.classList.remove('vista-activa'); v.classList.add('vista-oculta'); }
        });
        [navRutas, navEstudiantes, navConductores, navRutasNorte, navRutasSur, RutasCentro].forEach(b => {
            if (b) b.classList.remove('activo');
        });

        if (vistaActiva) { vistaActiva.classList.remove('vista-oculta'); vistaActiva.classList.add('vista-activa'); }
        if (btnActivo) btnActivo.classList.add('activo');
    };

    // Configuracion los botones de navegación 
    navRutas.addEventListener('click', () => cambiarVista(vistaRutas, navRutas));
    
    navEstudiantes.addEventListener('click', () => {
        cambiarVista(vistaEstudiantes, navEstudiantes);
        renderizarDirectorios(); // Actualiza la lista de nombres
    });

    navConductores.addEventListener('click', () => {
        cambiarVista(vistaConductores, navConductores); // Cambia a la pestaña de conductores
        renderizarDirectorios(); // Actualiza la lista de nombres
    });
    if (navRutasNorte) navRutasNorte.addEventListener('click', () => cambiarVista(vistaRutasNorte, navRutasNorte));
    if (navRutasSur) navRutasSur.addEventListener('click', () => cambiarVista(vistaRutasSur, navRutasSur));
    if (RutasCentro) RutasCentro.addEventListener('click', () => cambiarVista(vistaRutasCentro, RutasCentro));

    
    const filtroEstudiantes = document.getElementById('filtro-ruta-estudiantes');
    if (filtroEstudiantes) {
        filtroEstudiantes.addEventListener('change', (e) => {
            renderizarDirectorios(e.target.value);
        });
    }

    const renderizarDirectorios = (filtro = 'Todas') => {
        if (!contenedorTodosEstudiantes || !contenedorTodosConductores) return;

        
        let todosEstudiantes = rutas.flatMap(r => r.estudiantes.map(e => ({ nombre: e, ruta: r.nombre })));

        // filtro 
        if (filtro !== 'Todas') {
            todosEstudiantes = todosEstudiantes.filter(e => e.ruta === filtro);
        }

        if (todosEstudiantes.length === 0) {
            contenedorTodosEstudiantes.innerHTML = '<p class="item-vacio">No hay estudiantes registrados en ninguna ruta.</p>';
        } else {
            contenedorTodosEstudiantes.innerHTML = todosEstudiantes.map(e => `<div class="item-lista-simple">🎓 <strong>${e.nombre}</strong> <span style="margin-left:auto; font-size:0.85em; color:gray;">Ruta: ${e.ruta}</span></div>`).join('');
        }

        ///////////////////// Conductores
        const todosConductores = rutas.map(r => ({ nombre: r.conductor, ruta: r.nombre }));
        if (todosConductores.length === 0) {
            contenedorTodosConductores.innerHTML = '<p class="item-vacio">No hay conductores registrados.</p>';
        } else {
            contenedorTodosConductores.innerHTML = todosConductores.map(c => `<div class="item-lista-simple"><strong>${c.nombre}</strong> <span style="margin-left:auto; font-size:0.85em; color:gray;">Ruta: ${c.ruta}</span></div>`).join('');
        }
    };

    const guardarEnLocalStorage = () => {
        localStorage.setItem('rutas_kids', JSON.stringify(rutas));
    };

    const btnModoOscuro = document.getElementById('btn-modo-oscuro');

    // si ya habia activo el modo oscuro se deja 

    // Recordar al cargar
    if (localStorage.getItem('modo-oscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
        if (btnModoOscuro) btnModoOscuro.textContent = '☀️ Modo Claro';
    }

    // Config el botón que cambia entre  claro y oscuro
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener('click', () => {
            document.body.classList.toggle('modo-oscuro');
            const estaOscuro = document.body.classList.contains('modo-oscuro');
            localStorage.setItem('modo-oscuro', estaOscuro);
            btnModoOscuro.textContent = estaOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        });
    }

     // la api ,el clima 
     const obtenerClima = async () => {
        try {
            const respuesta = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CIUDAD}&appid=${API_KEY}&units=metric&lang=es`);
            const datos = await respuesta.json();
            if (infoClima) {
                // Ícono del clima desde OpenWeather
                const iconoCodigo = datos.weather[0].icon;
                const urlIcono = `https://openweathermap.org/img/wn/${iconoCodigo}.png`;
                infoClima.innerHTML = `
                    <img src="${urlIcono}" alt="clima" class="icono-clima">
                    <span>${CIUDAD}: ${datos.main.temp}°C, ${datos.weather[0].description}</span>
                `;
            }
        } catch (error) {
            if (infoClima) infoClima.textContent = 'Clima no disponible';
        }
    };

    // Validaciónes
    
    const mostrarError = (idInput, mensaje) => {
        const input = document.getElementById(idInput);
        const existente = input.parentElement.querySelector('.mensaje-error');
        if (existente) existente.remove();

        const span = document.createElement('span');
        span.className = 'mensaje-error';
        span.textContent = mensaje;
        input.parentElement.appendChild(span);
        input.classList.add('input-error');
    };

    const limpiarErrores = () => {
        document.querySelectorAll('.mensaje-error').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    };

    const validarFormulario = (nombre, conductor, hora) => {
        let valido = true;

        if (!nombre) {
            mostrarError('nombreRuta', 'El nombre de la ruta es obligatorio.');
            valido = false;
        } else if (rutas.some(r => r.nombre.toLowerCase() === nombre.toLowerCase())) {
            mostrarError('nombreRuta', 'Ya existe una ruta con ese nombre.');
            valido = false;
        }

        if (!conductor) {
            mostrarError('nombreConductor', 'El nombre del conductor es obligatorio.');
            valido = false;
        }

        if (!hora) {
            mostrarError('horaSalida', 'La hora de salida es obligatoria.');
            valido = false;
        }

        return valido;
    };

    // 
    //guarda la ruta 
    formularioRuta.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();

        const nombre    = document.getElementById('nombreRuta').value.trim();
        const conductor = document.getElementById('nombreConductor').value.trim();
        const hora      = document.getElementById('horaSalida').value;

        if (!validarFormulario(nombre, conductor, hora)) return;

        const nuevaRuta = {
            id: Date.now(),
            nombre,
            conductor,
            hora,
            estudiantes: []
        };

        rutas.push(nuevaRuta);
        guardarEnLocalStorage();
        renderizarRutas();
        formularioRuta.reset();
        limpiarErrores();

        const evento = new CustomEvent('rutaAgregada', { detail: nuevaRuta });
        document.dispatchEvent(evento);
    });

    // ruta creada con exito
    document.addEventListener('rutaAgregada', (e) => {
        console.log('Sistema: Nueva ruta creada:', e.detail.nombre);
    });

    // ///////////////////////////////////////////////////////////////////////////////////
    const renderizarRutas = () => {
        contenedorRutas.replaceChildren();
        rutas.forEach(ruta => {
            const tarjeta = document.createElement('tarjeta-ruta');
            tarjeta.datoRuta = ruta;

            // 

            tarjeta.addEventListener('eliminar-ruta', (e) => {
                rutas = rutas.filter(r => r.id != e.detail.id);
                guardarEnLocalStorage();
                renderizarRutas();
            });

            // Agregar estudiante desde la tarjeta
            tarjeta.addEventListener('agregar-estudiante-inline', (e) => {
                const { id, nombre } = e.detail;
                const indiceRuta = rutas.findIndex(r => r.id == id);
                rutas[indiceRuta].estudiantes.push(nombre);
                guardarEnLocalStorage();
                renderizarRutas();
            });

            // editar el nombre de un niño que ya está en la ruta
            tarjeta.addEventListener('editar-estudiante', (e) => {
                const { id, indice, nombre } = e.detail;
                const ruta = rutas.find(r => r.id == id);
                if (nombre !== undefined) {
                    ruta.estudiantes[indice] = nombre;
                    guardarEnLocalStorage();
                    renderizarRutas();
                }
            });

            
            tarjeta.addEventListener('eliminar-estudiante', (e) => {
                const { id, indice } = e.detail;
                const ruta = rutas.find(r => r.id == id);
                if (ruta) {
                    ruta.estudiantes.splice(indice, 1);
                    guardarEnLocalStorage();
                    renderizarRutas();
                }
            });

           
            tarjeta.addEventListener('editar-ruta-inline', (e) => {
                const { id, nuevoNombre, nuevoConductor } = e.detail;
                const ruta = rutas.find(r => r.id == id);

                if (!ruta) return;

               
                if (rutas.some(r => r.id != id && r.nombre.toLowerCase() === nuevoNombre.toLowerCase())) {
                    alert('Ya existe una ruta con ese nombre.');
                    
                    return;
                }

                ruta.nombre = nuevoNombre;
                ruta.conductor = nuevoConductor;

                guardarEnLocalStorage();
                renderizarRutas();
            });

            contenedorRutas.appendChild(tarjeta); // pone la tarjeta terminada 
        });
    };

    
    obtenerClima();
    renderizarRutas();
});



















//git checkout -b nombre-de-tu-rama
//git push -u origin nombre-de-tu-rama//