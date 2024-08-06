"use client"
import type { FileUploadProps } from "@/types/file-upload"

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"

import { FileIcon, X } from "lucide-react"
import Image from "next/image"

// 文件下载
export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop()
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={value}
          alt="Uploaded"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if(value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
        <a 
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(file) => {
        onChange(file?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log("Upload Error", error)
      }}
      content={{
        label: "点击或拖动文件到此处上传",
        button({ ready }) {
          if (ready) return <div>上传文件</div>
          return "加载中..."
        },
      }}
    />
  )
}
