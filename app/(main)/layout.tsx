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
import NavBar from "@/components/navbar";
import { SidebarBackdrop } from "@/components/sidebar-backdrop";
import Container from "@/components/Container";

const sidebarPlaceholders = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild>
                    <button type="button" className="w-full justify-start">
                      {label}
                    </button>
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
