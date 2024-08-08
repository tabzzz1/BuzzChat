import { NextApiRequest } from "next"
import { NextApiResponseServerIo } from "@/types/socket/NextApiResponseServerIo"
import { db } from "@/lib/db"
import { currentProfilePages } from "@/lib/current-profile-pages"
import { MemberRole, Server } from "@prisma/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }
  try {
    const profile = await currentProfilePages(req)
    const { messageId, serverId, channelId } = req.query
    const { content } = req.body
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server ID Missing" })
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID Missing" })
    }

    // 查找相应服务器
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })
    if (!server) {
      return res.status(404).json({ error: "Server Not Found" })
    }
    // 查找相应频道
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })
    if (!channel) {
      return res.status(404).json({ error: "Channel Not Found" })
    }
    // 确定当前用户成员信息
    const member = server.members.find(
      (member) => member.profileId === profile.id
    )
    if (!member) {
      return res.status(404).json({ error: "Member Not Found" })
    }
    //
    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message Not Found" })
    }
    //? 直接传入结果是不是更快一些？
    const isCurrentMemberMessage = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const allowDeleteOrEdit  = isCurrentMemberMessage || isAdmin || isModerator
    if (!allowDeleteOrEdit) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    //! DELETE(Delete)
    if (req.method === "DELETE") {
      //! 这里选择update而不是delete是因为选择更新了数据库中的content以便渲染
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      if(!isCurrentMemberMessage) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
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
    const updateKey = `chat:${serverId}:${channelId}:messages:update`
    res?.socket?.server?.io.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log("[MESSAGE_PATCH]", error)
    return res.status(500).json({ error: "Internal Error" })
  }
}
