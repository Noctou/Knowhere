"use client";

type ItemSearchFilterProps = {
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
  onSearchTermChange: (value: string) => void;
  onSelectedCategoryChange: (value: string) => void;
};

export default function ItemSearchFilter({
  categories,
  searchTerm,
  selectedCategory,
  onSearchTermChange,
  onSelectedCategoryChange,
}: ItemSearchFilterProps) {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <label
            htmlFor="item-search"
            className="block text-sm font-medium text-gray-700"
          >
            Search item name
          </label>
          <input
            id="item-search"
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            placeholder="Search by item name"
          />
        </div>

        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => onSelectedCategoryChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
