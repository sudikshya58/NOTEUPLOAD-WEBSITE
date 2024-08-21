import { FacultyName } from "../Page/index.ts";

export const Background = () => {
  return (
    <>
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1650954316234-5d7160b24eed?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
          className="w-full h-[85vh] object-cover"
        />
        <div className="absolute inset-0 flex justify-between mx-60 items-center text-white">
          <div className="w-[70%]">
            <h1 className="font-bold text-[20px] text-white inline-block pb-[15px] overflow-hidden">
              Collaborate, Transform, Succeed
            </h1>
            <hr className="h-1 bg-white w-60" />
            <h1 className="text-[44px] text-blue-400 font-semibold leading-[60px] mt-[30px]">
              A Software Development Company Committed <br /> to Your Vision
            </h1>
            <p className="mt-[40px] text-[18px] opacity-[0.7] w-[80%] leading-8 font-bold">
              Don't just imagine your dream software, create it. Our goal is to make your software development journey a breeze. From start to finish, we're committed to ensuring your project runs smoothly and exceeds your expectations. We're not happy until you are.
            </p>
            <button className="bg-blue-400 mt-[40px] rounded-[30px] text-[20px] font-bold p-5">
              Get a Quote
            </button>
          </div>
          <h2 className="text-white">MINE-NOTES</h2>
        </div>
      </div>
      <div className="bg-blue-300 h-[10vh]">
        <ul className="flex justify-between mx-60 h-full items-center">
          {FacultyName.map((item, index) => (
            <li key={index} className="font-bold text-[20px]">
              {item.Name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
