import { Member, Message, Profile } from "@prisma/client";

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}