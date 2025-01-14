import { Outlet, json, redirect, useLoaderData } from '@remix-run/react'
import { DefaultErrorBoundary } from '~/components/DefaultErrorBoundary'
import { availableVersions, latestVersion } from '~/projects/query'
import { RedirectVersionBanner } from '~/components/RedirectVersionBanner'
import { useClientOnlyRender } from '~/utils/useClientOnlyRender'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

export const loader = async (context: LoaderFunctionArgs) => {
  const { version } = context.params

  const redirectUrl = context.request.url.replace(version!, 'latest')

  if (!availableVersions.concat('latest').includes(version!)) {
    throw redirect(redirectUrl)
  }

  return json({
    version,
    redirectUrl,
  })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{
    tagName: "link",
    rel: "canonical",
    href: data?.redirectUrl,
  }]
}  

export const ErrorBoundary = DefaultErrorBoundary

export default function RouteVersionParam() {
  const { version, redirectUrl } = useLoaderData<typeof loader>()

  if (!useClientOnlyRender()) {
    return null
  }

  return (
    <>
      <RedirectVersionBanner
        version={version!}
        latestVersion={latestVersion}
        redirectUrl={redirectUrl}
      />
      <Outlet />
    </>
  )
}
