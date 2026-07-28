import { SidebarTrigger } from "@/components/ui/sidebar";
import CreateNote from "@/components/note/creation/CreateNote";

import Clock from "./Clock";
import SemanticSearch from "./SemanticSearch";

const MainHeader = () => {
  return (
    <div className="sticky pl-3 pr-5 py-1 top-0 right-0 border-b bg-background/4! flex justify-between items-center backdrop-blur-md z-200 no-scrollbar">
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
