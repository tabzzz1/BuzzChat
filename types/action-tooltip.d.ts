export interface ActionTooltipProps {
  label: string;
  children: React.ReactNode;
  // 可选属性
  // 位置
  side?: "top" | "right" | "bottom" | "left";
  // 对齐方式
  align?: "start" | "center" | "end";
}