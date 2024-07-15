"usse client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { ActionTooltipProps } from "@/types/action-tooltip"

export const ActionTooltip = ({
  children,
  side,
  align,
  label,
}: ActionTooltipProps) => {
  return (
    <div>
      {/* 提示者 */}
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          {/* 触发器 */}
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          {/* 提示内容 */}
          <TooltipContent side={side} align={align}>
            <p font-semibold>
              {/* {label.toLowerCase()} */}
              { label }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
