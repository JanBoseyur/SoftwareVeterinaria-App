// src/app/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";

export default async function Home() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
