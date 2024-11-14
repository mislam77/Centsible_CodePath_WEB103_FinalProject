import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignIn, SignUp } from "@clerk/clerk-react";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <header className="flex justify-center items-center h-screen space-x-4">
          <SignedOut>
            <div className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              <SignInButton />
            </div>
            <div className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              <SignUpButton />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      } />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;