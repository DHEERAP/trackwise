'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  APPLICATION_STATUS, APPLICATION_PRIORITY, APPLICATION_PLATFORM, SORT_OPTIONS,
} from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import type { ApplicationFilters } from '@/types';

interface FiltersBarProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
  onReset: () => void;
}

const ALL = '__all__';

export const FiltersBar = ({ filters, onChange, onReset }: FiltersBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? '')) {
      onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch]); // eslint-disable-line

  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.platform;

  const update = (key: keyof ApplicationFilters, value: string) =>
    onChange({ ...filters, [key]: value === ALL ? undefined : value, page: 1 });

  const sortValue = filters.sortBy
    ? `${filters.sortBy}:${filters.sortOrder ?? 'desc'}`
    : 'createdAt:desc';

  const handleSort = (value: string) => {
    const [sortBy, sortOrder] = value.split(':');
    onChange({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search company, role, recruiter..."
          className="pl-9 pr-9"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => { setSearchInput(''); onChange({ ...filters, search: undefined, page: 1 }); }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={filters.status ?? ALL} onValueChange={(v) => update('status', v)}>
          <SelectTrigger className="h-9 w-[150px] text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            {APPLICATION_STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.priority ?? ALL} onValueChange={(v) => update('priority', v)}>
          <SelectTrigger className="h-9 w-[130px] text-xs">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Priorities</SelectItem>
            {APPLICATION_PRIORITY.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.platform ?? ALL} onValueChange={(v) => update('platform', v)}>
          <SelectTrigger className="h-9 w-[140px] text-xs">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Platforms</SelectItem>
            {APPLICATION_PLATFORM.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={sortValue} onValueChange={handleSort}>
          <SelectTrigger className="h-9 w-[170px] text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-xs gap-1">
            <X className="h-3 w-3" /> Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
