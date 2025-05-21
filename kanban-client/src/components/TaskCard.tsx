import React from 'react';

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string;
  };
  editingTaskId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editDesc: string;
  setEditDesc: (desc: string) => void;
  saveTaskEdit: () => void;
  setEditingTaskId: (id: string | null) => void;
  startEditingTask: (taskId: string, title: string, description: string, columnId: string) => void;
  columnId: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  activeBoardId: string | null;
  dispatchDeleteTask: (taskId: string) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  editingTaskId,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  saveTaskEdit,
  setEditingTaskId,
  startEditingTask,
  columnId,
  onDragStart,
  activeBoardId,
  dispatchDeleteTask,
}) => {
  if (editingTaskId === task.id) {
    return (
      <div
        key={task.id}
        style={{
          marginBottom: 12,
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fffbea',
          boxShadow: '0 0 8px rgba(255, 223, 93, 0.6)',
          border: '1.5px solid #ffd93b',
        }}
      >
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          style={{
            width: '100%',
            padding: 8,
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Task description"
          style={{
            width: '100%',
            padding: 8,
            fontSize: 14,
            borderRadius: 4,
            border: '1px solid #ccc',
            resize: 'vertical',
            minHeight: 60,
            marginBottom: 8,
          }}
        />
        <button
          onClick={saveTaskEdit}
          style={{
            backgroundColor: '#ffd93b',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Save
        </button>
        <button
          onClick={() => setEditingTaskId(null)}
          style={{
            marginLeft: 8,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      key={task.id}
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => startEditingTask(task.id, task.title, task.description, columnId)}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          startEditingTask(task.id, task.title, task.description, columnId);
        }}
        title="Edit task"
      >
        Edit✏️
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (activeBoardId) dispatchDeleteTask(task.id);
        }}
        title="Delete task"
      >
        Delete🗑️
      </button>
    </div>
  );
};

export default TaskCard;
