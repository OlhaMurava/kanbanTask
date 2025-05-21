import React from 'react';

type Column = {
  id: string;
  title: string;
};

type TaskFormProps = {
  activeBoardColumns: Column[];
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskDesc: string;
  setNewTaskDesc: (desc: string) => void;
  newTaskColumnId: string;
  setNewTaskColumnId: (id: string) => void;
  handleAddTask: () => void;
};

const TaskForm: React.FC<TaskFormProps> = ({
  activeBoardColumns,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDesc,
  setNewTaskDesc,
  newTaskColumnId,
  setNewTaskColumnId,
  handleAddTask,
}) => {
  return (
    <div className="global-task-form" style={{ marginBottom: 20 }}>
      <h3>Add Task</h3>
      <input
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Task title"
      />
      <textarea
        value={newTaskDesc}
        onChange={(e) => setNewTaskDesc(e.target.value)}
        placeholder="Task description"
      />
      <select value={newTaskColumnId} onChange={(e) => setNewTaskColumnId(e.target.value)}>
        <option value="">Select Column</option>
        {activeBoardColumns.map((col) => (
          <option key={col.id} value={col.id}>
            {col.title}
          </option>
        ))}
      </select>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskForm;
