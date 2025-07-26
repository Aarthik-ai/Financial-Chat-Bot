"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import testimonialsData from "@/components/data/testimonials.json";
import TestimonialsCard from "./TestimonialsCard.tsx";

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !isMobile) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi, isHovered, isMobile]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-20">
      <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
        What our{" "}
        <span className="bg-gradient-to-r from-[#7972FF] to-[#76B6FD] bg-clip-text text-transparent">
          users
        </span>{" "}
        says
      </h2>

      {isMobile ? (
        <>
          <div
            className="overflow-hidden"
            ref={emblaRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex space-x-4">
              {testimonialsData.map((testimonial, index) => (
                <div className="min-w-full px-2" key={index}>
                  <TestimonialsCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Swipe Indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? "bg-[#7972FF] scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialsCard
              key={index}
              {...testimonial}
              delay={index * 100}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Testimonials;
