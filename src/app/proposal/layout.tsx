import ChangeModeButton from "@/app/components/change-mode-button";
import { cookies } from "next/headers";

async function ProposalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const currentMode = cookieStore.get("mode")?.value;
  return (
    <div
      className={`${currentMode === "light" ? "bg-gray-200 text-black" : "bg-black text-white"}`}
    >
      <header className="flex justify-end p-4">
        <ChangeModeButton />
      </header>
      <main className="w-screen h-screen p-4">{children}</main>
    </div>
  );
}

export default ProposalLayout;
