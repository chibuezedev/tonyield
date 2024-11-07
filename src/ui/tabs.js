import React from 'react';

// Tabs Component
export function Tabs({ children }) {
  return <div className="w-full">{children}</div>;
}

// TabsList Component
export function TabsList({ children }) {
  return <div className="flex border-b border-gray-200">{children}</div>;
}

// TabsTrigger Component
export function TabsTrigger({ label, isActive, onClick }) {
  return (
    <button
      className={`py-2 px-4 text-sm font-medium transition-colors ${
        isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function TabsContent({ children, isActive }) {
  return (
    isActive && (
      <div className="p-4">
        {children}
      </div>
    )
  );
}
