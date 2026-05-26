
const plantilla = document.createElement('template');
plantilla.innerHTML = `
    <link rel="stylesheet" href="style.css">
    <div class="contenedor-tarjeta-ruta">
        <div class="encabezado-tarjeta">
            <h3 id="t-nombre"></h3>
            <span id="t-hora"></span>
        </div>
        <div class="contenido-tarjeta">
            <img src="https://i.pinimg.com/1200x/6b/23/8a/6b238a7c0361534c6c428c38c9c83831.jpg" alt="Ruta Escolar" class="imagen-ruta-card">
            <p><strong>Conductor:</strong> <span id="t-conductor"></span></p>
            <div>
                <strong>Estudiantes:</strong>
                <ul class="lista-estudiantes" id="t-estudiantes"></ul>
            </div>

            <!-- Este es el cuadrito oculto que aparece para agregar o editar un niño -->
            <div class="formulario-inline" id="formulario-inline" style="display:none;">
                <input type="text" class="input-inline" id="input-estudiante" placeholder="Nombre del estudiante">
                <div class="acciones-inline">
                    <button class="btn-confirmar-inline" id="btn-confirmar">Guardar</button>
                    <button class="btn-cancelar-inline" id="btn-cancelar">Cancelar</button>
                </div>
            </div>

            <!-- Este es el cuadrito oculto para cambiar el nombre de la ruta o del conductor -->
            <div class="formulario-inline" id="formulario-inline-ruta" style="display:none;">
                <input type="text" class="input-inline" id="input-nombre-ruta" placeholder="Nuevo nombre de la ruta">
                <input type="text" class="input-inline" id="input-conductor-ruta" placeholder="Nuevo nombre del conductor">
                <div class="acciones-inline">
                    <button class="btn-confirmar-inline" id="btn-confirmar-ruta">Guardar</button>
                    <button class="btn-cancelar-inline" id="btn-cancelar-ruta">Cancelar</button>
                </div>
            </div>

        </div>
        <!-- Los botones principales de cada tarjeta -->
        <div class="acciones-tarjeta">
            <button class="btn-agregar-estudiante" id="agregar-estudiante">+ Asignar Estudiante</button>
            <button class="btn-editar-ruta" id="editar-ruta">✏️ Editar </button>
            <button class="btn-eliminar-ruta" id="eliminar-ruta">🗑️ Eliminar</button>
        </div>
    </div>
`;



const obtenerEmojiHora = (hora) => {
    const horas = parseInt(hora.split(':')[0]);
    if (horas >= 5 && horas < 12)  return '🌅'; 
    if (horas >= 12 && horas < 22) return '☀️'; 
    return '🌙'; 
};

// 
class TarjetaRuta extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(plantilla.content.cloneNode(true));
        this._modoEdicionEstudiante = { type: null, index: null }; // Para editar estudiantes
        this._modoEdicionRuta = false; // Para editar  ruta
    }

    // Esto recibe los datos nombre, conductor, y los guarda en una variable int
    set datoRuta(datos) {
        this._datos = datos;
        this.renderizar();
    }

    _mostrarFormularioEdicionRuta() {
        const formulario = this.shadowRoot.getElementById('formulario-inline-ruta');
        const inputNombre = this.shadowRoot.getElementById('input-nombre-ruta');
        const inputConductor = this.shadowRoot.getElementById('input-conductor-ruta');

        inputNombre.value = this._datos.nombre;
        inputConductor.value = this._datos.conductor;
        formulario.style.display = 'flex';
        inputNombre.focus();
        this._modoEdicionRuta = true;
    }

    _ocultarFormularioEdicionRuta() {
        const formulario = this.shadowRoot.getElementById('formulario-inline-ruta');
        formulario.style.display = 'none';
        this.shadowRoot.getElementById('input-nombre-ruta').value = '';
        this.shadowRoot.getElementById('input-conductor-ruta').value = '';
        this._modoEdicionRuta = false;
    }

    _mostrarFormularioEstudiante(modo, valorInicial = '') {
        const formulario = this.shadowRoot.getElementById('formulario-inline');
        const input = this.shadowRoot.getElementById('input-estudiante');
        this._modoEdicionEstudiante = { type: modo.type || modo, index: modo.index !== undefined ? modo.index : null };
        input.value = valorInicial;
        formulario.style.display = 'flex';
        input.focus();
    }

    _ocultarFormularioEstudiante() {
        const formulario = this.shadowRoot.getElementById('formulario-inline');
        const input = this.shadowRoot.getElementById('input-estudiante');
        formulario.style.display = 'none';
        input.value = '';
        this._modoEdicionEstudiante = { type: null, index: null };
    }

    // llena con informacion real los espacios
    renderizar() {
        if (!this._datos) return;
        const { id, nombre, conductor, hora, estudiantes } = this._datos;

        const emoji = obtenerEmojiHora(hora);

        // Pone el emoji y el nombre de la ruta en el encabezado de la tarjeta
        this.shadowRoot.getElementById('t-nombre').textContent = `${emoji} ${nombre}`;
        this.shadowRoot.getElementById('t-conductor').textContent = conductor;
        this.shadowRoot.getElementById('t-hora').textContent = `Salida: ${hora}`;

        const lista = this.shadowRoot.getElementById('t-estudiantes');
        lista.replaceChildren();

        // Si no hay niños mostrar mensaje que diga "Sin estudiantes"
        if (estudiantes.length === 0) {
            const sinEstudiantes = document.createElement('li');
            sinEstudiantes.className = 'item-estudiante item-vacio';
            sinEstudiantes.textContent = 'Sin estudiantes';
            lista.appendChild(sinEstudiantes);
        }

        // estudiante: borrar ,editar 
        estudiantes.forEach((estudiante, indice) => {
            const li = document.createElement('li');
            li.className = 'item-estudiante';

            const span = document.createElement('span');
            span.textContent = estudiante;

            const btnEditar = document.createElement('button');
            btnEditar.textContent = '✏️';
            btnEditar.className = 'btn-editar-estudiante';
            btnEditar.title = 'Editar estudiante';
            btnEditar.onclick = () => this._mostrarFormularioEstudiante({ type: 'edit', index: indice }, estudiante);

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑️';
            btnEliminar.className = 'btn-eliminar-estudiante';
            btnEliminar.title = 'Eliminar estudiante';
            btnEliminar.onclick = () => {
                this.dispatchEvent(new CustomEvent('eliminar-estudiante', {
                    detail: { id, indice },
                    bubbles: true,
                    composed: true
                }));
            };

            li.appendChild(span);
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            lista.appendChild(li);
        });

        // Botón de guardar para el cuadrito de agregar o editar estudiante
        this.shadowRoot.getElementById('btn-confirmar').onclick = () => {
            const valor = this.shadowRoot.getElementById('input-estudiante').value.trim();
            if (!valor) return;

            if (this._modoEdicionEstudiante.type === 'new') {
                this.dispatchEvent(new CustomEvent('agregar-estudiante-inline', {
                    detail: { id, nombre: valor },
                    bubbles: true,
                    composed: true
                }));
            } else if (this._modoEdicionEstudiante.type === 'edit' && this._modoEdicionEstudiante.index !== null) {
                this.dispatchEvent(new CustomEvent('editar-estudiante', {
                    detail: { id, indice: this._modoEdicionEstudiante.index, nombre: valor },
                    bubbles: true,
                    composed: true
                }));
            }
            this._ocultarFormularioEstudiante();
        };

        // Botón para cerrar el cuadro 
        this.shadowRoot.getElementById('btn-cancelar').onclick = () => {
            this._ocultarFormularioEstudiante();
        };

       // Botón verde de la tarjeta para abrir el cuadrito de "Asignar Estudiante"
        this.shadowRoot.getElementById('agregar-estudiante').onclick = () => {
            this._ocultarFormularioEdicionRuta(); // Ocultar formulario de ruta si está abierto
            this._mostrarFormularioEstudiante({ type: 'new' });
        };

        // Botón naranja de la tarjeta para abrir el cuadro de "Editar Ruta"
        this.shadowRoot.getElementById('editar-ruta').onclick = () => {
            this._ocultarFormularioEstudiante(); // Ocultar formulario de estudiante si está abierto
            this._mostrarFormularioEdicionRuta();
        };

        // Botón de guardar para el cuadrito de editar ruta
        this.shadowRoot.getElementById('btn-confirmar-ruta').onclick = () => {
            const nuevoNombre = this.shadowRoot.getElementById('input-nombre-ruta').value.trim();
            const nuevoConductor = this.shadowRoot.getElementById('input-conductor-ruta').value.trim();

            if (!nuevoNombre || !nuevoConductor) {
                alert('El nombre y el conductor no pueden estar vacíos.'); // Validación 
                return;
            }

            this.dispatchEvent(new CustomEvent('editar-ruta-inline', {
                detail: { id, nuevoNombre, nuevoConductor },
                bubbles: true,
                composed: true
            }));
            this._ocultarFormularioEdicionRuta();
        };

        this.shadowRoot.getElementById('btn-cancelar-ruta').onclick = () => {
            this._ocultarFormularioEdicionRuta();
        };

        // Botón rojo para borrar toda la tarjeta
        this.shadowRoot.getElementById('eliminar-ruta').onclick = () => {
            this.dispatchEvent(new CustomEvent('eliminar-ruta', {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        };
    }
}

// Registra tarjeta personalizada para que el navegador la reconozca
customElements.define('tarjeta-ruta', TarjetaRuta);