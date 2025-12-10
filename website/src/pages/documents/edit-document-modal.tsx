import plugins from "citation-js"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { v4 as uuidv4 } from "uuid"
import * as Dailp from "src/graphql/dailp"
import { UserRole, useUserRole } from "../../auth"
import { buildCitationMetadata } from "../../utils/build-citation-metadata"
import Cite from "../../utils/citation-config"
import { useTagSelector } from "../hooks/use-tag-selector"
import { Dropdown } from "./dropdown"
import * as styles from "./edit-document-modal.css"
import { EditingProvider, useEditing } from "./editing-context"
import { TagSelector } from "./tag-selector"

export type EditDocumentModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  documentMetadata: Dailp.AnnotatedDoc
}

export interface FormContributor extends Dailp.Contributor {
  details: Dailp.ContributorDetails | null
  isNew: boolean
  isVisible: boolean | false
}

export const formatMap: Record<string, string> = {
  APA: "apa",
  Vancouver: "vancouver",
  Harvard: "harvard1",
}

// Reusable approved tags lists
const approvedKeywords = [
  "Colonialism",
  "Government",
  "Politics",
  "History",
  "Culture",
  "Law",
  "Constitution",
  "Indigenous Rights",
  "Treaty",
  "Land Rights",
  "Self-Determination",
  "Tribal Governance",
]

const approvedSubjectHeadings = [
  "Cherokee Political Structure",
  "Sacred Relationships to Land",
  "Indigenous Self-Determination",
  "Ecological Stewardship",
  "Colonial Disruption and Resilience",
  "Ceremony and Sacred Practice",
  "Indigenous Governance Models",
]

const approvedLanguages = [
  "Mandarin Chinese",
  "Hindi",
  "Spanish",
  "French",
  "Arabic",
  "Bengali",
  "Portuguese",
  "Navajo",
  "Cree",
  "Sioux",
  "Chippewa",
]

const approvedSpatialCoverages = [
  "New Echota, GA",
  "Tennessee, USA",
  "Boston, MA",
  "New York City, NY",
  "Los Angeles, CA",
  "Tokyo, Japan",
  "Beijing, China",
  "Paris, France",
  "Dubai, UAE",
]

function getDisplayName(code: string) {
  return Object.keys(formatMap).find((key) => formatMap[key] === code) ?? code
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  documentMetadata,
}: EditDocumentModalProps) => {
  const { isEditing, setIsEditing } = useEditing()

  // Only render the modal when isOpen is true
  if (!isOpen) return null

  const userRole = useUserRole()
  const isContributor = userRole === UserRole.Contributor

  // Memoize extracted names from metadata so they update when documentMetadata changes
  const keywordStrings = useMemo(
    () => (documentMetadata.keywords ?? []).map((k) => k.name),
    [documentMetadata.keywords]
  )

  const languageStrings = useMemo(
    () => (documentMetadata.languages ?? []).map((l) => l.name),
    [documentMetadata.languages]
  )

  const subjectHeadingStrings = useMemo(
    () => (documentMetadata.subjectHeadings ?? []).map((sh) => sh.name),
    [documentMetadata.subjectHeadings]
  )

  const spatialCoverageStrings = useMemo(
    () => (documentMetadata.spatialCoverage ?? []).map((sc) => sc.name),
    [documentMetadata.spatialCoverage]
  )

  // Get name from tag
  const getKeywordName = (tag: Dailp.Keyword) => tag.name

  const [title, setTitle] = useState(documentMetadata.title ?? "")
  const [date, setDate] = useState(documentMetadata.date ?? "")
  const [creator, setCreator] = useState(documentMetadata.creators ?? [])
  const [keywords, setKeywords] = useState(documentMetadata.keywords ?? [])
  const [languages, setLanguages] = useState(documentMetadata.languages ?? [])
  const [spatialCoverage, setSpatialCoverage] = useState(
    documentMetadata.spatialCoverage ?? []
  )
  const [subjectHeadings, setSubjectHeadings] = useState(
    documentMetadata.subjectHeadings ?? []
  )

  const [contributors, setContributors] = useState<FormContributor[]>(() =>
    (documentMetadata.contributors ?? []).map((c) => ({
      ...c,
      isNew: false,
      isVisible: c.details?.isVisible ?? false,
      details: c.details ? { ...c.details } : null,
    }))
  )

  // const [description, setDescription] = useState(documentMetadata.description ?? "")
  // const [genre, setGenre] = useState(documentMetadata.genre ?? "")
  // const [format, setFormat] = useState(documentMetadata.format ?? "")
  // const [pages, setPages] = useState(documentMetadata.pages ?? "")
  // const [source, setSource] = useState(documentMetadata.source ?? "")
  // const [doi, setDOI] = useState(documentMetadata.doi ?? "")
  // const [citation, setCitation] = useState("")
  // const [citeFormat, setCiteFormat] = useState("APA")

  //const [newKeywords, setNewKeywords] = useState<Set<string>>(new Set())

  // For initializing new contributors who may not have a role yet
  type MaybeContributorRole = Dailp.ContributorRole | null

  const [newContributors, setNewContributors] = useState<Set<string>>(new Set())

  const [tempName, setTempName] = useState("")
  const [tempRole, setTempRole] = useState<MaybeContributorRole>(null)
  const [tempVisible, setTempVisible] = useState(false)

  const contributorRoles = Object.values(Dailp.ContributorRole)

  // useEffect(() => {
  //   if (!isOpen) return

  //   const dm = documentMetadata

  //   setTitle(dm.title ?? "")
  //   setDate(dm.date ?? "")
  //   setCreator(dm.creators ?? [])
  //   setKeywords(dm.keywords ?? [])
  //   setLanguages(dm.languages ?? [])
  //   setSubjectHeadings(dm.subjectHeadings ?? [])
  //   setSpatialCoverage(dm.spatialCoverage ?? [])
  //   setContributors(
  //     (dm.contributors ?? []).map((c) => ({
  //       ...c,
  //       isNew: false,
  //       isVisible: c.details?.isVisible ?? false,
  //       details: c.details ? { ...c.details } : null,
  //     }))
  //   )
  // }, [isOpen, documentMetadata])

  // Initialize tag selectors with memoized strings
  const {
    tags: selectedKeywords,
    newTags: newKeywords,
    addTag: addKeyword,
    removeTag: removeKeyword,
  } = useTagSelector(keywordStrings, approvedKeywords)

  const {
    tags: selectedSubjectHeadings,
    newTags: newHeadings,
    addTag: addHeading,
    removeTag: removeHeading,
  } = useTagSelector(subjectHeadingStrings, approvedSubjectHeadings)

  const {
    tags: selectedLanguages,
    newTags: newLanguages,
    addTag: addLanguage,
    removeTag: removeLanguage,
  } = useTagSelector(languageStrings, approvedLanguages)

  const {
    tags: selectedSpatialCoverages,
    newTags: newCoverages,
    addTag: addCoverage,
    removeTag: removeCoverage,
  } = useTagSelector(spatialCoverageStrings, approvedSpatialCoverages)

  const [backupState, setBackupState] = useState<null | {
    title: string
    date: string | Dailp.Date
    // description: string
    // type: string
    // format: string
    //genre: string
    // pages: string
    creator: Dailp.Creator[]
    // source: string
    // doi: string
    contributors: FormContributor[]
    keywords: Dailp.Keyword[]
    subjectHeadings: Dailp.SubjectHeading[]
    languages: Dailp.Language[]
    spatialCoverages: Dailp.SpatialCoverage[]
  }>(null)

  useEffect(() => {
    if (isOpen) {
      setBackupState({
        title,
        date,
        //description,
        //format,
        // pages,
        creator: [...creator],
        //source,
        //doi,
        contributors,
        keywords: [...keywords],
        subjectHeadings: [...subjectHeadings],
        languages: [...languages],
        spatialCoverages: [...spatialCoverage],
      })
    }
  }, [isOpen])

  // Reset state when modal opens or documentMetadata changes
  useEffect(() => {
    const dm = documentMetadata

    setTitle(dm.title ?? "")
    setDate(dm.date ?? "")
    setCreator(dm.creators ?? [])
    setKeywords(dm.keywords ?? [])
    setLanguages(dm.languages ?? [])
    setSubjectHeadings(dm.subjectHeadings ?? [])
    setSpatialCoverage(dm.spatialCoverage ?? [])

    const formattedContributors = (dm.contributors ?? []).map((c) => ({
      ...c,
      isNew: false,
      isVisible: c.details?.isVisible ?? false,
      details: c.details ? { ...c.details } : null,
    }))

    setContributors(formattedContributors)
    setNewContributors(new Set())

    // Reset temp form fields
    setTempName("")
    setTempRole(null)
    setTempVisible(false)

    setBackupState({
      title: dm.title ?? "",
      date: dm.date ?? "",
      // description,
      // format,
      // pages,
      creator: [...(dm.creators ?? [])],
      // source,
      // doi,
      contributors: formattedContributors,
      keywords: [...(dm.keywords ?? [])],
      subjectHeadings: [...(dm.subjectHeadings ?? [])],
      languages: [...(dm.languages ?? [])],
      spatialCoverages: [...(dm.spatialCoverage ?? [])],
    })
  }, [documentMetadata])

  const addContributor = (
    name: string,
    role: Dailp.ContributorRole,
    isVisible: boolean
  ) => {
    if (!name || !role) return

    const newContributor: FormContributor = {
      id: uuidv4(),
      name,
      role,
      isVisible,
      isNew: true,
      details: null,
    }

    setContributors((prev) => [...prev, newContributor])

    const label = `${name} (${role})`
    setNewContributors((prev) => new Set(prev).add(label))

    // Reset temp form fields
    setTempName("")
    setTempRole(null)
    setTempVisible(false)
  }

  const removeContributor = (index: number) => {
    const removedContributor = contributors[index]
    if (!removedContributor) return
    const label = `${removedContributor.name} (${removedContributor.role})`
    setContributors((prev) => prev.filter((_, i) => i !== index))
    setNewContributors((prev) => {
      const copy = new Set(prev)
      copy.delete(label)
      return copy
    })
  }

  /*
    const docMetadata = useMemo(
      () =>
        buildCitationMetadata({
          title,
          creator,
          date,
          source,
          pages,
          type: format.toLowerCase(),
          doi,
        }),
      [title, creator, date, source, pages, format, doi]
    )
  
    useEffect(() => {
      try {
        const docCitation = new Cite(docMetadata).format("bibliography", {
          format: "text",
          template: citeFormat.toLowerCase() || "apa",
          lang: "en-US",
        })
        setCitation(docCitation)
      } catch {
        setCitation("Error generating citation")
      }
    }, [citeFormat, docMetadata])
    */

  const cancelEdits = () => {
    if (!backupState) return
    setTitle(backupState.title)
    setDate(backupState.date)
    //setDescription(backupState.description)
    //setGenre(backupState.genre)
    //setFormat(backupState.format)
    //setPages(backupState.pages)
    setCreator(backupState.creator)
    setKeywords(backupState.keywords)
    setLanguages(backupState.languages)
    setSubjectHeadings(backupState.subjectHeadings)
    setSpatialCoverage(backupState.spatialCoverages)
    //setSource(backupState.source)
    //setDOI(backupState.doi)
    // Tags reset handled by reinitialization on modal open
    setContributors(backupState.contributors)

    // Reset new contributors tracking
    setNewContributors(new Set())

    // Reset temp form fields
    setTempName("")
    setTempRole(null)
    setTempVisible(false)

    setIsEditing(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Keywords to be submitted
    const keywordsToSubmit = selectedKeywords.map((name) => {
      // Find existing keyword by name to get id, otherwise generate new UUID
      const existing = keywords.find((k) => k.name === name)
      return {
        id: existing?.id ?? uuidv4(),
        name,
        //status: existing?.status ?? Dailp.ApprovalStatus.Approved, // If part of the editing form, can assume that keywords are approved (for now)
      }
    })

    // Subject Headings to be submitted
    const subjectHeadingsToSubmit = selectedSubjectHeadings.map((name) => {
      // Find existing subject headings by name to get id, otherwise generate new UUID
      const existing = subjectHeadings.find((sh) => sh.name === name)
      return {
        id: existing?.id ?? uuidv4(),
        name,
        //status: existing?.status ?? Dailp.ApprovalStatus.Approved,
      }
    })

    // Languages to be submitted
    const languagesToSubmit = selectedLanguages.map((name) => {
      // Find existing languages by name to get id, otherwise generate new UUID
      const existing = languages.find((l) => l.name === name)
      return {
        id: existing?.id ?? uuidv4(),
        name,
        //status: existing?.status ?? Dailp.ApprovalStatus.Approved,
      }
    })

    // Languages to be submitted
    const spatialCoverageToSubmit = selectedSpatialCoverages.map((name) => {
      // Find existing spatial coverages by name to get id, otherwise generate new UUID
      const existing = spatialCoverage.find((sc) => sc.name === name)
      return {
        id: existing?.id ?? uuidv4(),
        name,
        //status: existing?.status ?? Dailp.ApprovalStatus.Approved,
      }
    })

    // Update local state for metadata
    // setKeywords(keywordsToSubmit)
    // setSubjectHeadings(subjectHeadingsToSubmit)
    // setLanguages(languagesToSubmit)
    // setSpatialCoverage(spatialCoverageToSubmit)

    // Build updated document metadata object
    const updatedMetadata = {
      title,
      date,
      creator,
      contributors,
      keywords: keywordsToSubmit,
      subjectHeadings: subjectHeadingsToSubmit,
      languages: languagesToSubmit,
      spatialCoverage: spatialCoverageToSubmit,
    }

    // Update backup state to new submitted state
    // setBackupState({
    //   title,
    //   date,
    //   creator: [...creator],
    //   contributors: [...contributors],
    //   keywords: keywordsToSubmit,
    //   subjectHeadings: subjectHeadingsToSubmit,
    //   languages: languagesToSubmit,
    //   spatialCoverages: spatialCoverageToSubmit,
    // })

    // setIsEditing(false)
    onSubmit(updatedMetadata)
    // onClose()
  }

  // Pass UUID of the keyword
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Editing Document Information</h2>
        <p className={styles.subtitle}>* indicates a required field</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Title*</label>
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date Created</label>
              <input
                type="text"
                className={styles.input}
                value={
                  typeof date === "string" ? date : date?.year?.toString() ?? ""
                }
                onChange={(e) => setDate(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/*
            <div className={styles.fullWidthGroup}>
              <label className={styles.label}>Description</label>
              <TextareaAutosize
                className={styles.input}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }              
                minRows={1}
                maxRows={10}
                disabled={!isEditing}
              />
            </div>
              */}

          {/* <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Document Type</label>
              <input
                type="text"
                className={styles.input}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                disabled={!isEditing}
              />
            </div> */}

          {/* <div className={styles.fieldGroup}>
                <label className={styles.label}>Format</label>
                <input
                  type="text"
                  className={styles.input}
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={!isEditing}
                />
              </div> */}

          {/* 
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Pages (start page, end page)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              */}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Creator (separate by ',' if multiple)
            </label>
            <input
              type="text"
              className={styles.input}
              value={creator.map((c) => c.name).join(", ")} // Join names to string for input
              onChange={(e) =>
                setCreator(
                  e.target.value
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c.length > 0)
                    .map((name) => ({
                      id: uuidv4(),
                      name,
                    }))
                )
              }
              disabled={!isEditing}
            />
          </div>

          <TagSelector
            label="Contributors"
            selectedTags={contributors.map((c) => `${c.name} (${c.role})`)}
            approvedTags={[]}
            newTags={newContributors}
            onAdd={() => {}}
            onRemove={isEditing ? removeContributor : undefined}
            addButtonLabel="+ Contributor"
            customForm={
              isEditing ? (
                <div className={styles.fullWidthGroup}>
                  <input
                    type="text"
                    placeholder="Contributor name"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className={styles.input}
                  />
                  <select
                    value={tempRole ?? ""}
                    onChange={(e) => {
                      const val = e.target.value
                      setTempRole(
                        val === "" ? null : (val as Dailp.ContributorRole)
                      )
                    }}
                  >
                    {/* Show display name for role */}
                    <option value="">Select role</option>
                    {contributorRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <label className={styles.label}>
                    <input
                      type="checkbox"
                      checked={tempVisible}
                      onChange={(e) => setTempVisible(e.target.checked)}
                    />
                    Allow contributor profile to be publically visible?
                  </label>
                  <button
                    type="button"
                    className={styles.addTagButton}
                    onClick={() => {
                      if (!tempName || !tempRole) return
                      addContributor(tempName, tempRole, tempVisible)

                      setTempName("")
                      setTempRole(null)
                      setTempVisible(false)
                    }}
                  >
                    Submit
                  </button>
                </div>
              ) : null
            }
          />

          {/* <div className={styles.fullWidthGroup}>
                  <label className={styles.label}>Source</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.fullWidthGroup}>
                  <label className={styles.label}>DOI</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={doi}
                    onChange={(e) => setDOI(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
          */}

          <TagSelector
            label="Keywords"
            selectedTags={selectedKeywords}
            approvedTags={approvedKeywords}
            newTags={newKeywords}
            onAdd={(tagName) => addKeyword(tagName)}
            onRemove={removeKeyword}
            addButtonLabel="Add Keyword"
          />

          <TagSelector
            label="Subject Headings"
            selectedTags={selectedSubjectHeadings}
            approvedTags={approvedSubjectHeadings}
            newTags={newHeadings}
            onAdd={isEditing ? addHeading : undefined}
            onRemove={isEditing ? removeHeading : undefined}
            addButtonLabel="Add Subject Heading"
          />

          <TagSelector
            label="Languages"
            selectedTags={selectedLanguages}
            approvedTags={approvedLanguages}
            newTags={newLanguages}
            onAdd={isEditing ? addLanguage : undefined}
            onRemove={isEditing ? removeLanguage : undefined}
            addButtonLabel="Add Language"
          />

          <TagSelector
            label="Spatial Coverages"
            selectedTags={selectedSpatialCoverages}
            approvedTags={approvedSpatialCoverages}
            newTags={newCoverages}
            onAdd={isEditing ? addCoverage : undefined}
            onRemove={isEditing ? removeCoverage : undefined}
            addButtonLabel="Add Spatial Coverage"
          />

          {/* // Might need to pull the creator(s) from creator or contributors w/ author role
          
          <div className={styles.fullWidthGroup}>
                  <label className={styles.label}>Citation</label>
                  <TextareaAutosize
                    className={styles.input}
                    value={citation}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCitation(e.target.value)
                    }              
                    minRows={1}
                    maxRows={10}
                    disabled={!isEditing}
                  />
                </div>

                <div>{getDisplayName(citeFormat)}</div>
                <Dropdown
                  options={Object.keys(formatMap)}
                  selected={
                    Object.entries(formatMap).find(([_, v]) => v === citeFormat)?.[0] || "APA"
                  }
                  setSelected={(displayName) => {
                    setCiteFormat(formatMap[displayName] ?? "apa")
                  }}
                  addButtonLabel="Change Format"
                  disabled={!isEditing}
                />
                */}

          <div className={styles.buttonGroup}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEdits}
                  className={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={styles.modalCancelButton}
              >
                Close
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
