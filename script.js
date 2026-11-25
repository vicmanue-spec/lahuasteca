// ⚠️ CONFIGURACIÓN: Deja este número o cámbialo por el teléfono real de tu local
const TELEFONO_WHATSAPP = "525564282498";

const formularioPedido = document.getElementById('manejador-pedido-whatsapp');
const campoNotasPedido = document.getElementById('id-notas');

formularioPedido.addEventListener('change', function(e) {
    if (!e.target.matches('.producto-checkbox')) {
        return;
    }

    const tarjetaProducto = e.target.closest('.producto-pedido');
    const campoCantidad = tarjetaProducto.querySelector('.cantidad-producto');
    campoCantidad.disabled = !e.target.checked;

    if (e.target.id === 'producto-otro') {
        campoNotasPedido.required = e.target.checked;
    }

    if (!e.target.checked) {
        campoCantidad.value = '';
    }
});

function formatearCantidadKilos(cantidad) {
    const cuartos = Math.round(cantidad * 4);
    const kilosEnteros = Math.floor(cuartos / 4);
    const resto = cuartos % 4;
    const fracciones = {
        1: '1/4',
        2: '1/2',
        3: '3/4'
    };

    if (resto === 0) {
        return `${kilosEnteros} kg`;
    }

    const cantidadFormateada = kilosEnteros > 0
        ? `${kilosEnteros} ${fracciones[resto]}`
        : fracciones[resto];

    return `${cantidadFormateada} kg`;
}

formularioPedido.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombreCliente = document.getElementById('id-nombre').value;
    const horaRecogida = document.getElementById('id-hora').value;
    const metodoPago = document.getElementById('id-pago').value;

    const productosSeleccionados = Array.from(
        formularioPedido.querySelectorAll('.producto-checkbox:checked')
    );

    if (productosSeleccionados.length === 0) {
        alert('Selecciona al menos un producto para armar tu pedido.');
        return;
    }

    const desgloseDeOrden = productosSeleccionados.map((producto) => {
        const campoCantidad = producto.closest('.producto-pedido').querySelector('.cantidad-producto');
        return `• ${producto.value}: ${formatearCantidadKilos(campoCantidad.valueAsNumber)}`;
    }).join('\n');
    const notas = campoNotasPedido.value.trim();

    const mensajeEstructurado = `🥩 *PEDIDO - CARNICERÍA LA HUASTECA* 🥩\n\n` +
                                `👤 *Cliente:* ${nombreCliente.trim().toUpperCase()}\n` +
                                `⏰ *Hora de recogida:* ${horaRecogida}\n` +
                                `💳 *Método de pago:* ${metodoPago}\n\n` +
                                `🛒 *PRODUCTOS:*\n${desgloseDeOrden}\n\n` +
                                (notas ? `📝 *Notas:* ${notas}\n\n` : '') +
                                `Por favor, confírmame la disponibilidad de los productos seleccionados.\n\n` +
                                `_¡Gracias por tu preferencia!_`;

    const urlDestinoFinal = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensajeEstructurado)}`;
    window.open(urlDestinoFinal, '_blank');
});