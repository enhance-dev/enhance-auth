
export async function get(req){
  //1. Check session for unverified or authorized account
  const session = req.session
  const { unverified, authorized, ...restSession } = session 
  //2. Check if phone or email is unverified
  let phone,email,phoneVerified,emailVerified
  if (unverified) {
    phone = unverified.phone
    email = unverified.email
    phoneVerified = unverified.verified?.phone
    emailVerified = unverified.verified?.email
    if (email && !emailVerified){
      // send verification link
    }
    if (phone && !phoneVerified){
      // send SMS code 
    }
  }
  if (authorized) {
    phone = authorized.phone
    email = authorized.email
    phoneVerified = authorized.verified?.phone
    emailVerified = authorized.verified?.email
    if (email && !emailVerified){
    }
    if (phone && !phoneVerified){
      // send SMS code 
    }
    return {
      json:{}
    }
  }
}
