//IMPORTACIONES
const fs = require("fs"); // guardar en archivo de texto
const axios = require("axios");

//CLASE
class Busquedas {
  historial = [];
  dbPath = "./db/database.json"; // en donde quiero mi base de datos
  constructor() {
    //TO-DO: leer DB si existe
    console.log('ROBLOG CONSTRUCTOR')
    this.leerDB();
    console.log('ROBLOG CONSTRUCTOR')
  }
  //CAPITALIZAR CADA PALABRA
  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" "); // cortar cada palabra
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1)); //agregarle la palabra completa
      return palabras.join(" "); //juntar todos de nuevo
    });
  }

  get paramsMaxbox() {
    // para llamar nuestro objeto
    return {
      access_token: process.env.MAPBOX_KEY,
      language: "es",
      limit: 5,
    };
  }
  //
  get paramsWeatherMap() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lat: 19.05139,
      lon: -98.21778,
      lang: "es",
    };
  }

  async cuidad(lugar = "") {
    // le ponemos que es un string para establecer un valor por defecto
    // Peticion http
    // console.log('cuidad',lugar);
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMaxbox, // nada mas mando llamar el get de nuestra clase
      });
      const resp = await instance.get();
      //const resp=await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/madrid.json?types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiZGlhbmFlZ2MiLCJhIjoiY2wwanJpMG5zMGZkZTNjbDRpdWVpbWRkMyJ9.Tz6vm-ceRok8et27sOU-Dw');

      //console.log(resp.data.features);-AQUI es como obtengo o como extraigo la informacion
      //haremos lo mismo aca abajo
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));

      //return []; // retornar los lugaresque coincuidan con el lugar que escribe la persona
    } catch (error) {
      console.log("No se encontro nada");
      return [];
    }
  }
  async climaLugar(lat, lon) {
    try {
      //instance axios.create()
      const instancia = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeatherMap, lat, lon }, // desestructurar para que me traiga todo y ademas le agrego
        //?lat=19.05139&lon=-98.21778&appid=5389d87cd2dc608d97dc2494cb70ec0e&units=metric&lang=es`
      });
      const resp = await instancia.get();
      const { weather, main } = resp.data; // me interesa extraer el weather y el main

      //respuesta extraer la info la data -resp.data

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (err) {
      console.log(`No se encontro la cuidad`);
    }
  }

  //CREAR UN METODO ENCARGADO DE HACER LA GRABACION DEL HISTORIAL

  agregarHistorial(lugar = "") {
    //Prevenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }

    // restringuir si ya lo incluye 
    this.historial=this.historial.splice(0,5); // asi solo tendre 6 en mi historial

    //Grabarlos
    this.historial.unshift(lugar.toLocaleLowerCase()); //-colocar al inicio para que se vayan saliendo por eso el unshift
    //Grabar en db
    this.guardarDB();
  }
  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    console.log(payload);
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDB() {
    //verificar que exista
   // console.log(`ROBLOG -> paso 1 ${this.dbPath}`)
    if (!fs.existsSync(this.dbPath)) return;
    
    //si existe debemos carga la info
    //console.log(`ROBLOG -> paso 2`)
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    //console.log(`ROBLOG -> paso 3 ${info}`)
    const data = JSON.parse(info); //parsear para sea un objeto javascript
   // console.log(`ROBLOG -> paso 4`)
    this.historial = data.historial;
  }
}

//EXPORTACIONES
module.exports = Busquedas; //ya que se que de aqui solo voy a exportar esto
