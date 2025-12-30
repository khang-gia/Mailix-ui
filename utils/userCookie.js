/**
 * Cross-domain user session cookie utility
 * Works with ANY framework (Vue, React, Angular, vanilla JS, PHP, etc.)
 */

const COOKIE_NAME = 'mailix_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Set user data as a plain cookie (accessible from any framework)
 */
export function setUserCookie(userData) {
  if (!userData) {
    console.error('❌ Cannot set cookie: userData is null or undefined')
    return
  }
  
  const jsonData = JSON.stringify(userData)
  const encodedData = encodeURIComponent(jsonData)
  
  // Detect if running on localhost (development)
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.startsWith('192.168.')
  
  console.log('🔍 Cookie Debug Info:')
  console.log('  - Hostname:', window.location.hostname)
  console.log('  - Protocol:', window.location.protocol)
  console.log('  - Is Localhost:', isLocalhost)
  console.log('  - User Data:', userData)
  
  // Cookie attributes - adjust based on environment
  const attributes = [
    `${COOKIE_NAME}=${encodedData}`,
    `max-age=${COOKIE_MAX_AGE}`,
    'path=/',
  ]
  
  // Only add Secure and SameSite=None for production (HTTPS)
  if (!isLocalhost && window.location.protocol === 'https:') {
    attributes.push('SameSite=None')
    attributes.push('Secure')
    // attributes.push('domain=.yourdomain.com')  // Uncomment for subdomain sharing
  }
  
  const cookieString = attributes.join('; ')
  console.log('  - Cookie String:', cookieString.substring(0, 100) + '...')
  
  document.cookie = cookieString
  
  // Verify it was set
  const wasSet = document.cookie.includes(COOKIE_NAME)
  console.log(wasSet ? '✅ Cookie successfully set!' : '❌ Cookie was NOT set!')
  
  if (!wasSet) {
    console.error('Cookie setting failed. Current cookies:', document.cookie)
  }
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
  // Detect if running on localhost (development)
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.startsWith('192.168.')
  
  // Base removal attributes
  let cookieString = `${COOKIE_NAME}=; max-age=0; path=/`
  
  // Add Secure and SameSite=None for production
  if (!isLocalhost && window.location.protocol === 'https:') {
    cookieString += '; SameSite=None; Secure'
  }
  
  document.cookie = cookieString
  console.log('User cookie removed')
}

/**
 * Check if user is logged in (cookie exists)
 */
export function isUserLoggedIn() {
  return getUserCookie() !== null
}
