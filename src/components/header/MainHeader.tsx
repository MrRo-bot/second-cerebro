import { SidebarTrigger } from "@/components/ui/sidebar";
import CreateNote from "@/components/note/creation/CreateNote";
const MainHeader = () => {
  return (
    <div className="sticky top-0 px-2 py-1 border bg-muted/50 flex justify-between items-center shadow-[0px_2px_5px_0px_oklch(0.269_0_0)] backdrop-blur-md z-10 no-scrollbar">
      <div className="flex gap-2 justify-start items-center">
        <SidebarTrigger className="cursor-pointer" />
        breadcrumbs
      </div>
      <CreateNote />
    </div>
  );
};

export default MainHeader;
