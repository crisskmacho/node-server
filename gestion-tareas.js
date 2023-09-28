const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tasks = [];

function addTask(indicator, description) {
  tasks.push({ indicator, description, completed: false });
  console.log(`Tarea "${indicator}: ${description}" agregada.`);
}

function deleteTask(indicator) {
  const taskIndex = tasks.findIndex(task => task.indicator === indicator);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    console.log(`Tarea "${indicator}" eliminada.`);
  } else {
    console.log(`No se encontró una tarea con el indicador "${indicator}".`);
  }
}

function completeTask(indicator) {
  const task = tasks.find(task => task.indicator === indicator);
  if (task) {
    task.completed = true;
    console.log(`Tarea "${indicator}" marcada como completada.`);
  } else {
    console.log(`No se encontró una tarea con el indicador "${indicator}".`);
  }
}

function listTasks() {
  console.log('Lista de tareas:');
  tasks.forEach(task => {
    const status = task.completed ? 'Completada' : 'Pendiente';
    console.log(`- ${task.indicator}: ${task.description} (${status})`);
  });
}

rl.question('¿Qué acción deseas realizar? (add/delete/complete/list/exit): ', action => {
  if (action === 'add') {
    rl.question('Indicador de la tarea: ', indicator => {
      rl.question('Descripción de la tarea: ', description => {
        addTask(indicator, description);
        listTasks();
        rl.close();
      });
    });
  } else if (action === 'delete') {
    rl.question('Indicador de la tarea a eliminar: ', indicator => {
      deleteTask(indicator);
      listTasks();
      rl.close();
    });
  } else if (action === 'complete') {
    rl.question('Indicador de la tarea a marcar como completada: ', indicator => {
      completeTask(indicator);
      listTasks();
      rl.close();
    });
  } else if (action === 'list') {
    listTasks();
    rl.close();
  } else if (action === 'exit') {
    rl.close();
  } else {
    console.log('Acción no válida.');
    rl.close();
  }
});