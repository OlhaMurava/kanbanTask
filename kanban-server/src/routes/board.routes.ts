import { Router } from 'express';
import * as boardController from '../controllers/board.controller';

const router = Router();

router.get('/boards', boardController.getBoards);
router.get('/boards/:boardId', boardController.getBoardById);
router.post('/boards', boardController.createBoard);
router.post(
  '/boards/:boardId/columns/:columnId/tasks',
  boardController.addTask
);
router.put('/boards/:boardId/tasks/:taskId', boardController.updateTask);
router.put('/boards/:boardId/tasks/:taskId/move', boardController.moveTask);
router.delete('/boards/:boardId/tasks/:taskId', boardController.deleteTask);
router.delete('/boards/:boardId', boardController.deleteBoard);

export default router;
