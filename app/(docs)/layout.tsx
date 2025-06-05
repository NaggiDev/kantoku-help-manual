import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />
      <Sidebar />
      <main className="ml-72 pt-16">
        <div className="p-8 lg:p-12 min-h-[calc(100vh-4rem)] bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}
