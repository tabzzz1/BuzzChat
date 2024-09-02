/**
 * ChatHeaderProps
 * 频道与成员对话公用组件的属性
 * @param {string} serverId 服务器ID
 * @param {string} name 频道/对话人 名称
 * @param {"channel" | "conversation"} type 类型
 * @param {string} imageUrl ?.图片地址(对话人头像)
 */

export interface ChatHeaderProps {
  serverId: string,
  name: string,
  type: "channel" | "conversation",
  imageUrl?: string,
  video?: boolean
  audio?: boolean
}