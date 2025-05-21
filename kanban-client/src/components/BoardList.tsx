import React from 'react';
import '../App.css';

type Board = {
  id: string;
  title: string;
};

type BoardListProps = {
  boards: Board[];
  activeBoardId: string | null;
  editingBoardId: string | null;
  editingBoardTitle: string;
  setEditingBoardTitle: (title: string) => void;
  startEditingBoard: (boardId: string, currentTitle: string) => void;
  saveBoardTitle: (boardId: string) => void;
  cancelEditingBoard: () => void;
  handleBoardIdClick: (id: string) => void;
  handleDeleteBoard: (id: string) => void;
};

const BoardList: React.FC<BoardListProps> = ({
  boards,
  activeBoardId,
  editingBoardId,
  editingBoardTitle,
  setEditingBoardTitle,
  startEditingBoard,
  saveBoardTitle,
  cancelEditingBoard,
  handleBoardIdClick,
  handleDeleteBoard,
}) => {
  return (
    <div className="board-list" style={{ marginBottom: 20 }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {boards.map((board) => (
          <li
            key={board.id}
            style={{
              marginBottom: 8,
              backgroundColor: board.id === activeBoardId ? '#7a4fff' : '#d6caff',
              color: board.id === activeBoardId ? 'white' : 'black',
              padding: '6px 10px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: 'default',
            }}
          >
            <div title={`Board ID: ${board.id}`} style={{ flexGrow: 1, userSelect: 'text' }}>
              {editingBoardId === board.id ? (
                <>
                  <input
                    value={editingBoardTitle}
                    onChange={(e) => setEditingBoardTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveBoardTitle(board.id);
                      if (e.key === 'Escape') cancelEditingBoard();
                    }}
                  />
                  <button
                    className="button button-save"
                    onClick={() => saveBoardTitle(board.id)}
                    disabled={!editingBoardTitle.trim()}
                  >
                    Save
                  </button>
                  <button
                    className="button button-cancel"
                    onClick={cancelEditingBoard}
                    style={{ marginLeft: 8 }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{board.title}</strong>{' '}
                  <span
                    style={{
                      fontSize: '0.8em',
                      opacity: 0.8,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginLeft: 6,
                    }}
                    onClick={() => handleBoardIdClick(board.id)}
                    title="Click to copy Board ID to input"
                  >
                    ({board.id})
                  </span>
                </>
              )}
            </div>

            <div>
              {editingBoardId !== board.id && (
                <>
                  <button
                    className="button button-update"
                    onClick={() => startEditingBoard(board.id, board.title)}
                    title="Update Board"
                    style={{ marginRight: 8 }}
                  >
                    ✏️
                  </button>
                  <button
                    className="button button-delete"
                    onClick={() => handleDeleteBoard(board.id)}
                    title="Delete board"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;