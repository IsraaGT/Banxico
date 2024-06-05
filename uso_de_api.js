async function convertirMoneda() {
    const cantidad = document.getElementById('cantidad').value;
    const monedaOrigen = "USD";
    const monedaDestino = "MXN";

    if (monedaOrigen === monedaDestino) {
        document.getElementById('resultado').innerText = `${cantidad} ${monedaOrigen} equivale a ${cantidad} ${monedaDestino}`;
        return;
    }

    try {
        const token = 'a5305d3be15956a45586ed89c5b79db3b167b5bd645908e22c214cc40d94ad48';  // Tu token de Banxico
        const response = await fetch(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=${token}`);
        
        if (!response.ok) {
            throw new Error('Error en la solicitud de tipo de cambio');
        }

        const data = await response.json();
        console.log('Respuesta completa de la API:', data);  // Imprime la respuesta de la API para verificar los datos

        const series = data.bmx.series;
        let tasaCambio = 0;

        series.forEach(serie => {
            console.log(`Serie ID: ${serie.idSerie}, Dato: ${serie.datos[0]?.dato}`);  // Imprime los IDs y los datos de las series
            if (serie.idSerie === 'SF43718') {  // ID de la serie para USD a MXN
                tasaCambio = parseFloat(serie.datos[0]?.dato);
            }
        });

        console.log(`Tasa de cambio: ${tasaCambio}`);

        if (tasaCambio === 0) {
            throw new Error('No se encontró la tasa de cambio para USD a MXN.');
        }

        const resultado = cantidad * tasaCambio;

        document.getElementById('resultado').innerText = `${cantidad} ${monedaOrigen} equivale a ${resultado.toFixed(2)} ${monedaDestino}`;
    } catch (error) {
        console.error('Error al obtener las tasas de cambio:', error);
        document.getElementById('resultado').innerText = 'Error al obtener las tasas de cambio. Por favor, inténtalo de nuevo más tarde.';
    }
}
