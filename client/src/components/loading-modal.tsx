interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export default function LoadingModal({ 
  isOpen, 
  title = "Analyzing Gaps...", 
  message = "Our AI is scanning existing solutions to find what's missing" 
}: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-google-gray-dark mb-2">{title}</h3>
          <p className="text-google-gray">{message}</p>
        </div>
      </div>
    </div>
  );
}
