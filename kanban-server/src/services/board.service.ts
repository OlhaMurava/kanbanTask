import { pool } from '../db/pool';
import { generateId } from '../utils/generateId';
import { Board, Column } from '../models/board.model';

export async function getAllBoards() {
  const result = await pool.query('SELECT * FROM boards');
  return result.rows;
}

export async function getFullBoard(boardId: string): Promise<Board | null> {
  const result = await pool.query(
    `
  SELECT b.id as board_id, b.title as board_title,
         c.id as column_id, c.title as column_title, c.position as column_position,
         t.id as task_id, t.title as task_title, t.description as task_description
  FROM boards b
  LEFT JOIN columns c ON c.board_id = b.id
  LEFT JOIN tasks t ON t.column_id = c.id
  WHERE b.id = $1
  ORDER BY c.position ASC
`,
    [boardId]
  );

  if (result.rows.length === 0) return null;

  const board: Board = {
    id: result.rows[0].board_id,
    title: result.rows[0].board_title,
    columns: [],
  };

  const columnsMap = new Map<string, Column>();

  for (const row of result.rows) {
    if (row.column_id && !columnsMap.has(row.column_id)) {
      columnsMap.set(row.column_id, {
        id: row.column_id,
        title: row.column_title,
        tasks: [],
      });
    }

    if (row.task_id && columnsMap.has(row.column_id)) {
      columnsMap.get(row.column_id)?.tasks.push({
        id: row.task_id,
        title: row.task_title,
        description: row.task_description,
      });
    }
  }

  board.columns = Array.from(columnsMap.values());
  return board;
}

export async function createBoard(title: string) {
  const boardId = generateId();
  const client = await pool.connect();
  const defaultColumns = [
    { id: generateId(), title: 'To Do' },
    { id: generateId(), title: 'In Progress' },
    { id: generateId(), title: 'Done' },
  ];

  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO boards (id, title) VALUES ($1, $2)', [
      boardId,
      title,
    ]);

    const defaultColumns = [
      { id: generateId(), title: 'To Do', position: 0 },
      { id: generateId(), title: 'In Progress', position: 1 },
      { id: generateId(), title: 'Done', position: 2 },
    ];

    for (const col of defaultColumns) {
      await client.query(
        'INSERT INTO columns (id, title, board_id, position) VALUES ($1, $2, $3, $4)',
        [col.id, col.title, boardId, col.position]
      );
    }


    await client.query('COMMIT');
    return { id: boardId, title, columns: defaultColumns };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function addTask(
  columnId: string,
  title: string,
  description: string
) {
  const taskId = generateId();
  await pool.query(
    'INSERT INTO tasks (id, title, description, column_id) VALUES ($1, $2, $3, $4)',
    [taskId, title, description, columnId]
  );
  return { id: taskId, title, description };
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string
) {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
    [title, description, taskId]
  );
  if (result.rowCount === 0) throw new Error('Task not found');
  return result.rows[0];
}

export async function moveTask(taskId: string, toColumnId: string) {
  const result = await pool.query(
    'UPDATE tasks SET column_id = $1 WHERE id = $2 RETURNING *',
    [toColumnId, taskId]
  );
  if (result.rowCount === 0) throw new Error('Task not found');
  return result.rows[0];
}

export async function deleteTask(taskId: string) {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
  if (result.rowCount === 0) throw new Error('Task not found');
}

export async function deleteBoard(boardId: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'DELETE FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = $1)',
      [boardId]
    );
    await client.query('DELETE FROM columns WHERE board_id = $1', [boardId]);
    const result = await client.query('DELETE FROM boards WHERE id = $1', [
      boardId,
    ]);
    await client.query('COMMIT');
    if (result.rowCount === 0) throw new Error('Board not found');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
