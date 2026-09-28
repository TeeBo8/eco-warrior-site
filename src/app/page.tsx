import type { Metadata } from "next";
import { Recit } from "@/components/recit/Recit";

export const metadata: Metadata = {
  title: { absolute: "On veut vivre — EcoWarrior" },
  description:
    "Climat, vivant, paix, justice sociale : un seul combat. Un récit sourcé pour comprendre ce qui nous menace, et ce qui existe déjà.",
};

export default function HomePage() {
  return <Recit />;
}
