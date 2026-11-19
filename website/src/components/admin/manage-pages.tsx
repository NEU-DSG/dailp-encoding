import React, { useState } from "react"
import { HiOutlinePencil } from "react-icons/hi/index"
import { IoSearch } from "react-icons/io5/index"
import { MdClose, MdTune } from "react-icons/md/index"
import { useAllPagesQuery, useDeletePageMutation } from "src/graphql/dailp"
import { Button } from "../button"
import Link from "../link"
import * as css from "./manage-pages.css"

const LOCATION_OPTIONS = [
  "None",
  "Home",
  "Tools",
  "About",
  "Stories",
  "Spotlights",
  "Collections",
] as const

type Location = typeof LOCATION_OPTIONS[number]

const PATH_PREFIX_TO_LOCATION: Record<string, Location> = {
  "/": "Home",
  "/tools": "Tools",
  "/about": "About",
  "/stories": "Stories",
  "/spotlights": "Spotlights",
  "/collections": "Collections",
}

const locationForPath = (path: string): Location => {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") return "Home"
  const firstSegment = "/" + normalized.split("/")[1]
  return PATH_PREFIX_TO_LOCATION[firstSegment] ?? "None"
}

export const ManagePages = () => {
  const [{ data, fetching, error }] = useAllPagesQuery()
  const [search, setSearch] = useState("")
  const [locationFilter, setLocationFilter] = useState<Location | "">("")
  const allPages = data?.allPages ?? []
  const query = search.trim().toLowerCase()
  const pages = allPages.filter((p) => {
    const matchesSearch =
      !query || (p.title ?? p.path).toLowerCase().includes(query)
    const matchesLocation =
      !locationFilter || locationForPath(p.path) === locationFilter
    return matchesSearch && matchesLocation
  })

  return (
    <div className={css.wrapper}>
      <h1 className={css.header}>Manage Site Pages</h1>

      <div className={css.toolbar}>
        <div className={css.searchGroup}>
          <IoSearch className={css.searchIcon} aria-hidden />
          <input
            type="search"
            className={css.searchInput}
            placeholder="Search for an existing page"
            aria-label="Search for an existing page"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={css.filterGroup}>
          <MdTune className={css.filterIcon} aria-hidden />
          <label>
            Filter By:{" "}
            <select
              className={css.select}
              value={locationFilter}
              onChange={(e) =>
                setLocationFilter(e.target.value as Location | "")
              }
            >
              <option value="">All</option>
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Link href="/edit/?path=/new-page" className={css.newPageButton}>
          + New Page
        </Link>
      </div>

      {fetching && <p className={css.empty}>Loading pages…</p>}
      {error && <p className={css.empty}>Failed to load pages.</p>}
      {!fetching && !error && pages.length === 0 && (
        <p className={css.empty}>No pages found.</p>
      )}

      <ul className={css.list}>
        {pages.map((page) => (
          <PageRow key={page.path} page={page} />
        ))}
      </ul>
    </div>
  )
}

const PageRow = ({
  page,
}: {
  page: { path: string; title?: string; id?: string }
}) => {
  const editHref = `/edit/?path=${encodeURIComponent(page.path)}`
  const [confirming, setConfirming] = useState(false)
  const [{ fetching: deleting }, deletePage] = useDeletePageMutation()

  const onConfirmYes = async () => {
    if (!page.id) return
    await deletePage({ id: page.id })
    setConfirming(false)
  }

  return (
    <li className={css.row}>
      <div className={css.pageTitleGroup}>
        <Link href={page.path} className={css.pageTitle}>
          {page.title ?? page.path}
        </Link>
        <Link href={editHref} className={css.editIcon} aria-label="Rename page">
          <HiOutlinePencil />
        </Link>
      </div>

      <div className={css.locationGroup}>
        Location: <span>{locationForPath(page.path)}</span>
      </div>

      {confirming ? (
        <div className={css.confirmGroup}>
          <span className={css.confirmLabel}>Confirm Delete Page?</span>
          <Button onClick={onConfirmYes} disabled={deleting || !page.id}>
            Yes
          </Button>
          <Button onClick={() => setConfirming(false)} disabled={deleting}>
            No
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className={css.deleteButton}
          aria-label={`Delete ${page.title ?? page.path}`}
          onClick={() => setConfirming(true)}
        >
          <MdClose aria-hidden /> Delete Page
        </button>
      )}
    </li>
  )
}
