//Inquirer es un paquete que instalamos que sirve de foma interactiva utilizar la ventana de commandos

//IMPORTACIONES
const inquirer = require("inquirer");
require("colors");

///FUNCIONES
//MENU -que se muestra en la terminal
const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "Que desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green}Buscar cuidad`,
      },
      {
        value: 2,
        name: `${"2.".green}Historial`,
      },
      {
        value: 0,
        name: `${"0.".green}Salir`,
      },
    ],
  },
];
//Titulo del menu 
const inquirerMenu = async () => {
  //console.clear();
  console.log("==============================".green);
  console.log("    Seleccione una opción".white);
  console.log("==============================\n".green);

  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
};

const pausa = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"ENTER".green} para continuar.`,
    },
  ];
  console.log("\n");
  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "descripcion",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];
  const { descripcion } = await inquirer.prompt(question);
  return descripcion;
};

//Listado de los lugares
const listarLugares = async (lugares = []) => {
  
  const choices = lugares.map((lugar, i) => {
    const indice = `${i + 1}.`.green; //generar el id 
    return {
      value: lugar.id,
      name: `${indice} ${lugar.nombre}`,
    };
  });
  choices.unshift({
    //para que  lo pongo al inicio y tenga la opcion de 0 para poder cancelar 
    value: "0",
    name: "0.".green + "Cancelar",
  });
  const preguntas = [
    {
      type: "list",
      name: "id",
      msg: "Seleccione lugar:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (mensaje) => {
  const pregunta = [
    {
      type: "confirm",
      name: "ok",
      mensaje,
    },
  ];
  const { ok } = await inquirer.prompt(pregunta);
  return ok;
};
//Completar tarea (s) - Multiples selecciones
const mostrarListadoCheckList = async (tareas = []) => {
  // pq voy a recibir las tareas
  const choices = tareas.map((tarea, i) => {
    const indice = `${i + 1}.`.green;
    return {
      value: tarea.id,
      name: `${indice} ${tarea.descripcion}`,
      checked: tarea.completadoEn ? true : false,
    };
  });
  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      msg: "Selecciones",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

//EXPORTACIONES
module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoCheckList,
};
