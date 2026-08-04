import React from 'react';
import { useGenerateArchitecture } from '../../../entities/idea/api';
import { toast } from 'sonner';

interface Props {
  ideaId: string;
}

export const GenerateArchitectureButton: React.FC<Props> = ({ ideaId }) => {
  const generate = useGenerateArchitecture();

  const handleGenerate = () => {
    toast.promise(
      generate.mutateAsync(ideaId),
      {
        loading: 'Generating architecture... this may take up to 20 seconds.',
        success: 'Architecture generated successfully!',
        error: (err) => `Failed to generate: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }
    );
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={generate.isPending}
      className="text-sm font-medium bg-foreground text-background py-2 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 ease-out active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {generate.isPending && (
        <svg className="animate-spin h-4 w-4 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span>{generate.isPending ? 'Generating...' : 'Generate Architecture'}</span>
    </button>
  );
};
