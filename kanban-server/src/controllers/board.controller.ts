import { Request, Response } from 'express';
import * as boardService from '../services/board.service';
import * as validator from '../validators/board.validator';

export async function getBoards(req: Request, res: Response) {
  try {
    const boards = await boardService.getAllBoards();
    res.json(boards);
  } catch {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
}

export async function getBoardById(req: Request, res: Response) {
  try {
    const board = await boardService.getFullBoard(req.params.boardId);
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch {
    res.status(500).json({ error: 'Failed to fetch board' });
  }
}

export async function createBoard(req: Request, res: Response) {
  try {
    validator.validateBoardTitle(req.body.title);
    const board = await boardService.createBoard(req.body.title);
    res.status(201).json(board);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    validator.validateTaskInput(title, description);
    const task = await boardService.addTask(
      req.params.columnId,
      title,
      description
    );
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    validator.validateTaskInput(title, description);
    const task = await boardService.updateTask(
      req.params.taskId,
      title,
      description
    );
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function moveTask(req: Request, res: Response) {
  try {
    const { toColumnId } = req.body;
    if (!toColumnId) throw new Error('toColumnId is required');
    await boardService.moveTask(req.params.taskId, toColumnId);
    res.json({ message: 'Task moved successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    await boardService.deleteTask(req.params.taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteBoard(req: Request, res: Response) {
  try {
    await boardService.deleteBoard(req.params.boardId);
    res.json({ message: 'Board deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
