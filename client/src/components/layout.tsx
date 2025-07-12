import { Link, useLocation } from "wouter";
import { SearchX, History, Bookmark, Download } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <SearchX className="text-google-blue w-6 h-6 mr-2" />
                <span className="text-xl font-medium text-google-gray-dark">GapFinder</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/history" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/history' 
                  ? 'text-google-blue bg-blue-50' 
                  : 'text-google-gray hover:text-google-blue'
              }`}>
                <History className="w-4 h-4 mr-1" />
                History
              </Link>
              <Link href="/saved" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === '/saved' 
                  ? 'text-google-blue bg-blue-50' 
                  : 'text-google-gray hover:text-google-blue'
              }`}>
                <Bookmark className="w-4 h-4 mr-1" />
                Saved
              </Link>
              <button className="flex items-center bg-google-blue text-white px-4 py-2 rounded-lg hover:bg-google-blue-dark transition-colors">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {children}
    </div>
  );
}
