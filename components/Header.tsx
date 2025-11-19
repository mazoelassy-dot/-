import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white p-6 shadow-lg rounded-b-3xl mb-8">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">المصحح الذكي</h1>
          <p className="text-indigo-100 opacity-90">تصحيح آلي لأوراق الطلاب المكتوبة بخط اليد باستخدام فهم السياق</p>
        </div>
        <div className="hidden md:block">
            {/* Placeholder for an icon or graphic */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 opacity-80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
      </div>
    </header>
  );
};