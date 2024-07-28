import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { ServerHeaderMenuItemProps } from "@/types/server-header-menu-item.d"
import { ModalStore } from "@/stores/modal-store"

export const ServerHeaderMenuItem = ({
  identity,
  context,
  Icon,
  iconType,
  server,

  invite,
  edit,
  manage,
  createChannel
}: ServerHeaderMenuItemProps) => {
  const textColor = iconType
    ? "text-rose-500 dark:text-rose-400"
    : "text-indigo-600 dark:text-indigo-400"

  const { onOpen } = ModalStore()

  return (
    <>
      {identity && (
        <DropdownMenuItem
          className={`${textColor} px-3 py-2 text-sm cursor-pointer`}
          onClick={() => {
            if (invite) {
              onOpen("invite", { server })
            }
            if (edit) {
              onOpen("editServer", { server })
            }
            if (manage) {
              onOpen("manageMembers", { server })
            }
            if(createChannel) {
              onOpen("createChannel", { server })
            }
          }}
        >
          {context}
          <Icon className="h-5 w-5 ml-auto" />
        </DropdownMenuItem>
      )}
    </>
  )
}
