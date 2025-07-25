import { X } from "lucide-react";

interface VideoPopupProps {
  videoUrl: string;
  onClose: () => void;
}

export default function VideoPopup({ videoUrl, onClose }: VideoPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/80 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="aspect-w-16 aspect-h-9 h-[600px]">
          <iframe 
            src={videoUrl}
            title="Demo Video"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
