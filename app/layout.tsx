import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="fixed inset-0 w-full h-full">{children}</body>
    </html>
  );
}
