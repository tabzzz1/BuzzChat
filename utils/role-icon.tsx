import { MemberRole } from "@prisma/client";
import React, { ReactNode } from 'react';
import { ShieldCheck, ShieldAlert, ShieldEllipsis } from 'lucide-react';

// const roleIconMap: RoleIconMap = {
//   [MemberRole.ADMIN]: <ShieldCheck className="mr-2 h-4 w-4 text-rose-500" />,
//   [MemberRole.MODERATOR]: <ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />,
//   [MemberRole.GUEST]: <ShieldEllipsis className="mr-2 h-4 w-4 text-green-500" />,
// };

export const roleIconMap = (role: string) => {
  switch (role) {
    case MemberRole.ADMIN:
      return (<ShieldCheck className="mr-2 h-4 w-4 text-rose-500" />) 
    case MemberRole.MODERATOR:
      return (<ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />)
    case MemberRole.GUEST:
      return (<ShieldEllipsis className="mr-2 h-4 w-4 text-green-500" />)
    default:
      return null;
  }
};