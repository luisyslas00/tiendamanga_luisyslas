$(document).ready(function(){
    //Llamo al archivo json en una variable
    const URLJSON = './app/productos.json';
    //Uso Ajax
    $.getJSON(URLJSON,function(mangas,estado){
        if(estado === 'success'){
            localStorage.setItem('stock', JSON.stringify(mangas));
            obtenerProductos();
            renderizarProductos(mangas);
            obtenerLocal();
        }
    })
});


//Creamos un array vacío para carrito y otro para los productos en stock

let carritoCompras = [];
let mangas = [];

//Obtener los productos

function obtenerProductos() {
    let stock = JSON.parse(localStorage.getItem('stock'))
    if(stock){
        stock.forEach(el => mangas.push(el))
    }
}

//Asignamos variables, llamando a los elementos del HTML

let contadorCarrito = parseInt($('#contadorCarrito').text()); //Contador Carrito
let precioTotal = parseInt($('#precioTotal').text());  //Precio Total

//Función para mostrar los productos en el HTML

function renderizarProductos(listaProductos){
    $('#contenedorProductos').empty()
    for (const producto of listaProductos) {
        $('#contenedorProductos').append(`  <div class="producto__contenedor">
                                                <h2>${producto.nombre}</h2>
                                                <div class="img__contenedor">
                                                    <img src=${producto.img}>
                                                </div>
                                                <div class="tomo__p">
                                                    <p>Tomo</p>
                                                    <p class="parrafo__tomos">${producto.tomo}</p>
                                                </div>
                                                <p>Autor: ${producto.autor}</p>
                                                <div class="contenedor__precio">
                                                    <p>$${producto.precio}</p>
                                                    <button id="boton${producto.id}" class="btn-agregar">
                                                        <i class="fa fa-cart-plus" aria-hidden="true"> AGREGAR</i>
                                                    </button>
                                                </div>
                                            </div>`)
        $(`#boton${producto.id}`).click(function(){
            agregarAlCarrito(producto.id);
            $('.productoAgregado').append(` <div class="contenedorProductoAgregado">
                                                <p>Su producto fue agregado correctamente!</p>
                                            </div>`)
            // ANIMACIÓN
            $('.contenedorProductoAgregado').fadeIn('slow').delay(2000).fadeOut('slow');
        })
    }
}

//Sección filtro por título

$('#filtroNombre').on('change',()=>{
    if($('#filtroNombre').val() == 'Todos'){
        renderizarProductos(mangas)
    }else{
        renderizarProductos(mangas.filter(el => el.nombre == $('#filtroNombre').val()))
    }
})

//Función agregar al Carrito

function agregarAlCarrito(id){
    let productoRepetido = carritoCompras.find(productoRep => productoRep.id == id);
    if(productoRepetido){
        productoRepetido.cantidad = productoRepetido.cantidad + 1;
        $(`#cantidad${productoRepetido.id}`).html(`cantidad: ${productoRepetido.cantidad}`)
        actualizarCarrito();
        guardarLocal();
    }else{
        let productoAgregar = mangas.find(item => item.id == id);
        carritoCompras.push(productoAgregar)
        productoAgregar.cantidad =1;
        actualizarCarrito();
        guardarLocal();
        $('#contenedorCarrito').append(`    <div class="productoEnCarrito">
                                                <div class="img-carrito">
                                                    <img src="${productoAgregar.img}">
                                                </div>
                                                <p class="tituloManga">${productoAgregar.nombre}</p>
                                                <p>Precio: $${productoAgregar.precio}</p>
                                                <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                                                <button id="eliminar${productoAgregar.id}" class="boton-eliminar">QUITAR</button>
                                            </div>`)
        /* BOTON ELIMINAR */                                        
        $(`#eliminar${productoAgregar.id}`).click(function(){
            $(this).parent().remove();
            carritoCompras = carritoCompras.filter(productoEliminado => productoEliminado.id != productoAgregar.id)
            actualizarCarrito();
            guardarLocal();
        })
    }
}

//Función actualizar el carrito, contador y el precio total

function actualizarCarrito(){
    contadorCarrito = carritoCompras.reduce((acumulador,elemento)=> acumulador + elemento.cantidad,0);
    $('#contadorCarrito').text(contadorCarrito)
    precioTotal = carritoCompras.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad),0);
    $('#precioTotal').text(precioTotal)
}

//Función para guardar en el localStorage

function guardarLocal (){
    const guardarMangas = JSON.stringify(carritoCompras)
    const guardarEnStorage = localStorage.setItem('Producto',guardarMangas)
}

//Función obtener LocalStorage

function obtenerLocal(){
    const obtenerEnStorage = localStorage.getItem('Producto')
    const obtenerMangas = JSON.parse(obtenerEnStorage);
    if(obtenerMangas){
        obtenerMangas.forEach(element => {
            agregarAlCarrito(element.id); 
        });
    }    
}

//Vaciar Carrito

function vaciarCarrito(){
    carritoCompras = [];
    localStorage.clear()
    precioTotal = 0;
    $('#precioTotal').html(precioTotal)
}

//Funcionamiento del Modal Carrito

$('#btn-carrito').click(function(){
    $('.modal-contenedor').toggleClass('modal-active');
}) 
$('#carritoCerrar').click(function(){
    $('.modal-contenedor').toggleClass('modal-active')
}) 
$('.modal-carrito').click(function(e){
    e.stopPropagation()
})
$('.modal-contenedor').click(function(){
    $('#carritoCerrar').click()
})


//Creando el contenedor de Pago

function contenedorPago(){
    $('#contenedorPago').empty()
    $('#contenedorPago').append(`   <h2>Selecione su método de pago</h2>
                                    <select id="seccionMetodoPago">
                                        <option value="selecione" selected>Seleccione método de Pago</option>
                                        <option value="efectivo">Efectivo</option>
                                        <option value="tarjeta">Tarjeta Crédito</option>
                                    </select>
                                    <div id="contenedorMetodoPago">
                                    </div> `);
    selecionPago()
}

//Función para selecionar el método de pago, efectivo o tarjeta

function selecionPago(){
    $('#seccionMetodoPago').on('change',()=>{                                   
        if($('#seccionMetodoPago').val() == 'efectivo'){
            $('#contenedorMetodoPago').empty()
            $('#contenedorMetodoPago').append( `    <div id="contenedorEfectivo">
                                                        <h2>Precio en un pago</h2>
                                                        <p id="totalPago">$${precioTotal}</p>
                                                    </div>
                                                    <div id="formularioEfectivo"></div>`)
        }
        else if($('#seccionMetodoPago').val() == 'tarjeta'){
            $('#contenedorMetodoPago').empty()
            $('#contenedorMetodoPago').append(` <div id="contenedorTarjeta">
                                                    <h2>Seleccione la cantidad de cuotas a pagar</h2>
                                                    <select id="calcularCuotas">
                                                        <option value="selecionar">Seleccione cantidad de cuotas</option>
                                                        <option value="1">1 cuota</option>
                                                        <option value="3">3 cuotas</option>
                                                        <option value="6">6 cuotas</option>
                                                        <option value="12">12 cuotas</option>
                                                    </select>
                                                    <div id="precioCuotas">
                                                    </div>
                                                    <div id="formularioTarjeta"></div>
                                                </div>`)
            calcularCuotas()
        }
        else{
            $('#contenedorMetodoPago').empty()
            $('#contenedorMetodoPago').append( `  <p>Por favor elija su método de pago</p>`)
        }
    })
}


// Función calcular Cuotas

function calcularCuotas(){
    $('#calcularCuotas').change( ()=>{
        if($('#calcularCuotas').val() == '1'){
            $('#precioCuotas').empty()
            actualizarCarrito()
            let cuota1 = (precioTotal).toFixed(2);
            $('#precioCuotas').append(`   <p>¡1 cuota de $${cuota1}!</p>`)
        }
        else if($('#calcularCuotas').val() == '3'){
            $('#precioCuotas').empty()
            let cuota3 = (precioTotal/3).toFixed(2);
            $('#precioCuotas').append(`   <p>¡3 cuotas sin interés de $${cuota3}!</p>`)
        }
        else if($('#calcularCuotas').val() == '6'){
            $('#precioCuotas').empty()
            let cuota6 = (precioTotal/6).toFixed(2);
            $('#precioCuotas').append(`   <p>¡6 cuotas sin interés de $${cuota6}!</p>`)
        }
        else if($('#calcularCuotas').val() == '12'){
            $('#precioCuotas').empty()
            let cuota12 = (precioTotal/12).toFixed(2);
            $('#precioCuotas').append(`   <p>¡12 cuotas sin interés de $${cuota12}!</p>`)
        }
        else{
            $('#precioCuotas').empty()
            $('#precioCuotas').append(`   <p>Elija la cantidad de cuotas</p>`)
        }
    })
}

//Funcionamiento del Modal Pagos

$('#irPagar').click(function(){
    $('.contenedor-pagar').toggleClass('modal-activado');
    contenedorPago()
})

$('#pagarCerrar').click(function(){
    $('.contenedor-pagar').toggleClass('modal-activado');
    $('#contenedorMetodoPago').empty()
    $('#continuarCompra').show()
})
$('.modal-pagar').click(function(e){
    e.stopPropagation()
})
$('.contenedor-pagar').click(function(){
    $('#pagarCerrar').click();
})

//Continuar Compra

$('#continuarCompra').click(function(){
    if($('#seccionMetodoPago').val()=='efectivo'||$('#seccionMetodoPago').val()=='tarjeta'){
        if(precioTotal!=0 && $('#seccionMetodoPago').val()=='efectivo'){
            mostrarFormularioEfectivo()
            $('#continuarCompra').hide()
        }
        else if(precioTotal!=0 && (($('#seccionMetodoPago').val() == 'tarjeta') && ($('#calcularCuotas').val() == '1') || ($('#calcularCuotas').val() == '3') || ($('#calcularCuotas').val() == '6') || ($('#calcularCuotas').val() == '12'))){
            mostrarFormularioTarjeta()
            $('#continuarCompra').hide()
        }
        else if(precioTotal!=0 && $(($('#seccionMetodoPago').val() == 'tarjeta') && ($('#calcularCuotas').val() != '1') || ($('#calcularCuotas').val() != '3') || ($('#calcularCuotas').val() != '6') || ($('#calcularCuotas').val() != '12'))){
            Toastify({
                text: "Seleccione cantidad de cuotas",
                duration: 3000,
                style: {
                    background: "red",
                }
            }).showToast();
        }
        else{
            Toastify({
                text: "Agregue productos a su carrito",
                duration: 3000,
                style: {
                    background: "red",
                }
            }).showToast();
        }
    }
    else{
        Toastify({
            text: "Seleccione un método de pago",
            duration: 3000,
            style: {
                background: "red",
            }
        }).showToast();
    }
})


//Carrusel

carrusel()

function carrusel(){
    for(let i= 1; i<=3;i++ ) {
        $(`#img${i}`).click(function(){
            let posicion  = i
            if(posicion==1){
                let operacion = 0;
                $('.contenedorCarrusel').css({'transform': `translateX(${operacion}%)`});
            } else if(posicion==2){
                let operacion = posicion * -33.3/2;
                $('.contenedorCarrusel').css({'transform': `translateX(${operacion}%)`})
            } else{
                let operacion = 2 * -33.3;
                $('.contenedorCarrusel').css({'transform': `translateX(${operacion}%)`})
            }
            for(let i= 1; i<=3;i++ ){
                $(`#img${i}`).removeClass('punto__activado');
            }
            $(`#img${i}`).addClass('punto__activado');
        })
    }
}

//Reloj

function cuentaRegresiva(fecha,tiempoLimite){
    const countdown = $('#id');
    fechaCuentaRegresiva = new Date(tiempoLimite).getTime()
    let countdownTempo = setInterval(()=>{
        let fechaHoy = new Date().getTime();
        fechaLimite = fechaCuentaRegresiva - fechaHoy;
        let dias = ('0'+Math.floor(fechaLimite/(1000 * 60 * 60 * 24))).slice(-2);
        let horas = ('0'+Math.floor(fechaLimite % (1000 * 60 * 60 * 24)/(1000*60*60))).slice(-2);
        let minutos = ('0'+Math.floor(fechaLimite % (1000 * 60 * 60)/(1000*60))).slice(-2);
        let segundos = ('0'+Math.floor(fechaLimite % (1000 * 60)/1000)).slice(-2);
        $('#relojTemporizador').html(`  <div class="reloj">
                                            <p class="reloj__numeros">${dias}</p>
                                            <p>dias</p>
                                        </div>
                                        <div class="reloj">
                                            <p class="reloj__numeros">${horas}</p>
                                            <p>horas</p>
                                        </div>
                                        <div class="reloj">
                                            <p class="reloj__numeros">${minutos}</p>
                                            <p>minutos</p>
                                        </div>
                                        <div class="reloj">
                                            <p class="reloj__numeros">${segundos}</p>
                                            <p>segundos</p>
                                        </div>`)
    },1000)
}

//Fecha en el que finaliza el temporizador, el día que terminan las ofertas

cuentaRegresiva('fecha','Dec 1 2021 00:00:00')

//Buscador

document.addEventListener("DOMContentLoaded", (e) => {
    buscador(".search", ".producto__contenedor");
});

function buscador(input,selector){
    document.addEventListener('keyup',(e)=>{
        if(e.target.matches(input)){
            document.querySelectorAll(selector).forEach(el=>
                el.textContent.toLowerCase().includes(e.target.value)
                ? el.classList.remove('filter')
                : el.classList.add('filter')
            )
        };
    })
}