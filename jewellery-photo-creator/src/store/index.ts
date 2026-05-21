import { create } from 'zustand';
import type { ImageJob, JobHistoryItem } from '../types';
import { GoogleProvider } from '../lib/providers/google';

const provider = new GoogleProvider();

interface AppState {
  currentJob: ImageJob;
  setSourceImage: (file: File) => void;
  setPrompt: (prompt: string) => void;
  generateImage: () => Promise<void>;
  resetJob: () => void;
  selectHistoryItem: (item: JobHistoryItem) => void;
}

const initialJobState: ImageJob = {
  id: '',
  sourceImage: null,
  sourceImageUrl: null,
  editedImageUrl: null,
  status: 'idle',
  prompt: '',
  history: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  currentJob: { ...initialJobState },

  setSourceImage: (file) => {
    const imageUrl = URL.createObjectURL(file);
    set((state) => ({
      currentJob: {
        ...state.currentJob,
        id: Math.random().toString(36).substring(7),
        sourceImage: file,
        sourceImageUrl: imageUrl,
        status: 'idle',
        editedImageUrl: null,
      },
    }));
  },

  setPrompt: (prompt) => {
    set((state) => ({
      currentJob: {
        ...state.currentJob,
        prompt,
      },
    }));
  },

  generateImage: async () => {
    const { currentJob } = get();
    if (!currentJob.sourceImage || !currentJob.prompt) return;

    set((state) => ({
      currentJob: { ...state.currentJob, status: 'processing', error: undefined },
    }));

    try {
      // In a real app, this would call the actual provider.
      // We are mocking it here to return a placeholder after a delay.
      const resultUrl = await provider.processImage(currentJob.sourceImage, currentJob.prompt);
      
      const historyItem: JobHistoryItem = {
        id: Math.random().toString(36).substring(7),
        prompt: currentJob.prompt,
        resultUrl,
        timestamp: Date.now(),
      };

      set((state) => ({
        currentJob: {
          ...state.currentJob,
          status: 'completed',
          editedImageUrl: resultUrl,
          history: [historyItem, ...state.currentJob.history],
        },
      }));
    } catch {
      set((state) => ({
        currentJob: {
          ...state.currentJob,
          status: 'error',
          error: 'Failed to generate image. Please try again.',
        },
      }));
    }
  },

  resetJob: () => {
    set({ currentJob: { ...initialJobState } });
  },
  
  selectHistoryItem: (item) => {
    set((state) => ({
        currentJob: {
            ...state.currentJob,
            editedImageUrl: item.resultUrl,
            prompt: item.prompt,
            status: 'completed'
        }
    }))
  }
}));
