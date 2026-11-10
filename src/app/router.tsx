import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { routes } from "../config/routes";
import {
  LegacyRiderVenuesRedirect,
  LegacyRoundDetailsRedirect,
  LegacySessionResultsRedirect,
} from "./routes/legacy-route-redirects";
import { NotFoundPage, RouteErrorPage } from "./routes/route-states";

import HomePage from "../features/home/home-page";
import RankingPage from "../features/ranking/ranking-page";
import ResultsPage from "../features/results/results-page";
import LivePage from "../features/live/live-page";
import LiveResultsPage from "../features/live/live-results-page";
import ComparePage from "../features/compare/compare-page";
import FantasyPage from "../features/fantasy/fantasy-page";
import AboutPage from "../features/project-info/about-page";
import PrivacyPolicyPage from "../features/project-info/privacy-policy-page";
import RoundDetailsPage from "../features/rounds/round-details-page";
import RiderRouteLayout from "../features/riders/rider-route-layout";
import RiderDetailsPage from "../features/riders/rider-details-page";
import RiderResultsPage from "../features/riders/rider-results-page";
import RiderTracksPage from "../features/riders/rider-tracks-page";

const routeErrorElement = <RouteErrorPage />;

const riderChildren = [
  {
    index: true,
    element: <RiderDetailsPage />,
    errorElement: routeErrorElement,
  },
  {
    path: "results",
    element: <RiderResultsPage />,
    errorElement: routeErrorElement,
  },
  {
    path: "tracks",
    element: <RiderTracksPage />,
    errorElement: routeErrorElement,
  },
  { path: "venues", element: <LegacyRiderVenuesRedirect /> },
];

const riderRoute = (path: string) => ({
  path,
  element: <RiderRouteLayout />,
  errorElement: routeErrorElement,
  children: riderChildren,
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: routeErrorElement,
    children: [
      { index: true, element: <HomePage />, errorElement: routeErrorElement },
      {
        path: "ranking",
        element: <RankingPage />,
        errorElement: routeErrorElement,
      },
      {
        path: "results",
        element: <ResultsPage />,
        errorElement: routeErrorElement,
      },
      { path: "live", element: <LivePage />, errorElement: routeErrorElement },
      {
        path: "live/results/:sessionId",
        element: <LiveResultsPage />,
        errorElement: routeErrorElement,
      },
      {
        path: "compare",
        element: <ComparePage />,
        errorElement: routeErrorElement,
      },
      {
        path: "fantasy",
        element: <FantasyPage />,
        errorElement: routeErrorElement,
      },
      {
        path: "about",
        element: <AboutPage />,
        errorElement: routeErrorElement,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicyPage />,
        errorElement: routeErrorElement,
      },
      {
        path: "results/rounds/:roundId",
        element: <RoundDetailsPage />,
        errorElement: routeErrorElement,
      },
      {
        path: "results/:roundId",
        element: <RoundDetailsPage />,
        errorElement: routeErrorElement,
      },
      { path: "rounds/:roundId", element: <LegacyRoundDetailsRedirect /> },
      riderRoute("riders/:riderId"),
      riderRoute("home/riders/:riderId"),
      riderRoute("ranking/riders/:riderId"),
      riderRoute("results/riders/:riderId"),
      riderRoute("live/riders/:riderId"),
      riderRoute("compare/riders/:riderId"),
      riderRoute("fantasy/riders/:riderId"),
      riderRoute("about/riders/:riderId"),
      {
        path: "sessions/:sessionId/results",
        element: <LegacySessionResultsRedirect />,
      },
      { path: "standings", element: <Navigate to={routes.ranking} replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
