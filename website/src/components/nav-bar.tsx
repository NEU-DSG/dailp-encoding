import * as Dailp from "src/graphql/dailp"
import { useLocation } from "src/renderer/PageShell"
import { DropdownNavItem } from "./dropdown-nav-item"
import { navBar, navIcons, navLinks } from "./nav-bar.css"

export const NavBar = () => {
  const location = useLocation()

  const [{ data, fetching, error }] = Dailp.useMenuBySlugQuery({
    variables: { slug: "default-nav" },
  })

  if (fetching) return null
  if (error) return null

  const menuItems = data?.menuBySlug?.items
  if (!menuItems) return null

  // Handles top-level nav items
  const isTopLevel = (a: any) =>
    !menuItems.some((b: any) => b?.items?.some((c: any) => c?.path === a?.path))

  return (
    <nav className={navBar}>
      <ul className={navLinks}>
        {menuItems.filter(isTopLevel).map((item: any) => {
          if (!item) return null

          // Handles dropdown nav items
          if (item.items?.length) {
            return (
              <DropdownNavItem
                key={item.label}
                label={item.label}
                links={item.items.map((child: any) => ({
                  text: child.label,
                  href: child.path,
                }))}
              />
            )
          }

          // Normal link
          let href = item.path
          if (item.path?.startsWith("http")) {
            href = new URL(item.path).pathname
          }

          return (
            <li key={item.path}>
              <a
                href={href}
                aria-current={location.pathname === href ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          )
        })}

        <li className={navIcons}>
          {/* Only show for logged in users, otherwise  "Log in" */}
          <i className="fa-solid fa-user"></i>
          <i className="fa-solid fa-gear"></i>
          <i className="fa-solid fa-bell"></i>
        </li>
      </ul>
    </nav>
  )
}

{
  /* ADD MOBILE NAV BAR */
}

export default NavBar
