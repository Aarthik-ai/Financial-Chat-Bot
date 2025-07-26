import { useState, KeyboardEvent, MouseEvent } from 'react';
import { useLocation } from 'wouter';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [, setLocation] = useLocation();

  const handleSearch = (e?: MouseEvent<HTMLImageElement>) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/chat?message=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation('/chat');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%' height='100%' fill='none'/><path d='M 40 0 L 0 0 0 40' fill='none' stroke='%23E4F5FF' stroke-width='1'/><path d='M0 0 H40 M0 0 V40' stroke='%23E4F5FF' stroke-width='0.5'/></svg>")`,
        backgroundRepeat: "repeat",
      }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 mb-4">
        Smarter Finance Answers
      </h1>

      <div className="pb-1">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.3] bg-gradient-to-r from-[#796FFF] to-[#74CBFC] text-transparent bg-clip-text mb-4">
          Instantly Delivered
        </h2>
      </div>

      <p className="text-gray-500 text-lg max-w-xl mb-8">
        Search any company or stock and get instant insights powered by
        real-time data.
      </p>

      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-3 shadow-sm">
          <img src="/home/search.svg" alt="Search" className="w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="What are the top 5 AI stocks in 2025?"
            className="flex-grow outline-none text-gray-700 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <img
            src="/home/arrow.svg"
            alt="Arrow"
            className="w-6 h-6 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#4686FE] to-[#87B0FF] shadow-lg cursor-pointer"
          onClick={() => setLocation('/chat')}
        >
          Try For Free
        </button>
        <button
          className="bg-white px-6 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-100 cursor-pointer shadow-lg"
          onClick={() => setLocation('/register')}
        >
          Register ↗
        </button>
      </div>
    </div>
  );
}