interface Action {
  type: string;
  payload: any;
}

class UndoRedoStack {
  private history: Action[] = [];
  private future: Action[] = [];
  private maxSize: number;

  constructor(maxSize: number = 200) {
    this.maxSize = maxSize;
  }

  execute(action: Action) {
    this.history.push(action);
    if (this.history.length > this.maxSize) {
      this.history.shift(); // Remove the oldest action if stack exceeds max size
    }
    this.future = []; // Clear future when a new action is executed
  }

  undo(): Action | undefined {
    const action = this.history.pop();
    if (action) {
      this.future.push(action);
    }
    return action;
  }

  redo(): Action | undefined {
    const action = this.future.pop();
    if (action) {
      this.history.push(action);
    }
    return action;
  }

  clear() {
    this.history = [];
    this.future = [];
  }

  getHistory(): Action[] {
    return this.history;
  }

  getFuture(): Action[] {
    return this.future;
  }
}

export const undoRedoStack = new UndoRedoStack();
