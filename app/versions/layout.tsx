import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Version History | LazyCLI",
  description: "Browse all versions of LazyCLI, view release notes, and download specific versions.",
  keywords: ["LazyCLI versions", "CLI tool versions", "release history", "changelog", "download versions"],
};

export default function VersionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      {children}
    </section>
  );
}