declare namespace CSL {
    interface CreatorName {
      family?: string
      given?: string
      literal?: string
    }
  
    interface Date {
      "date-parts"?: (number | string)[][]
    }
  
    interface CitationData {
      type: string
      title?: string
      author?: CreatorName[]
      editor?: CreatorName[]
      issued?: Date
      page?: string
      volume?: string
      issue?: string
      "container-title"?: string
      publisher?: string
      publisherPlace?: string
      DOI?: string
      ISBN?: string
      URL?: string
      [key: string]: any
    }
  }
  