import WJSQuickNav from "./wjs-quick-nav"
import WJSTitleCard from "./wjs-title-card"

export const WJSHomepage = () => {
  ;<div>
    {/* add header  */}

    <WJSTitleCard
      button={{
        text: "Start Reading",
        link: "/acknowledgements",
      }}
    />

    <WJSQuickNav />

    <section id="about">...</section>
    <section id="getting-started">...</section>
    <section id="chapters">...</section>
    <section id="featured-stories">...</section>
    <section id="credit">...</section>
  </div>
}
