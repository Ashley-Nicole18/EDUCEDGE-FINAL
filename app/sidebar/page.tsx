'use client';

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import styles from './Sidebar.module.css'; // Ensure the correct path

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}> {/* Apply styles from Sidebar.module.css */}
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/profile" className="hover:text-yellow-400">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/settings" className="hover:text-yellow-400">
            Settings
          </Link>
        </li>
        <li>
          <button
            onClick={() => signOut(auth)}
            className="hover:text-yellow-400"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
