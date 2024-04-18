// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Función para leer el último registro cada 2 segundos
    function leerUltimoRegistro() {
        // Hacer una solicitud GET a tu endpoint de MockAPI
        fetch('https://tu-mockapi.com/tu-endpoint')
            .then(response => response.json())
            .then(data => {
                // Obtener el último registro de la respuesta
                const ultimoRegistro = data[data.length - 1];
                // Actualizar el contenido en el span con id "orden"
                document.getElementById('orden').textContent = ultimoRegistro.contenido;
            })
            .catch(error => {
                console.error('Hubo un error al obtener los datos:', error);
            });
    }

    // Llamar a la función inicialmente
    leerUltimoRegistro();

    // Llamar a la función cada 2 segundos
    setInterval(leerUltimoRegistro, 2000);
});
