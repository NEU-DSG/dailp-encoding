import React from "react"
import { css, ClassNames } from "@emotion/react"
import { BiRightArrow, BiLeftArrow } from "react-icons/bi"
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel"
import "pure-react-carousel/dist/react-carousel.es.css"

export const Carousel = (p: {
  caption: any
  images: { src: string; alt: string }[]
}) => (
  <>
    <CarouselProvider
      css={carousel}
      totalSlides={2}
      naturalSlideWidth={100}
      naturalSlideHeight={40}
      isIntrinsicHeight={true}
      isPlaying={true}
    >
      <Slider>
        {p.images.map((img, idx) => (
          <CenteredSlide key={idx} index={idx}>
            <img src={img.src} alt={img.alt} height={300} />
          </CenteredSlide>
        ))}
      </Slider>
      <ButtonBack css={[carouselButton, onLeft]}>
        <BiLeftArrow aria-label="Previous" size={24} />
      </ButtonBack>
      <ButtonNext css={[carouselButton, onRight]}>
        <BiRightArrow aria-label="Next" size={24} />
      </ButtonNext>
    </CarouselProvider>
    {p.caption ? <h5 css={{ textAlign: "center" }}>{p.caption}</h5> : null}
  </>
)

const CenteredSlide = (props: any) => (
  <ClassNames>
    {({ css }) => (
      <Slide innerClassName={css({ textAlign: "center" })} {...props} />
    )}
  </ClassNames>
)

const carousel = css`
  position: relative;
`

const carouselButton = css`
  position: absolute;
  top: 0;
  height: 100%;
  outline: none;
  border: none;
  background: none;
  width: 4rem;
`

const onLeft = css`
  left: 0;
`

const onRight = css`
  right: 0;
`
