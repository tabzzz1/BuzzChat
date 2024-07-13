export interface FileUploadProps {
  endpoint: "messageFile" | "serverImage"
  value: string
  onChange: (url?: string) => void
}
