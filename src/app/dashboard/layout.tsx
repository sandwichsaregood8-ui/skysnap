"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    Sidebar,
    SidebarProvider,
    SidebarInset,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, GalleryVertical, Camera, Users, LogOut, Gem } from "lucide-react";
import { useUser, useAuth } from "@/firebase";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
            router.push('/');
        }
    };

    if (isUserLoading || !user) {
        return (
          <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg animate-pulse">
                    <Camera className="text-white" />
                </div>
                <p className="text-on-surface-variant">Loading session...</p>
            </div>
          </div>
        );
    }

    return (
        <>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg">
                                <Camera className="text-white" />
                            </div>
                            <h1 className="text-lg font-bold text-white tracking-tight">SkySnap</h1>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                                    <Link href="/dashboard">
                                        <Home />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/gallery')}>
                                    <Link href="/dashboard/gallery">
                                        <GalleryVertical />
                                        <span>Gallery</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="#">
                                        <Users />
                                        <span>Community</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="flex flex-col gap-2 px-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={handleLogout}>
                                        <LogOut />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset className={(pathname.startsWith('/dashboard/gallery') || pathname.startsWith('/dashboard/connect')) ? 'bg-transparent' : ''}>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
