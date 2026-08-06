import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TemplateContent } from '../../entities/template/types';
import './TemplateViewer.css';

interface Props {
  template: TemplateContent;
}

export function TemplateViewer({ template }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{template.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(template.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto mt-6">
        <div className="markdown-content">
          <Markdown remarkPlugins={[remarkGfm]}>
            {template.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
