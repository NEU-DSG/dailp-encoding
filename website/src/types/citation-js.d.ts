declare module "@citation-js/core" {
  export class Cite {
    constructor(data: any)
    format(format: string, options?: any): string
  }
  export const plugins: any
}

declare module "@citation-js/plugin-csl"

declare module "citation-js" {
  export class Cite {
    static config: any
    constructor(data: any)
    format(format: string, options?: any): string
  }
  export const plugins: any
  export default Cite
}
