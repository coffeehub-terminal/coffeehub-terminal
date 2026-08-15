import "./globals.css";
export const metadata = { title: "CoffeeHub", description: "Seller OS" };
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased bg-white text-black">{children}</body></html>;
}
