import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import BuilderPreview from './BuilderPreview';

export default function BuilderPage() {
  const [generated, setGenerated] = useState(null);

  return (
    <div className="flex min-h-screen">
      <ChatSidebar onGenerate={(item) => setGenerated(item)} />
      <main className="flex-1 bg-gradient-to-br from-slate-50 to-white overflow-auto">
        <div className="max-w-8xl mx-auto py-10">
          <BuilderPreview item={generated} />
        </div>
      </main>
    </div>
  );
}
