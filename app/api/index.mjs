import { accountInfo } from '../middleware/auth-middleware.mjs'
import send from '../middleware/send.mjs'
export const get = [accountInfo, send]
