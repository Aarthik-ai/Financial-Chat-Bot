import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { Button } from "./button";

export default function GoogleLoginPopup({ onClose }: { onClose: () => void }) {
  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, googleProvider);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Sign in with Google</h2>
        <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
        <Button variant="ghost" className="mt-4" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
