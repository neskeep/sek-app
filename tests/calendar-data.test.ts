import { describe, it, expect } from 'vitest'
import { calendarData, SCHOOL_YEAR_START, SCHOOL_YEAR_END } from '../app/data/calendar-2025-2026'

describe('Calendar Data', () => {
  it('should have school year boundaries defined', () => {
    expect(SCHOOL_YEAR_START).toBe('2025-08-11')
    expect(SCHOOL_YEAR_END).toBe('2026-06-12')
  })

  it('should have entries for all school days', () => {
    const entries = Object.keys(calendarData)
    expect(entries.length).toBeGreaterThan(200)
  })

  it('should mark August 11 as institutional day (no cycle)', () => {
    const firstDay = calendarData['2025-08-11']
    expect(firstDay).toBeDefined()
    expect(firstDay!.special).toBe('receso')
    expect(firstDay!.label).toBe('Jornada institucional')
    expect(firstDay!.cycleDay).toBeUndefined()
  })

  it('should start cycle on August 12 with D1', () => {
    expect(calendarData['2025-08-12']!.cycleDay).toBe('D1')
  })

  it('should have D1-D6 cycle rotating correctly', () => {
    // Aug 12 (Tue) = D1, Aug 13 (Wed) = D2, Aug 14 (Thu) = D3, Aug 15 (Fri) = D4
    expect(calendarData['2025-08-12']!.cycleDay).toBe('D1')
    expect(calendarData['2025-08-13']!.cycleDay).toBe('D2')
    expect(calendarData['2025-08-14']!.cycleDay).toBe('D3')
    expect(calendarData['2025-08-15']!.cycleDay).toBe('D4')
    // Aug 18 is festivo (Asuncion de la Virgen)
    expect(calendarData['2025-08-18']!.special).toBe('festivo')
    expect(calendarData['2025-08-18']!.cycleDay).toBeUndefined()
    // Aug 19 should be D5 (festivo doesn't advance cycle)
    expect(calendarData['2025-08-19']!.cycleDay).toBe('D5')
    // Continue: Aug 20 = D6, Aug 21 = D1
    expect(calendarData['2025-08-20']!.cycleDay).toBe('D6')
    expect(calendarData['2025-08-21']!.cycleDay).toBe('D1')
  })

  it('should not have entries on weekends', () => {
    expect(calendarData['2025-08-16']).toBeUndefined()
    expect(calendarData['2025-08-17']).toBeUndefined()
  })

  it('should mark holidays correctly', () => {
    expect(calendarData['2025-08-18']!.special).toBe('festivo')
    expect(calendarData['2025-08-18']!.label).toBe('Asuncion de la Virgen')
    expect(calendarData['2025-10-13']!.special).toBe('festivo')
    expect(calendarData['2025-11-03']!.special).toBe('festivo')
    expect(calendarData['2026-01-12']!.special).toBe('festivo')
    expect(calendarData['2026-05-01']!.special).toBe('festivo')
  })

  it('should mark December school days correctly (Dec 15-18)', () => {
    // Per official schedule, Dec 15-18 ARE school days
    expect(calendarData['2025-12-15']!.cycleDay).toBe('D2')
    expect(calendarData['2025-12-16']!.cycleDay).toBe('D3')
    expect(calendarData['2025-12-17']!.cycleDay).toBe('D4')
    expect(calendarData['2025-12-18']!.cycleDay).toBe('D5')
  })

  it('should mark Dec 19 as Christmas celebration (no cycle)', () => {
    expect(calendarData['2025-12-19']!.special).toBe('celebracion')
    expect(calendarData['2025-12-19']!.label).toBe('Celebracion de navidad')
    expect(calendarData['2025-12-19']!.cycleDay).toBeUndefined()
  })

  it('should mark vacation days correctly (Dec 22 to Jan 13)', () => {
    expect(calendarData['2025-12-22']!.special).toBe('vacaciones')
    expect(calendarData['2026-01-09']!.special).toBe('vacaciones')
    expect(calendarData['2026-01-13']!.special).toBe('vacaciones')
    // Vacation days should not have cycleDay
    expect(calendarData['2025-12-22']!.cycleDay).toBeUndefined()
  })

  it('should resume cycle correctly after vacation (Jan 14 = D6)', () => {
    expect(calendarData['2026-01-14']!.cycleDay).toBe('D6')
  })

  it('should mark recess days correctly', () => {
    expect(calendarData['2025-10-06']!.special).toBe('receso')
    expect(calendarData['2025-10-10']!.special).toBe('receso')
  })

  it('should mark Holy Week correctly', () => {
    expect(calendarData['2026-03-30']!.special).toBe('semana-santa')
    expect(calendarData['2026-04-02']!.special).toBe('semana-santa')
    expect(calendarData['2026-04-02']!.label).toBe('Jueves Santo')
    expect(calendarData['2026-04-03']!.label).toBe('Viernes Santo')
  })

  it('should have Oct 31 as regular cycle day D4 (no special)', () => {
    expect(calendarData['2025-10-31']!.cycleDay).toBe('D4')
    expect(calendarData['2025-10-31']!.special).toBeUndefined()
  })

  it('should have Feb 25 as D6', () => {
    expect(calendarData['2026-02-25']!.cycleDay).toBe('D6')
  })

  it('should mark end of activities Jun 9-11 (no cycle)', () => {
    expect(calendarData['2026-06-09']!.special).toBe('receso')
    expect(calendarData['2026-06-10']!.special).toBe('receso')
    expect(calendarData['2026-06-11']!.special).toBe('receso')
    expect(calendarData['2026-06-09']!.cycleDay).toBeUndefined()
  })

  it('should end with clausura on June 12, 2026', () => {
    const lastDay = calendarData['2026-06-12']
    expect(lastDay).toBeDefined()
    expect(lastDay!.special).toBe('clausura')
    expect(lastDay!.label).toBe('Clausura')
  })

  it('should not have entries after school year end', () => {
    expect(calendarData['2026-06-13']).toBeUndefined()
    expect(calendarData['2026-06-15']).toBeUndefined()
  })
})
