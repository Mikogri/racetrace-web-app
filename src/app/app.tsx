import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useLoadDomainMetadata } from '../components/filters/api/get-domain-metadata'

export function App() {
  useLoadDomainMetadata()
  return <RouterProvider router={router} />
}
