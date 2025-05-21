import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Types
export type Task = {
  id: string;
  title: string;
  description: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Board = {
  id: string;
  title: string;
  columns: Column[];
};

type BoardsState = {
  boards: Board[];
  activeBoardId: string | null;
  activeBoard: Board | null;
  loading: boolean;
  error: string | null;
};

// Get Boards
export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const res = await axios.get<Board[]>(API_URL);
  return res.data;
});

// Get boards with id
export const fetchBoardById = createAsyncThunk('boards/fetchBoardById', async (boardId: string) => {
  const res = await axios.get<Board>(`${API_URL}/${boardId}`);
  return res.data;
});

// Create Board
export const createBoard = createAsyncThunk('boards/createBoard', async (title: string) => {
  const res = await axios.post<Board>(API_URL, { title });
  return res.data;
});

// Delete Board
export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Add Task
export const addTaskToColumn = createAsyncThunk(
  'boards/addTaskToColumn',
  async ({
    boardId,
    columnId,
    title,
    description,
  }: {
    boardId: string;
    columnId: string;
    title: string;
    description: string;
  }) => {
    const res = await axios.post<Task>(`${API_URL}/${boardId}/columns/${columnId}/tasks`, {
      title,
      description,
    });
    return { boardId, columnId, task: res.data };
  },
);

// Delete Task
export const deleteTask = createAsyncThunk(
  'boards/deleteTask',
  async ({ boardId, taskId }: { boardId: string; taskId: string }) => {
    await axios.delete(`${API_URL}/${boardId}/tasks/${taskId}`);
    return { boardId, taskId };
  },
);

// Move Task
export const moveTask = createAsyncThunk(
  'boards/moveTask',
  async ({
    boardId,
    taskId,
    toColumnId,
  }: {
    boardId: string;
    taskId: string;
    toColumnId: string;
  }) => {
    await axios.put(`${API_URL}/${boardId}/tasks/${taskId}/move`, {
      toColumnId,
    });
    return { boardId, taskId, toColumnId };
  },
);

// Edit Task
export const editTask = createAsyncThunk(
  'boards/editTask',
  async ({
    boardId,
    taskId,
    title,
    description,
  }: {
    boardId: string;
    taskId: string;
    title: string;
    description: string;
  }) => {
    const res = await axios.put<Task>(`${API_URL}/${boardId}/tasks/${taskId}`, {
      title,
      description,
    });
    return { boardId, task: res.data };
  },
);

const initialState: BoardsState = {
  boards: [],
  activeBoardId: null,
  activeBoard: null,
  loading: false,
  error: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setActiveBoard(state, action: PayloadAction<string>) {
      state.activeBoardId = action.payload;
    },
    editBoardTitle: (state, action: PayloadAction<{ boardId: string; newTitle: string }>) => {
      const { boardId, newTitle } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.title = newTitle;
      }
      if (state.activeBoard && state.activeBoard.id === boardId) {
        state.activeBoard.title = newTitle;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBoards (список бордів без колонок)
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
        state.loading = false;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch boards';
      })

      // fetchBoardById (повний борд з колонками і тасками)
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
        state.activeBoardId = action.payload.id;
        state.loading = false;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch board';
      })

      // createBoard
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
        state.loading = false;
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create board';
      })

      // deleteBoard
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
        if (state.activeBoardId === action.payload) {
          state.activeBoardId = null;
          state.activeBoard = null;
        }
      })

      // addTaskToColumn
      .addCase(addTaskToColumn.fulfilled, (state, action) => {
        if (!state.activeBoard || state.activeBoard.id !== action.payload.boardId) return;
        const column = state.activeBoard.columns.find((c) => c.id === action.payload.columnId);
        if (!column) return;
        column.tasks.push(action.payload.task);
      })

      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        if (!state.activeBoard || state.activeBoard.id !== action.payload.boardId) return;
        for (const col of state.activeBoard.columns) {
          col.tasks = col.tasks.filter((t) => t.id !== action.payload.taskId);
        }
      })

      // moveTask
      .addCase(moveTask.fulfilled, (state, action) => {
        if (!state.activeBoard || state.activeBoard.id !== action.payload.boardId) return;

        let movedTask: Task | undefined;

        for (const col of state.activeBoard.columns) {
          const idx = col.tasks.findIndex((t) => t.id === action.payload.taskId);
          if (idx !== -1) {
            movedTask = col.tasks.splice(idx, 1)[0];
            break;
          }
        }

        if (movedTask) {
          const targetCol = state.activeBoard.columns.find(
            (c) => c.id === action.payload.toColumnId,
          );
          if (targetCol) targetCol.tasks.push(movedTask);
        }
      })

      // editTask
      .addCase(editTask.fulfilled, (state, action) => {
        if (!state.activeBoard || state.activeBoard.id !== action.payload.boardId) return;

        for (const col of state.activeBoard.columns) {
          const existingTask = col.tasks.find((t) => t.id === action.payload.task.id);
          if (existingTask) {
            existingTask.title = action.payload.task.title;
            existingTask.description = action.payload.task.description;
            break;
          }
        }
      });
  },
});

export const { setActiveBoard, editBoardTitle } = boardsSlice.actions;

export default boardsSlice.reducer;
