'use client';
import React, {useState} from "react";
import {db} from "@/lib/firebaseClient"
import {doc, setDoc} from "firebase/firestore"


const ProfileTutee: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [courseYear, setCourseYear] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');

  const handleSaveProfile = async () => {
    try {
      const userId = "demo-user-id"; // later replace with real auth user ID

      await setDoc(doc(db, "tuteeProfiles", userId), {
        firstName,
        lastName,
        college,
        courseYear,
        schoolEmail,
      });

      alert('Profile saved successfully!');
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  return (
    <div className="relative h-full p-15">
      <div className="flex items-center mb-1 ml-25">
        <div className="w-20 h-20 bg-gray-300 rounded-full mr-10 flex items-center justify-center">
          <span className="text-black text-2xl">+</span>
        </div>
        <h1 className="text-black text-xs whitespace-nowrap">Personal Information</h1>
      </div>

      <div className="flex items-center space-x-10 mb-5">
        <div className="flex items-center space-x-5">
          <button className="text-blue-500 text-xs border border-blue-500 px-5 py-1 rounded text-center ml-25">
            Upload
          </button>
        </div>

        {/* Personal information */}

        <div className="flex space-x-5">
          <div>
            <label className="block text-black text-xs mb-1 whitespace-nowrap">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-50"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-black text-xs mb-1 whitespace-nowrap">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-50"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div>

      {/* Academic information */}

      <div className="mt-10">
        <h2 className="text-black text-xs font-base px-55">Academic Information</h2>
      </div>

      <div className="mt-10 flex flex-col space-y-5 ml-55"> 
        <div>
          <label className="block text-black text-xs mb-1">College</label>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-45"
            placeholder="Enter college name"
          />
        </div>

        <div>
          <label className="block text-black text-xs mb-1">Course & Year</label>
          <input
            type="text"
            value={courseYear}
            onChange={(e) => setCourseYear(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-45"
            placeholder="Enter course and year"
          />
        </div>

        <div>
          <label className="block text-black text-xs mb-1">School Email</label>
          <input
            type="email"
            value={schoolEmail}
            onChange={(e) => setSchoolEmail(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-black text-sm rounded w-full"
            placeholder="Enter school email"
          />
        </div>
      </div>

      {/* Button */}
      <div className="mt-10 ml-55">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveProfile} >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileTutee;
