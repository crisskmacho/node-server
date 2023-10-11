const express = require('express');
const listEditRouter = express.Router();



listEditRouter.post('/create', (req, res) => {
    const { tasks } = require('./gestion-tareas');
    const {indicator, description } = req.body;
    if (!indicator || !description){
        res.status(400).json({ error: 'Se requiere el indicador y la descripción de la tarea.'});
    }else{
        const newTask = { indicator , description, completed: false};
        tasks.push(newTask);
        res.status(201).json(newTask);
    }
});


module.exports = listEditRouter;