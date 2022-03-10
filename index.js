//CONFIGURACION DE LAS VARIABLES DE ENTORNO
require("dotenv").config();

const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// imprimir variables de entorno
//console.log(process.env.MAPBOX_KEY);

const main = async () => {
    console.log('ROBLOG main')
  const busquedas = new Busquedas();
  let opt;
  //Hacer el menu
  do {
    opt = await inquirerMenu(); // espera a mostrar el menu y elija una opcion - resuelve una promesa
    //console.log({opt});
    switch (opt) {
      case 1:
        //Mostrar mensjae
        const terminoDeBusqueda = await leerInput("Cuidad:");
        //Buscar los lugares
        const lugares = await busquedas.cuidad(terminoDeBusqueda);
        //Seleccionar el lugar
        // console.log(`ROBLOG -> OBJETOS MAPEADOS: ${JSON.stringify(lugares)}`)
        const idSeleccionado = await listarLugares(lugares);
        //por si picamos el 0 nos regrese al menu principal
        if (idSeleccionado === "0") continue;
        //si no selecciona el 0 entonces si lo puedo guardar en db
        const lugarSel = lugares.find((l) => l.id === idSeleccionado); //va a ir lugar por lugar  en el array hasta que sea el mismo id del que seleccione
        busquedas.agregarHistorial(lugarSel.nombre);

        //console.log(lugarSel)

        //Clima
        // const clima=await busquedas.climaLugar()
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
        // console.log(clima)

        //Mostrar resultados
        console.clear();
        console.log("\nInformacion de la cuidad\n".green);
        console.log("Cuidad:", lugarSel.nombre.green);
        console.log("Lat:", lugarSel.lat);
        console.log("Lng:", lugarSel.lng);
        console.log("Temperatura", clima.temp);
        console.log("Temperatura Min:", clima.min);
        console.log("Temperatura Max", clima.max);
        console.log("Descripcion del clima:", clima.desc.green);
        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, indice) => {
          const idx = `${indice + 1}.`.green;
          console.log(`${idx}${lugar}`);
        });
    }
    if (opt !== 0) await pausa(); // para poder ver .. que sale cuando le doy enter  y el if es para que salga de golpe
  } while (opt !== 0);
};

main();
