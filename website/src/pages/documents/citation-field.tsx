import React from "react"
import * as styles from "./document-info.css"

export interface CitationFieldProps {
  citation: string | null
}

export const CitationField: React.FC<CitationFieldProps> = ({ citation }) => {
  return (
    <div className={styles.field}>
      <div className={styles.label}>CITATION</div>
      <div className={styles.value} style={{ whiteSpace: "pre-line" }}>
        {citation ?? "Citation Not Yet Available."}
      </div>
    </div>
  )
}

export default CitationField
