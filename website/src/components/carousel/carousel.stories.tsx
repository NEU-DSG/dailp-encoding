import type { Meta, StoryObj } from "@storybook/react-vite"
import { Carousel } from "./carousel"

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
}

export default meta
type Story = StoryObj<typeof meta>

export const SingleImage: Story = {
  args: {
    caption: "Cherokee syllabary chart",
    images: [
      { src: "https://placehold.co/600x300?text=Syllabary+Chart", alt: "Syllabary chart" },
    ],
  },
}

export const ThreeImages: Story = {
  args: {
    caption: "Multiple Pages",
    images: [
      { src: "https://placehold.co/600x300?text=Page+1", alt: "Manuscript page 1" },
      { src: "https://placehold.co/600x300?text=Page+2", alt: "Manuscript page 2" },
      { src: "https://placehold.co/600x300?text=Page+3", alt: "Manuscript page 3" },
    ],
  },
}

export const ThreeImagesNoCaption: Story = {
  args: {
    caption: null,
    images: [
      { src: "https://placehold.co/600x300?text=Photo+A", alt: "Archive photo A" },
      { src: "https://placehold.co/600x300?text=Photo+B", alt: "Archive photo B" },
      { src: "https://placehold.co/600x300?text=Photo+C", alt: "Archive photo C" },
    ],
  },
}

export const EmptyImages: Story = {
  args: {
    caption: "No images available (Caption)",
    images: [],
  },
}