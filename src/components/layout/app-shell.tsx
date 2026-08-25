import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer } from './footer'
import { MobileNavigation } from '../navigation/mobile-navigation'
import { TopNavigation } from '../navigation/top-navigation'

export function AppShell() {
  return (
    <>
      <TopNavigation />
      <MobileNavigation />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </>
  )
}
