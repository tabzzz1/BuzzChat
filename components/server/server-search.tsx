"use client"
import { ServerSearchProps } from "@/types/server-search.d"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Search } from "lucide-react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export const ServerSearch = ({ searchData }: ServerSearchProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  // 监听键盘事件
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // s + Command/Ctrl组合键
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [])

  const onClickItem = ({
    id,
    type,
  }: {
    id: string
    type: "channel" | "member"
  }) => {
    setOpen(false)
    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/conversation/${id}`)
    }
    if (type === "channel") {
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }

  return (
    <>
      <button
        className="group px-2 py-2 rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto text-xs">
          <span>CTRL</span>S
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索所有的频道和成员..." />
        <CommandList >
          <CommandEmpty>没有被找到的结果...</CommandEmpty>
          {searchData.map(({ label, type, data }) => {
            if (!data?.length) return null
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, name, id }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClickItem({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
