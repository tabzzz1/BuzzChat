import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile()
    // 获取查询参数
    const { searchParams } = new URL(req.url)
    // 获取给选取成员修改的规则
    const { role } = await req.json()
    const serverId = searchParams.get("serverId")
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 })
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 })
    }
    // 更新成员身份
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error)
    return new NextResponse("Internal Error:", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile()
    // 获取查询参数
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get("serverId")
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 })
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 })
    }
    // 踢出成员
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            }
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error)
    return new NextResponse("Internal Error:", { status: 500 })
  }
}