import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4 text-xl font-semibold">
        Student Performance Tracker
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
