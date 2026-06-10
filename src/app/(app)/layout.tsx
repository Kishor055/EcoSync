import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Sidebar: Fixed width on desktop, hidden on mobile (handled by Sheet in Header) */}
        <div className="hidden md:block w-[280px] shrink-0 border-r border-white/5 bg-[#070908]">
          <AppSidebar />
        </div>
        
        {/* Main Content Area: Scrollable container */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#020403] relative">
          <AppHeader />
          <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-12">
            <div className="max-w-[1800px] mx-auto w-full">
              {children}
            </div>
          </main>
          
          {/* Decorative Background Orbs for Immersion */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        </div>
      </div>
    </AuthGuard>
  );
}
