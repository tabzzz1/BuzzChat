import { v4 as uuidv4 } from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { MemberRole } from "@prisma/client"

export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    // 解析请求体得到频道的名字和类型
    const profile = await currentProfile()
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get("serverId")

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 })
    }
    // if(name === 'xxx') {
    //   return new NextResponse("Name cannot be 'xxx' ", { status: 400 })
    // }

    // 创建频道
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channel: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[CHANNELS_POST]", error)
    return new NextResponse("Internal Error:", { status: 500 })
  }
}