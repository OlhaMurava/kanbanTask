import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {
  fetchBoards,
  fetchBoardById,
  createBoard,
  deleteBoard,
  addTaskToColumn,
  deleteTask,
  moveTask,
  editTask,
  setActiveBoard,
  editBoardTitle,
} from './features/boards/boardsSlice';
import './App.css';

import LoadBoardForm from './components/LoadBoardForm';
import BoardForm from './components/BoardForm';
import BoardList from './components/BoardList';
import TaskForm from './components/TaskForm';
import BoardColumns from './components/BoardColumns';

const App: React.FC = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch<AppDispatch>();

  const { boards, activeBoard, activeBoardId, loading, error } = useSelector(
    (state: RootState) => state.boards,
  );

  const [inputBoardId, setInputBoardId] = useState('');
  const [boardTitleInput, setBoardTitleInput] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskColumnId, setNewTaskColumnId] = useState('');

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState('');

  useEffect(() => {
    fetch(`${url}/boards`)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error('Error fetching boards:', err));
  }, [url]);

  useEffect(() => {
    if (activeBoardId) {
      dispatch(fetchBoardById(activeBoardId));
    }
  }, [activeBoardId, dispatch]);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

const handleLoadBoard = () => {
  if (!inputBoardId.trim()) {
    alert('Please, fill in Board ID.');
    return;
  }

  dispatch(setActiveBoard(inputBoardId.trim()));
};

const handleSaveBoard = () => {
  if (!boardTitleInput.trim()) {
    alert('Please, fill in Board Name.');
    return;
  }
  dispatch(createBoard(boardTitleInput.trim()));
  setBoardTitleInput('');
};

  const handleDeleteBoard = (id: string) => {
    if (window.confirm('Delete this board?')) {
      dispatch(deleteBoard(id));
    }
  };

  const startEditingBoard = (boardId: string, currentTitle: string) => {
    setEditingBoardId(boardId);
    setEditingBoardTitle(currentTitle);
  };

  const saveBoardTitle = () => {
    if (!editingBoardId || !editingBoardTitle.trim()) return;
    dispatch(editBoardTitle({ boardId: editingBoardId, newTitle: editingBoardTitle.trim() }));
    setEditingBoardId(null);
    setEditingBoardTitle('');
  };

  const cancelEditingBoard = () => {
    setEditingBoardId(null);
    setEditingBoardTitle('');
  };

  const startEditingTask = (
    taskId: string,
    title: string,
    description: string,
    columnId: string,
  ) => {
    setEditingTaskId(taskId);
    setEditTitle(title);
    setEditDesc(description);
    setSelectedColumnId(columnId);
  };

  const saveTaskEdit = () => {
    if (!editingTaskId || !selectedColumnId) return;
    if (!editTitle.trim()) return;

    dispatch(
      editTask({
        boardId: activeBoardId!,
        taskId: editingTaskId,
        title: editTitle.trim(),
        description: editDesc.trim(),
      }),
    );

    setEditingTaskId(null);
    setEditTitle('');
    setEditDesc('');
  };

  const dispatchDeleteTask = (taskId: string) => {
    if (!activeBoardId) return;
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask({ boardId: activeBoardId, taskId }));
    }
  };

const handleAddTask = () => {
  if (!activeBoardId  !newTaskColumnId  !newTaskTitle.trim() || !newTaskDesc.trim()) {
    alert('Please fill in the task name, description and select a column.');
    return;
  }

  dispatch(
    addTaskToColumn({
      boardId: activeBoardId,
      columnId: newTaskColumnId,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
    }),
  );

  setNewTaskTitle('');
  setNewTaskDesc('');
  setNewTaskColumnId('');
};

  // Drag & drop

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, destColumnId: string) => {
    e.preventDefault();
    if (!activeBoardId || !draggedTaskId) return;

    dispatch(
      moveTask({
        boardId: activeBoardId,
        taskId: draggedTaskId,
        toColumnId: destColumnId,
      }),
    );

    setDraggedTaskId(null);
  };

  return (
    <div className="App" style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h1>Kanban Boards</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <LoadBoardForm
        inputBoardId={inputBoardId}
        setInputBoardId={setInputBoardId}
        onLoadBoard={handleLoadBoard}
        loadingError={''}
      />

      <BoardForm
        boardTitleInput={boardTitleInput}
        setBoardTitleInput={setBoardTitleInput}
        onSaveBoard={handleSaveBoard}
        editingBoardId={editingBoardId}
        setEditingBoardId={setEditingBoardId}
      />

      <BoardList
        boards={boards}
        activeBoardId={activeBoardId}
        editingBoardId={editingBoardId}
        editingBoardTitle={editingBoardTitle}
        setEditingBoardTitle={setEditingBoardTitle}
        startEditingBoard={startEditingBoard}
        saveBoardTitle={saveBoardTitle}
        cancelEditingBoard={cancelEditingBoard}
        handleBoardIdClick={setInputBoardId}
        handleDeleteBoard={handleDeleteBoard}
      />

      {activeBoard && (
        <>
          <TaskForm
            activeBoardColumns={activeBoard.columns}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskDesc={newTaskDesc}
            setNewTaskDesc={setNewTaskDesc}
            newTaskColumnId={newTaskColumnId}
            setNewTaskColumnId={setNewTaskColumnId}
            handleAddTask={handleAddTask}
          />

          <BoardColumns
            columns={activeBoard.columns}
            editingTaskId={editingTaskId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editDesc={editDesc}
            setEditDesc={setEditDesc}
            saveTaskEdit={saveTaskEdit}
            setEditingTaskId={setEditingTaskId}
            startEditingTask={startEditingTask}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            activeBoardId={activeBoardId!}
            dispatchDeleteTask={dispatchDeleteTask}
          />
        </>
      )}
    </div>
  );
};

export default App;
