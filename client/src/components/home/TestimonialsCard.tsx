import React from "react";

type TestimonialsCardProps = {
  name: string;
  username: string;
  image: string;
  text: string;
  delay?: number;
};

const TestimonialsCard: React.FC<TestimonialsCardProps> = ({
  name,
  username,
  image,
  text,
  delay = 0,
}) => {
  return (
    <div
      className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-gray-700 text-sm mb-6">“{text}”</p>
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-gray-500">{username}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCard;
