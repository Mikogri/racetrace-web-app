/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/app-shell'
import { routes } from '../config/routes'
import { LegacyRiderVenuesRedirect, LegacyRoundDetailsRedirect, LegacySessionResultsRedirect } from './routes/legacy-route-redirects'
import { NotFoundPage, RouteErrorPage, RouteLoadingPage } from './routes/route-states'

const HomePage = lazy(() => import('../features/home/home-page'))
const RankingPage = lazy(() => import('../features/ranking/ranking-page'))
const ResultsPage = lazy(() => import('../features/results/results-page'))
const LivePage = lazy(() => import('../features/live/live-page'))
const LiveResultsPage = lazy(() => import('../features/live/live-results-page'))
const ComparePage = lazy(() => import('../features/compare/compare-page'))
const FantasyPage = lazy(() => import('../features/fantasy/fantasy-page'))
const AboutPage = lazy(() => import('../features/project-info/about-page'))
const PrivacyPolicyPage = lazy(() => import('../features/project-info/privacy-policy-page'))
const RoundDetailsPage = lazy(() => import('../features/rounds/round-details-page'))
const RiderRouteLayout = lazy(() => import('../features/riders/rider-route-layout'))
const RiderDetailsPage = lazy(() => import('../features/riders/rider-details-page'))
const RiderResultsPage = lazy(() => import('../features/riders/rider-results-page'))
const RiderTracksPage = lazy(() => import('../features/riders/rider-tracks-page'))

function lazyElement(Component: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={<RouteLoadingPage />}>
      <Component />
    </Suspense>
  )
}

const routeErrorElement = <RouteErrorPage />

const riderChildren = [
  { index: true, element: lazyElement(RiderDetailsPage), errorElement: routeErrorElement },
  { path: 'results', element: lazyElement(RiderResultsPage), errorElement: routeErrorElement },
  { path: 'tracks', element: lazyElement(RiderTracksPage), errorElement: routeErrorElement },
  { path: 'venues', element: <LegacyRiderVenuesRedirect /> },
]

const riderRoute = (path: string) => ({
  path,
  element: lazyElement(RiderRouteLayout),
  errorElement: routeErrorElement,
  children: riderChildren,
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: routeErrorElement,
    children: [
      { index: true, element: lazyElement(HomePage), errorElement: routeErrorElement },
      { path: 'ranking', element: lazyElement(RankingPage), errorElement: routeErrorElement },
      { path: 'results', element: lazyElement(ResultsPage), errorElement: routeErrorElement },
      { path: 'live', element: lazyElement(LivePage), errorElement: routeErrorElement },
      {
        path: 'live/results/:sessionId',
        element: lazyElement(LiveResultsPage),
        errorElement: routeErrorElement,
      },
      { path: 'compare', element: lazyElement(ComparePage), errorElement: routeErrorElement },
      { path: 'fantasy', element: lazyElement(FantasyPage), errorElement: routeErrorElement },
      { path: 'about', element: lazyElement(AboutPage), errorElement: routeErrorElement },
      {
        path: 'privacy-policy',
        element: lazyElement(PrivacyPolicyPage),
        errorElement: routeErrorElement,
      },
      {
        path: 'results/rounds/:roundId',
        element: lazyElement(RoundDetailsPage),
        errorElement: routeErrorElement,
      },
      {
        path: 'results/:roundId',
        element: lazyElement(RoundDetailsPage),
        errorElement: routeErrorElement,
      },
      { path: 'rounds/:roundId', element: <LegacyRoundDetailsRedirect /> },
      riderRoute('riders/:riderId'),
      riderRoute('home/riders/:riderId'),
      riderRoute('ranking/riders/:riderId'),
      riderRoute('results/riders/:riderId'),
      riderRoute('live/riders/:riderId'),
      riderRoute('compare/riders/:riderId'),
      riderRoute('fantasy/riders/:riderId'),
      riderRoute('about/riders/:riderId'),
      { path: 'sessions/:sessionId/results', element: <LegacySessionResultsRedirect /> },
      { path: 'standings', element: <Navigate to={routes.ranking} replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
