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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{template.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(template.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 ease-out active:scale-[0.98] rounded-md hover:bg-muted"
                disabled={updateTemplate.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-200 ease-out active:scale-[0.98] rounded-md"
                disabled={updateTemplate.isPending}
              >
                {updateTemplate.isPending ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors duration-200 ease-out active:scale-[0.98] rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto mt-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent text-foreground focus:outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Write your markdown here..."
            spellCheck="false"
          />
        ) : (
          <div className="markdown-content">
            <Markdown remarkPlugins={[remarkGfm]}>
              {content}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
