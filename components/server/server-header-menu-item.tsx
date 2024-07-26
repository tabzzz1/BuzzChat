import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { ServerHeaderMenuItemProps } from "@/types/server-header-menu-item.d"

export const ServerHeaderMenuItem = ({
  identity,
  context,
  Icon,
  iconType
}: ServerHeaderMenuItemProps) => {
  const textColor = iconType ? "text-rose-500 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"
  return (
    <>
      {identity && (
        <DropdownMenuItem className={`${textColor} px-3 py-2 text-sm cursor-pointer`}>
          { context }
          <Icon className="h-5 w-5 ml-auto" />
        </DropdownMenuItem>
      )}
    </>
  )
}
