import type { Meta, StoryObj } from "@storybook/react-vite"
import { UserGroup } from "src/graphql/dailp"
import { AccountActionsMenu } from "./account-actions-menu"

const meta: Meta<typeof AccountActionsMenu> = {
  title: "Components/AccountActionsMenu",
  component: AccountActionsMenu,
}

export default meta
type Story = StoryObj<typeof meta>

export const Reader: Story = {
  args: {},
}

export const Editor: Story = {
  args: {
    groups: [UserGroup.Editors],
  },
}

export const MultipleRoles: Story = {
  args: {
    groups: [UserGroup.Administrators, UserGroup.Editors],
  },
}
