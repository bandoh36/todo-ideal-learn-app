export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  score: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Pages {
  name: string;
  href: string;
}

export interface TodoData {
  todos: Todo[];
  maxScore: number;
  lastUpdated: string;
  categories?: Category[];
  version?: string;
}
