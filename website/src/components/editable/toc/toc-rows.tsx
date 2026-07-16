import React, { useEffect, useState } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { MdDragIndicator } from "react-icons/md/index"
import { useEditToc } from "src/contexts/edit-toc-context"
import type { ChapterNode, SectionKey } from "src/types/edit-toc"
import { idOf } from "src/utils/edit-toc"
import * as css from "./EditToc.css"

// Draft Row is a green row that has not been added as a pending chapter yet
export const DraftRow = () => {
  const {
    draftTitle,
    draftSlug,
    availableSlugs,
    onDraftTitleChange,
    onDraftSlugChange,
    onConfirmDraft,
    onCancelDraft,
  } = useEditToc()

  return (
    <li className={css.chapterRow.draft}>
      <div className={css.chapterRowContent}>
        <div className={css.inputsOfRow}>
          <input
            type="text"
            placeholder="Title"
            value={draftTitle}
            onChange={(e) => onDraftTitleChange(e.target.value)}
            className={css.titleInput}
          />
          <select
            value={draftSlug}
            onChange={(e) => onDraftSlugChange(e.target.value)}
            className={css.slugInput}
            disabled={availableSlugs.length === 0}
          >
            <option value="">
              {availableSlugs.length === 0
                ? "No unassigned chapters"
                : "Select a slug..."}
            </option>
            {availableSlugs.map((s) => (
              <option value={s} key={s}>
                {s.replace(/_/g, "-")}
              </option>
            ))}
          </select>
        </div>
        <div className={css.controlsOfRow}>
          <button
            type="button"
            onClick={onConfirmDraft}
            disabled={availableSlugs.length === 0}
            className={css.tocButton.primary}
          >
            Add Chapter
          </button>
          <button
            type="button"
            onClick={onCancelDraft}
            className={css.tocButton.neutral}
          >
            Cancel
          </button>
        </div>
      </div>
    </li>
  )
}

// In addition to the context, props for an existing chapter
type ChapterItemProps = {
  chapter: ChapterNode
  index: number // Index in parent list
  sectionKey: SectionKey
  depth: number // Depth (either 0 for chapter or 1 for subchapter)
}

// Chapter row for already added chapters
export const ChapterRow = ({
  chapter,
  index,
  sectionKey,
  depth,
}: ChapterItemProps) => {
  const { draftTarget, onOpenDraft, onRemove } = useEditToc()

  const chapterId = idOf(chapter)
  const isTopLevel = depth === 0

  // if draft is in this chapter as subchapter
  const hasDraftHere =
    draftTarget?.sectionKey === sectionKey && draftTarget.parentId === chapterId

  return (
    <Draggable key={chapterId} draggableId={chapterId} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={
            chapter.isNew
              ? css.chapterRow.draft
              : snapshot.isDragging
              ? css.chapterRow.dragging
              : css.chapterRow.default
          }
        >
          <div className={css.chapterRowContent} {...provided.dragHandleProps}>
            <div className={css.inputsOfRow}>
              <span className={css.dragHandle}>
                <MdDragIndicator size={16} />
              </span>
              {!isTopLevel && <span className={css.nestedArrow}>↳</span>}
              {chapter.isNew && <span className={css.newBadge}>NEW</span>}
              <input
                type="text"
                placeholder="Title"
                value={chapter.title}
                className={css.titleInput}
                disabled
              />
              <input
                type="text"
                placeholder="Slug"
                value={chapter.slug.replace(/_/g, "-")}
                className={css.slugInput}
                disabled
              />
            </div>
            <div className={css.controlsOfRow}>
              {isTopLevel && (
                <button
                  type="button"
                  onClick={() => onOpenDraft(sectionKey, chapterId)}
                  className={css.tocButton.primary}
                >
                  + Add Subchapter
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  onRemove(
                    sectionKey,
                    chapterId,
                    chapter.title,
                    !!chapter.isNew
                  )
                }
                className={
                  chapter.isNew ? css.tocButton.neutral : css.tocButton.danger
                }
              >
                {chapter.isNew ? "Remove" : "Delete"}
              </button>
            </div>
          </div>
          {(chapter.children.length > 0 || hasDraftHere) && (
            <Droppable
              droppableId={`${sectionKey}:${chapterId}`}
              type={`${chapterId}`}
              direction="vertical"
            >
              {(dropProvided) => (
                <ul
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  className={css.nestedList}
                >
                  {chapter.children.map((child, childIndex) => (
                    <ChapterRow
                      key={idOf(child)}
                      chapter={child}
                      index={childIndex}
                      sectionKey={sectionKey}
                      depth={depth + 1}
                    />
                  ))}
                  {dropProvided.placeholder}
                  {hasDraftHere && <DraftRow />}
                </ul>
              )}
            </Droppable>
          )}
        </li>
      )}
    </Draggable>
  )
}
