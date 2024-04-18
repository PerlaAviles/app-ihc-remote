window.innerWidth = 800;
window.innerHeight = 600;

let recognition; // Variable para almacenar el objeto de reconocimiento de voz
let restartInterval; 

function startRecording() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'es-ES';
    const ordenIdentificada = document.getElementById('ordenIdentificada');
    recognition.onresult = function (event) {
        // Trae la información de todo lo que estuve hablando
        const transcript = event.results[0][0].transcript;
        if (transcript.toLowerCase().includes('comandos')) {

            ordenIdentificada.textContent = "Orden Identificada: " + transcript;

            // Verificar diferentes instrucciones reconocidas por voz usando switch
            switch (true) {
                case transcript.toLowerCase().includes('abre una ventana nueva'):
                    // Abre una nueva pestaña
                    enviarDatosAMockAPI('Abre una ventana nueva');
                    window.open('about:blank', '_blank');
                    break;
                case transcript.toLowerCase().includes('abre la página del tec'):
                    // Abre la página del tec en una nueva ventana
                    window.open('https://www.tecnm.mx/', '_blank');
                    enviarDatosAMockAPI('Abre la página del tec');
                    break;
                case transcript.toLowerCase().includes('cambia dimensiones de la ventana'):
                    enviarDatosAMockAPI('Cambia dimensiones de la ventana').then(() => {
                        setTimeout(function () {
                            // Obtener la URL actual
                            const urlActual = window.location.href;
                            // Abrir una nueva ventana con la misma URL y dimensiones deseadas
                            const nuevaVentana = window.open(urlActual, '', 'width=800,height=600');
                            if (nuevaVentana) {
                                // Cerrar la ventana actual
                                window.close();
                            }
                        }, 1000); // 1000 milisegundos = 1 segundo
                    });
                    break;
                case transcript.toLowerCase().includes('cierra esta ventana'):
                    enviarDatosAMockAPI('Cierra esta ventana').then(() => {
                        setTimeout(function () {
                            window.open('', '_self', '');
                            window.close();
                        }, 1000); // 1000 milisegundos = 1 segundo
                    });
                    break;
                case transcript.toLowerCase().includes('dime la hora actual'):
                    // Obtiene la hora actual
                    enviarDatosAMockAPI('Hora actual');
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
                case transcript.toLowerCase().includes('consultar clima'):
                    enviarDatosAMockAPI('Consultar clima');
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
    };

    recognition.onerror = function (event) {
        console.error('Error en el reconocimiento de voz: ', event.error);
    }

    recognition.start();

    // Reinicia la grabación cada 5 segundos
    restartInterval = setInterval(function () {
        recognition.start();
    }, 2000);
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
        clearInterval(restartInterval); // Detiene el intervalo de reinicio
    }
}

function obtenerFechaHoraActual() {
    return new Date().toLocaleString();
}

// Función para enviar datos a MockAPI
function enviarDatosAMockAPI(instruccion) {
    const fechaHoraActual = obtenerFechaHoraActual();

    // Datos a enviar en la solicitud POST
    const datos = {
        comando: comando,
        fecha: fechaHoraActual
    };

    // Opciones de la solicitud
    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    };

    // URL de MockAPI
    const urlMockAPI = 'https://65ef77c3ead08fa78a507bac.mockapi.io/webappvoice';

    // Enviar la solicitud POST
    return fetch(urlMockAPI, opciones)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud POST a MockAPI');
            }
            return response.json();
        })
        .then(data => {
            console.log('Registro exitoso en MockAPI:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
