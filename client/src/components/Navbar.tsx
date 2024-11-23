import Logo from "../assets/centsible-logo.png";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
];

export const Navbar = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const response = await fetch("https://web103-finalproject-centsible.onrender.com/api/auth/logout", {
                method: "POST",
                credentials: "include", // Ensure cookies are sent with the request
            });

            if (response.ok) {
                // Navigate to the login page after successful logout
                navigate("/signin");
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="border-separate border-b bg-[#3D3D3D]">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Link to="/">
                        <img src={Logo} alt="Logo" style={{ width: "220px", height: "auto" }} />
                    </Link>
                    <div className="flex h-full text-background">
                        {items.map((item) => (
                            <NavbarItem
                                key={item.label}
                                link={item.link}
                                label={item.label}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className={cn(buttonVariants({ variant: "outline" }), "text-black")}
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>
        </div>
    );
};

function NavbarItem({
    link,
    label,
    clickCallback,
}: {
    link: string;
    label: string;
    clickCallback?: () => void;
}) {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <div className="relative flex items-center">
            <Link
                to={link}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-lg text-muted-background hover:text-background",
                    isActive && "text-background"
                )}
                onClick={() => {
                    if (clickCallback) clickCallback();
                }}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
            )}
        </div>
    );
}