// Install React types if missing: npm install --save-dev @types/react @types/react-dom
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-300">Strona nie znaleziona</p>
      <a href="/" className="mt-4 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800">
        Wróć do strony głównej
      </a>
    </div>
  );
}