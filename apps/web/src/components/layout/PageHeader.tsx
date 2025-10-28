'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  icon?: ReactNode | string;
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({ icon, title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`text-center mb-12 animate-fade-in ${className}`}>
      {icon && (
        <div className="text-6xl mb-4 animate-bounce-subtle">
          {typeof icon === 'string' ? icon : icon}
        </div>
      )}
      <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
