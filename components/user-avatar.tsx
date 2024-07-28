import { Avatar, AvatarImage } from "@/components/ui/avatar"

import { UserAvatarProps } from "@/types/user-avatar"

import { cn } from "@/lib/utils"

export const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn(
      "h-7 w-7 md:h-10 md:w-10",
      className
    )}>
      <AvatarImage src={src}/>
    </Avatar>
  )
}
