document.addEventListener('DOMContentLoaded', () => {
    try {
        const tituloPrincipal = document.getElementById('tituloPrincipal');
        if (!tituloPrincipal) throw new Error(' "tituloPrincipal" no encontrado.');
        tituloPrincipal.innerHTML = '<img src="medios/logo.png" class="logo">';

    } catch (error) {
        console.error('Error al agregar título:', error);
    }

    try {
        const subtitulo = document.createElement('h2');
        subtitulo.textContent = 'Nuestros Productos';
        const subtituloContainer = document.getElementById('subtitulo');
        if (!subtituloContainer) throw new Error(' "subtitulo" no encontrado.');
        subtituloContainer.appendChild(subtitulo);
    } catch (error) {
        console.error('Error al agregar subtítulo:', error);
    }

    try {
        const elementosMenu = ['Inicio', 'Productos', 'Mi Carrito'];
        const menu = document.getElementsByTagName('ul')[0];
        if (!menu) throw new Error('Elemento no encontrado.');

        elementosMenu.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');

            if (item === 'Mi Carrito') {
                link.href = 'carrito.html';
                link.innerHTML = `
                    <i class="fas fa-shopping-cart"></i>
                    <span id="carritoCantidad" class="carrito-cantidad">0</span>
                `;
            } else {
                link.href = 'index.html';
                link.textContent = item;
            }

            li.appendChild(link);
            menu.appendChild(li);
        });
    } catch (error) {
        console.error('Error de menú:', error);
    }

    fetch('db/data.JSON')
        .then(response => response.json())
        .then(productos => {
            const listaProductos = document.getElementById('listaProductos');
            productos.forEach(producto => {
                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.className = 'tarjeta-producto';

                const img = document.createElement('img');
                img.src = producto.imagenUrl;
                tarjetaProducto.appendChild(img);

                const nombre = document.createElement('p');
                nombre.textContent = `${producto.nombre}`;
                tarjetaProducto.appendChild(nombre);

                const codigo = document.createElement('p');
                codigo.textContent = `Código: ${producto.codigo}`;
                tarjetaProducto.appendChild(codigo);

                const precio = document.createElement('p');
                precio.textContent = `Precio: $${producto.precio}`;
                tarjetaProducto.appendChild(precio);

                const cantidadEtiqueta = document.createElement('label');
                cantidadEtiqueta.textContent = '';
                tarjetaProducto.appendChild(cantidadEtiqueta);

                const cantidadInput = document.createElement('input');
                cantidadInput.type = 'number';
                cantidadInput.min = '1';
                cantidadInput.value = '1';
                cantidadInput.className = 'producto-cantidad';
                tarjetaProducto.appendChild(cantidadInput);

                const botonAgregar = document.createElement('button');
                botonAgregar.textContent = 'Agregar al carrito';
                botonAgregar.addEventListener('click', () => {
                    const cantidad = parseInt(cantidadInput.value);
                    agregarAlCarrito(producto, cantidad);

                    Swal.fire({
                        title: 'Producto agregado!',
                        text: `${producto.nombre} se ha agregado al carrito.`,
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                });

                tarjetaProducto.appendChild(botonAgregar);

                listaProductos.appendChild(tarjetaProducto);
            });
        });

    const itemsCarrito = document.getElementById('itemsCarrito');
    const precioTotalElemento = document.getElementById('precioTotal');

    const cargarItemsCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        itemsCarrito.innerHTML = '';
        let precioTotal = 0;
        let cantidadTotal = 0;
        carrito.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;
            itemsCarrito.appendChild(li);
            precioTotal += item.precio * item.cantidad;
            cantidadTotal += item.cantidad;
        });
        precioTotalElemento.textContent = `Total: $${precioTotal}`;

        const carritoCantidad = document.getElementById('carritoCantidad');
        if (carritoCantidad) {
            carritoCantidad.textContent = cantidadTotal;
        }
    };

    const agregarAlCarrito = (producto, cantidad) => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const indiceProductoExistente = carrito.findIndex(item => item.codigo === producto.codigo);
        if (indiceProductoExistente !== -1) {
            carrito[indiceProductoExistente].cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarItemsCarrito();
    };

    cargarItemsCarrito();
});
