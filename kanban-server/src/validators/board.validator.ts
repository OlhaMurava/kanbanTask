export function validateBoardTitle(title: string) {
  if (!title) throw new Error('Title is required');
}

export function validateTaskInput(title: string, description: string) {
  if (!title || !description)
    throw new Error('Title and Description are required');
}
