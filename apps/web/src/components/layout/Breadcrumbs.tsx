'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-600 mx-2" />
            )}
            {isLast ? (
              <span className="text-gray-300 font-medium">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-aurora-green transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-400">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
