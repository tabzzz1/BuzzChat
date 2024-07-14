import { v4 as uuidv4 } from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { MemberRole } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json()
    const profile = await currentProfile()
    // 如果没有找到当前用户，返回未授权
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    // 创建一个服务器
    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        profileId: profile.id,
        channel: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    })
    // 返回服务器
    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error:", { status: 500 })
  }
}
