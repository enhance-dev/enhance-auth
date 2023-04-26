import crypto from 'crypto'
import db from '@begin/data'
import arc from '@architect/functions'
import bcrypt from 'bcryptjs'
import { getAccounts, upsertAccount } from '../models/accounts.mjs'

export async function get(req) {
  const token = req.query?.token

  if (token) {
    const verifySession = await db.get({ table: 'session', key: token })
    const { sessionToken, linkUsed = false } = verifySession
    if (sessionToken && !linkUsed) {
      let sessionInfo = await db.get({ table: 'session', key: sessionToken })
      return {
        session: { resetPassword: { email: sessionInfo.email, token } },
        json: { resetPassword: true }
      }
      // Link Used
    } else if (sessionToken && linkUsed) {
      return {
        json: { linkUsed: true }
      }
      // Link not valid
    } else {
      return {
        json: { linkInvalid: true }
      }
    }
  }
}


export async function post(req) {
  const session = req?.session
  const { resetPassword } = session
  const { password, confirmPassword, email } = req.body

  // if email is posted generate a reset link
  if (email) {
    const accounts = await getAccounts()
    const account = accounts.find(a => a.email === email)
    if (account) {
      const sessionToken = crypto.randomBytes(32).toString('base64')
      const verifyToken = crypto.randomBytes(32).toString('base64')
      const { redirectAfterAuth = '/' } = session

      await arc.events.publish({
        name: 'reset-password-link',
        payload: { sessionToken, verifyToken, email, redirectAfterAuth },
      })

      return {
        session: {},
        html: '<div>Check email or console for reset link</div>'
      }
    }

  } else if (resetPassword && password && confirmPassword) {
    const resetEmail = resetPassword.email
    const validPassword = password.length >= 8 && (password === confirmPassword)
    const token = resetPassword.token

    if (validPassword) {
      const accounts = await getAccounts()
      const account = accounts.find(a => a.email === resetEmail)
      if (account) {
        const verifySession = await db.get({ table: 'session', key: token })
        const { sessionToken, linkUsed = false } = verifySession
        let sessionInfo
        // Valid Link Unused
        if (sessionToken && !linkUsed) {
          await db.set({ table: 'session', key: token, linkUsed: true })
          sessionInfo = await db.get({ table: 'session', key: sessionToken })
          if (sessionInfo.email === resetEmail) {
            const hash = bcrypt.hashSync(password, 10)
            await upsertAccount({ ...account, password: hash })
            return {
              session: {},
              html: '<div>Password has been reset. <a style="color:blue" href=/login>Click here to Login</a></div>'
            }
          }
        }
      }
    }
  } else {
    return {
      session: {},
      location: '/login'
    }
  }
}


