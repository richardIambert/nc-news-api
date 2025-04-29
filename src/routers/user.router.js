import { Router } from 'express';
import { getUsers, getUserByUsername } from '../controllers/user.controller.js';

const userRouter = new Router();

userRouter.route('/').get(getUsers);

userRouter.route('/:username').get(getUserByUsername);

export default userRouter;
