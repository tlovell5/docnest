// src/context/DashboardContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // State for spec sheets
  const [specSheets, setSpecSheets] = useState([]);
  const [filteredSpecSheets, setFilteredSpecSheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    category: 'all',
    sortBy: 'dateDesc'
  });
  const [selectedSpecSheet, setSelectedSpecSheet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for spec sheets
  useEffect(() => {
    // Simulate API call to fetch spec sheets
    const fetchSpecSheets = () => {
      setIsLoading(true);
      
      // Mock data
      const mockSpecSheets = [
        {
          id: '1001',
          name: 'Chocolate Chip Cookie',
          description: 'Classic chocolate chip cookie with semi-sweet chocolate chips',
          category: 'Bakery',
          status: 'approved',
          createdBy: 'John Smith',
          createdAt: new Date('2025-03-15'),
          updatedAt: new Date('2025-04-10'),
          approvedBy: 'Sarah Johnson',
          approvedAt: new Date('2025-04-12'),
          thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
          tags: ['cookie', 'chocolate', 'bakery'],
          version: '1.2'
        },
        {
          id: '1002',
          name: 'Vanilla Ice Cream',
          description: 'Premium vanilla bean ice cream',
          category: 'Frozen',
          status: 'pending',
          createdBy: 'Emily Davis',
          createdAt: new Date('2025-04-01'),
          updatedAt: new Date('2025-04-15'),
          approvedBy: null,
          approvedAt: null,
          thumbnail: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371',
          tags: ['ice cream', 'vanilla', 'frozen'],
          version: '1.0'
        },
        {
          id: '1003',
          name: 'Tomato Basil Soup',
          description: 'Hearty tomato soup with fresh basil',
          category: 'Soup',
          status: 'draft',
          createdBy: 'Michael Brown',
          createdAt: new Date('2025-04-16'),
          updatedAt: new Date('2025-04-16'),
          approvedBy: null,
          approvedAt: null,
          thumbnail: 'https://images.unsplash.com/photo-1547592180-85f173990888',
          tags: ['soup', 'tomato', 'basil'],
          version: '0.1'
        },
        {
          id: '1004',
          name: 'Grilled Chicken Sandwich',
          description: 'Grilled chicken breast with lettuce, tomato, and mayo on a brioche bun',
          category: 'Sandwiches',
          status: 'approved',
          createdBy: 'Jennifer Wilson',
          createdAt: new Date('2025-02-20'),
          updatedAt: new Date('2025-03-05'),
          approvedBy: 'Robert Taylor',
          approvedAt: new Date('2025-03-10'),
          thumbnail: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0',
          tags: ['sandwich', 'chicken', 'lunch'],
          version: '2.1'
        },
        {
          id: '1005',
          name: 'Vegetable Stir Fry',
          description: 'Mixed vegetables stir-fried with soy sauce and ginger',
          category: 'Entrees',
          status: 'rejected',
          createdBy: 'David Martinez',
          createdAt: new Date('2025-03-25'),
          updatedAt: new Date('2025-04-02'),
          approvedBy: 'Sarah Johnson',
          approvedAt: null,
          thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
          tags: ['vegetable', 'stir fry', 'vegan'],
          version: '1.0'
        },
        {
          id: '1006',
          name: 'Blueberry Muffin',
          description: 'Moist muffin loaded with fresh blueberries',
          category: 'Bakery',
          status: 'approved',
          createdBy: 'Lisa Anderson',
          createdAt: new Date('2025-01-10'),
          updatedAt: new Date('2025-01-15'),
          approvedBy: 'Robert Taylor',
          approvedAt: new Date('2025-01-20'),
          thumbnail: 'https://images.unsplash.com/photo-1587830076330-5af15cfcb3c8',
          tags: ['muffin', 'blueberry', 'bakery'],
          version: '1.1'
        },
        {
          id: '1007',
          name: 'Caesar Salad',
          description: 'Romaine lettuce with Caesar dressing, croutons, and parmesan',
          category: 'Salads',
          status: 'pending',
          createdBy: 'Thomas White',
          createdAt: new Date('2025-04-05'),
          updatedAt: new Date('2025-04-14'),
          approvedBy: null,
          approvedAt: null,
          thumbnail: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
          tags: ['salad', 'caesar', 'lunch'],
          version: '1.0'
        },
        {
          id: '1008',
          name: 'Beef Stroganoff',
          description: 'Tender beef in a creamy mushroom sauce served over egg noodles',
          category: 'Entrees',
          status: 'approved',
          createdBy: 'Jessica Lee',
          createdAt: new Date('2025-02-10'),
          updatedAt: new Date('2025-02-25'),
          approvedBy: 'Sarah Johnson',
          approvedAt: new Date('2025-03-01'),
          thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
          tags: ['beef', 'stroganoff', 'dinner'],
          version: '1.3'
        },
        {
          id: '1009',
          name: 'Lemonade',
          description: 'Refreshing lemonade made with fresh lemons and cane sugar',
          category: 'Beverages',
          status: 'draft',
          createdBy: 'Daniel Clark',
          createdAt: new Date('2025-04-17'),
          updatedAt: new Date('2025-04-17'),
          approvedBy: null,
          approvedAt: null,
          thumbnail: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e',
          tags: ['lemonade', 'beverage', 'summer'],
          version: '0.1'
        },
        {
          id: '1010',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
          category: 'Pizza',
          status: 'approved',
          createdBy: 'Christopher Rodriguez',
          createdAt: new Date('2025-03-01'),
          updatedAt: new Date('2025-03-20'),
          approvedBy: 'Robert Taylor',
          approvedAt: new Date('2025-03-25'),
          thumbnail: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
          tags: ['pizza', 'margherita', 'italian'],
          version: '1.0'
        },
        {
          id: '1011',
          name: 'Apple Pie',
          description: 'Traditional apple pie with a flaky crust',
          category: 'Desserts',
          status: 'pending',
          createdBy: 'Amanda Harris',
          createdAt: new Date('2025-04-10'),
          updatedAt: new Date('2025-04-15'),
          approvedBy: null,
          approvedAt: null,
          thumbnail: 'https://images.unsplash.com/photo-1535920527002-b35e96722969',
          tags: ['pie', 'apple', 'dessert'],
          version: '1.0'
        },
        {
          id: '1012',
          name: 'Chicken Noodle Soup',
          description: 'Comforting soup with chicken, vegetables, and egg noodles',
          category: 'Soup',
          status: 'approved',
          createdBy: 'Matthew Thompson',
          createdAt: new Date('2025-01-15'),
          updatedAt: new Date('2025-01-30'),
          approvedBy: 'Sarah Johnson',
          approvedAt: new Date('2025-02-05'),
          thumbnail: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
          tags: ['soup', 'chicken', 'comfort food'],
          version: '1.2'
        }
      ];
      
      setSpecSheets(mockSpecSheets);
      setFilteredSpecSheets(mockSpecSheets);
      setIsLoading(false);
    };
    
    // Simulate delay for API call
    const timer = setTimeout(() => {
      fetchSpecSheets();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter and search spec sheets
  useEffect(() => {
    if (specSheets.length === 0) return;
    
    let filtered = [...specSheets];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(sheet => 
        sheet.name.toLowerCase().includes(searchLower) ||
        sheet.description.toLowerCase().includes(searchLower) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (filterOptions.status !== 'all') {
      filtered = filtered.filter(sheet => sheet.status === filterOptions.status);
    }
    
    // Apply category filter
    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(sheet => sheet.category === filterOptions.category);
    }
    
    // Apply sorting
    switch (filterOptions.sortBy) {
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'dateAsc':
        filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;
      case 'dateDesc':
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      default:
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    
    setFilteredSpecSheets(filtered);
  }, [specSheets, searchTerm, filterOptions]);
  
  // Get all unique categories
  const getCategories = () => {
    const categories = specSheets.map(sheet => sheet.category);
    return ['all', ...new Set(categories)];
  };
  
  return (
    <DashboardContext.Provider value={{
      specSheets,
      filteredSpecSheets,
      searchTerm,
      setSearchTerm,
      filterOptions,
      setFilterOptions,
      selectedSpecSheet,
      setSelectedSpecSheet,
      isLoading,
      getCategories
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
