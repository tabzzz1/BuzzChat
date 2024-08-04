import { NextApiRequest } from "next"
import { NextApiResponseServerIo } from "@/types/socket/NextApiResponseServerIo"
import { currentProfilePages } from "@/lib/current-profile-pages"
import { db } from "@/lib/db"

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
    const { serverId, channelId } = req.query
    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" })
    }
    if (!channelId) {
      return res.status(400).json({ error: "channelId ID is required" })
    }
    if (!content) {
      return res.status(400).json({ error: "content is required" })
    }

    // 查询到所聊天的服务器的相关信息
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
      return res.status(404).json({ error: "Server not found" })
    }

    // 查询到所聊天的频道的相关信息
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" })
    }

    // 找到当前用户的信息
    const member = server.members.find((member) => member.profileId === profile.id)
    if(!member) {
      return res.status(404).json({ error: "Member not found" })
    }

    // 创建信息
    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        memberId: member.id,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })

    const channelKey = `chat:${serverId}:${channelId}:messages`
    res?.socket?.io?.to(channelKey).emit(channelKey, message)


    return res.status(200).json(message)

  } catch (error) {
    console.log("[MESSAGE_POST]", error)
    return res.status(500).json({ error: "Internal Error" })
  }
}
