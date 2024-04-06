"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { buttonVariants } from "./ui/button";
import {
  Cog,
  Frame,
  Image,
  Inbox,
  ScrollText,
  Shirt,
  SwatchBook,
} from "lucide-react";

export default function SideNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
      icon: Inbox,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
      icon: Cog,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
      icon: Image,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
      icon: SwatchBook,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
      icon: Shirt,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
      icon: ScrollText,
    },
  ];
  return (
    <div className="group flex flex-col gap-4 py-2 ">
      <nav className={cn("grid gap-3 px-2", className)}>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "justify-start w-full text-lg",
              "dark:hover:bg-muted hover:bg-slate-200",
              route.active
                ? "text-black dark:text-white  font-bold"
                : "text-muted-foreground"
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
