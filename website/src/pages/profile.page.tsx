import React from "react"
import { FormProvider } from "src/components/dashboard/edit-profile-sidebar-form-context"
import {
  LayoutVariant,
  ProfileSidebarLayout,
} from "src/components/dashboard/profile-sidebar-layout"
import { useMediaQuery } from "src/custom-hooks"
import { mediaQueries } from "src/style/constants"
import Layout from "../layout"

const ProfilePage = () => {
  const isDesktop = useMediaQuery(mediaQueries.medium)

  return (
    <Layout>
      {/* <main> */}
      {isDesktop ? (
        <FormProvider>
          <ProfileSidebarLayout layout={LayoutVariant.Page} />
        </FormProvider>
      ) : (
        <FormProvider>
          <ProfileSidebarLayout layout={LayoutVariant.MobilePage} />
        </FormProvider>
      )}
      {/* </main> */}
    </Layout>
  )
}
export const Page = ProfilePage
