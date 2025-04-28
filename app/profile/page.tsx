import React from 'react';
import Image from 'next/image';

const ProfileTutee = () => {
  return (
    <div>
      <h2>Welcome to the Tutee Profile</h2>
      <p>This is the profile page for the Tutee.</p>
      
      <Image
        src="/img/Bg-Tutee.jpg" // Your image path
        alt="Tutee Profile"
        width={200} // Desired width
        height={200} // Desired height
        priority // Optionally add `priority` for images that should load quickly
      />
    </div>
  );
};

export default ProfileTutee;
