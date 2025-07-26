import React, { useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stockData = [
  { name: "Mon", value: 100 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 200 },
  { name: "Thu", value: 400 },
  { name: "Fri", value: 350 },
];

type Card = {
  title: string;
  text: string;
  chart?: boolean;
  image?: string;
  horizontal?: boolean;
};

const cards: Card[] = [
  {
    title: "Real–Time Stock Insights",
    text: "Understand stock trends, key metrics, and market sentiment — simplified.",
    chart: true,
  },
  {
    title: "Smart Budgeting",
    text: "Get personalized tips to plan, save, and optimize your monthly spending.",
    image: "/streamline/smart.svg",
  },
  {
    title: "Investment Suggestions",
    text: "Explore potential opportunities with AI-backed, data–driven insights.",
    image: "/streamline/invest.svg",
  },
  {
    title: "AI-Powered Q&A",
    text: "Ask anything — from personal finance to company reports",
    image: "/streamline/ai.svg",
    horizontal: true,
  },
  {
    title: "Market Highlights",
    text: "Stay updated with simplified summaries of complex financial news",
    image: "/streamline/market.svg",
    horizontal: true,
  },
];

const StreamLine: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    Array(cards.length).fill(false)
  );

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        const updated = [...visibleCards];
        entries.forEach((entry) => {
          const index = cardRefs.current.findIndex((el) => el === entry.target);
          if (entry.isIntersecting && !updated[index]) {
            updated[index] = true;
          }
        });
        setVisibleCards(updated);
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [visibleCards]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 mx-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
          Streamline Finances with Smart{" "}
          <span className="bg-gradient-to-r from-[#7972FF] to-[#76B6FD] bg-clip-text text-transparent">
            Features
          </span>
        </h2>
      </div>

      {/* Top 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.slice(0, 3).map((card, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className={`border border-gray-200 rounded-xl p-6 shadow-lg cursor-pointer bg-white transition-all duration-700 ease-out transform ${
              visibleCards[i]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{card.text}</p>
            {card.chart ? (
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={stockData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#75ADFD"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center">
                <img
                  src={card.image}
                  alt={card.title}
                  width={220}
                  height={220}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom 2 horizontal cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.slice(3).map((card, i) => {
          const index = i + 3;
          return (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`border border-gray-200 rounded-xl p-6 shadow-lg cursor-pointer bg-white flex flex-col md:flex-row justify-between items-center transition-all duration-700 ease-out ${
                visibleCards[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="md:w-1/2">
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{card.text}</p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={card.image}
                  alt={card.title}
                  width={220}
                  height={220}
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StreamLine;