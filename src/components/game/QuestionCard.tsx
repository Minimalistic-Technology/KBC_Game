'use client';

interface QuestionCardProps {
  questionText: string;
  mediaUrl?: string | null;
  mediaType?:string | null;
}

export const QuestionCard = ({ questionText, mediaUrl, mediaType }: QuestionCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-6 flex-grow w-full">
      {/* Media section */}
      {mediaUrl && (
        <div className="w-full flex justify-center mb-6">
          {mediaType === "image" && (
            <img
              src={mediaUrl}
              alt="Question media"
              className="w-full max-w-4xl rounded-lg object-contain shadow-lg"
            />
          )}

          {mediaType === "audio" && (
            <audio
              controls
              className="w-full max-w-md rounded-lg shadow-md"
            >
              <source src={mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {mediaType === "video" && (
            <video
              controls
              className="w-full max-w-3xl rounded-lg shadow-lg"
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {/* Question Text */}
      <p className="text-2xl md:text-3xl font-bold text-center text-slate-900 leading-relaxed px-4">
        {questionText}
      </p>
    </div>
  );
};
