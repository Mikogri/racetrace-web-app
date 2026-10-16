import { describe, expect, it } from 'vitest'
import { formatCompetitionClassAbbreviation, getCompetitionClassColors } from './competition-classes'

describe('competition class display', () => {
  it.each(['world_cup', 'world-cup', 'World Cup', 'WC'])('preserves World Cup colors for %s', (code) => {
    expect(getCompetitionClassColors({ code }).text).toBe('var(--color-event-class-world-cup-text)')
  })

  it.each(['world_championship', 'world-championship', 'World Championships', 'WCH'])('preserves World Championship colors for %s', (code) => {
    expect(getCompetitionClassColors({ code }).text).toBe('var(--color-event-class-world-championship-text)')
  })

  it.each(['continental_championship', 'regional_cup', 'new_class', 'constructor', '__proto__', null])('uses neutral colors for an unconfigured class %s', (code) => {
    expect(getCompetitionClassColors({ code }).text).toBe('var(--color-event-class-neutral-text)')
  })

  it('uses API labels and recognizes aliases without restricting new classes', () => {
    expect(getCompetitionClassColors({ name: 'World Cup' })).toEqual(getCompetitionClassColors({ abbreviation: 'WC' }))
    expect(formatCompetitionClassAbbreviation({ code: 'new_class', abbreviation: 'NC' })).toBe('NC')
    expect(formatCompetitionClassAbbreviation({ name: 'Regional Race' })).toBe('RRA')
    expect(formatCompetitionClassAbbreviation({})).toBe('--')
  })
})
