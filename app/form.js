function mostrarFormularioEfectivo(){
    $('#formularioEfectivo').append(`
    <form action="" id="formulario" class="formulario">
            <h5>Complete sus datos</h5>
        
            <div class="formulario__contenedor" id="formulario__nombre">
                <div class="formulario__contenedor--input">
                    <input type="text" class="input" name="nombre" id="nombre" placeholder="Nombre">
                    <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                </div>
                <p class="formulario__contenedor--mensajeError">No se admiten números y carácteres especiales</p>
            </div>
        
            <div class="formulario__contenedor" id="formulario__apellido">
                <div class="formulario__contenedor--input">
                    <input type="text" class="input" name="apellido" id="apellido" placeholder="Apellido">
                    <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                </div>
                <p class="formulario__contenedor--mensajeError">No se admiten números y carácteres especiales</p>
            </div>
        
            <div class="formulario__contenedor" id="formulario__email">
                <div class="formulario__contenedor--input">
                    <input type="email" class="input" name="email" id="email" placeholder="Correo Electrónico">
                    <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                </div>
                <p class="formulario__contenedor--mensajeError">Se admiten letras, números, @, puntos, guiones y guion bajo</p>
            </div>
        
            <div class="formulario__contenedor" id="formulario__direccion">
                <div class="formulario__contenedor--input">
                    <input type="text" class="input" name="direccion" id="direccion" placeholder="Dirección">
                    <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                </div>
                <p class="formulario__contenedor--mensajeError">No se admiten carácteres especiales</p>
            </div>
        
            <div class="formulario__contenedor" id="formulario__terminos">
                <input type="checkbox" class="input formularioCheckbox" name="terminos" id="terminos">Acepto los términos y Condiciones
            </div>
        
            <div class="formulario__enviado" id="formulario__enviado">
                <p><i class="fa fa-check" aria-hidden="true"></i> ¡Compra confirmada!</p>
            </div>
        
            <div class="formulario__mensaje" id="formulario__mensaje">
                <p><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Complete el formulario</p>
            </div>
        
            <div class="formulario__contenedor formulario__btn">
                <button type="submit" class="formulario__btn--enviar">Confirmar</button>
            </div>
        </form>`)

        //Creo variables

        const formulario = document.getElementById('formulario');
        const inputs = document.querySelectorAll('#formulario input');
            
        //Válido los carácteres

        inputs.forEach((input)=>{
            input.addEventListener('keyup',validarFormulario)
        })

        //Válido el formulario al enviarlo

        formulario.addEventListener('submit',(e)=>{
            e.preventDefault(e);
            const terminos = document.getElementById('terminos')
            if(campos.nombre && campos.apellido && campos.email && campos.direccion && terminos.checked ){
                formulario.reset();
                $('#contenedorPago').empty()
                $('#contenedorPago').append(`   <div class="formulario__enviado" id="formulario__enviado">
                                                    <p><i class="fa fa-check" aria-hidden="true"></i> ¡Compra confirmada!</p>
                                                </div>`);
                document.getElementById('formulario__enviado').classList.add('formulario__enviado--active');
                $('#contenedorCarrito').empty()
                vaciarCarrito()
                document.querySelectorAll('.formulario__contenedor--correcto').forEach((icono) => {
                    icono.classList.remove('formulario__contenedor--correcto');
                });
            } 
            else{
                document.getElementById('formulario__enviado').classList.remove('formulario__enviado--active');
                document.getElementById('formulario__mensaje').classList.add('formulario__mensaje--active');
            }
        })
}

//Creo expresiones donde pido ciertas condiciones para los inputs

const expresiones = {
	nombre: /^[a-zA-ZÁ-ÿ\s]{3,20}$/, 
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    direccion: /^[a-zA-ZÀ-ÿ\s0-9.\s]{1,30}$/,
    numeroTarjeta: /^\d{16}$/,
    nombreTarjeta: /^[a-zA-ZÁ-ÿ\s]{3,20}$/,
    expiracion:/^\d{4}$/,
    codigoSeguridad:/^\d{4}$/,
}

//Los inputs sean falsos al iniciar

const campos = {
    nombre: false,
    apellido: false,
    email: false,
    direccion: false,
    numeroTarjeta:false,
    nombreTarjeta:false,
    expiracion:false,
    codigoSeguridad:false,
}

//Valido el formulario

function validarFormulario(e){
    switch(e.target.name){
        case 'nombre':
            validarInput(expresiones.nombre,e.target,'nombre')
            break;
        case 'apellido':
            validarInput(expresiones.apellido,e.target,'apellido')
            break;
        case 'email':
            validarInput(expresiones.email,e.target,'email')
            break;
        case 'direccion':
            validarInput(expresiones.direccion,e.target,'direccion')
            break;
        case 'numeroTarjeta':
            validarInput(expresiones.numeroTarjeta,e.target,'numeroTarjeta')
            break;
        case 'nombreTarjeta':
            validarInput(expresiones.nombreTarjeta,e.target,'nombreTarjeta')
            break;
        case 'expiracion':
            validarInput(expresiones.expiracion,e.target,'expiracion')
            break;
        case 'codigoSeguridad':
            validarInput(expresiones.codigoSeguridad,e.target,'codigoSeguridad')
            break;
    }
}

//Función para validar cada input

function validarInput(expresion, input, campo){
    if(expresion.test(input.value)){
        document.getElementById(`formulario__${campo}`).classList.remove('formulario__contenedor--incorrecto');
        document.getElementById(`formulario__${campo}`).classList.add('formulario__contenedor--correcto');
        document.querySelector(`#formulario__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#formulario__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#formulario__${campo} .formulario__contenedor--mensajeError`).classList.remove('formulario__contenedor--mensajeError-active')
        campos[campo] = true;
    }else{
        document.getElementById(`formulario__${campo}`).classList.add('formulario__contenedor--incorrecto');
        document.getElementById(`formulario__${campo}`).classList.remove('formulario__contenedor--correcto');
        document.querySelector(`#formulario__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#formulario__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#formulario__${campo} .formulario__contenedor--mensajeError`).classList.add('formulario__contenedor--mensajeError-active')
        campos[campo] = false;
    }
}

//Formulario Tarjeta

function mostrarFormularioTarjeta(){
    $('#formularioTarjeta').append(`<form action="" id="formulario" class="formulario">
                                        <h5>Complete sus datos</h5> 
                                        <div class="formulario__contenedor" id="formulario__nombre">
                                            <div class="formulario__contenedor--input">
                                                <input type="text" class="input" name="nombre" id="nombre" placeholder="Nombre">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">No se admiten números y carácteres especiales</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__apellido">
                                            <div class="formulario__contenedor--input">
                                                <input type="text" class="input" name="apellido" id="apellido" placeholder="Apellido">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">No se admiten números y carácteres especiales</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__email">
                                            <div class="formulario__contenedor--input">
                                                <input type="email" class="input" name="email" id="email" placeholder="Correo Electrónico">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">Se admiten letras, números, @, puntos, guiones y guion bajo</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__direccion">
                                            <div class="formulario__contenedor--input">
                                                <input type="text" class="input" name="direccion" id="direccion" placeholder="Dirección">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">No se admiten carácteres especiales</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__numeroTarjeta">
                                            <div class="formulario__contenedor--input">
                                                <input type="number" class="input" name="numeroTarjeta" id="numeroTarjeta" placeholder="Numero de tarjeta">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">Debe introducir 16 dígitos</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__nombreTarjeta">
                                            <div class="formulario__contenedor--input">
                                                <input type="text" class="input" name="nombreTarjeta" id="nombreTarjeta" placeholder="Nombre y Apellido que figura en la tarjeta">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">No se admiten números y carácteres especiales</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__expiracion">
                                            <div class="formulario__contenedor--input">
                                                <input type="number" class="input" name="expiracion" id="expiracion" placeholder="Fecha de Expiración">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">Debe introducir 4 digitos MES-AÑO, ejemplo 1021</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__codigoSeguridad">
                                            <div class="formulario__contenedor--input">
                                                <input type="number" class="input" name="codigoSeguridad" id="codigoSeguridad" placeholder="Código de seguridad">
                                                <i class="fa fa-times-circle validacionEstado" aria-hidden="true"></i>
                                            </div>
                                            <p class="formulario__contenedor--mensajeError">Debe introducir los 3 o 4 dígitos de seguridad del reverso de su tarjeta XXX</p>
                                        </div>

                                        <div class="formulario__contenedor" id="formulario__terminos">
                                            <input type="checkbox" class="input formularioCheckbox" name="terminos" id="terminos">Acepto los términos y Condiciones
                                        </div>

                                        <div class="formulario__enviado" id="formulario__enviado">
                                            <p><i class="fa fa-check" aria-hidden="true"></i> ¡Compra confirmada!</p>
                                        </div>

                                        <div class="formulario__mensaje" id="formulario__mensaje">
                                            <p><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Complete el formulario</p>
                                        </div>

                                        <div class="formulario__contenedor formulario__btn">
                                            <button type="submit" class="formulario__btn--enviar">Confirmar</button>
                                        </div>
                                    </form>`)
    //Creo variables

    const formulario = document.getElementById('formulario');
    const inputs = document.querySelectorAll('#formulario input');

    //Válido los carácteres

    inputs.forEach((input)=>{
        input.addEventListener('keyup',validarFormulario)
        console.log('a')
    })

    //Válido el formulario al enviarlo

    formulario.addEventListener('submit',(e)=>{
        e.preventDefault(e);
        const terminos = document.getElementById('terminos')
        if(campos.nombre && campos.apellido && campos.email && campos.direccion && campos.numeroTarjeta && campos.nombreTarjeta && campos.expiracion && campos.codigoSeguridad && terminos.checked ){
            formulario.reset();
            $('#contenedorPago').empty()
            $('#contenedorPago').append(`   <div class="formulario__enviado" id="formulario__enviado">
                                                <p><i class="fa fa-check" aria-hidden="true"></i> ¡Compra confirmada!</p>
                                            </div>`);
            document.getElementById('formulario__enviado').classList.add('formulario__enviado--active');
            $('#contenedorCarrito').empty()
            vaciarCarrito()
            document.querySelectorAll('.formulario__contenedor--correcto').forEach((icono) => {
                icono.classList.remove('formulario__contenedor--correcto');
            });
        } 
        else{
            document.getElementById('formulario__enviado').classList.remove('formulario__enviado--active');
            document.getElementById('formulario__mensaje').classList.add('formulario__mensaje--active');
        }
    })
}
