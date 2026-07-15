import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp — Dương Văn Ngọc | Thiệp Mời",
  description:
    "Kính mời Quý Khách đến dự Lễ Tốt Nghiệp của Dương Văn Ngọc — Công nghệ Thông tin, Đại học Phenikaa. Hãy cùng chúc mừng khoảnh khắc vinh quang này!",
  keywords: [
    "graduation",
    "tốt nghiệp",
    "thiệp mời",
    "invitation",
    "Phenikaa",
    "PKA",
  ],
  authors: [{ name: "Dương Văn Ngọc" }],
  openGraph: {
    title: "Lễ Tốt Nghiệp — Dương Văn Ngọc",
    description:
      "Thiệp mời tốt nghiệp — Công nghệ Thông tin — Đại học Phenikaa",
    type: "website",
    locale: "vi_VN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-primary text-surface" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
