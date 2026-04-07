import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Card } from "./card"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithLink: Story = {
  args: {
    thumbnail: "https://placehold.co/300x200?text=WithLink",
    header: { text: "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11 (1951)", link: "/collections/cwkw/dollie-duncan-02-11-1951" },
    description:
      "Dollie Duncan 02-11",
  },
}

export const WithoutLink: Story = {
  args: {
    thumbnail: "https://placehold.co/300x200?text=WithoutLink",
    header: { text: "Ned Crawford Letter (1929)", link: undefined },
    description:
      "Ned Crawford Letter",
  },
}

export const LongDescription: Story = {
  args: {
    thumbnail: "https://placehold.co/300x200?text=LongDescription",
    header: { text: "Test Long Description", link: "/documents/test1" },
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet ultricies lorem. Phasellus faucibus magna id dui scelerisque, at consectetur sapien pulvinar. Proin vehicula mauris et turpis rhoncus pulvinar id interdum odio. Sed euismod velit ac cursus convallis. Vivamus facilisis vitae ex convallis efficitur. Morbi placerat, nunc id elementum faucibus, ante nisl laoreet quam, ac sodales mauris dui ac velit. Morbi ac eros mauris. Quisque cursus dapibus tempor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum finibus sapien vel metus tempor, non tempus turpis pulvinar. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
}