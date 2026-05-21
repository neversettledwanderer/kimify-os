import { Clock } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

export function HistoryGallery() {
  const { currentJob, selectHistoryItem } = useAppStore();
  
  if (currentJob.history.length === 0) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-premium-400">
             <Clock className="w-8 h-8 mb-3 opacity-20" />
             <p className="text-sm">No history yet.<br/>Your generated edits will appear here.</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-premium-50">
      <div className="p-4 border-b border-premium-200 bg-white sticky top-0 z-10">
        <h3 className="font-medium text-premium-900 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Edit History
        </h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {currentJob.history.map((item) => (
          <button
            key={item.id}
            onClick={() => selectHistoryItem(item)}
            className={cn(
              "w-full text-left bg-white border rounded-xl overflow-hidden hover:border-premium-900 transition-colors group relative",
              currentJob.editedImageUrl === item.resultUrl ? "border-premium-900 ring-1 ring-premium-900" : "border-premium-200"
            )}
          >
            <div className="aspect-square w-full bg-premium-100 border-b border-premium-100">
                <img src={item.resultUrl} alt="History item" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs text-premium-600 line-clamp-2 leading-relaxed">
                "{item.prompt}"
              </p>
              <p className="text-[10px] text-premium-400 mt-2">
                {new Date(item.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
