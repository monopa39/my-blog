'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CategoryData } from '@/lib/posts';

export default function CategoryNav({ categories }: { categories: CategoryData[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="category-nav">
      <button onClick={toggleMenu} aria-expanded={isOpen} aria-controls="category-menu">
        ☰ {/* Hamburger icon */}
      </button>
      <ul id="category-menu" className={`category-menu ${isOpen ? 'open' : ''}`}>
        {categories.map(({ categoryName, postCount }) => (
          <li key={categoryName}>
            <Link href={`/category/${categoryName}`} onClick={toggleMenu}>
              {categoryName} ({postCount})
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
