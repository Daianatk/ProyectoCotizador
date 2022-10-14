//Variables informativas
let productos = [];
let usuario;

//Variables para autentificacion de usuario
let formularioIdentificacion;
let contenedorIdentificacion;
let contenedorUsuario;
let textoUsuario;
let limpiarStorage;

//Variables para el formulario
let modalCotizarProducto;
let agregarProducto;
let formularioCotizador;
let inputTelefonoProducto;
let inputNombreProducto;
let inputCantidadProducto;
let inputPrecioProducto;
let contenedorProductos;
let btnCerrarModal;
let modal;

class Producto {
    constructor(id, telefono, nombre, cantidad, precio) {
        this.id = id;
        this.telefono = telefono;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
    }
}

function inicializarElementos() {
    formularioIdentificacion = document.getElementById("formularioIdentificacion");
    inputClienteProducto = document.getElementById("inputClienteProducto");
    contenedorIdentificacion = document.getElementById("contenedorIdentificacion")
    contenedorUsuario = document.getElementById("contenedorUsuario");
    textoUsuario = document.getElementById("textoUsuario");
    limpiarStorage = document.getElementById("limpiarStorage");
    formularioCotizador = document.getElementById("formularioCotizador");
    inputTelefonoProducto = document.getElementById("inputTelefonoProducto");
    inputNombreProducto = document.getElementById("inputNombreProducto");
    inputCantidadProducto = document.getElementById("inputCantidadProducto");
    inputPrecioProducto = document.getElementById("inputPrecioProducto");
    image = document.getElementById("image");
    contenedorProductos = document.getElementById("contenedorProductos");
    btnCerrarModal = document.getElementById("btnCerrarModal");
    agregarProducto = document.getElementById("agregarProducto");
    modalCotizarProducto = document.getElementById("modalCotizarProducto")
    modal = new bootstrap.Modal(modalCotizarProducto);
}

function inicializarEventos() {
    formularioCotizador.onsubmit = (event) => validarFormulario(event);
    formularioIdentificacion.onsubmit = (event) => identificarUsuario(event);
    limpiarStorage.onclick = eliminarStorage;
    agregarProducto.onclick = abrirModalCotizarProducto;
    btnCerrarModal.onclick = cerrarModalCotizarProducto;
}

function abrirModalCotizarProducto() {
    usuario ? modal.show() : mostrarAlert1()

    function mostrarAlert1() {
        Swal.fire({
            text: 'Identifiquese antes de agregar una cotización',
            icon: 'info',
            confirmButtonText: ' OK '
        })

    }
}

function cerrarModalCotizarProducto() {
    formularioCotizador.reset()
    modal.hide()
}

function eliminarStorage() {
    localStorage.clear();
    usuario = "";
    productos = [];

    mostrarFormularioIdentificacion();
    pintarProductos();
    mostrarAlert2();

    function mostrarAlert2() {
        Swal.fire({
            text: 'Se limpio el storage correctamente',
            icon: 'success',
            confirmButtonText: ' LISTO '
        })
    }
}

function identificarUsuario(event) {
    event.preventDefault();
    usuario = inputClienteProducto.value;
    formularioIdentificacion.reset();
    actualizarUsuarioStorage();
    mostrarTextoUsuario();
    mostrarToast1();

    function mostrarToast1() {
        Toastify({
            text: "Se agregó tu nombre correctamente",
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
            },
            onClick: function () {} // Callback after click
        }).showToast();
    }
}

function mostrarTextoUsuario() {
    contenedorIdentificacion.hidden = true;
    contenedorUsuario.hidden = false;
    textoUsuario.innerHTML += ` ${usuario}`;
}

function mostrarFormularioIdentificacion() {
    contenedorIdentificacion.hidden = false;
    contenedorUsuario.hidden = true;
    textoUsuario.innerHTML = ``;
}

function validarFormulario(event) {
    event.preventDefault();
    if (usuario) {
        let id = inputIdClienteProducto.value;
        let telefono = inputTelefonoProducto.value;
        let nombre = inputNombreProducto.value;
        let cantidad = parseInt(inputCantidadProducto.value);
        let precio = parseFloat(inputPrecioProducto.value);

        const idExiste = productos.some((producto) => producto.id === id);
        if (!idExiste) {
            let producto = new Producto(
                id,
                telefono,
                nombre,
                cantidad,
                precio
            );

            productos.push(producto);
            formularioCotizador.reset();
            mostrarAlert3();

            function mostrarAlert3() {
                Swal.fire({
                    text: `Se agregó la cotización del producto ${nombre} exitosamente`,
                    icon: 'success',
                    confirmButtonText: ' LISTO '
                })
            }
            actualizarProductosStorage();
            pintarProductos();
        } else {
            mostrarAlert4();

            function mostrarAlert4() {
                Swal.fire({
                    text: 'El ID ya existe, por favor ingrese uno diferente',
                    icon: 'error',
                    confirmButtonText: ' OK '
                })
            }
        }
    } else {
        mostrarAlert5()

        function mostrarAlert5() {
            Swal.fire({
                text: 'Identifiquese antes de agregar un producto',
                icon: 'warning',
                confirmButtonText: ' OK '
            })
        }

    }
}

function confirmarEliminacion(id) {
    Swal.fire({
        icon: "question",
        title: "¿Estas seguro que quieres eliminar el producto?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarProducto(id);
        }
    });
}

function eliminarProducto(id) {
    eliminarProductoServer(id);
}

function pintarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
        let column = document.createElement("div");
        column.className = "col-md-3 mt-3";
        column.id = `columna-${producto.id}`;
        column.innerHTML = `
            <div class="card">
                <div class="card-body">
                <p class="card-text">ID:
                    <b>${producto.id}</b>
                </p>
                <p class="card-text">Telefono:
                <b>${producto.telefono}</b>
            </p>
                <p class="card-text">Producto:
                    <b>${producto.nombre}</b>
                </p>
                <p class="card-img">Imagen:
                <img class="img-fluid" src="${producto.imagen}">
                </p>
                <p class="card-text">Cantidad:
                    <b>${producto.cantidad}</b>
                </p>
                <p class="card-text">Precio:
                    <b>${producto.precio}</b>
                </p>
                <p class="card-text">Total:
                <b>${producto.cantidad*producto.precio*1.18}</b>
            </p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger" id="botonEliminar-${producto.id}" >Eliminar</button>
                </div>
            </div>`;

        contenedorProductos.append(column);

        let botonEliminar = document.getElementById(`botonEliminar-${producto.id}`);
        botonEliminar.onclick = () => eliminarProducto(producto.id);
    });
}

function actualizarProductosStorage() {
    let productosJSON = JSON.stringify(productos);
    localStorage.setItem("productos", productosJSON);
}

function actualizarUsuarioStorage() {
    localStorage.setItem("usuario", usuario);
}

function obtenerProductosStorage() {
    let productosJSON = localStorage.getItem("productos");
    if (productosJSON) {
        productos = JSON.parse(productosJSON);
        pintarProductos();
    }
}

function obtenerUsuarioStorage() {
    let usuarioAlmacenado = localStorage.getItem("usuario");
    if (usuarioAlmacenado) {
        usuario = usuarioAlmacenado;
        mostrarTextoUsuario();
    }
}

function mostrarMensajeConfirmacion(mensaje) {
    Toastify({
        text: mensaje,
        duration: 2000,
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(90deg, yellow 10%, orange 90%)",
        },
        onClick: function () {} // Callback after click
    }).showToast();
}

async function consultarProductosServer() {
    try {
        const response = await fetch(
            "https://6341e05120f1f9d7997b3667.mockapi.io/productos/productos"
        );
        const data = await response.json();
        productos = [...data];
        pintarProductos();
    } catch (error) {
        console.log(error);
    }
}

async function registrarProductoServer(producto) {
    try {
        const response = await fetch(
            "https://6341e05120f1f9d7997b3667.mockapi.io/productos/productos", {
                method: "POST",
                body: JSON.stringify(producto),
            }
        );
        console.log(response);

        productos.push(producto);
        formularioCotizador.reset();
        pintarProductos();
        mostrarMensajeConfirmacion(
            `El producto ${nombre} fue agregado exitosamente`,
            "info"
        );
    } catch (error) {
        console.log(error);
    }
}

async function eliminarProductoServer(productoId) {
    try {
        const response = await fetch(
            `https://6341e05120f1f9d7997b3667.mockapi.io/productos/productos${productoId}`, {
                method: "DELETE",
            }
        );

        console.log(response);

        let columnaBorrar = document.getElementById(`columna-${productoId}`);
        let indiceBorrar = productos.findIndex(
            (producto) => Number(producto.id) === Number(productoId)
        );

        let nombreProductoEliminado = productos[indiceBorrar].nombre;
        productos.splice(indiceBorrar, 1);
        columnaBorrar.remove();
        mostrarMensajeConfirmacion(
            `El producto ${nombreProductoEliminado} fue eliminado exitosamente`,
            "danger"
        );
    } catch (error) {
        console.log(error);
    }
}


function main() {
    inicializarElementos();
    inicializarEventos();
    consultarProductosServer();
    //obtenerProductosStorage();
    obtenerUsuarioStorage();
}

main();