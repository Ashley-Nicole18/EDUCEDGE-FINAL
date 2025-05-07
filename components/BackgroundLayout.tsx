import Image from "next/image";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const BackgroundLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      
      <Image
        src="/img/Background.png"
        alt="Background image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />

      
      <div className="absolute top-0 left-5 z-20 p-2">
        <Image src="/img/logow.PNG" alt="logowhite" width={144} height={50} />
      </div>

      
      <div className="absolute top-0 right-0 h-full w-[85%] bg-white z-10 overflow-auto shadow-xl p-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;
