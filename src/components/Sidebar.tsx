"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, FileText, CheckCircle } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        { label: "Active Requests", href: "/active", icon: Clock },
        { label: "New Request", href: "/new", icon: FileText },
        { label: "Completed", href: "/completed", icon: CheckCircle },
    ];

    return (
        <aside className="sidebar">
            <div className="brand">
                <LayoutDashboard className="brand-icon" size={24} />
                <span>Label PO System</span>
            </div>

            <nav className="nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
