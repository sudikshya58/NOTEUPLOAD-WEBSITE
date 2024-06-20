// Banner2.tsx or similar file
import React from "react";
import { Banner } from "../Page/index.js";

interface BannerType {
  icon: string;
  title: string;
  description: string;
}

export const Banner2: React.FC = () => {
  return (
    <div className="flex justify-between p-3 gap-20 mt-40">
      {Banner.map((item: BannerType, index: number) => (
        <div
          key={index}
          className="banner-item p-6 bg-[#0F26F4]  w-[30rem] bg-opacity-10 rounded"
        >
          <div className="flex w-full items-center justify-center mb-2">{item.icon && <img src={item.icon} alt="icon" className="h-10 w-10 " />}</div>
          <h1 className="font-bold text-center text-[24px] mb-2">{item.title}</h1>
          <p className="text-gray-600 font-medium text-justify text-[24px]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};
