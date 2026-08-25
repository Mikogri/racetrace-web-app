import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { riderPathForLocation, useRiderNavigationState } from './rider-navigation-state'

type RiderLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & { riderId: string }

export function RiderLink({ riderId, state, ...props }: RiderLinkProps) {
  const location = useLocation()
  const navigationState = useRiderNavigationState()
  return <Link {...props} to={riderPathForLocation(location.pathname, riderId)} state={state ?? navigationState} />
}
