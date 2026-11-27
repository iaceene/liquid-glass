import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LiquidSidebar } from './liquid-sidebar'
import { LiquidBreadcrumb } from './liquid-breadcrumb'
import { LiquidPagination } from './liquid-pagination'
import { LiquidTable, LiquidTableHeader, LiquidTableRow, LiquidTableHead, LiquidTableBody, LiquidTableCell, LiquidDataTable } from './liquid-table'
import { LiquidCommandMenu } from './liquid-command-menu'
import { LiquidCalendar } from './liquid-calendar'

describe('New Liquid Glass Components', () => {
  it('renders LiquidSidebar with items and allows selection', () => {
    const onSelect = vi.fn()
    render(
      <LiquidSidebar
        items={[
          { id: 'home', label: 'Home' },
          { id: 'analytics', label: 'Analytics' },
        ]}
        onSelect={onSelect}
      />
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Analytics'))
    expect(onSelect).toHaveBeenCalledWith('analytics', expect.objectContaining({ id: 'analytics' }))
  })

  it('renders LiquidBreadcrumb and handles item click', () => {
    const onClick = vi.fn()
    render(
      <LiquidBreadcrumb
        items={[
          { label: 'Projects', href: '#' },
          { label: 'Settings', onClick },
          { label: 'General', current: true },
        ]}
      />
    )
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Settings'))
    expect(onClick).toHaveBeenCalled()
  })

  it('renders LiquidPagination and changes page', () => {
    const onPageChange = vi.fn()
    render(<LiquidPagination totalPages={5} page={1} onPageChange={onPageChange} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()

    fireEvent.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('renders LiquidTable and LiquidDataTable with sorting and searching', () => {
    const { container } = render(
      <LiquidTable>
        <LiquidTableHeader>
          <LiquidTableRow>
            <LiquidTableHead>Header</LiquidTableHead>
          </LiquidTableRow>
        </LiquidTableHeader>
        <LiquidTableBody>
          <LiquidTableRow>
            <LiquidTableCell>Cell Value</LiquidTableCell>
          </LiquidTableRow>
        </LiquidTableBody>
      </LiquidTable>
    )
    expect(container.querySelector('.nimbus-table-container')).toBeInTheDocument()

    const rows = [
      { id: 1, name: 'Tidepool Node', status: 'Online' },
      { id: 2, name: 'Aqueduct Relay', status: 'Offline' },
    ]
    render(
      <LiquidDataTable
        data={rows}
        columns={[
          { key: 'name', header: 'Name', sortable: true },
          { key: 'status', header: 'Status' },
        ]}
      />
    )
    expect(screen.getByText('Tidepool Node')).toBeInTheDocument()
    expect(screen.getByText('Aqueduct Relay')).toBeInTheDocument()

    // Filter
    const input = screen.getByPlaceholderText(/filter records/i)
    fireEvent.change(input, { target: { value: 'Aqueduct' } })
    expect(screen.queryByText('Tidepool Node')).not.toBeInTheDocument()
    expect(screen.getByText('Aqueduct Relay')).toBeInTheDocument()
  })

  it('renders LiquidCommandMenu and navigates items', () => {
    const onSelect = vi.fn()
    render(
      <LiquidCommandMenu
        open={true}
        items={[
          { id: '1', label: 'Create Droplet', onSelect },
          { id: '2', label: 'Purge Stream' },
        ]}
      />
    )
    expect(screen.getByText('Create Droplet')).toBeInTheDocument()
    expect(screen.getByText('Purge Stream')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Create Droplet'))
    expect(onSelect).toHaveBeenCalled()
  })

  it('renders LiquidCalendar and selects dates', () => {
    const onSelect = vi.fn()
    const now = new Date(2026, 10, 15) // Nov 15, 2026
    render(<LiquidCalendar defaultSelected={now} onSelect={onSelect} />)

    expect(screen.getByText(/November 2026/i)).toBeInTheDocument()
    // Click day 20
    const day20 = screen.getByText('20')
    fireEvent.click(day20)
    expect(onSelect).toHaveBeenCalled()
  })
})
