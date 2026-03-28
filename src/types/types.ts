export type StatusType = "success" | "info" | "warning" | "error" | "promise";

export interface ToastEvent {
  status: StatusType;
  message: string;
}
