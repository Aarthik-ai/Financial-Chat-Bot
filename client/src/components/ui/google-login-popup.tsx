import { auth, googleProvider, db } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "./button";

export default function GoogleLoginPopup({ onClose }: { onClose: () => void }) {
  const handleGoogleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Save user to Firestore
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-[#74CAFC] min-w-[320px]">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#74CAFC] to-[#7978FF] bg-clip-text text-transparent">
          Sign in with Google
        </h2>
        <Button
          className="bg-gradient-to-r from-[#74CAFC] to-[#7978FF] text-white font-bold px-6 py-2 rounded-full shadow-md mb-2"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>
        <Button
          variant="ghost"
          className="mt-2 text-[#7978FF] hover:bg-[#f0f4ff] rounded-full px-4 py-2"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}