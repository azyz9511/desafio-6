const socket = io.connect();

// tabla productos
// ---------------------------------------------------------------------------------------------------------------------------------------
const formProductos = document.getElementById('formulario');
formProductos.addEventListener('submit',(e) => {
    e.preventDefault();

    const datos = {
        'id': formProductos[0].value,
        'title': formProductos[1].value,
        'price': formProductos[2].value,
        'thumbnail': formProductos[3].value
    }
    
    fetch('/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    formProductos.reset();

    socket.emit('guardar','guardado con exito');
    socket.on('historialGuardar', data => {
        console.log(data);
        if(data.length !== 0){
            render(data)
        }
    });

});


function render(data) {
    const table = `<tr><td colspan="3"><h2 class="text-center text-secondary">Productos</h2></td></tr>
                    <tr><th><h5>Nombre</h5></th><th><h5>Precio</h5></th><th><h5>Foto</h5></th></tr>`;
    const html = data
    .map((elem, index) => {
        return `<tr>
        <td>${elem.title}</td>
        <td>${elem.price}</td>
        <td><img width="50" src="${elem.thumbnail}"></td>
        </tr>`
    })
    .join(' ');
    const tableComplete = table + html;
    document.getElementById('productos').innerHTML = tableComplete;
}

socket.on('historialProductos', data => {
    if(data.length !== 0){
        render(data)
    }
});

// chat
// -----------------------------------------------------------------------------------------------------------------------------------------

function enviar(){
    const fyh = new Date();
    const mensaje = {
        email: document.getElementById('email').value,
        texto: document.getElementById('texto').value,
        fyh: `${fyh.getDate()}/${(fyh.getMonth() + 1)}/${fyh.getFullYear()} ${fyh.getHours()}:${fyh.getMinutes()}:${fyh.getSeconds()}`
    };
    socket.emit('nuevoMensaje', mensaje);
    socket.on('historialGlobal',data => {
        const html = data
        .map((elem, index) => {
            return `<div>
            <b style='color:blue;'>${elem.email}</b>
            <span style='color:brown'>[${elem.fyh}] : </span>
            <i style='color:green'>${elem.texto}</i>
            </div>`
        })
        .join(' ');
        document.getElementById('mensajes').innerHTML = html;
    });
    // return false;
}

socket.on('historialChat', data => {
    const html = data
        .map((elem, index) => {
            return `<div>
            <b style='color:blue;'>${elem.email}</b>
            <span style='color:brown'>[${elem.fyh}] : </span>
            <i style='color:green'>${elem.texto}</i>
            </div>`
        })
        .join(' ');
        document.getElementById('mensajes').innerHTML = html;
});