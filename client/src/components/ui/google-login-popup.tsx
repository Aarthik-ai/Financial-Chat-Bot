import { auth, googleProvider, db } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "./button";

export default function GoogleLoginPopup({ onClose }: { onClose: () => void }) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
          historyChats: [],
        });
      } else {
        // Only update last login without affecting other fields
        await setDoc(userRef, {
          lastLogin: new Date().toISOString(),
        }, { merge: true });
      }
      
      onClose(); // only call if login is successful
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("User closed the popup without signing in.");
      } else {
        console.error("Google Sign-in error:", error.message);
      }
    }
  };


  return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center border border-gray-200 min-w-[320px] max-w-[400px] transition-all duration-300 ease-in-out scale-100 hover:scale-[1.01]">
    <h2 className="text-xl font-semibold mb-6 text-gray-800">
      Sign in with Google
    </h2>

    <Button
      className="bg-gradient-to-r from-[#74CAFC] to-[#7978FF] text-white font-medium px-6 py-2 rounded-full shadow-sm mb-4 flex items-center gap-2 transition-colors duration-200"
      onClick={handleGoogleSignIn}
    >
      <span className="w-5 h-5 bg-gray-200 rounded-full" /> {/* Placeholder for Google icon */}
      Sign in with Google
    </Button>

    <Button
      variant="ghost"
      className="mt-2 text-gray-500 hover:bg-gray-100 rounded-full px-4 py-2 transition-colors duration-200"
      onClick={onClose}
    >
      Cancel
    </Button>
  </div>
</div>

  );
}