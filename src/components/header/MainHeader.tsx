import { SidebarTrigger } from "@/components/ui/sidebar";
import CreateNote from "@/components/note/creation/CreateNote";

import Clock from "./Clock";
import SemanticSearch from "./SemanticSearch";

const MainHeader = () => {
  return (
    <div className="sticky pl-3 pr-5 py-1 top-0 right-0 border-b bg-muted/50 flex justify-between items-center shadow-[0px_2px_3px_0px_oklch(0.269_0_0)] backdrop-blur-md z-50 no-scrollbar">
      <div className="flex gap-2 justify-start items-center">
        <SidebarTrigger className="cursor-pointer" />
        <SemanticSearch />
      </div>
      <Clock />
      <CreateNote />
    </div>
  );
};

export default MainHeader;
