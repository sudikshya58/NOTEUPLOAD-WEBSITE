import React from "react";
import { motion } from "framer-motion";
import { Banner } from "../Page/index.ts";
import { ContentDoc } from "./index.ts";

const { title, description } = ContentDoc[0];

interface BannerType {
  icon: string;
  title: string;
  description: string;
}

export const Banner2: React.FC = () => {
  return (
    <>
      {/* Main Section */}
      <div className="mt-16">
      <motion.div
        className="w-full flex flex-col md:flex-row mt-20 md:gap-6 lg:gap-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Text Section */}
        <div className="flex flex-col w-full md:w-3/4 p-4">
          <h1 className="font-extrabold text-gray-900 text-3xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
            {title}
          </h1>
          <p className="font-medium text-gray-600 text-lg md:text-xl mb-8 leading-relaxed text-justify">
            {description}
          </p>
          <button
            className="w-full md:w-44 text-lg p-4 rounded-md text-white font-bold bg-gradient-to-r from-[#003479] to-[#0056a6] hover:from-[#0056a6] hover:to-[#003479] transition duration-300 shadow-lg hover:shadow-xl"
            aria-label="Learn more about the banner topic"
          >
            Learn More
          </button>
        </div>

        {/* Image Section */}
        <motion.div
          className="hidden md:flex md:w-1/2 items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <img
            src="https://img.freepik.com/free-vector/happy-woman-sitting-talking-each-other_1308-93633.jpg?t=st=1716966527~exp=1716970127~hmac=1ca05aae04339147eb96f3d8e536d7b58f9cbd083599061be6cba3cd30875d7c&w=826"
            alt="Happy woman talking"
            className="w-full lg:h-auto object-cover rounded-lg shadow-lg"
          />
        </motion.div>
      </motion.div>

      {/* Banner Cards Section */}
      <div className="flex flex-col md:flex-row justify-between p-4 gap-6 md:gap-8 mt-12">
        {Banner.map((item: BannerType, index: number) => (
          <motion.div
            key={index}
            className="banner-item p-6 bg-[#0F26F4] bg-opacity-10 w-full md:w-[30rem] rounded-lg cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(15, 38, 244, 0.4)" }}
            aria-label={`Banner: ${item.title}`}
          >
            <div className="flex w-full items-center justify-center mb-4">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className="h-12 w-12 md:h-14 md:w-14"
                  loading="lazy"
                />
              )}
            </div>
            <h1 className="font-extrabold text-center text-xl md:text-lg mb-3 text-[#0F26F4]">
              {item.title}
            </h1>
            <p className="text-gray-700 font-medium text-justify text-sm md:text-base leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
      </div>
    </>
  );
};
