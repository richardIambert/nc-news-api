import { Router } from 'express';
import { getUsers } from '../controllers/user.controller.js';

const userRouter = new Router();

userRouter.route('/').get(getUsers);

export default userRouter;
