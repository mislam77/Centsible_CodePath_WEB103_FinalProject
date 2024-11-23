import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "../assets/centsible-logo.png";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://web103-finalproject-centsible.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        navigate("/signin");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed");
    }
  };  
  

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#3D3D3D]">
      <img src={Logo} alt="Logo" style={{ width: "320px", height: "auto" }} />
      <div className="mt-12 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
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
                  placeholder="Choose a password"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};