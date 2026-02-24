'use client';

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

interface ActivityFiltersProps {
  filters: {
    city: string;
    neighborhood_id: string;
    category: string;
    age_min: string;
    age_max: string;
  };
  neighborhoods: Neighborhood[];
  onFiltersChange: (filters: any) => void;
}

const categories = [
  'Sports',
  'Arts & Crafts',
  'Music',
  'Dance',
  'Academic',
  'STEM',
  'Language',
  'Martial Arts',
  'Swimming',
  'Other',
];

const cities = ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora'];

export default function ActivityFilters({
  filters,
  neighborhoods,
  onFiltersChange,
}: ActivityFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset neighborhood when city changes
    if (key === 'city') {
      newFilters.neighborhood_id = '';
    }
    
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      city: '',
      neighborhood_id: '',
      category: '',
      age_min: '',
      age_max: '',
    });
  };

  // Filter neighborhoods by selected city
  const filteredNeighborhoods = filters.city
    ? neighborhoods.filter((n) => n.city.toLowerCase() === filters.city.toLowerCase())
    : neighborhoods;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Neighborhood Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Neighborhood
          </label>
          <select
            value={filters.neighborhood_id}
            onChange={(e) => handleFilterChange('neighborhood_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!filters.city}
          >
            <option value="">All Neighborhoods</option>
            {filteredNeighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Age Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Child Age Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min age"
                min="3"
                max="18"
                value={filters.age_min}
                onChange={(e) => handleFilterChange('age_min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max age"
                min="3"
                max="18"
                value={filters.age_max}
                onChange={(e) => handleFilterChange('age_max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            {Object.values(filters).filter(Boolean).length > 0 ? (
              <span>
                {Object.values(filters).filter(Boolean).length} filter(s) applied
              </span>
            ) : (
              <span>No filters applied</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}