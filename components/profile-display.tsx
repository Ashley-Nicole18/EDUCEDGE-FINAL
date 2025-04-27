// app/profile/page.tsx (if using app router)
// or pages/profile.tsx (if using pages router)

'use client'; // if you're using Next.js 13+ app directory
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  first_name: string;
  last_name: string;
  college: string;
  course_year: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false }) // get the latest profile
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
      <div className="space-y-2">
        <p><strong>First Name:</strong> {profile.first_name}</p>
        <p><strong>Last Name:</strong> {profile.last_name}</p>
        <p><strong>College:</strong> {profile.college}</p>
        <p><strong>Course & Year:</strong> {profile.course_year}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
