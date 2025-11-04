'use client';

interface QuestionCardProps {
  questionText: string;
  mediaUrl?: string | null;
}

export const QuestionCard = ({ questionText, mediaUrl }: QuestionCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-6 flex-grow">
      {mediaUrl && (
        <div className="w-full max-w-md mb-6 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={mediaUrl} 
            alt="Question media" 
            className="w-full h-auto max-h-64 object-contain" 
          />
        </div>
      )}
      <p className="text-2xl md:text-3xl font-bold text-center text-slate-900 leading-relaxed">
        {questionText}
      </p>
    </div>
  );
};