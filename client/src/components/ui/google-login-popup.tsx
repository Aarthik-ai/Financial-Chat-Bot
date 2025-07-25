import { auth, googleProvider, db } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "./button";

export default function GoogleLoginPopup({ onClose }: { onClose: () => void }) {
  const handleGoogleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-[#74CAFC] min-w-[320px] max-w-[400px] transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#74CAFC] to-[#7978FF] bg-clip-text text-transparent drop-shadow-md">
          Sign in with Google
        </h2>
        <Button
          className="bg-gradient-to-r from-[#74CAFC] to-[#7978FF] text-white font-semibold px-6 py-2 rounded-full shadow-md mb-4 flex items-center gap-2 hover:shadow-lg transition-shadow duration-200"
          onClick={handleGoogleSignIn}
        >
          <span className="w-5 h-5 bg-gray-300 rounded-full" /> {/* Placeholder for Google icon */}
          Sign in with Google
        </Button>
        <Button
          variant="ghost"
          className="mt-2 text-[#7978FF] hover:bg-[#f0f4ff] rounded-full px-4 py-2 hover:text-[#5a5ad2] transition-colors duration-200"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}