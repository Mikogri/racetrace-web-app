import { Navigate } from 'react-router-dom'
import { routes } from '../../config/routes'
import { useRequiredRouteParam } from './use-required-route-param'

export function LegacySessionResultsRedirect() {
  const sessionId = useRequiredRouteParam('sessionId')
  return <Navigate to={routes.liveResults(sessionId)} replace />
}

export function LegacyRiderVenuesRedirect() {
  const riderId = useRequiredRouteParam('riderId')
  return <Navigate to={routes.riderTracks(riderId)} replace />
}

export function LegacyRoundDetailsRedirect() {
  const roundId = useRequiredRouteParam('roundId')
  return <Navigate to={routes.round(roundId)} replace />
}
