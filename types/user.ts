// types/user.ts

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    role: 'tutor' | 'tutee';
}
