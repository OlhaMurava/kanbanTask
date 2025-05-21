import React from 'react';
import TaskCard from './TaskCard';

type Task = {
  id: string;
  title: string;
  description: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type BoardColumnsProps = {
  columns: Column[];
  editingTaskId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editDesc: string;
  setEditDesc: (desc: string) => void;
  saveTaskEdit: () => void;
  setEditingTaskId: (id: string | null) => void;
  startEditingTask: (taskId: string, title: string, description: string, columnId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, destColumnId: string) => void;
  activeBoardId: string | null;
  dispatchDeleteTask: (taskId: string) => void;
};

const BoardColumns: React.FC<BoardColumnsProps> = ({
  columns,
  editingTaskId,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  saveTaskEdit,
  setEditingTaskId,
  startEditingTask,
  onDragStart,
  onDragOver,
  onDrop,
  activeBoardId,
  dispatchDeleteTask,
}) => {
  return (
    <div className="board-columns" style={{ display: 'flex', gap: 20 }}>
      {columns.map((column) => (
        <div
          key={column.id}
          className="column task-column"
          style={{
            flex: '1 1 0',
            backgroundColor: '#eee',
            borderRadius: 6,
            padding: 12,
            minWidth: 200,
          }}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, column.id)}
        >
          <h3>{column.title}</h3>

          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              editingTaskId={editingTaskId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDesc={editDesc}
              setEditDesc={setEditDesc}
              saveTaskEdit={saveTaskEdit}
              setEditingTaskId={setEditingTaskId}
              startEditingTask={startEditingTask}
              columnId={column.id}
              onDragStart={onDragStart}
              activeBoardId={activeBoardId}
              dispatchDeleteTask={dispatchDeleteTask}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BoardColumns;
