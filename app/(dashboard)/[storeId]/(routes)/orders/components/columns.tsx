"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  variant: any;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "variant",
    header: "Variant",
    cell: ({ row }) =>
      row.original.variant ? (
        <div className="space-x-1">
          {row.original.variant.split("|").map((variant: string) => (
            <Badge key={variant}>{variant}</Badge>
          ))}
        </div>
      ) : (
        <Badge variant={"secondary"}>No Variant</Badge>
      ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) =>
      row.original.isPaid ? (
        <Badge>Yes</Badge>
      ) : (
        <Badge variant={"destructive"}>No</Badge>
      ),
  },
];
