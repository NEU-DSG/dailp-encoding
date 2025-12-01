"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import * as styles from "./edit-document-modal.css"
import { useTagSelector } from "../hooks/use-tag-selector"
import { TagSelector } from "./tag-selector"
import TextareaAutosize from "react-textarea-autosize";
import { buildCitationMetadata } from "../../utils/build-citation-metadata"
import { Dropdown } from "./dropdown"
import Cite from "../../utils/citation-config"
import plugins from "citation-js"

export type EditDocumentModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

// Defining contributors
interface Contributor {
  name: string
  role: string
  isNew?: boolean
  isVisible: boolean // Controls profile visibility
}

// Citation formats for dropdown (mapped from display name to name Cite expects)
export const formatMap: Record<string, string> = {
  APA: "apa",
  Vancouver: "vancouver",
  Harvard: "harvard1",
}

// Get citation display name
function getDisplayName(code: string) {
  return Object.keys(formatMap).find(key => formatMap[key] === code) ?? code
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [newContributors, setNewContributors] = useState<Set<string>>(new Set())
  const [title, setTitle] = useState("Constitution of Cherokee Nation")
  // TODO: Handle full date in citation
  const [date, setDate] = useState("1827")
  const [description, setDescription] = useState("A product of a convention held in early July 1827 at New Echota, Georgia, the constitution appears to be a version of the American Constitution adapted to suit Cherokee needs. The constitution does not represent a position of assimilation to white society but, rather, a conscious strategy to resist removal and maintain autonomy. However, traditionalists saw it as one more concession to white, Christian authority.")
  const [type, setType] = useState("Legal Document")
  const [format, setFormat] = useState("Book") // For citation purposes
  const [pages, setPages] = useState("1, 24")
  const [creator, setCreator] = useState(["Sam Houston"])
  const [source, setSource] = useState("https://teva.contentdm.oclc.org/digital/collection/tfd/id/304")
  const [doi, setDOI] = useState("https://doi.org/10.1000/182")
  const [citation, setCitation] = useState("")
  const [citeFormat, setCiteFormat] = useState("APA")
  
  // Temporary name, role, and visibility for contributors
  const [tempName, setTempName] = useState("")
  const [tempRole, setTempRole] = useState("")
  const [tempVisible, setTempVisible] = useState(false)

  // Adding contributors
  const addContributor = (name: string, role: string, isVisible: boolean) => {
    if (!name || !role) return;
    const label = `${name} (${role})`;
    
    setContributors(prev => [
      ...prev,
      { name, role, isVisible: false } // Default contributor visibility is false
    ]);

    setNewContributors(prev => new Set(prev).add(label));
    setTempName("");
    setTempRole("");
  }

  // Removing contributors
  const removeContributor = (index: number) => {
    const updated = [...contributors]
    updated.splice(index, 1)
    setContributors(updated)
  }

  // Define contributor roles
  // TODO: Create dropdown with these role for adding contributors
  const contributorRoles = [
    "Uploader",
    "Editor",
    "Translator",
    "Annotator",
    "Transcriber",
  ]

  // Handle keyword editing
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
  
  const {
    tags: keywords,
    newTags: newKeywords,
    addTag: addKeyword,
    removeTag: removeKeyword,
  } = useTagSelector(
    ["Cherokee", "Sovereignty", "Traditionalism", "Resistance", "Native American Removal"],
    approvedKeywords
  )

  // Handle subject heading editing
  const approvedHeadings = [
    "Cherokee Political Structure",
    "Sacred Relationships to Land",
    "Indigenous Self-Determination",
    "Ecological Stewardship",
    "Colonial Disruption and Resilience",
    "Ceremony and Sacred Practice",
    "Indigenous Governance Models",
  ]
  
  const {
    tags: subjectHeadings,
    newTags: newHeadings,
    addTag: addHeading,
    removeTag: removeHeading,
  } = useTagSelector(
    ["Cherokee Political Structure", "Sacred Relationships to Land", "Indigenous Self-Determination"],
    approvedHeadings
  )

  // Handle language editing
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
  
  const {
    tags: languages,
    newTags: newLanguages,
    addTag: addLanguage,
    removeTag: removeLanguage,
  } = useTagSelector(
    ["English"],
    approvedLanguages
  )

  // Handle spatial coverage editing
  // TODO: Could use API to fetch location names (figure out what kinds of location names to include)
  const approvedCoverages = [
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

  const {
    tags: spatialCoverages,
    newTags: newCoverages,
    addTag: addCoverage,
    removeTag: removeCoverage,
  } = useTagSelector(
    ["New Echota, GA", "Tennessee, USA"],
    approvedCoverages
  )

  // Handle citation generation
  // TODO: Add more fields to cover more formats
  const docMetadata = useMemo(() => buildCitationMetadata({
    title,
    creator,
    date,
    source,
    pages,
    type: format.toLowerCase(),
    doi
  }), [title, creator, date, source, pages, format, doi]);

  // Generate citation from document metadata and selected format (APA by default)
  useEffect(() => {
    const hasTemplate = !!plugins?.config?.get?.("csl")?.templates?.has?.(citeFormat)
    console.log("Using template:", citeFormat, "exists?", hasTemplate)

    try {
      // Create text citation using selected format
      const docCitation = new Cite(docMetadata).format("bibliography", { 
        format: "text", 
        template: citeFormat || "apa",
        lang: "en-US",
      })
      console.log("Using citeFormat:", citeFormat)
      console.log("Generated citation:", docCitation)
      setCitation(docCitation)
    } catch (err) {
      console.error("Citation formatting failed:", err)
      setCitation("Error generating citation")
    }
  }, [citeFormat, docMetadata]) // Re-run everytime format or metadata changes

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({})
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Editing Document Information</h2>
        <p className={styles.subtitle}>* indicates a required field</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>

            {/* Editing title */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Title*</label>
              <input 
                type="text" 
                className={styles.input} 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Editing date created */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date Created</label>
              <input 
                type="text" 
                className={styles.input} 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
            </div>
          </div>
            
          {/* Editing description */}
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
              />
            </div>

          <div className={styles.formGrid}>
            
            {/* Editing document type */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Document Type</label>
              <input 
                type="text" 
                className={styles.input} 
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            {/* Editing format */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Format</label>
              <input 
                type="text"
                className={styles.input} 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              />
            </div>

            {/* Editing pages */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Pages (start page, end page)</label>
              <input 
                type="text" 
                className={styles.input} 
                value={pages}
                placeholder="Ex. 1, 24"
                onChange={(e) => setPages(e.target.value)}
              />
            </div>

            {/* Editing creator */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Creator (separate by ',' if multiple)</label>
              <input 
                type="text" 
                className={styles.input} 
                value={creator.join(", ")}
                onChange={(e) => setCreator(e.target.value.split(",").map(c => c.trim()))}
              />
            </div>
          </div>

          {/* Editing contributors */}
          <TagSelector
            label="Contributors"
            selectedTags={contributors.map(c => `${c.name} (${c.role})`)}
            approvedTags={[]}
            newTags={newContributors}
            onAdd={() => {}}
            onRemove={index => {
                const contributor = contributors[index];
                if (!contributor) return;
              
                const removed = `${contributor.name} (${contributor.role})`;
              
                setContributors(prev => prev.filter((_, i) => i !== index));
                setNewContributors(prev => {
                  const copy = new Set(prev);
                  copy.delete(removed);
                  return copy;
                });
            }}              
            addButtonLabel="+ Contributor"
            customForm={
              <div className={styles.fullWidthGroup}>
                <input
                  type="text"
                  placeholder="Contributor name"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className={styles.input}
                />
                <select
                  value={tempRole}
                  onChange={e => setTempRole(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select role</option>
                  {contributorRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>

                {/* Visibility toggle */}
                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={tempVisible}
                    onChange={e => setTempVisible(e.target.checked)}
                  />
                  Allow contributor profile to be publically visible?
                </label>

                <button
                  type="button"
                  className={styles.addTagButton}
                  onClick={() => {
                    if (!tempName || !tempRole) return;
                    const label = `${tempName} (${tempRole})`;

                    addContributor(tempName, tempRole, tempVisible);

                    setTempName("");
                    setTempRole("");
                    setTempVisible(false);
                  }}
                >
                  Submit
                </button>
              </div>
                          }
          />

          {/* Editing source */}
          <div className={styles.fullWidthGroup}>
            <label className={styles.label}>Source</label>
            <input 
              type="text" 
              className={styles.input} 
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* Editing DOI */}
          <div className={styles.fullWidthGroup}>
            <label className={styles.label}>DOI</label>
            <input 
              type="text" 
              className={styles.input} 
              value={doi}
              onChange={(e) => setDOI(e.target.value)}
            />
          </div>

          {/* Editing keywords */}
          <TagSelector
            label="Keywords"
            selectedTags={keywords}
            approvedTags={approvedKeywords}
            newTags={newKeywords}
            onAdd={addKeyword}
            onRemove={removeKeyword}
            addButtonLabel="+ Keyword"
          />

          {/* Editing subject headings */}
          <TagSelector
            label="Subject Headings"
            selectedTags={subjectHeadings}
            approvedTags={approvedHeadings}
            newTags={newHeadings}
            onAdd={addHeading}
            onRemove={removeHeading}
            addButtonLabel="+ Subject Heading"
          />

          {/* Editing languages */}
          <TagSelector
            label="Languages"
            selectedTags={languages}
            approvedTags={approvedLanguages}
            newTags={newLanguages}
            onAdd={addLanguage}
            onRemove={removeLanguage}
            addButtonLabel="+ Language"
          />

          {/* Editing spatial coverages */}
          <TagSelector
            label="Spatial Coverages"
            selectedTags={spatialCoverages}
            approvedTags={approvedCoverages}
            newTags={newCoverages}
            onAdd={addCoverage}
            onRemove={removeCoverage}
            addButtonLabel="+ Spatial Coverage"
          />

          {/* Editing citation */}
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
            />
          </div>
          <div>{getDisplayName(citeFormat)}</div>
          <Dropdown
            options={Object.keys(formatMap)} // Show display names as dropdown options (ex. "APA", "MLA")
            selected={Object.entries(formatMap) // Find display name for current citeFormat
              .find(([_, v]) => v === citeFormat)?.[0] || "apa"} // Use "APA" as the default
            setSelected={(displayName) => {
                setCiteFormat(formatMap[displayName] ?? "apa");
            }}
            addButtonLabel="Change Format"
          />
          
          {/* Cancel and submit buttons */}
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.modalCancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDocumentModal
