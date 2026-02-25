import { describe, it, expect } from 'vitest'
import { calendarData, SCHOOL_YEAR_START, SCHOOL_YEAR_END } from '../app/data/calendar-2025-2026'

describe('Calendar Data', () => {
  it('should have school year boundaries defined', () => {
    expect(SCHOOL_YEAR_START).toBe('2025-08-11')
    expect(SCHOOL_YEAR_END).toBe('2026-06-12')
  })

  it('should have entries for all school days', () => {
    // Should have 200+ entries
    const entries = Object.keys(calendarData)
    expect(entries.length).toBeGreaterThan(200)
  })

  it('should start on August 11, 2025 with D1', () => {
    const firstDay = calendarData['2025-08-11']
    expect(firstDay).toBeDefined()
    expect(firstDay!.cycleDay).toBe('D1')
  })

  it('should have D1-D6 cycle rotating correctly', () => {
    // First 6 school days should be D1 through D6
    // Aug 11 (Mon) = D1, Aug 12 (Tue) = D2, ..., Aug 14 (Thu) = D4
    // Aug 15 (Fri) = D5, Aug 18 is festivo, Aug 19 (Tue) = D6
    expect(calendarData['2025-08-11']!.cycleDay).toBe('D1')
    expect(calendarData['2025-08-12']!.cycleDay).toBe('D2')
    expect(calendarData['2025-08-13']!.cycleDay).toBe('D3')
    expect(calendarData['2025-08-14']!.cycleDay).toBe('D4')
    expect(calendarData['2025-08-15']!.cycleDay).toBe('D5')
    // Aug 18 is festivo (Asuncion de la Virgen)
    expect(calendarData['2025-08-18']!.special).toBe('festivo')
    expect(calendarData['2025-08-18']!.cycleDay).toBeUndefined()
    // Aug 19 should be D6 (festivo doesn't advance cycle)
    expect(calendarData['2025-08-19']!.cycleDay).toBe('D6')
  })

  it('should not have entries on weekends', () => {
    // Aug 16, 2025 is Saturday
    expect(calendarData['2025-08-16']).toBeUndefined()
    // Aug 17, 2025 is Sunday
    expect(calendarData['2025-08-17']).toBeUndefined()
  })

  it('should mark holidays correctly', () => {
    expect(calendarData['2025-08-18']!.special).toBe('festivo')
    expect(calendarData['2025-08-18']!.label).toBe('Asuncion de la Virgen')

    expect(calendarData['2025-10-13']!.special).toBe('festivo')
    expect(calendarData['2025-11-03']!.special).toBe('festivo')
    expect(calendarData['2026-05-01']!.special).toBe('festivo')
  })

  it('should mark vacation days correctly', () => {
    // Dec 15, 2025 to Jan 19, 2026 (weekdays)
    expect(calendarData['2025-12-15']!.special).toBe('vacaciones')
    expect(calendarData['2026-01-19']!.special).toBe('vacaciones')
    // Vacation days should not have cycleDay
    expect(calendarData['2025-12-15']!.cycleDay).toBeUndefined()
  })

  it('should mark recess days correctly', () => {
    // Oct 6-10, 2025
    expect(calendarData['2025-10-06']!.special).toBe('receso')
    expect(calendarData['2025-10-10']!.special).toBe('receso')
  })

  it('should mark Holy Week correctly', () => {
    expect(calendarData['2026-03-30']!.special).toBe('semana-santa')
    expect(calendarData['2026-04-02']!.special).toBe('semana-santa')
    expect(calendarData['2026-04-02']!.label).toBe('Jueves Santo')
    expect(calendarData['2026-04-03']!.label).toBe('Viernes Santo')
  })

  it('should mark celebrations WITH cycle day', () => {
    // Celebrations advance the cycle
    const halloween = calendarData['2025-10-31']
    expect(halloween).toBeDefined()
    expect(halloween!.special).toBe('celebracion')
    expect(halloween!.label).toBe('Dia de Disfraces')
    expect(halloween!.cycleDay).toBeDefined() // has a cycle day
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
