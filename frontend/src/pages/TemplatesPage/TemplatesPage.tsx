import { useState, useMemo } from 'react';
import { useGetTemplates, useGetTemplate } from '../../entities/template/api';
import { TemplateGraph } from '../../widgets/TemplateGraph/TemplateGraph';
import { TemplateViewer } from '../../widgets/TemplateViewer/TemplateViewer';
import { buildGraph } from '../../entities/template/lib/buildGraph';

export function TemplatesPage() {
  const { data: templates = [] } = useGetTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedTemplate } = useGetTemplate(selectedId);

  const graphData = useMemo(() => buildGraph(templates), [templates]);

  return (
    <div className="relative flex h-full overflow-hidden w-full bg-transparent">
      {/* Graph — takes full width */}
      <div className="flex-1 relative w-full h-full">
        {templates.length > 0 && (
          <TemplateGraph
            data={graphData}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {/* Hint if nothing is selected */}
        {!selectedId && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-muted-foreground/30 tracking-widest uppercase">
              Click a node
            </p>
          </div>
        )}
      </div>

      {/* Viewer — drawer slides in from the right */}
      <div className={`
        absolute right-0 top-0 h-full w-[560px] max-w-full z-20
        bg-background/90 backdrop-blur-xl border-l border-border/30
        transition-transform duration-300 ease-out shadow-2xl
        ${selectedId ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {selectedTemplate && (
          <div className="h-full flex flex-col relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 overflow-auto p-8 pt-12">
              <TemplateViewer template={selectedTemplate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
