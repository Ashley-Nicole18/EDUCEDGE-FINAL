import React from "react";

const UpperText: React.FC = () => {
  return (
    <div className="flex justify-around space-x-10 mr-150 mb-175 items-center">
      <p className="text-l text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
        Information
      </p>
      <p className="text-l text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
        Course
      </p>
      <p className="text-l text-black hover:text-orange-500 transition-all duration-300 cursor-pointer">
        Reviews
      </p>
    </div>
  );
};

export default UpperText;
