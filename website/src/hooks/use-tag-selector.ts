import { useState } from "react"

type TagLike = { name: string } | string

interface UseTagSelectorOptions<T extends TagLike> {
  initialTags?: T[]
  approvedTags?: string[]
  getTagName?: (tag: T) => string
}

// Provides functionality for adding and removing tags in document metadata editing modal
export function useTagSelector<T extends TagLike = string>({
  initialTags = [],
  approvedTags = [],
  getTagName = (tag: T) => (typeof tag === "string" ? tag : tag.name),
}: UseTagSelectorOptions<T>) {
  const [tags, setTags] = useState<T[]>(initialTags)
  const [newTags, setNewTags] = useState<Set<string>>(new Set())
  const [showDropdown, setShowDropdown] = useState(false)

  const addTag = (tag: T) => {
    const tagName = getTagName(tag)
    if (!tags.some((t) => getTagName(t) === tagName)) {
      setTags((prev) => [...prev, tag])
      setNewTags((prev) => new Set(prev).add(tagName))
    }
    setShowDropdown(false)
  }

  const removeTag = (indexToRemove: number) => {
    setTags((prev) => {
      const removedTag = prev[indexToRemove]
      if (!removedTag) return prev

      const removedTagName = getTagName(removedTag)

      setNewTags((prevNewTags) => {
        const copy = new Set(prevNewTags)
        copy.delete(removedTagName)
        return copy
      })

      return prev.filter((_, index) => index !== indexToRemove)
    })
  }

  return {
    tags,
    newTags,
    showDropdown,
    setShowDropdown,
    addTag,
    removeTag,
    approvedTags,
  }
}
