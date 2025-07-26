import React from "react";
import { Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[#D9D9D9]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
          {/* Left Theme Text */}
          <div className="mb-6 md:mb-0 max-w-md">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Let’s build the future of finance together.
            </h4>
            <p className="text-sm text-gray-600">
              Explore tools that help users become financially independent and
              smarter every day.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-4 md:mb-0">
            <h4 className="font-semibold mb-2 text-gray-800">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a
                  href="/ai-report"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Ai Report
                </a>
              </li>
              <li>
                <a
                  href="/scanner"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Scanner
                </a>
              </li>
              <li>
                <a
                  href="/alpha-learn"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Alpha Learn
                </a>
              </li>
              <li>
                <a href="/blog" className="cursor-pointer hover:text-[#7972FF]">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Policy</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a
                  href="/privacy-policy"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-use"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/cookies-policy"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Cookies & Data Collection Policy
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="cursor-pointer hover:text-[#7972FF]"
                >
                  Return and Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gradient Bar with Icons */}
      <div className="bg-gradient-to-r from-[#7972FF] to-[#74C9FC] m-4 px-4 py-4 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white text-sm text-center">contact@aarthik.ai</p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border border-white rounded-full p-2 transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#7972FF] hover:to-[#74C9FC] cursor-pointer"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border border-white rounded-full p-2 transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#7972FF] hover:to-[#74C9FC] cursor-pointer"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border border-white rounded-full p-2 transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#7972FF] hover:to-[#74C9FC] cursor-pointer"
            >
              <Instagram size={16} />
            </a>
          </div>

          <p className="text-white text-sm text-center md:text-right">
            Copyright 2025 © Pocketwise Technologies Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
