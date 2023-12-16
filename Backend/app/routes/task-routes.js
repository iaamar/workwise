import expess from 'express';
import * as taskController from '../controllers/task-controller.js';



const Router = expess.Router();
    
Router.route('/')                               //Route for creating a new task
    .post(taskController.postTask);
    
Router.route('/:id')                           
    .get(taskController.getTask)                //Route for getting a task by id
    .put(taskController.putTask)                //Route for updating a task
    .delete(taskController.removeTask);            //Route for deleting a task

export default Router;
