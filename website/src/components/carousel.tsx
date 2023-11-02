import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "pure-react-carousel"
import "pure-react-carousel/dist/react-carousel.es.css"
import React from "react"
import { BiLeftArrow, BiRightArrow } from "react-icons/bi/index"
import * as css from "./carousel.css"

export const Carousel = (p: {
  caption: any
  images: { src: string; alt: string }[]
}) => (
  <>
    <CarouselProvider
      className={css.carousel}
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
      <ButtonBack className={css.leftButton}>
        <BiLeftArrow aria-label="Previous" size={24} />
      </ButtonBack>
      <ButtonNext className={css.rightButton}>
        <BiRightArrow aria-label="Next" size={24} />
      </ButtonNext>
    </CarouselProvider>
    {p.caption ? <h5 className={css.centerText}>{p.caption}</h5> : null}
  </>
)

const CenteredSlide = (props: any) => (
  <Slide innerClassName={css.centerText} {...props} />
)
