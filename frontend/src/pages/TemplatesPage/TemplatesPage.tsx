import { useState } from 'react';
import { useGetTemplates, useGetTemplate } from '../../entities/template/api';
import { TemplateViewer } from '../../widgets/TemplateViewer/TemplateViewer';

export function TemplatesPage() {
  const { data: templates = [], isLoading: templatesLoading } = useGetTemplates();
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  const { data: selectedTemplate, isLoading: templateLoading } = useGetTemplate(selectedTemplateName);

  return (
    <div className="flex flex-col h-full gap-4 animate-in fade-in duration-300 p-6 md:p-8 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Templates</h1>
        <p className="text-muted-foreground text-sm">Manage and customize your system templates.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden mt-4">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-2 flex-shrink-0 border-r border-border pr-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Available Templates
          </h2>
          <div className="flex-1 overflow-y-auto">
            {templatesLoading ? (
              <div className="text-sm text-muted-foreground">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="text-sm text-muted-foreground">No templates found.</div>
            ) : (
              <div className="flex flex-col gap-1">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setSelectedTemplateName(template.name)}
                    className={`text-left px-3 py-2 rounded-md transition-colors duration-200 ease-out active:scale-[0.98] text-sm flex justify-between items-center group ${
                      selectedTemplateName === template.name
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{template.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-hidden bg-card border border-border rounded-lg shadow-sm">
          {selectedTemplateName ? (
            templateLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-muted-foreground text-sm flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-muted-foreground border-t-foreground rounded-full animate-spin" />
                  Loading...
                </div>
              </div>
            ) : selectedTemplate ? (
              <div className="h-full p-6">
                <TemplateViewer template={selectedTemplate} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Failed to load template.</p>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-4 bg-muted/30">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-foreground mb-1">No Template Selected</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                Select a template from the sidebar to view its contents and edit the markdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
