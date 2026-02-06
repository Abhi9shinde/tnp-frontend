"use client";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
} from "@/components/ui/sidebar";
import NavBar from "@/components/navbar/adminNavbar";
import { SidebarBackdrop } from "@/components/sidebar-backdrop";
import Container from "@/components/Container";
import Link from "next/link";
import { useEffect } from "react";
import { useMe } from "@/hooks/useMe";
import { useRouter } from "next/navigation";

const sidebarPlaceholders = [
  {
    label: "TEST",
    href: "/TEST",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  useEffect(() => {
    if (isLoading) return;
    if (!me || (me.role !== "ADMIN" && me.role !== "TNP_OFFICER")) {
      router.replace("/home");
    }
  }, [me, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!me || (me.role !== "ADMIN" && me.role !== "TNP_OFFICER")) {
    return null;
  }

  return (
    <SidebarProvider
      defaultOpen={false}
      className="min-h-screen bg-background text-foreground"
    >
      <Sidebar
        className="border-r border-border bg-sidebar/95 z-50"
        collapsible="offcanvas"
        variant="floating"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
            <SidebarMenu>
              {sidebarPlaceholders.map((label) => (
                <SidebarMenuItem key={label.label}>
                  <SidebarMenuButton asChild>
                    <Link href={label.href} className="w-full justify-start">
                      <button type="button">{label.label}</button>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarBackdrop />
      <SidebarInset className="relative flex min-h-screen flex-1 flex-col bg-background text-foreground">
        <NavBar />
        <Container className="max-w-6xl">{children}</Container>
      </SidebarInset>
    </SidebarProvider>
  );
}
