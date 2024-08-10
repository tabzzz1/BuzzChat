import { NextApiRequest } from "next"
import { NextApiResponseServerIo } from "@/types/socket/NextApiResponseServerIo"
import { db } from "@/lib/db"
import { currentProfilePages } from "@/lib/current-profile-pages"
import { MemberRole, Server } from "@prisma/client"

// 更新（删除/编辑）消息
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }
  try {
    const profile = await currentProfilePages(req)
    const { directMessageId, conversationId } = req.query
    const { content } = req.body
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID Missing" })
    }

    // 查找相应对话
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
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
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    // 确定当前用户成员信息
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo
    if (!member) {
      return res.status(404).json({ error: "Member Not Found" })
    }
    //
    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "DirectMessage Not Found" })
    }
    //? 直接传入结果是不是更快一些？
    const isCurrentMemberMessage = directMessage.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const allowDeleteOrEdit = isCurrentMemberMessage || isAdmin || isModerator
    if (!allowDeleteOrEdit) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    //! DELETE(Delete)
    if (req.method === "DELETE") {
      //! 这里选择update而不是delete是因为选择更新了数据库中的content以便渲染
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "此消息已经被删除...",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }
    //! PATCH(Edit)
    if (req.method === "PATCH") {
      // 只有当前成员自己可以进行消息更改
      if (!isCurrentMemberMessage) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    //! 消息手动删除/编辑时，需要更新频道的最后消息
    const updateKey = `chat:${conversation.id}:messages:update`
    res?.socket?.server?.io.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log("[MESSAGE_PATCH]", error)
    return res.status(500).json({ error: "Internal Error" })
  }
}
