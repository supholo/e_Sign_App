export type FormField = {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  required: boolean
  label: string
}

export type FlexiformTemplate = {
  id: string
  name: string
  fields: FormField[]
  pdfUrl: string
  type: "flexiform"
  createdAt: string
}

