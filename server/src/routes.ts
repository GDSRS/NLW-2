import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UsersController from './controllers/UsersController';


const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const usersController = new UsersController();

routes.post('/classes', classesController.create);
routes.get('/classes', classesController.index);
routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);
routes.post('/register', usersController.create);
routes.post('/login', usersController.login);
routes.post('/forgot-password', usersController.forgotPassword);
routes.post('/reset-password', usersController.resetPassword);

export default routes;