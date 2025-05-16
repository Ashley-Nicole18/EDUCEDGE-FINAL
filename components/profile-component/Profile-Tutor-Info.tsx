'use client';

import React, { useState, useEffect } from "react";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface TutorInfo {
  firstName: string;
  lastName: string;
  email: string;
  college?: string;
  courseYear?: string;
  achievements?: string;
  schoolEmail?: string;
  role?: string;
}

type UpdateTutorInfo = Partial<TutorInfo>;

interface TutorInfoSectionProps {
  userId: string | null;
}

const TutorInfoSection: React.FC<TutorInfoSectionProps> = ({ userId }) => {
  // Edit state, form fields, error handling, and role-based access
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState<UpdateTutorInfo>({ 
    firstName: "",
    lastName: "",
    college: "",
    courseYear: "",
    schoolEmail: "",
    achievements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});  
  const [hasProfileData, setHasProfileData] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  // Fetches user profile from Firestore when userId changes.
  useEffect(() => {
    const fetchTutorInfo = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        const userDocRef = doc(db, "users", userId);
        try {
          const docSnap = await getDoc(userDocRef); // fetch profile data using getdoc
          if (docSnap.exists()) {
            const data = docSnap.data() as TutorInfo;
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              college: data.college || "",
              courseYear: data.courseYear || "",
              schoolEmail: data.schoolEmail || "",
              achievements: data.achievements || "",
            });
            setHasProfileData(true);
            setProfileRole(data.role || null); //Saves the user role into profileRole.
          } else {
            setHasProfileData(false);
          }
        } catch (e: unknown) { //catch any throw error safely
          if (e instanceof Error) {
            setError(`Failed to load profile: ${e.message}`);
          } else {
            setError("Failed to load profile due to an unknown error."); 
          }
        } finally {
          setLoading(false); //stop loading
        }
      }
    };

    fetchTutorInfo();

    // detect current login user UID
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      } else {
        setCurrentUserUid(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });//na update ya ang form field when any field is edited
  };
//validation form to ensure required fields are filled
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.college) newErrors.college = "College is required.";
    if (!formData.courseYear)
      newErrors.courseYear = "Course & Year is required.";
    if (!formData.schoolEmail)
      newErrors.schoolEmail = "School Email is required.";
    else if (formData.schoolEmail && !/\S+@\S+\.\S+/.test(formData.schoolEmail)) {
      newErrors.schoolEmail = "Invalid email format.";
    }
    if (!formData.achievements)
      newErrors.achievements = "Achievements are required.";
    setErrors(newErrors); //error if mayara empty field
    return Object.keys(newErrors).length === 0; //return sya true if valid
  };
//prevents default form behavior
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      if (validateForm()) { 
        setLoading(true);
        setError(null);
        const userDocRef = doc(db, "users", userId);
        try {
          await updateDoc(userDocRef, formData); //Sends updated formData to Firestore using updateDoc
          setHasProfileData(true);
          setIsEditing(false);
          alert("Profile updated successfully!"); 
        } catch (e: unknown) {
          if (e instanceof Error) {
            setError(`Failed to update profile: ${e.message}`);
          } else {
            setError("Failed to update profile due to an unknown error.");
          }
        } finally {
          setLoading(false);
        }
      }
    } else {
      alert("User ID not available. Cannot save profile.");
    }
  };
//if there is no profile data exists, the form is shown. Otherwise profile display is rendered read-only 
  const ProfileDisplay: React.FC<{ data: UpdateTutorInfo }> = ({ data }) => {
    return (

      //personal info section display
      <div className="space-y-6 pt-4">
        <div className="mb-2 p-4 border rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h2> 
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-gray-700">{data.firstName} {data.lastName}</p>
          </div>
        </div>

        <div className="mb-4 p-4 border rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Academic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">College</p>
              <p className="text-gray-700">{data.college || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Course & Year</p>
              <p className="text-gray-700">{data.courseYear || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">School Email</p>
              <p className="text-gray-700">{data.schoolEmail || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 p-4 border rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Credentials</h2>
          <div>
            <p className="text-gray-500 text-sm">Achievements</p>
            <p className="text-gray-700 whitespace-pre-line">
              {data.achievements || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Loading profile information...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    //edit section
    <div className="bg-white rounded-md shadow-md p-6">
      {isEditing || !hasProfileData ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile Information</h2>
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Academic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700">College <span className="text-red-500">*</span></label>
                <input type="text" id="college" name="college" value={formData.college || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                {errors.college && <p className="text-red-600 text-xs mt-1">{errors.college}</p>}
              </div>
              <div>
                <label htmlFor="courseYear" className="block text-sm font-medium text-gray-700">Course & Year <span className="text-red-500">*</span></label>
                <input type="text" id="courseYear" name="courseYear" value={formData.courseYear || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                {errors.courseYear && <p className="text-red-600 text-xs mt-1">{errors.courseYear}</p>}
              </div>
              <div>
                <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700">School Email <span className="text-red-500">*</span></label>
                <input type="email" id="schoolEmail" name="schoolEmail" value={formData.schoolEmail || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black" />
                {errors.schoolEmail && <p className="text-red-600 text-xs mt-1">{errors.schoolEmail}</p>}
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Credentials</h3>
            <div>
              <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">Achievements <span className="text-red-500">*</span></label>
              <textarea id="achievements" name="achievements" value={formData.achievements || ""} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none h-24 text-black" placeholder="Enter achievements (e.g., Graduated with honors in Senior High School)"></textarea>
              {errors.achievements && <p className="text-red-600 text-xs mt-1">{errors.achievements}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-5 rounded hover:bg-blue-700"
            >
              {hasProfileData ? "Save Changes" : "Create Profile"}
            </button>
          </div>
        </form>
      ) : (
        //this one ensure that no one can open the form unless they are the tutor who owns that profile
        <> 
          <ProfileDisplay data={formData} />
          {profileRole === 'tutor' && currentUserUid === userId && ( 
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
              >
                Edit Profile
              </button>
            </div>
          )}
        </> 
      )}
    </div>
  );
};

export default TutorInfoSection;