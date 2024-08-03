import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIo } from "socket.io"
import { NextApiResponseServerIo } from "@/types/socket/NextApiResponseServerIo"

// 关闭了默认的bodyParser中间件
// socket.io不需要解析请求体
export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  // 检查socket.io是否初始化
  if (!res.socket.server.io) {
    const path = "/api/socket/io"
    // 获取http的实例
    const httpServer: NetServer = res.socket.server as any
    // 创建新的socket.io实例，绑定到httpServer上
    const io = new ServerIo(httpServer, {
      path: path,
      addTrailingSlash: false, // 不添加尾随斜杠
    })
    res.socket.server.io = io
  }
  // 结束响应
  res.end()
}

export default ioHandler
