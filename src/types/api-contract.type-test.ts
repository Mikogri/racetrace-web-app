import { z } from 'zod'
import type { AssertApiContract } from './api-contract'

export const schema = z.object({ id: z.number(), state: z.enum(['ready', 'pending']), date: z.string().nullable() })
export type CompatibleWire = AssertApiContract<{ id: number; state: 'ready'; date: null } extends z.input<typeof schema> ? true : false>
// @ts-expect-error A backend ID becoming nullable must break the contract check.
export type ChangedNullability = AssertApiContract<{ id: number | null; state: 'ready'; date: null } extends z.input<typeof schema> ? true : false>
// @ts-expect-error A new backend enum member must be accepted explicitly by Zod.
export type ChangedEnum = AssertApiContract<{ id: number; state: 'removed'; date: null } extends z.input<typeof schema> ? true : false>
// @ts-expect-error A renamed backend field must break a required Zod property.
export type ChangedName = AssertApiContract<{ riderId: number; state: 'ready'; date: null } extends z.input<typeof schema> ? true : false>
