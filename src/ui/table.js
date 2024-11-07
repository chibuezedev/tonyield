import React from 'react';

// Table Component
export function Table({ children }) {
  return <div className="overflow-x-auto"><table className="min-w-full border border-gray-200">{children}</table></div>;
}

// TableHeader Component
export function TableHeader({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

// TableHead Component
export function TableHead({ children }) {
  return <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b">{children}</th>;
}

// TableBody Component
export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

// TableRow Component
export function TableRow({ children }) {
  return <tr className="border-b">{children}</tr>;
}

// TableCell Component
export function TableCell({ children }) {
  return <td className="px-4 py-2 text-sm text-gray-700">{children}</td>;
}
