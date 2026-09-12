'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface CategoryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CategoryAutocomplete({ value, onChange, placeholder = 'Search categories...' }: CategoryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.categories),
    staleTime: 60 * 1000,
  });

  const categories = categoriesData || [];

  const filteredCategories = categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (categoryName: string) => {
    onChange(categoryName);
    setSearchTerm(categoryName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          value={value || searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="input-field text-sm pl-9"
        />
      </div>
      
      {isOpen && filteredCategories.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCategories.map((cat: any) => (
            <div
              key={cat._id}
              onClick={() => handleSelect(cat.name)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
