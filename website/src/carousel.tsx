import React from "react"
import { css, cx } from "linaria"
import { BiRightArrow, BiLeftArrow } from "react-icons/bi"
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel"
import "pure-react-carousel/dist/react-carousel.es.css"

export const Carousel = (p: { caption: any; images: string[] }) => (
  <>
    <CarouselProvider
      className={carousel}
      totalSlides={2}
      naturalSlideWidth={100}
      naturalSlideHeight={40}
      isIntrinsicHeight={true}
      isPlaying={true}
    >
      <Slider>
        {p.images.map((url, idx) => (
          <Slide key={idx} index={idx} innerClassName={centerAlign}>
            <img src={url} />
          </Slide>
        ))}
      </Slider>
      <ButtonBack className={cx(carouselButton, onLeft)}>
        <BiLeftArrow aria-label="Previous" size={24} />
      </ButtonBack>
      <ButtonNext className={cx(carouselButton, onRight)}>
        <BiRightArrow aria-label="Next" size={24} />
      </ButtonNext>
    </CarouselProvider>
    {p.caption ? <h5 className={centerAlign}>{p.caption}</h5> : null}
  </>
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

const centerAlign = css`
  text-align: center;
`