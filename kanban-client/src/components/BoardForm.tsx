import React from 'react';

type BoardFormProps = {
  boardTitleInput: string;
  setBoardTitleInput: (title: string) => void;
  onSaveBoard: () => void;
  editingBoardId: string | null;
  setEditingBoardId: (id: string | null) => void;
};

const BoardForm: React.FC<BoardFormProps> = ({
  boardTitleInput,
  setBoardTitleInput,
  onSaveBoard,
  setEditingBoardId,
}) => {
  return (
    <div className="board-form" style={{ marginBottom: 20 }}>
      <input
        value={boardTitleInput}
        onChange={(e) => setBoardTitleInput(e.target.value)}
        placeholder="New board title"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSaveBoard();
          if (e.key === 'Escape') {
            setEditingBoardId(null);
            setBoardTitleInput('');
          }
        }}
      />
      <button onClick={onSaveBoard}> Create Board</button>
    </div>
  );
};

export default BoardForm;
