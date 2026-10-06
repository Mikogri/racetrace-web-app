import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { riderPathForLocation, useRiderNavigationState } from './rider-navigation-state'
import { routes } from '../../config/routes'
import { readMetricsFilters, writeMetricsFilters } from '../../utils/url-filters'

type RiderLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & { riderId: string }

export function RiderLink({ riderId, state, ...props }: RiderLinkProps) {
  const location = useLocation()
  const navigationState = useRiderNavigationState()
  const search = location.pathname.replace(/\/$/, '') === routes.ranking
    ? writeMetricsFilters(new URLSearchParams(), readMetricsFilters(new URLSearchParams(location.search))).toString()
    : ''
  return <Link {...props} to={{ pathname: riderPathForLocation(location.pathname, riderId), search }} state={state ?? navigationState} />
}
