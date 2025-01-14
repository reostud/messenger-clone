//รายการแชทหน้าเว็บ

import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: { 
  children: React.ReactNode; 
}) {
  const currentUser = await getCurrentUser();
  return ( // <MobileFooter คือการทำ responsiveMobile หน้าจอ
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter /> 
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
