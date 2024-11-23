import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Logo from "../assets/centsible-logo.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Wizard = () => {
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://web103-finalproject-centsible.onrender.com/api/auth/user", {
          credentials: "include", // Send cookies with the request
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.username }); // Set user details if authenticated
        } else {
          navigate("/signin"); // Redirect to signin if not authenticated
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/signin"); // Redirect to signin if an error occurs
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#3D3D3D] text-white">
      <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
        <div>
          <h1 className="text-center text-3xl">
            Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋</span>
          </h1>
          <h2 className="mt-4 text-center text-base text-muted-foreground">
            Let&apos;s get started by setting up your currency
          </h2>
          <h3 className="mt-2 text-center text-sm text-muted-foreground">
            You can change these settings at any time
          </h3>
        </div>
        <Separator />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <Separator />
        <Button className="w-full" asChild>
          <a href="/">I&apos;m done! Take me to the dashboard</a>
        </Button>
        <div className="mt-8">
          <img src={Logo} alt="Logo" style={{ width: "220px", height: "auto" }} />
        </div>
      </div>
    </div>
  );
};