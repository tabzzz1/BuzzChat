import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 })
    }

    // 检查用户是否是服务器成员
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: params.serverId,
      },
    })

    if (!member) {
      return new NextResponse("Not a member of the server", { status: 403 })
    }

    // 更新服务器成员
    const server = await db.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        members: {
          delete: {
            id: member.id,
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error)
    return new NextResponse("Internal Error:", { status: 500 })
  }
}
