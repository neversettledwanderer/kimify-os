import { useAppStore } from '../store';
import { PromptInput } from './PromptInput';
import { PresetChips } from './PresetChips';
import { HistoryGallery } from './HistoryGallery';
import { Download, RefreshCw, ChevronLeft } from 'lucide-react';

export function EditorWorkspace() {
  const { currentJob, resetJob } = useAppStore();

  const handleDownload = () => {
    if (currentJob.editedImageUrl) {
        // Mock download
        const link = document.createElement('a');
        link.href = currentJob.editedImageUrl;
        link.download = `jewellery-edit-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="flex h-screen bg-premium-50">
      {/* Sidebar History */}
      <div className="w-80 border-r border-premium-200 bg-white hidden md:block overflow-y-auto">
        <HistoryGallery />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-premium-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={resetJob}
              className="p-2 hover:bg-premium-100 rounded-full transition-colors text-premium-600"
              title="Start New"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium text-premium-900">Editor Workspace</h2>
          </div>
          <div className="flex items-center gap-3">
            {currentJob.status === 'completed' && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-premium-300 rounded-full text-sm font-medium hover:bg-premium-50 transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            
          <div className="w-full max-w-5xl">
            {/* Image Preview Container */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Original */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-premium-600 uppercase tracking-wider">Original</span>
                <div className="aspect-square bg-white border border-premium-200 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                  {currentJob.sourceImageUrl && (
                    <img
                      src={currentJob.sourceImageUrl}
                      alt="Original upload"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Result */}
              <div className="flex flex-col gap-2">
                 <span className="text-sm font-medium text-premium-600 uppercase tracking-wider flex items-center gap-2">
                    Result 
                    {currentJob.status === 'processing' && <RefreshCw className="w-3 h-3 animate-spin" />}
                 </span>
                <div className="aspect-square bg-white border border-premium-200 rounded-2xl overflow-hidden flex items-center justify-center relative">
                  {currentJob.status === 'processing' && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
                      <RefreshCw className="w-8 h-8 text-premium-900 animate-spin mb-4" />
                      <p className="text-premium-900 font-medium">Refining image...</p>
                    </div>
                  )}
                  {currentJob.editedImageUrl ? (
                    <img
                      src={currentJob.editedImageUrl}
                      alt="Edited result"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-premium-400 text-sm p-8 text-center">
                      Your generated image will appear here. Enter an instruction below to begin.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="max-w-3xl mx-auto space-y-6">
                <PresetChips />
                <PromptInput />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
