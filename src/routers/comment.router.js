import { Router } from 'express';
import { deleteCommentById } from '../controllers/comment.controller.js';

const commentRouter = new Router();

commentRouter.route('/:id').delete(deleteCommentById);

export default commentRouter;
