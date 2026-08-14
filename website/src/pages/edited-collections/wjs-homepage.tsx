import WJSQuickNav from "./wjs-quick-nav"
import WJSTitleCard from "./wjs-title-card"

export const WJSHomepage = () => {
  ;<div>
    {/* add nav bar  */}

    <WJSTitleCard
      button={{
        text: "Start Reading",
        link: "", // TODO: add link
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
