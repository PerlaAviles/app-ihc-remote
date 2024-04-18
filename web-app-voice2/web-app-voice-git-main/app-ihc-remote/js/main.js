let ultimoDatoAnterior = null; // Variable para almacenar el último dato anterior
setInterval(recibirDatos, 2000);


async function recibirDatos() {
    try {
        // Opciones de la solicitud
        const opciones = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const url = 'https://65ef77c3ead08fa78a507bac.mockapi.io/webappvoice';
        // Recibir los datos de la URL proporcionada
        const response = await fetch(url, opciones);

        if (!response.ok) {
            throw new Error('Error en la solicitud GET a la URL');
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        // Arreglo
        datosRecibidos = data;
        // Último dígito del arreglo
        const ultimoDato = datosRecibidos.pop();
        console.log('Último dato:', ultimoDato);

        // Verifica si el último dato ha cambiado
        if (!esIgual(ultimoDato, ultimoDatoAnterior)) {
            // Sustitución en los párrafos
            const parrafoOrdenRecibida = document.getElementById('OrdenRecibida');
            parrafoOrdenRecibida.textContent = ultimoDato.comando;
            const parrafoHora = document.getElementById('Hora');
            parrafoHora.textContent = ultimoDato.fecha;
            // Llama a la función para manejar las acciones basadas en el último dato
            manejarAccion(ultimoDato);
            // Actualiza el valor del último dato anterior
            ultimoDatoAnterior = ultimoDato;
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

function esIgual(objA, objB) {
    return JSON.stringify(objA) === JSON.stringify(objB);
}

function manejarAccion(ultimoDato) {
    switch (ultimoDato.comando.toLowerCase()) {
        case 'abre una ventana nueva':
            // Abre una nueva pestaña
            window.open('about:blank', '_blank');
            break;
        case 'abre la página del tec':
            // Abre la página del tec en una nueva ventana
            window.open('https://www.tecnm.mx/', '_blank');
            break;
        case 'cambia dimensiones de la ventana':
            const urlActual = window.location.href;
            // Verifica si ya se abrió una ventana en esta iteración
            if (!ventanaAbierta) {
                // Abrir una nueva ventana con las dimensiones deseadas
                const nuevaVentana = window.open(urlActual, '', 'width=800,height=600');
                if (nuevaVentana) {
                    // Marcar que se ha abierto una ventana
                    ventanaAbierta = true;
                }
            }
            break;
        case 'cierra esta ventana':
            // Cierra la ventana actual
            window.open('', '_self', '');
            window.close();
            break;
        case 'hora actual':
            // Obtiene la hora actual
            var fecha = new Date();
            var hora = fecha.getHours();
            var minutos = fecha.getMinutes();
            // Convierte la hora en formato legible
            var horaLegible = hora + ":" + (minutos < 10 ? '0' : '') + minutos;
            // Utiliza la API de Text-to-Speech para decir la hora
            var synth = window.speechSynthesis;
            var utterance = new SpeechSynthesisUtterance("La hora actual es " + horaLegible);
            synth.speak(utterance);
            break;
        case 'consultar clima':
            var ciudad = prompt("Por favor, ingresa la ciudad para buscar el clima en Google:");
            if (ciudad) {
                var urlGoogleClima = 'https://www.google.com/search?q=clima+' + ciudad;
                window.open(urlGoogleClima, '_blank');
            } else {
                alert("Debes ingresar una ciudad para buscar el clima.");
            }
            break;
        default:
            // Instrucción no reconocida
            console.log('Instrucción no reconocida');
    }
}


