import React from 'react';
import { GraduationCap } from 'lucide-react';

export function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Automated Paperless Transparent College System
          </h1>
          <h2 className="text-xl text-gray-600">{title}</h2>
        </header>

        <main className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            {children}
          </div>
        </main>

        <footer className="text-center mt-8 text-gray-600">
          <p>&copy; {new Date().getFullYear()} College System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}