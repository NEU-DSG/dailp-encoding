import { navBar, navIcons, navLinks } from "./nav-bar.css"
import { DropdownNavItem } from "./dropdown-nav-item"

export const NavBar = () => {
  return (
    <nav className={navBar}>
      <ul className={navLinks}>
        <li><a href="/">HOME</a></li>
        
        {/* Change links */}
        <DropdownNavItem
          label="ABOUT"
          links={[
            { text: "Support", href: "https://dev.dailp.northeastern.edu/collections/cwkw" },
            { text: "Goals", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
            { text: "Team", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
            { text: "Former Contributors", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
            { text: "Project History", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
            { text: "References", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
          ]}
        />

        <DropdownNavItem
          label="COLLECTIONS"
          links={[
            { text: "Cherokees Writing the Keetoowah Way", href: "https://dev.dailp.northeastern.edu/collections/cwkw" },
            { text: "Willie Jumper Manuscripts", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
          ]}
        />

        <DropdownNavItem
          label="TOOLS"
          links={[
            { text: "Glossary of Terms", href: "https://dev.dailp.northeastern.edu/collections/cwkw" },
            { text: "Word Search", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
            { text: "Further Learning", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
          ]}
        />

        <DropdownNavItem
          label="FEATURED"
          links={[
            { text: "Stories", href: "https://dev.dailp.northeastern.edu/collections/cwkw" },
            { text: "Spotlights", href: "https://dev.dailp.northeastern.edu/collections/willie-jumper-stories" },
          ]}
        />

        <li><a href="/credit">CREDIT</a></li>

        <div className={navIcons}>
          <i className="fa-solid fa-user"></i>
          <i className="fa-solid fa-gear"></i>
          <i className="fa-solid fa-bell"></i>
        </div>
      </ul>
    </nav>
  )
}

export default NavBar