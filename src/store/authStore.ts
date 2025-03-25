import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getRandomAvatar } from '@/lib/avatar';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGoogleUser?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  initializeAuth: () => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateUserAvatar: (avatarUrl: string) => Promise<boolean>;
}

// Function to update user avatar - exported for direct use
export const updateUserAvatar = async (avatarUrl: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    await updateProfile(user, {
      photoURL: avatarUrl,
    });
    
    // Update the store with the new avatar
    const authStore = useAuthStore.getState();
    if (authStore.user) {
      useAuthStore.setState({
        user: {
          ...authStore.user,
          avatar: avatarUrl,
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating avatar:', error);
    return false;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        return new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              const user: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || getRandomAvatar(firebaseUser.email || ''),
                isGoogleUser: firebaseUser.providerData.some(provider => provider.providerId === 'google.com')
              };
              
              // If the user doesn't have an avatar, generate and save one
              if (!firebaseUser.photoURL) {
                const avatarUrl = getRandomAvatar(user.email);
                updateProfile(firebaseUser, { photoURL: avatarUrl })
                  .then(() => {
                    set({
                      user: {
                        ...user,
                        avatar: avatarUrl
                      },
                    });
                  })
                  .catch(error => {
                    console.error("Error updating avatar on auth state change:", error);
                  });
              }
              
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
            unsubscribe();
            resolve();
          });
        });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simple validation
          if (email === "" || password === "") {
            throw new Error("Email and password are required");
          }
          
          // Authenticate with Firebase
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || getRandomAvatar(firebaseUser.email || ''),
            isGoogleUser: firebaseUser.providerData.some(provider => provider.providerId === 'google.com')
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },
      
      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simple validation
          if (name === "" || email === "" || password === "") {
            throw new Error("All fields are required");
          }
          
          // Check password length (basic validation)
          if (password.length < 8) {
            throw new Error("Password must be at least 8 characters");
          }
          
          // Create user with Firebase
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Generate a random avatar based on email
          const avatarUrl = getRandomAvatar(email);
          
          // Update profile with name and avatar
          await updateProfile(firebaseUser, {
            displayName: name,
            photoURL: avatarUrl,
          });
          
          const user: User = {
            id: firebaseUser.uid,
            name,
            email,
            avatar: avatarUrl,
            isGoogleUser: false
          };
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false,
          });
        }
      },
      
      logout: async () => {
        try {
          await signOut(auth);
          
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      
      checkAuth: () => {
        return get().isAuthenticated;
      },

      updateUserPassword: async (currentPassword, newPassword) => {
        try {
          const user = auth.currentUser;
          if (!user || !user.email) {
            throw new Error('User not authenticated');
          }

          // Re-authenticate user before changing password
          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, credential);
          
          // Update password
          await updatePassword(user, newPassword);
          return true;
        } catch (error) {
          console.error('Error updating password:', error);
          throw error;
        }
      },
      
      updateUserAvatar: async (avatarUrl) => {
        return updateUserAvatar(avatarUrl);
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
