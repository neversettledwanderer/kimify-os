export type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export interface ImageJob {
  id: string;
  sourceImage: File | null;
  sourceImageUrl: string | null;
  editedImageUrl: string | null;
  status: JobStatus;
  prompt: string;
  error?: string;
  history: JobHistoryItem[];
}

export interface JobHistoryItem {
  id: string;
  prompt: string;
  resultUrl: string;
  timestamp: number;
}

export interface PresetStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface AIProvider {
  id: string;
  name: string;
  processImage: (image: File, prompt: string, options?: Record<string, unknown>) => Promise<string>;
}
