import type {
  LoadingBarProviderInst,
  DialogProviderInst,
  MessageProviderInst,
  NotificationProviderInst,
} from 'naive-ui'

declare global {
  interface Window {
    $loading: LoadingBarProviderInst
    $dialog: DialogProviderInst
    $message: MessageProviderInst
    $notification: NotificationProviderInst
  }
  interface IComment {
    _id: string
    nickname: string
    comment: string
    replys?: string[]
  }
}
