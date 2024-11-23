import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "@/components/dashboard/CreateTransactionDialog";
import History from "@/components/dashboard/History";
import Overview from "@/components/dashboard/Overview";

export const Dashboard = () => {
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const navigate = useNavigate();

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://web103-finalproject-centsible.onrender.com/api/auth/user", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.username }); // Assuming username maps to firstName
        } else {
          navigate("/signin"); // Redirect to sign-in if not authenticated
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/signin");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>

          <div className="flex items-center gap-3">
            {/* Button to add a new income */}
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New income 🤑
                </Button>
              }
              type="income"
            />

            {/* Button to add a new expense */}
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New expense 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>

      {/* Overview section */}
      <Overview />

      {/* History section */}
      <History />
    </div>
  );
};
