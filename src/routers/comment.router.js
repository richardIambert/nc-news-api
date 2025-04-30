import { Router } from 'express';
import { deleteCommentById, patchCommentById } from '../controllers/comment.controller.js';

const commentRouter = new Router();

commentRouter.route('/:id').delete(deleteCommentById).patch(patchCommentById);

export default commentRouter;
