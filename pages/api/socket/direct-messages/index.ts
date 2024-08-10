import { NextApiRequest } from "next"
import { NextApiResponseServerIo } from "@/types/socket/NextApiResponseServerIo"
import { currentProfilePages } from "@/lib/current-profile-pages"
import { db } from "@/lib/db"

// 添加消息
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }
  // 处理POST请求
  try {
    const profile = await currentProfilePages(req)
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { content, fileUrl } = req.body
    const { conversationId } = req.query
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID is required" })
    }
    if (!content) {
      return res.status(400).json({ error: "content is required" })
    }

    // 查询到所聊天的对话的相关信息
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

    // 找到当前用户的信息
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo
    if (!member) {
      return res.status(404).json({ error: "Member not found" })
    }

    // 创建信息
    const directMessage = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        memberId: member.id,
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

    //! 频道收到新消息时，通过socket.io发送消息
    const addKey = `chat:${conversation.id}:messages:add`
    res?.socket?.server?.io.emit(addKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log("[DIRECT_MESSAGE_POST]", error)
    return res.status(500).json({ error: "Internal Error" })
  }
}
