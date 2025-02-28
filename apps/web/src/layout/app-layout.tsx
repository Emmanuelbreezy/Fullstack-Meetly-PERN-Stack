import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={`overflow-x-hidden p-0 !bg-[#fafafa]`}>
        <div className="flex flex-1 flex-col gap-4 px-3 lg:px-8">
          <>
            <Header />
            <div>
              <Outlet />
            </div>
          </>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
