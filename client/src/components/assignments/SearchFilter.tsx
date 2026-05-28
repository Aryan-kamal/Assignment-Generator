"use client";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  subjects: string[];
}

export default function SearchFilter({
  search,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  sortBy,
  onSortChange,
  subjects,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
      {/* Subject filter */}
      <div className="relative">
        <select
          value={subjectFilter}
          onChange={(e) => onSubjectFilterChange(e.target.value)}
          className="appearance-none flex items-center gap-2 px-4 py-2.5 pr-9 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none flex items-center gap-2 px-4 py-2.5 pr-9 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="due_soon">Due Soon</option>
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search Assignment"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
        />
      </div>
    </div>
  );
}
