import React from 'react';
import { useGenerateArchitectureIdea } from '../../../entities/idea/api';

interface GenerateArchitectureButtonProps {
  ideaId: string;
}

export const GenerateArchitectureButton: React.FC<GenerateArchitectureButtonProps> = ({ ideaId }) => {
  const generateArchitecture = useGenerateArchitectureIdea();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        generateArchitecture.mutate(ideaId);
      }}
      disabled={generateArchitecture.isPending}
      className="w-full mt-4 px-4 py-2 font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-transform duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    >
      Generate Architecture
    </button>
  );
};
