import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function App() {
  return (
    <header className="flex justify-center items-center h-screen">
      <SignedOut>
        <div className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}