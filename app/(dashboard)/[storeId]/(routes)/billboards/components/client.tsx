"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

interface BillboardClientProps {
  data: Billboard[];
}
export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage your store's billboards."
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 mt-4">
        {data.map((billboard) => (
          <div
            key={billboard.id}
            className="flex items-center justify-between p-4 bg-white rounded-md shadow-sm dark:bg-gray-800"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={billboard.imageUrl}
                alt={billboard.label}
                className="w-16 h-16 rounded-md"
                width={64}
                height={64}
              />
              <div>
                <h3 className="text-lg font-semibold">{billboard.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {billboard.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/${params.storeId}/billboards/${billboard.id}`)
              }
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
