import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Message } from "@prisma/client"
import { NextResponse } from "next/server"

// 设定每页消息容量为12
const MESSAGE_CAPACITY = 12

export async function GET(req: Request) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    // 处理消息过多分页的情况，cursor是用来标记当前页的
    const cursor = searchParams.get("cursor")
    const channelId = searchParams.get("channelId")

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    if (!channelId) {
      return new NextResponse("Channel ID Missing", { status: 401 })
    }
    // 从数据库中获取消息
    let messages: Message[] = []
    // 如果有cursor，说明不是第一页，需要跳过第一条消息
    // 如果没有cursor，说明是第一页，不需要跳过
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGE_CAPACITY,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        // 倒序排列
        orderBy: {
          createdAt: "desc",
        }
      })
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_CAPACITY,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    }

    let nextCursor = null
    if(messages.length === MESSAGE_CAPACITY) {
      // 如果消息数量等于容量，说明还有下一页
      // 下一页的cursor是当前页的最后一条消息的id
      nextCursor = messages[MESSAGE_CAPACITY - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    })

  } catch (error) {
    console.log("[MESSAGE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
