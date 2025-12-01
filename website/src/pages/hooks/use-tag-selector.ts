import { useState } from "react"

// Provides functionality for adding and removing tags in document metadata editing modal
export function useTagSelector(initialTags: string[] = [], approvedTags: string[] = []) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [newTags, setNewTags] = useState<Set<string>>(new Set())
  const [showDropdown, setShowDropdown] = useState(false)

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTags((prev) => new Set(prev).add(tag))
    }
    setShowDropdown(false)
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
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
