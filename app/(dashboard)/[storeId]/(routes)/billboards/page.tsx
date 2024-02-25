import { Heading } from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect, useParams, useRouter } from "next/navigation";
import { BillboardClient } from "./components/client";
interface BillboardsPageProps {
  params: { storeId: string };
}

const BillboardsPage: React.FC<BillboardsPageProps> = async ({ params }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={billboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
