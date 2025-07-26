import React, { useState } from "react";
import faqData from "@/components/data/FAQ.json";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
        Your Questions, Our{" "}
        <span className="text-indigo-400 font-bold">Answer</span>
      </h2>
      <div className="bg-white border rounded-xl p-8 w-full max-w-2xl shadow-sm">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="py-3 cursor-pointer transition-all"
            onClick={() => toggleAnswer(index)}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm sm:text-base font-medium">
                {item.question}
              </p>
              <span className="text-xl text-gray-500">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <p
                className="text-sm bg-clip-text text-transparent mt-2"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #787DFF 0%, #77A5FE 100%)",
                }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;