import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <Button variant="default" size="default">
      Button
      <UserButton afterSignOutUrl="/" />
    </Button>
  );
}
