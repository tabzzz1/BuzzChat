import { db } from "@/lib/db"

// 返回对话
export const getConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findOldConversation(memberOneId, memberTwoId)) ||
    (await findOldConversation(memberTwoId, memberOneId))
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }
  return conversation
}

// 获取一对一聊天对话
const findOldConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          {
            memberOneId,
          },
          {
            memberTwoId,
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}
// 创建新的一对一聊天对话
const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}
