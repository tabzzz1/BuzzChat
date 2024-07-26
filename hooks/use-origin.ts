// 安全地获取当前网页的源地址(协议、主机名和端口号)
import { useEffect, useState } from "react"

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : ""

  if (!mounted) {
    return null
  }

  return origin
}
