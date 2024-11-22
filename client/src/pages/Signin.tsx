import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "../assets/centsible-logo.png";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies in the request
      });
  
      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/wizard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Signin failed:", error);
      alert("Signin failed");
    }
  };  

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#3D3D3D]">
      <img src={Logo} alt="Logo" style={{ width: "320px", height: "auto" }} />
      <div className="mt-12 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            {/* Add Sign Up Link */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-500 hover:underline hover:text-blue-700"
              >
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};