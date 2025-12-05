import plugins from "citation-js"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
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

  // Extract names from metadata
  const keywordStrings = (documentMetadata.keywords ?? []).map((k) => k.name)
  const languageStrings = (documentMetadata.languages ?? []).map((l) => l.name)
  const subjectHeadingStrings = (documentMetadata.subjectHeadings ?? []).map(
    (sh) => sh.name
  )
  const spatialCoverageStrings = (documentMetadata.spatialCoverage ?? []).map(
    (sc) => sc.name
  )

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

  // const [description, setDescription] = useState(documentMetadata.description ?? "")
  // const [genre, setGenre] = useState(documentMetadata.genre ?? "")
  // const [format, setFormat] = useState(documentMetadata.format ?? "")
  // const [pages, setPages] = useState(documentMetadata.pages ?? "")
  // const [source, setSource] = useState(documentMetadata.source ?? "")
  // const [doi, setDOI] = useState(documentMetadata.doi ?? "")
  // const [citation, setCitation] = useState("")
  // const [citeFormat, setCiteFormat] = useState("APA")

  // For initializing new contributors who may not have a role yet
  type MaybeContributorRole = Dailp.ContributorRole | null

  const [formContributors, setFormContributors] = useState<FormContributor[]>(
    () =>
      (documentMetadata.contributors ?? []).map((c) => ({
        ...c,
        isNew: false,
        isVisible: c.details?.isVisible ?? false,
        details: c.details ? { ...c.details } : null,
      }))
  )
  const [newContributors, setNewContributors] = useState<Set<string>>(new Set())

  const [tempName, setTempName] = useState("")
  const [tempRole, setTempRole] = useState<MaybeContributorRole>(null)
  const [tempVisible, setTempVisible] = useState(false)

  const contributorRoles = Object.values(Dailp.ContributorRole)

  const {
    tags: selectedKeywords,
    newTags: newKeywords,
    addTag: addKeyword,
    removeTag: removeKeyword,
  } = useTagSelector(keywordStrings ?? [], approvedKeywords)

  const {
    tags: selectedSubjectHeadings,
    newTags: newHeadings,
    addTag: addHeading,
    removeTag: removeHeading,
  } = useTagSelector(subjectHeadingStrings ?? [], approvedSubjectHeadings)

  const {
    tags: selectedLanguages,
    newTags: newLanguages,
    addTag: addLanguage,
    removeTag: removeLanguage,
  } = useTagSelector(languageStrings ?? [], approvedLanguages)

  const {
    tags: selectedSpatialCoverages,
    newTags: newCoverages,
    addTag: addCoverage,
    removeTag: removeCoverage,
  } = useTagSelector(spatialCoverageStrings ?? [], approvedSpatialCoverages)

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
    contributors: Dailp.Contributor[]
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

  const [contributors, setContributors] =
    useState<FormContributor[]>(formContributors)
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
    //setContributors(backupState.contributors)
    // Tags reset handled by reinitialization on modal open
    setIsEditing(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      date,
      //   description,
      //   genre,
      //   format,
      //   pages,
      creator,
      //   source,
      //   doi,
      contributors,
      keywords,
      subjectHeadings,
      languages,
      spatialCoverage,
      //   citation,
      //   citeFormat,
    })
    setIsEditing(false)
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
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
            onAdd={isEditing ? addKeyword : undefined}
            onRemove={isEditing ? removeKeyword : undefined}
            addButtonLabel="+ Keyword"
          />

          <TagSelector
            label="Subject Headings"
            selectedTags={selectedSubjectHeadings}
            approvedTags={approvedSubjectHeadings}
            newTags={newHeadings}
            onAdd={isEditing ? addHeading : undefined}
            onRemove={isEditing ? removeHeading : undefined}
            addButtonLabel="+ Subject Heading"
          />

          <TagSelector
            label="Languages"
            selectedTags={selectedLanguages}
            approvedTags={approvedLanguages}
            newTags={newLanguages}
            onAdd={isEditing ? addLanguage : undefined}
            onRemove={isEditing ? removeLanguage : undefined}
            addButtonLabel="+ Language"
          />

          <TagSelector
            label="Spatial Coverages"
            selectedTags={selectedSpatialCoverages}
            approvedTags={approvedSpatialCoverages}
            newTags={newCoverages}
            onAdd={isEditing ? addCoverage : undefined}
            onRemove={isEditing ? removeCoverage : undefined}
            addButtonLabel="+ Spatial Coverage"
          />

          {/* <div className={styles.fullWidthGroup}>
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
function uuidv4(): any {
  throw new Error("Function not implemented.")
}
