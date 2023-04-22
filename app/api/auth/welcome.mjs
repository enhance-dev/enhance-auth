import { accountInfo, auth } from '../../middleware/auth-middleware.mjs'
import send from '../../middleware/send.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export const get = [auth, accountInfo, send]
