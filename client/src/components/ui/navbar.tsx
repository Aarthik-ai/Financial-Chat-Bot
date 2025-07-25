import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Logo from "../../../public/logo.svg";
import { useState } from "react";
import { MdArrowOutward, MdMenu, MdClose } from "react-icons/md";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm shadow-sm"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setLocation("/")}
            >
              <img src={Logo} alt="Aarthik.ai Logo" className="h-18 w-18" />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 text-base font-medium text-gray-700 ml-8 items-end">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`hover:text-black transition-colors ${
                    location === item.path ? "text-black" : ""
                  }`}
                >
                  {location === item.path ? (
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-black rounded-full mr-1" />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-black focus:outline-none"
            >
              {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="text-black bg-white border-2 text-base"
              onClick={() => setLocation("/chatbot")}
            >
              Try Aarthik
              <MdArrowOutward />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-4 p-6 items-center">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`text-base font-medium hover:text-black transition-colors ${
                    location === item.path ? "text-black" : "text-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {location === item.path ? (
                    <span className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-black rounded-full mr-1" />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </a>
              ))}
              <Button
                className="text-black bg-white border-2 text-base w-full"
                onClick={() => {
                  setLocation("/chatbot");
                  setIsOpen(false);
                }}
              >
                Try Aarthik
                <MdArrowOutward />
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}