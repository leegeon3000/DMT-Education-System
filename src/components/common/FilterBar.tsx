import React, { useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

export type FilterType = 'text' | 'select' | 'multiselect' | 'daterange' | 'date';

export interface FilterConfig {
  type: FilterType;
  name: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, any>) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onSearch,
  searchPlaceholder = 'Tìm kiếm...',
  showSearch = true,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    filters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        initial[filter.name] = filter.defaultValue;
      }
    });
    return initial;
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (name: string, value: any) => {
    const newFilters = { ...filterValues, [name]: value };
    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: Record<string, any> = {};
    filters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        clearedFilters[filter.name] = filter.defaultValue;
      } else {
        clearedFilters[filter.name] = filter.type === 'multiselect' ? [] : '';
      }
    });
    setFilterValues(clearedFilters);
    onFilterChange(clearedFilters);
    setSearchQuery('');
    onSearch?.('');
  };

  const activeFiltersCount = Object.entries(filterValues).filter(([_, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== '';
  }).length;

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.name] || (filter.type === 'multiselect' ? [] : '');

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            placeholder={filter.placeholder || filter.label}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">{filter.placeholder || `Chọn ${filter.label.toLowerCase()}`}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...value, option.value]
                      : value.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.name, newValue);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        );

      case 'daterange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
              <input
                type="date"
                value={value.from || ''}
                onChange={(e) => handleFilterChange(filter.name, { ...value, from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
              <input
                type="date"
                value={value.to || ''}
                onChange={(e) => handleFilterChange(filter.name, { ...value, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        )}

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition-all ${
            showFilters || activeFiltersCount > 0
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa lọc</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
