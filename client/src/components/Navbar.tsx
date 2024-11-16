import Logo from "../assets/centsible-logo.png";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
];

export const Navbar = () => {
    return (
        <div className="border-separate border-b bg-[#3D3D3D]">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <img src={Logo} alt="Logo" style={{ width: '220px', height: 'auto' }} />
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
                <div className="flex items-center gap-2 text-white">
                    Sign Out
                </div>
            </nav>
        </div>
    );
}

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
