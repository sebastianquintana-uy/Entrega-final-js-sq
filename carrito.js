document.addEventListener('DOMContentLoaded', () => {
    const itemsCarrito = document.getElementById('itemsCarrito');
    const precioTotalElemento = document.getElementById('precioTotal');
    const botonVaciar = document.getElementById('vaciarCarrito');
    const botonComprar = document.getElementById('comprar');
    const botonVolver = document.getElementById('volver'); 

    const cargarItemsCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        itemsCarrito.innerHTML = '';
        let precioTotal = 0;

        if (carrito.length === 0) {
            itemsCarrito.innerHTML = '<li>El carrito está vacío.</li>';
        } else {
            carrito.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;
                itemsCarrito.appendChild(li);
                precioTotal += item.precio * item.cantidad;
            });
        }
        
        precioTotalElemento.textContent = `Total: $${precioTotal}`;
    };

    const vaciarCarrito = () => {
        localStorage.removeItem('carrito');
        cargarItemsCarrito();
        Swal.fire({
            title: 'Carrito vaciado!',
            text: 'El carrito ha sido vaciado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    };

    const comprar = () => {
        Swal.fire({
            title: 'Completa tus datos',
            html: `
                <input id="nombre" class="swal2-input" placeholder="Nombre">
                <input id="telefono" class="swal2-input" placeholder="Teléfono">
                <input id="direccion" class="swal2-input" placeholder="Dirección">
                <input id="correo" class="swal2-input" placeholder="Correo">
            `,
            confirmButtonText: 'Finalizar pedido',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const telefono = Swal.getPopup().querySelector('#telefono').value;
                const direccion = Swal.getPopup().querySelector('#direccion').value;
                const correo = Swal.getPopup().querySelector('#correo').value;
                
                if (!nombre || !telefono || !direccion || !correo) {
                    Swal.showValidationMessage('Por favor completa todos los campos.');
                    return false;
                }
                
                return { nombre, telefono, direccion, correo };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const numeroPedido = Math.floor(1000 + Math.random() * 9000);
                Swal.fire({
                    title: 'Compra realizada!',
                    text: `Gracias por tu compra. Tu número de pedido es ${numeroPedido}.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });

                localStorage.removeItem('carrito');
                cargarItemsCarrito();
            }
        });
    };

    const volverAlInicio = () => {
        window.location.href = 'index.html'; 
    };

    botonVaciar.addEventListener('click', vaciarCarrito);
    botonComprar.addEventListener('click', comprar);
    botonVolver.addEventListener('click', volverAlInicio); 

    cargarItemsCarrito();
});
