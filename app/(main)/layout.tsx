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

const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";

const sidebarPlaceholders = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      defaultOpen={false}
      className={`min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white ${fontClass}`}
    >
      <Sidebar
        className="border-r border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 z-50"
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
      <SidebarInset className="relative flex min-h-screen flex-1 flex-col bg-white text-zinc-900 dark:bg-black dark:text-white">
        <NavBar />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
