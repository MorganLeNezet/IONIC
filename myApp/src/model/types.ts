export interface Task {
  id?: string;
  title: string;
  dueDate: string;
  category: string;
  status: string;
  audioData?: {
    base64: string;
    mimeType: string;
  } | null;
}