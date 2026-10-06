import { cookies } from "next/headers";
import "./globals.css";

export const metadata = { title: "Korapaduck 시스템 통제소" };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const isDark = theme === "dark";
  const bgClass = isDark
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-50 text-gray-900";

  const headerClass = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const textClass = isDark ? "text-[#38bdf8]" : "text-[#0070f3]";

  // 설정 변경
  const settings = cookieStore.get("settings")?.value || "free";
  const isConcentrate = settings === "concentrate";
  const textScale = isConcentrate
    ? "text-xl tracking-wide leading-loose"
    : "text-base tracking-normal leading-normal";
  const bgTheme = isConcentrate ? "bg-amber-50/30" : "bg-slate-50";

  return (
    <html lang="ko">
      <body
        className={`${bgClass}${bgTheme} m-0 font-sans transition-colors duration-500`}
      >
        <header
          className={`p-5 border-b shadow-sm flex items-center justify-between transition-colors duration-500 ${headerClass}`}
        >
          <h2 className={`m-0 font-bold text-xl ${textClass}`}>
            ARCHITECT CONTROL CENTER
          </h2>
        </header>
        <main className={`${textScale}`}>{children}</main>
      </body>
    </html>
  );
}
