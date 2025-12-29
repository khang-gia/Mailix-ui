/**
 * Cross-domain user data cookie utility
 * Works with ANY framework (Vue, React, Angular, vanilla JS, PHP, etc.)
 */

const COOKIE_NAME = 'user_data'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Set user data as a plain cookie (accessible from any framework)
 */
export function setUserCookie(userData) {
  const jsonData = JSON.stringify(userData)
  const encodedData = encodeURIComponent(jsonData)
  
  // Cookie attributes for cross-domain access
  const attributes = [
    `${COOKIE_NAME}=${encodedData}`,
    `max-age=${COOKIE_MAX_AGE}`,
    'path=/',
    'SameSite=None',  // Required for cross-domain
    'Secure',         // Required for SameSite=None
    // 'domain=.yourdomain.com',  // Uncomment for subdomain sharing
  ]
  
  document.cookie = attributes.join('; ')
  console.log('User cookie set:', COOKIE_NAME)
}

/**
 * Get user data from cookie (works in any framework)
 */
export function getUserCookie() {
  const cookies = document.cookie.split('; ')
  const userCookie = cookies.find(cookie => cookie.startsWith(`${COOKIE_NAME}=`))
  
  if (!userCookie) {
    return null
  }
  
  try {
    const encodedData = userCookie.split('=')[1]
    const jsonData = decodeURIComponent(encodedData)
    return JSON.parse(jsonData)
  } catch (error) {
    console.error('Error parsing user cookie:', error)
    return null
  }
}

/**
 * Remove user cookie
 */
export function removeUserCookie() {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=None; Secure`
  console.log('User cookie removed')
}

/**
 * Check if user is logged in (cookie exists)
 */
export function isUserLoggedIn() {
  return getUserCookie() !== null
}
