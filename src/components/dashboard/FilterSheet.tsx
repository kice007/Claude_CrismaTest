'use client'

import { useTranslation } from 'react-i18next'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

export interface FilterState {
  role: string
  scoreMin: string
  scoreMax: string
  search: string
}

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function FilterSheet({ open, onOpenChange, filters, onChange }: FilterSheetProps) {
  const { t } = useTranslation('translation')

  function update(key: keyof FilterState, value: string) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 pb-safe space-y-4">
          {/* Search */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={e => update('search', e.target.value)}
              placeholder={t('dashboard.talentPool.search')}
              className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <input
              type="text"
              value={filters.role}
              onChange={e => update('role', e.target.value)}
              placeholder={t('dashboard.talentPool.filterRole')}
              className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Score range */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              {t('dashboard.talentPool.filterScore')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.scoreMin}
                onChange={e => update('scoreMin', e.target.value)}
                placeholder="Min"
                min="0"
                max="100"
                className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-slate-400 shrink-0">–</span>
              <input
                type="number"
                value={filters.scoreMax}
                onChange={e => update('scoreMax', e.target.value)}
                placeholder="Max"
                min="0"
                max="100"
                className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Apply */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full min-h-[48px] rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
