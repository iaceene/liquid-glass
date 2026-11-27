"use client"

/**
 * Nimbus UI · Liquid Table & DataTable — "Still Waters"
 * A transparent refractive table cast in frosted glass. Rows lift slightly on hover
 * with dynamic meniscus highlights, column headers feature sorting waves, and
 * DataTable provides search, column sorting, selection, and integrated pagination.
 * No dependencies besides React.
 * by guglielmogiannattasio.it
 */

import * as React from "react"
import { useLiquidContext } from "./liquid/provider"
import { playPlip } from "./liquid/engine"
import { LiquidPagination } from "./liquid-pagination"
import { LiquidCheckbox } from "./liquid-checkbox"

/* =========================================================================
 * 1. Primitives: Table, TableHeader, TableBody, TableRow, TableHead, TableCell
 * ========================================================================= */

const TBL_CSS = `
.nimbus-table-container {
  --tb-tint: rgba(255, 255, 255, 0.16);
  --tb-fg: #0B132B;
  --tb-soft: rgba(11, 19, 43, 0.65);
  --tb-line: rgba(11, 19, 43, 0.08);
  --tb-rim: rgba(255, 255, 255, 0.75);
  --tb-hover: rgba(0, 162, 255, 0.08);
  --tb-active: rgba(0, 162, 255, 0.16);
  --tb-shadow: 0 18px 44px -20px rgba(0, 40, 90, 0.35), 0 2px 6px rgba(0, 40, 90, 0.06);
  position: relative;
  width: 100%;
  overflow-x: auto;
  border-radius: 20px;
  background: var(--tb-tint);
  -webkit-backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  backdrop-filter: blur(14px) saturate(1.2) brightness(1.06);
  box-shadow: inset 0 1px 1px var(--tb-rim), inset 0 0 0 1px rgba(255, 255, 255, 0.18), var(--tb-shadow);
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  color: var(--tb-fg);
  box-sizing: border-box;
}

.nimbus-table-container[data-tone="dark"] {
  --tb-tint: rgba(10, 18, 40, 0.3);
  --tb-fg: #F1F7FF;
  --tb-soft: rgba(241, 247, 255, 0.65);
  --tb-line: rgba(241, 247, 255, 0.1);
  --tb-rim: rgba(255, 255, 255, 0.25);
  --tb-hover: rgba(0, 162, 255, 0.12);
  --tb-active: rgba(0, 162, 255, 0.24);
  --tb-shadow: 0 18px 44px -20px rgba(0, 0, 0, 0.6);
}

.tb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  text-align: left;
}

.tb-head-row {
  border-bottom: 1px solid var(--tb-line);
}

.tb-head-cell {
  padding: 14px 16px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tb-soft);
  white-space: nowrap;
}

.tb-head-cell[data-sortable="true"] {
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;
}

.tb-head-cell[data-sortable="true"]:hover {
  color: #00A2FF;
}

.tb-body-row {
  border-bottom: 1px solid var(--tb-line);
  transition: background 0.15s ease, transform 0.15s ease;
}

.tb-body-row:last-child {
  border-bottom: 0;
}

.tb-body-row:hover {
  background: var(--tb-hover);
}

.tb-body-row[data-selected="true"] {
  background: var(--tb-active);
}

.tb-cell {
  padding: 13px 16px;
  color: var(--tb-fg);
  letter-spacing: -0.01em;
}

.tb-sort-icon {
  display: inline-flex;
  margin-left: 6px;
  vertical-align: middle;
  transition: transform 0.2s ease;
}

.tb-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--tb-line);
}

.tb-search-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--tb-line);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  color: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.tb-search-input:focus {
  border-color: #00A2FF;
  box-shadow: 0 0 10px rgba(0, 162, 255, 0.25);
  background: rgba(255, 255, 255, 0.2);
}

.tb-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--tb-line);
  font-size: 12.5px;
  color: var(--tb-soft);
}
`

export type LiquidTableProps = React.HTMLAttributes<HTMLTableElement> & {
  tone?: "light" | "dark"
}

export const LiquidTable = React.forwardRef<HTMLTableElement, LiquidTableProps>(
  function LiquidTable({ tone: propTone, className, children, ...props }, ref) {
    const ctx = useLiquidContext()
    const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")

    return (
      <div className="nimbus-table-container" data-tone={tone}>
        <style dangerouslySetInnerHTML={{ __html: TBL_CSS }} />
        <table ref={ref} className={["tb-table", className].filter(Boolean).join(" ")} {...props}>
          {children}
        </table>
      </div>
    )
  }
)
LiquidTable.displayName = "LiquidTable"

export const LiquidTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function LiquidTableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={className} {...props} />
  }
)
LiquidTableHeader.displayName = "LiquidTableHeader"

export const LiquidTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  function LiquidTableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={className} {...props} />
  }
)
LiquidTableBody.displayName = "LiquidTableBody"

export const LiquidTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }>(
  function LiquidTableRow({ selected, className, ...props }, ref) {
    return <tr ref={ref} data-selected={selected} className={["tb-body-row", className].filter(Boolean).join(" ")} {...props} />
  }
)
LiquidTableRow.displayName = "LiquidTableRow"

export const LiquidTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement> & { sortable?: boolean }>(
  function LiquidTableHead({ sortable, className, ...props }, ref) {
    return <th ref={ref} data-sortable={sortable} className={["tb-head-cell", className].filter(Boolean).join(" ")} {...props} />
  }
)
LiquidTableHead.displayName = "LiquidTableHead"

export const LiquidTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  function LiquidTableCell({ className, ...props }, ref) {
    return <td ref={ref} className={["tb-cell", className].filter(Boolean).join(" ")} {...props} />
  }
)
LiquidTableCell.displayName = "LiquidTableCell"

/* =========================================================================
 * 2. High-level DataTable Component
 * ========================================================================= */

export type DataTableColumn<T> = {
  key: keyof T | string
  header: React.ReactNode
  render?: (item: T, index: number) => React.ReactNode
  sortable?: boolean
  width?: string | number
}

export type LiquidDataTableProps<T> = {
  data: T[]
  columns: DataTableColumn<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: keyof T
  pageSize?: number
  tone?: "light" | "dark"
  sound?: boolean
  selectable?: boolean
  onSelectionChange?: (selectedItems: T[]) => void
  className?: string
  style?: React.CSSProperties
}

export function LiquidDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Filter records...",
  searchKey,
  pageSize = 5,
  tone: propTone,
  sound: propSound,
  selectable = false,
  onSelectionChange,
  className,
  style,
}: LiquidDataTableProps<T>) {
  const ctx = useLiquidContext()
  const tone = propTone ?? (ctx ? (ctx.tone === "midnight" || ctx.tone === "dark" ? "dark" : "light") : "light")
  const sound = propSound ?? ctx?.sound ?? true

  const [query, setQuery] = React.useState("")
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")
  const [page, setPage] = React.useState(1)
  const [selectedIndices, setSelectedIndices] = React.useState<Set<number>>(new Set())

  // Filter
  const filteredData = React.useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((item) => {
      if (searchKey) {
        return String(item[searchKey] ?? "").toLowerCase().includes(q)
      }
      return Object.values(item).some((val) => String(val ?? "").toLowerCase().includes(q))
    })
  }, [data, query, searchKey])

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal === bVal) return 0
      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      return sortOrder === "asc" ? 1 : -1
    })
  }, [filteredData, sortKey, sortOrder])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize])

  const handleSort = (key: string) => {
    if (sound) playPlip(500, 700)
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc")
      else {
        setSortKey(null)
        setSortOrder("asc")
      }
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const toggleSelectAll = () => {
    if (selectedIndices.size === paginatedData.length) {
      setSelectedIndices(new Set())
      onSelectionChange?.([])
    } else {
      const all = new Set(paginatedData.map((_, i) => i))
      setSelectedIndices(all)
      onSelectionChange?.(paginatedData)
    }
    if (sound) playPlip(400, 550)
  }

  const toggleSelectRow = (idx: number, _item: T) => {
    const next = new Set(selectedIndices)
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
    setSelectedIndices(next)
    onSelectionChange?.(Array.from(next).map((i) => paginatedData[i]))
    if (sound) playPlip(420, 600)
  }

  return (
    <div className="nimbus-table-container" data-tone={tone} style={style}>
      <style dangerouslySetInnerHTML={{ __html: TBL_CSS }} />

      {searchable && (
        <div className="tb-filter-bar">
          <input
            type="text"
            className="tb-search-input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {sortedData.length} records found
          </span>
        </div>
      )}

      <table className={["tb-table", className].filter(Boolean).join(" ")}>
        <thead>
          <tr className="tb-head-row">
            {selectable && (
              <th className="tb-head-cell" style={{ width: 40 }}>
                <LiquidCheckbox
                  checked={paginatedData.length > 0 && selectedIndices.size === paginatedData.length}
                  onCheckedChange={toggleSelectAll}
                  tone={tone === "dark" ? "dark" : "light"}
                  size="sm"
                  sound={sound}
                />
              </th>
            )}
            {columns.map((col) => {
              const keyStr = String(col.key)
              const isSorted = sortKey === keyStr
              return (
                <th
                  key={keyStr}
                  className="tb-head-cell"
                  data-sortable={col.sortable}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(keyStr)}
                >
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    {col.header}
                    {col.sortable && (
                      <span className="tb-sort-icon">
                        {isSorted ? (
                          sortOrder === "asc" ? " ▲" : " ▼"
                        ) : (
                          <span style={{ opacity: 0.3 }}> ⇅</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="tb-cell" style={{ textAlign: "center", padding: "32px 0", opacity: 0.6 }}>
                No records to display
              </td>
            </tr>
          ) : (
            paginatedData.map((item, idx) => {
              const isSelected = selectedIndices.has(idx)
              return (
                <tr key={idx} className="tb-body-row" data-selected={isSelected}>
                  {selectable && (
                    <td className="tb-cell">
                      <LiquidCheckbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectRow(idx, item)}
                        tone={tone === "dark" ? "dark" : "light"}
                        size="sm"
                        sound={sound}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const keyStr = String(col.key)
                    const content = col.render ? col.render(item, idx) : (item[keyStr] as React.ReactNode)
                    return (
                      <td key={keyStr} className="tb-cell">
                        {content}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="tb-footer-bar">
          <span>
            Page {page} of {totalPages}
          </span>
          <LiquidPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            tone={tone}
            sound={sound}
          />
        </div>
      )}
    </div>
  )
}

export { LiquidTable as Table }
export { LiquidTableHeader as TableHeader }
export { LiquidTableBody as TableBody }
export { LiquidTableRow as TableRow }
export { LiquidTableHead as TableHead }
export { LiquidTableCell as TableCell }
export { LiquidDataTable as DataTable }
export { LiquidTable as Component }
export default LiquidTable
