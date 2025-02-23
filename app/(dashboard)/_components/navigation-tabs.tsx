"use client";

import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NavigationTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname === "/notes" ? "notes" : "record";

  const handleTabChange = (value: string) => {
    router.push(value === "notes" ? "/notes" : "/record");
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="w-full pb-4"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="record">Record</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 