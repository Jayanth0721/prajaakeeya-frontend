import { AuthUser } from '../types/auth';

/**
 * Checks if a user's profile is complete
 * @param user - The AuthUser object to check
 * @returns boolean - true if profile is complete, false otherwise
 */
export const isProfileComplete = (user: AuthUser | null): boolean => {
  if (!user) return false;

  // Admin profiles don't need completion
  if (user.role === 'admin') return true;

  // Required fields for voters and aspirants
  const hasRequiredFields = !!(
    user.name &&
    user.gender &&
    user.phone &&
    user.profilePicture &&
    user.age
  );

  return hasRequiredFields;
};

/**
 * Returns an array of missing profile fields
 * @param user - The AuthUser object to check
 * @returns string[] - Array of missing field names
 */
export const getMissingProfileFields = (user: AuthUser | null): string[] => {
  if (!user) return ['All fields'];
  
  const missing: string[] = [];

  if (!user.name) missing.push('Full Name');
  if (!user.age) missing.push('Age');
  if (!user.gender) missing.push('Gender');
  if (!user.phone) missing.push('Mobile Number');
  if (!user.profilePicture) missing.push('Profile Photo');

  return missing;
};
