import { ChatQueryProps } from "@/types/chat/chat-query"

import qs from "query-string"
import { useInfiniteQuery } from "@tanstack/react-query"

import { useSocket } from "@/hooks/use-socket"

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessage = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    ) // 生成URL时跳过为null的参数

    const res = await fetch("/api" + url)
    return res.json()
  }
  /**
   * 作用：处理无限滚动或分页数据的加载
   * 1. queryKey: 用于标识查询的key
   * 2. queryFn: 用于获取数据的查询函数
   * 3. getNextPageParam: 用于获取下一页数据的函数，从最后一页提取nextCursor
   * 4. refetchInterval: 重新获取数据的时间间隔，如果socket不可用，就每秒重新获取一次
   * 5. initialPageParam: 初始的分页参数
   */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessage,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: undefined,
    })

  // 返回数据
  // 1. data: 数据
  // 2. fetchNextPage: 获取下一页数据
  // 3. hasNextPage: 是否有下一页数据
  // 4. isFetchingNextPage: 是否正在获取下一页数据
  // 5. status: 数据状态
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
