import React, { useState, useRef } from 'react';
import { useCreateNote } from '../../entities/note/api';

export const CreateNoteForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDocInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: createNote, isPending } = useCreateNote();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);

      // Generate previews for images
      newFiles.forEach(f => {
        if (f.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target?.result) {
              setPreviews(prev => [...prev, ev.target!.result as string]);
            }
          };
          reader.readAsDataURL(f);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (fileDocInputRef.current) fileDocInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const normalizedTags = tags
      .split(',')
      .map(t => t.trim().replace(/^#+/, ''))
      .filter(t => t.length > 0)
      .join(',');

    createNote(
      { content, tags: normalizedTags, files },
      {
        onSuccess: () => {
          setContent('');
          setTags('');
          setFiles([]);
          setPreviews([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          if (fileDocInputRef.current) fileDocInputRef.current.value = '';
        },
      }
    );
  };

  const hasContent = content.trim().length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-xl border border-border/40 bg-card/30 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
          rows={4}
          className="w-full px-4 pt-3 pb-2 bg-transparent outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/30 leading-relaxed"
          style={{ fontWeight: 400 }}
          required
        />

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
            {previews.map((src, i) => (
              <div key={i} className="relative flex-shrink-0 group/thumb">
                <img src={src} alt="" className="h-16 w-16 object-cover rounded-lg border border-border/30" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150"
                >
                  <svg className="w-2.5 h-2.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Non-image file chips */}
        {files.filter(f => !f.type.startsWith('image/')).length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {files.map((f, i) => {
              if (f.type.startsWith('image/')) return null;
              return (
                <span key={i} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-muted/30 rounded-md text-[11px] text-muted-foreground" style={{ fontWeight: 400 }}>
                  {f.name.length > 20 ? f.name.substring(0, 20) + '...' : f.name}
                  <button type="button" onClick={() => removeFile(i)} className="p-0.5 rounded hover:bg-muted/50 transition-opacity duration-150">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Tags */}
        <div className="px-4 pb-2">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="# Add tags..."
            className="w-full bg-transparent outline-none text-xs text-muted-foreground placeholder:text-muted-foreground/25"
            style={{ fontWeight: 400 }}
          />
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/20">
          <div className="flex items-center gap-1">
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/20 cursor-pointer transition-colors duration-150 active:scale-95" style={{ fontWeight: 400 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image
              <input type="file" multiple accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            </label>
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/20 cursor-pointer transition-colors duration-150 active:scale-95" style={{ fontWeight: 400 }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              File
              <input type="file" multiple accept=".pdf,.md,.txt,.doc,.docx" onChange={handleFileChange} ref={fileDocInputRef} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending || !hasContent}
            className="px-4 py-1.5 bg-foreground text-background text-xs rounded-lg hover:opacity-90 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-opacity duration-150 ease-out"
            style={{ fontWeight: 500 }}
          >
            {isPending ? 'Saving...' : 'Save note'}
          </button>
        </div>
      </div>
    </form>
  );
};
