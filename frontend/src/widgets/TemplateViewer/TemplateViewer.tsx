import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TemplateContent } from '../../entities/template/types';
import { useUpdateTemplate } from '../../entities/template/api';
import './TemplateViewer.css';

interface Props {
  template: TemplateContent;
}

export function TemplateViewer({ template }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(template.content);
  const updateTemplate = useUpdateTemplate();

  useEffect(() => {
    if (!isEditing) {
      setContent(template.content);
    }
  }, [template, isEditing]);

  const handleSave = () => {
    updateTemplate.mutate(
      { name: template.name, payload: { content } },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const handleCancel = () => {
    setContent(template.content);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-[var(--shadow-glow)] overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border bg-card/80 backdrop-blur-sm z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{template.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(template.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ease-out active:scale-95 rounded-xl hover:bg-input"
                disabled={updateTemplate.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 ease-out active:scale-95 rounded-xl shadow-sm"
                disabled={updateTemplate.isPending}
              >
                {updateTemplate.isPending ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200 ease-out active:scale-95 rounded-xl"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-background/50">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 bg-transparent text-foreground focus:outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Write your markdown here..."
          />
        ) : (
          <div className="p-8 markdown-content">
            <Markdown remarkPlugins={[remarkGfm]}>
              {content}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
