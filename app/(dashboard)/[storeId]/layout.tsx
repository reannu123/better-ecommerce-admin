import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import SideNav from "@/components/side-bar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex"
      >
        <ResizablePanel
          collapsible={true}
          defaultSize={12}
          minSize={12}
          maxSize={12}
          className="bg-slate-100 dark:bg-slate-900 transition-all ease-in-out flex-shrink-0"
        >
          <SideNav />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="flex-1">
          <ScrollArea className="h-full">{children}</ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
