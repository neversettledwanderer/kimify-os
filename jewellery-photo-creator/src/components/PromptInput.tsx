import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

export function PromptInput() {
  const { currentJob, setPrompt, generateImage } = useAppStore();
  const [localPrompt, setLocalPrompt] = useState(currentJob.prompt || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localPrompt.trim()) return;
    setPrompt(localPrompt);
    generateImage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalPrompt(currentJob.prompt);
  }, [currentJob.prompt]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full shadow-sm rounded-2xl bg-white border border-premium-300 focus-within:border-premium-900 focus-within:ring-1 focus-within:ring-premium-900 transition-all">
      <textarea
        value={localPrompt}
        onChange={(e) => setLocalPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="E.g., Place this gold ring on warm beige marble with soft luxury lighting..."
        className="w-full bg-transparent border-0 resize-none p-4 pr-32 focus:ring-0 text-premium-900 placeholder:text-premium-400 min-h-[100px] rounded-2xl"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          type="button"
          className="text-xs text-premium-500 hover:text-premium-900 flex items-center gap-1 px-2 py-1"
          title="Enhance prompt automatically"
        >
          <Sparkles className="w-3 h-3" />
          Enhance
        </button>
        <button
          type="submit"
          disabled={!localPrompt.trim() || currentJob.status === 'processing'}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors",
            localPrompt.trim() && currentJob.status !== 'processing'
              ? "bg-premium-900 text-white hover:bg-premium-950"
              : "bg-premium-100 text-premium-400 cursor-not-allowed"
          )}
        >
          {currentJob.status === 'processing' ? 'Generating...' : 'Generate'}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
