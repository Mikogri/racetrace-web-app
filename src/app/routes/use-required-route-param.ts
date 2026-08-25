import { useParams } from 'react-router-dom'
import { z } from 'zod'

const routeParamSchema = z.string().trim().min(1).max(200)

export function useRequiredRouteParam(name: string): string {
  const params = useParams()
  const result = routeParamSchema.safeParse(params[name])
  if (!result.success) throw new Response(`Missing or invalid ${name}.`, { status: 400 })
  return result.data
}
