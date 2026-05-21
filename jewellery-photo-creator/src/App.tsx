import { UploadArea } from './components/UploadArea';
import { EditorWorkspace } from './components/EditorWorkspace';
import { useAppStore } from './store';

function App() {
  const currentJob = useAppStore((state) => state.currentJob);

  return (
    <div className="min-h-screen bg-premium-50 font-sans selection:bg-premium-900 selection:text-white">
      {currentJob.sourceImage ? <EditorWorkspace /> : <UploadArea />}
    </div>
  );
}

export default App;
