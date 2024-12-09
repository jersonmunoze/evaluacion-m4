//Jerson Muñoz Espinoza Evaluación Módulo 4
//Funciones sin Jquery 

// ------- Función para la creación de tarjeta html ----------
const crearTarjeta = ({ name, height, mass }, id) => {
    let colorClass;
    if (id >= 1 && id < 6) {
        colorClass = 'timeline-icon-bg-red';
    } else if (id >= 6 && id < 11) {
        colorClass = 'timeline-icon-bg-green';
    } else {
        colorClass = 'timeline-icon-bg-blue'
    }
    return `<div class="col-12 col-md-6 col-lg-4 elemento-card">
                <div class="single-timeline-content d-flex">
                    <div class="timeline-icon ${colorClass}">
                    </div>
                    <div class="timeline-text">
                        <h6>${name}</h6>
                        <p>Estatura: ${height} cm. Peso: ${mass} kg.</p>
                    </div>
                </div>
            </div>`;
}

// ---- Función generadora para la creación de tarjetas llamando a api usando fetch ------------
async function* generadorTarjetaPersonaje(idsPersonajes){
    for(const id of idsPersonajes){
        const url = `https://swapi.dev/api/people/${id}/`;
        try{
            let respuesta = await fetch(url);
            const data = await respuesta.json();
            let tarjeta = crearTarjeta(data, id);
            yield tarjeta;
        } catch(error){
            console.log(`Ha ocurrido un error ${error}`);
            yield 'Error fetch';
        }
    }
    return 'No hay más elementos';
}

//Funciones con Jquery 
$(document).ready(async() => {
     //Función con jquery para agregar las tarjetas en el html
     const agregarTarjetaPersonaje = (tarjeta, tipoPersonaje) => {
        //Si hay un error con fetch, muestra un mensaje
        if (tarjeta === 'Error fetch') {
            let mensaje = '<p>Ha ocurrido un error al cargar los personajes, intente cargar más tarde.</p>';
            $("#personajes-error").html(mensaje);
        }
        //si no hay error, agrega las tarjetas, si es undefined no agrega nada al html
        else if (tarjeta !== 'No hay más elementos') {
            if(tipoPersonaje === "primario"){
                $("#primarios-contenedor").append(tarjeta);
            } else if(tipoPersonaje === "secundario"){
                $("#secundarios-contenedor").append(tarjeta);
            } else if(tipoPersonaje === "otro"){
                $("#otros-contenedor").append(tarjeta);
            }
        }
    }

    //Generador personajes principales
    let idsPersonajesPrincipales = [1, 2, 3, 4, 5];
    const genPersonajePrincipal = generadorTarjetaPersonaje(idsPersonajesPrincipales);
    //Generador personajes secundarios
    let idsPersonajesSecundarios = [6, 7, 8, 9, 10];
    const genPersonajeSecundario = generadorTarjetaPersonaje(idsPersonajesSecundarios);
    //Generador Otros personajes 
    let idsOtrosPersonajes = [12, 13, 14, 15, 16];
    const genOtroPersonaje = generadorTarjetaPersonaje(idsOtrosPersonajes);

    $("#rango-primarios").on("mouseover", async () => {
        let tarjeta = await genPersonajePrincipal.next();
        agregarTarjetaPersonaje(tarjeta.value, "primario");
    });
    $("#rango-secundarios").on("mouseover", async () => {
        let tarjeta = await genPersonajeSecundario.next();
        agregarTarjetaPersonaje(tarjeta.value, "secundario");
    });
    $("#rango-otros").on("mouseover", async () => {
        let tarjeta = await genOtroPersonaje.next();
        agregarTarjetaPersonaje(tarjeta.value, "otro");
    });

});
