import Image from 'next/image';
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, children }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Side with Background */}
      <div className="relative hidden md:block">
        <Image
          src="/img/bg.png"
          alt="Background"
          fill
          className="object-cover"
          style={{ filter: 'blur(4px)' }}
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Right Side with Shared Layout */}
      <div className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <Image
              src="/img/EDUCEDGE.png"
              alt="EducEdge Logo"
              width={240}
              height={240}
              className="object-contain"
              priority
            />
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          </div>

          {/* Form content gets rendered here */}
          {children}
        </div>
      </div>
    </div>
  );
}
