import { useState } from 'react';
import { useGetTemplates, useGetTemplate } from '../../entities/template/api';
import { TemplateViewer } from '../../widgets/TemplateViewer/TemplateViewer';

export function TemplatesPage() {
  const { data: templates = [], isLoading: templatesLoading } = useGetTemplates();
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  const { data: selectedTemplate, isLoading: templateLoading } = useGetTemplate(selectedTemplateName);

  return (
    <div className="flex h-[calc(100vh-3rem)] gap-6">
      {/* Sidebar */}
      <div className="w-80 flex flex-col gap-5 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your system templates.</p>
        </div>
        
        <div className="flex-1 bg-card rounded-2xl border border-border shadow-[var(--shadow-glow)] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <h2 className="font-semibold text-foreground text-sm tracking-wide uppercase">Available Templates</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 bg-background/50">
            {templatesLoading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">No templates found.</div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setSelectedTemplateName(template.name)}
                    className={`text-left px-4 py-3 rounded-xl transition-all duration-200 ease-out active:scale-95 text-sm ${
                      selectedTemplateName === template.name
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-input hover:text-foreground'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span>{template.name}</span>
                      <span className="text-[10px] opacity-70 font-normal">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden">
        {selectedTemplateName ? (
          templateLoading ? (
            <div className="h-full flex items-center justify-center bg-card rounded-2xl border border-border shadow-sm">
              <div className="animate-pulse flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm">Loading template...</p>
              </div>
            </div>
          ) : selectedTemplate ? (
            <TemplateViewer template={selectedTemplate} />
          ) : (
            <div className="h-full flex items-center justify-center bg-card rounded-2xl border border-border shadow-sm">
              <p className="text-muted-foreground">Failed to load template.</p>
            </div>
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-card/30 rounded-2xl border border-border border-dashed shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Template Selected</h2>
            <p className="text-muted-foreground text-sm max-w-xs text-center">
              Select a template from the sidebar to view and edit its contents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
