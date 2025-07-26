import { memo, useMemo } from "react";
import './FeatureOption.css';

const logos = [
  { src: "/logos/HT.png", alt: "Hindustan Times", width: 192, height: 48 },
  { src: "/logos/ZB.webp", alt: "Zee Business", width: 190, height: 64 },
  { src: "/logos/LM.webp", alt: "Lokmat Times", width: 176, height: 40 },
  { src: "/logos/JN.webp", alt: "Jio News", width: 190, height: 60 },
  { src: "/logos/GN.png", alt: "Google News", width: 160, height: 56 },
  { src: "/logos/AM.png", alt: "Ahmedabad Mirror", width: 192, height: 48 },
  { src: "/logos/DH.png", alt: "Dailyhunt", width: 190, height: 58 },
  { src: "/logos/IT.png", alt: "India Today", width: 190, height: 64 },
  { src: "/logos/TTOI.png", alt: "Times of India", width: 192, height: 72 },
];

const FeatureOption = () => {
  const repeatCount = 3;
  const repeatedLogos = useMemo(
    () => Array(repeatCount).fill(logos).flat(),
    []
  );

  return (
    <div className="relative flex justify-center mt-5 overflow-hidden mb-5">
      {/* Left Blur Effect */}
      <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none"></div>

      <div className="w-[95%] overflow-hidden">
        <div
          className="flex gap-x-12 w-max will-change-transform animate-marquee"
        >
          {repeatedLogos.map(({ src, alt, width, height }, index) => (
            <img
              key={index}
              src={src}
              alt={alt}
              loading="eager"
              decoding="async"
              width={width}
              height={height}
              className="object-contain transition-transform duration-300 p-2 rounded-3xl border border-gray-200 hover:scale-110"
            />
          ))}
        </div>
      </div>

      {/* Right Blur Effect */}
      <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-white via-white/60 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default memo(FeatureOption);
