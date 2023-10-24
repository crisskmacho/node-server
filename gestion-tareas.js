const { reject } = require('lodash'); //bibliotecas
const { resolve } = require('path');
const readline = require('readline');

const express = require('express');
const app = express();
const port = 3000;

//constates jwt y dotenv
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();


// Usuarios predefinidos
const usuarios = [
  { username: 'usuario1', password: 'contrasena1' },
  { username: 'usuario2', password: 'contrasena2' },
];

app.use(express.json());

const jwtSecret = process.env.JWT_SECRET;

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  //verificar las credenciales del usuario
  const usuario = usuarios.find((user) => user.username === username && user.password === password);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas'});
  }

  //Generar el token JWT
  const token = jwt.sign({ username}, jwtSecret, { expiresIn: '1h'});
  //console.log("Generated token:", token);
  res.json({ token });
});


//Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.get("Authorization")

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const tokenWithoutBearer = token.replace("Bearer ", "");

  jwt.verify(tokenWithoutBearer, jwtSecret, (error, decoded) => {
    if (error) {
      res.status(401).json({ error: 'Token invalido' });
      return;
    }
    req.user = decoded;  // Agrega el usuario autenticado a la solicitud para su posterior uso
    next();
  });
  /*console.log(token);
  console.log(jwt.verify(token, jwtSecret));*/
}


//Ruta protegida con el middleware verifyToken
app.post('/rutaProtegida', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Ruta protegida' });
});




//constantes para los routers
const listViewRouter = require('./list-view-router');
const listEditRouter = require('./list-edit-router');

// Middleware de aplicacion para validar metodos http validos
const validateHTTPMethods = (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE'){
    res.status(405).send('Metodo HTTP no permitido');
  }else{
    next();
  }
};


app.use(validateHTTPMethods)


//Ruta para obtener la lista de tareas en formato JSON
app.get('/tasks', (req, res) => {
  res.json(tasks);
});


//ruta para llamar el post con body
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Rutas para los Routers
app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

const rl = readline.createInterface({  //se usa para interactuar con el usuario y leer las respuestas del usuario (entrada y salida)
  input: process.stdin,
  output: process.stdout
});

const tasks = [];

// Función para agregar una tarea con una promesa
function addTask(indicator, description) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      tasks.push({ indicator, description, completed: false });
      console.log(`Tarea "${indicator}: ${description}" agregada.`);
      resolve(); // Resuelve la promesa cuando se completa la tarea
    }, 1000); //simulando una operación asincronica
  });
}

// Función para eliminar una tarea con una promesa
function deleteTask(indicator) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = tasks.findIndex(task => task.indicator === indicator);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        console.log(`Tarea "${indicator}" eliminada.`);
        resolve(); // Resuelve la promesa cuando se completa la tarea
      } else {
        console.log(`No se encontró una tarea con el indicador "${indicator}".`);
        reject(); // Rechaza la promesa si no se encuentra la tarea
      }
    }, 1000);
  });
}

function updateTask(indicator, newDrescription){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(task => task.indicator === indicator);
      if (task) {
        task.description = newDrescription;
        console.log(`Tarea ${indicator} actualizada con nueva descripcion: ${newDrescription}`);
        resolve();     
      }else{
        console.log(`No se encontro una tarea con el indicador: ${indicator}`);
        reject();
      }
    }, 1000);
  });
}

// Función para marcar una tarea como completada con una promesa
function completeTask(indicator) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(task => task.indicator === indicator);
      if (task) {
        task.completed = true;
        console.log(`Tarea "${indicator}" marcada como completada.`);
        resolve(); // Resuelve la promesa cuando se completa la tarea
      } else {
        console.log(`No se encontró una tarea con el indicador "${indicator}".`);
        reject(); // Rechaza la promesa si no se encuentra la tarea
      }
    }, 1000); // Simulando una operación asincrónica
  });
}

// Función para listar las tareas
function listTasks() {
  console.log('Lista de tareas:');
  tasks.forEach(task => {
    const status = task.completed ? 'Completada' : 'Pendiente';
    console.log(`- ${task.indicator}: ${task.description} (${status})`);
  });
}

// Función principal asincrónica
async function main(){  // declara la función asincrónica, la función contrendrá operaciones asincrónicas
  while (true) {
    const action = await askForAction(); //esperar la respuesta del usuario antes de continuar.
    if (action === 'exit'){
      rl.close();
      break;
    }
  }
}

function askForAction() {
  return new Promise((resolve, reject) => {
    rl.question('¿Qué acción deseas realizar? (add/delete/update/complete/list/exit): ', async action => { //readline "rl" Permite al usuario ingresar comandos y recibir respuestas del programa.
      if (action === 'add') {
        const indicador = await askQuestion('Indicador de la tarea para agregar: ');
        const description = await askQuestion('Descripción de la tarea: ');
        try {
          await addTask(indicador, description);  //pausa la ejecución de la función hasta que la promesa se complete
        } catch (error) {
          console.log('No se pudo agregar la tarea.');
        }
      } else if (action === 'delete') {
        const indicador = await askQuestion('Indicador de la tarea a eliminar: ');
        try {
          await deleteTask(indicador);
        } catch (error){
          console.log('No se pudo eliminar la tarea.');
        }
      }else if(action === 'update') {
        const indicador = await askQuestion('Indicador de la tarea a actualizar: ');
        const newDrescription = await askQuestion('Nueva descripcion: ')
        try {
          await updateTask(indicador, newDrescription);
        } catch (error) {
          console.log('No se pudo actualizar la tarea.');
        }
      }else if (action === 'complete') {
        const indicador = await askQuestion('Indicador de la tarea a marcar como completada: ');
        try {
          await completeTask(indicador);
        } catch (error){
          console.log('No se pudo marcar la tarea como completada.');
        }
      } else if (action === 'list') {
        listTasks();
      } else if (action === 'exit') {
        resolve(action); // Resuelve la promesa con 'exit' para salir
      } else {
        console.log('Acción no válida.');
      }
      resolve(action);
    });
  });
}


// Función para hacer una pregunta y obtener la respuesta
function askQuestion(question) {
  return new Promise((resolve, reject) => {  // promesa para esperar la respuesta del usuario de manera asincrónica.
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

main();

module.exports = { tasks };