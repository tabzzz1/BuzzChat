import { format } from "date-fns"

// eg: 2024-8-6 21:41:00
const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss"

export const formatDate = (date: Date) => {
  return format(new Date(date), DATE_FORMAT)
}