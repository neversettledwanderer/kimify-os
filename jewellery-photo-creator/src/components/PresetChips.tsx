import { useAppStore } from '../store';
import type { PresetStyle } from '../types';

const PRESETS: PresetStyle[] = [
  { id: '1', label: 'Clean Catalogue', prompt: 'Clean white background studio catalogue shot with soft subtle reflections, maintaining exact product details.' },
  { id: '2', label: 'Soft Beige Luxury', prompt: 'Place this jewellery on warm soft beige velvet fabric with gentle luxury editorial lighting.' },
  { id: '3', label: 'Warm Marble', prompt: 'Place this item on a warm tone marble block with elegant shadows and high-end styling.' },
  { id: '4', label: 'Dark Premium', prompt: 'Create a dark premium scene with the jewellery placed on dark slate, highlighted by a focused soft spotlight.' },
  { id: '5', label: 'Minimal Insta', prompt: 'Create an Instagram ad version with a refined minimal pastel background and elegant drop shadow.' },
];

export function PresetChips() {
  const { setPrompt } = useAppStore();

  return (
    <div className="w-full">
      <p className="text-xs font-medium text-premium-500 mb-2 uppercase tracking-wider">Quick Presets</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setPrompt(preset.prompt)}
            className="px-4 py-1.5 rounded-full text-sm bg-white border border-premium-200 text-premium-700 hover:border-premium-900 hover:text-premium-900 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
