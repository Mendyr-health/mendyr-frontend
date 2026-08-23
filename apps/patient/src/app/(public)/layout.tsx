import { PublicHeader, PublicFooter } from "@/components/layout/public-layout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
      <PublicFooter />
    </>
  );
}
