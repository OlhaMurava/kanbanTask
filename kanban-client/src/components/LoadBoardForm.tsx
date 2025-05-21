import React from 'react';

type LoadBoardFormProps = {
  inputBoardId: string;
  setInputBoardId: (id: string) => void;
  loadingError: string;
  onLoadBoard: () => void;
};

const LoadBoardForm: React.FC<LoadBoardFormProps> = ({
  inputBoardId,
  setInputBoardId,
  loadingError,
  onLoadBoard,
}) => {
  return (
    <div className="load-board-form" style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Enter Board ID"
        value={inputBoardId}
        onChange={(e) => setInputBoardId(e.target.value)}
      />
      <button onClick={onLoadBoard}>Load Board</button>
      {loadingError && <p style={{ color: 'red' }}>{loadingError}</p>}
    </div>
  );
};

export default LoadBoardForm;
