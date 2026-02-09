import { navBar, navIcons, navLinks } from "./nav-bar.css"
import { DropdownNavItem } from "./dropdown-nav-item"

export const NavBar = () => {
  return (
    <nav className={navBar}>
      <ul className={navLinks}>
        <li><a href="/">HOME</a></li>

        {/* Change links? */}
        <DropdownNavItem
          label="ABOUT"
          links={[
            { text: "Support", href: "/support" },
            { text: "Goals", href: "/goals" },
            { text: "Team", href: "/team" },
            { text: "Former Contributors", href: "/former-contributors" },
            { text: "Project History", href: "/project-history" },
            { text: "Why DAILP? Why Now?", href: "/why-this-archive-why-now" },
            { text: "References", href: "/sources" },
          ]}
        />

        <DropdownNavItem
          label="COLLECTIONS"
          links={[
            {
              text: "Cherokees Writing the Keetoowah Way",
              href: "/collections/cwkw",
            },
            {
              text: "Willie Jumper Manuscripts",
              href: "/collections/willie-jumper-stories",
            },
          ]}
        />

        <DropdownNavItem
          label="TOOLS"
          links={[
            { text: "Glossary of Terms", href: "/glossary" },
            { text: "Word Search", href: "/search?query" },
            { text: "Further Learning", href: "/further-learning" },
          ]}
        />

        {/* Link out to separate "Stories" and "Spotlights" pages later on */}
        <DropdownNavItem
          label="FEATURED"
          links={[
            { text: "Stories", href: "https://dev.dailp.northeastern.edu/collections/cwkw" },
            { text: "Spotlights", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
          ]}
        />

        <li><a href="/credit">CREDIT</a></li>

        <li className={navIcons}>
          <i className="fa-solid fa-user"></i> {/* Only show for logged in users, otherwise  "Log in" */}
          <i className="fa-solid fa-gear"></i>
          <i className="fa-solid fa-bell"></i> {/* Only show for logged in users */}
        </li>
      </ul>
    </nav>
  )
}

{/* ADD MOBILE NAV BAR */ }

export default NavBar