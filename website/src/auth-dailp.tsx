import { navigate } from "vite-plugin-ssr/client/router"
import { AuthUser } from "./auth"
import * as Dailp from "src/graphql/dailp"
import { UserGroup } from "src/graphql/dailp"
import { jwtDecode } from "jwt-decode"

// Needed for localStorage access issue in SSR environment
const LocalStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} }

export function useDailpAuthOperations(
  setUser: (user: AuthUser | null) => void
) {
  const [signupMutationResult, signupUserMutation] = Dailp.useSignupMutation()
  const [loginMutationResult, loginMutation] = Dailp.useLoginMutation()
  const [refreshTokenMutationResult, refreshTokenMutation] = Dailp.useRefreshTokenMutation()
  const [logoutMutationResult, logoutMutation] = Dailp.useLogoutMutation()
  const [requestPasswordResetMutationResult, requestPasswordResetMutation] = Dailp.useRequestPasswordResetMutation()
  const [resetPasswordMutationResult, resetPasswordMutation] = Dailp.useResetPasswordMutation()
  const [verifyEmailMutationResult, verifyEmailMutation] = Dailp.useVerifyEmailMutation()
  
  async function createUser(email: string, password: string) {
    const emailLowercase = email.toLowerCase()
    
    try {
      const response = await signupUserMutation({
        input: {
          email: emailLowercase,
          password: password,
        }
      })
      
      // Check for errors
      if (response.error) {
        handleDailpError(response.error)
        return
      }
      
      // Success
      console.log('Signup successful:', response.data?.signup.message)
      alert(response.data?.signup.message || 'Account created! Please check your email to verify your account.')
      
      await navigate("/auth/login")
      
      // Failure
    } catch (err) {
      console.error('Signup error:', err)
      handleDailpError(err)
    }
  }
  
  async function loginUser(username: string, password: string) {
    try {
      const response = await loginMutation({
        input: {
          email: username.toLowerCase(),
          password: password,
        }
      })
      
      if (response.error) {
        handleDailpError(response.error)
        return
      }
      
      const data = response.data?.login
      if (!data) return
      
      // Store tokens in localStorage
      LocalStorage.setItem('dailp_access_token', data.accessToken)
      LocalStorage.setItem('dailp_refresh_token', data.refreshToken)
      
      // Decode JWT to get user info and set user state
      const decodedToken = jwtDecode<{ sub: string, email: string, role: string }>(data.accessToken)
      setUser({
        type: 'dailp',
        userId: decodedToken.sub,
        email: decodedToken.email,
        groups: roleToGroups(decodedToken.role)
      })
      
      await navigate("/dashboard")
      
    } catch (err) {
      handleDailpError(err)
    }
  }

  async function resetConfirmationCode(email: string) {
      alert("DAILP doesn't use confirmation codes")
  }
  
  async function resetPassword(username: string) {
      // TODO: Implement
      alert("DAILP password reset not yet implemented")
  }
  
  async function changePassword(verificationCode: string, newPassword: string) {
      // TODO: Implement
      alert("DAILP change password not yet implemented")
  }
  
  async function signOutUser() {
    try {
      const refreshToken = LocalStorage.getItem('dailp_refresh_token')
      if (refreshToken) {
        await logoutMutation({
          refreshToken: refreshToken
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
      LocalStorage.removeItem('dailp_access_token')
      LocalStorage.removeItem('dailp_refresh_token')
      setUser(null)
  }
  
  async function confirmUser(email: string, confirmationCode: string) {
      alert("DAILP doesn't use confirmation codes")
  }

  async function refreshTokenNow() {
    const refreshToken = localStorage.getItem('dailp_refresh_token')
    if (!refreshToken) {
      console.error('No refresh token available')
      signOutUser()
      return
    }
    
    const response = await refreshTokenMutation({
      input: { refreshToken }
    })

    if (response.error) {
      console.error('Token refresh failed:', response.error)
      signOutUser()
      return
    }
    
    if (response.data?.refreshToken.accessToken) {
      LocalStorage.setItem('dailp_access_token', response.data.refreshToken.accessToken)
    }
  }
  
  async function setupTokenRefresh(): Promise<number> {
    const accessToken = LocalStorage.getItem('dailp_access_token')
    if (!accessToken) return 0

    try {
      const decoded = jwtDecode<{ exp: number }>(accessToken)
      // Calculate interval length to refresh 5 minutes before expiry
      const intervalLength = (decoded.exp * 1000) - Date.now() - (5 * 60 * 1000)
      
      if (intervalLength <= 0) {
        // Token expired or expiring within 5 minutes, refresh immedaitely
        // Scenarios where user closes and re-opens page after a long time can make interval negative
        await refreshTokenNow()
        
        // After refresh, read the NEW token and set up its interval
        const newAccessToken = LocalStorage.getItem('dailp_access_token')
        if (!newAccessToken) return 0
        
        const newDecoded = jwtDecode<{ exp: number }>(newAccessToken)
        const newIntervalLength = (newDecoded.exp * 1000) - Date.now() - (5 * 60 * 1000)
        
        if (newIntervalLength <= 0) {
          console.error('New token is also expired!')
          return 0
        }
        
        const handle = window.setInterval(async () => {
          refreshTokenNow()
        }, newIntervalLength)
      
        return handle
      } else {
        // Token is valid, set up interval normally
        const handle = window.setInterval(async () => {
          refreshTokenNow()
        }, intervalLength)
        
        return handle
      }

    }
    catch (err) {
      console.error('Error in setupTokenRefresh:', err)
      return 0
    }
  }

  return {
      createUser,
      loginUser,
      resetConfirmationCode,
      resetPassword,
      changePassword,
      signOutUser,
      confirmUser,
      setupTokenRefresh,
  }
}

export function roleToGroups(role: string): UserGroup[] {
  // Convert DAILP role string to UserGroup array
  switch (role) {
    case 'Contributors': return [UserGroup.Contributors]
    case 'Editors': return [UserGroup.Editors]
    case 'Readers': return [UserGroup.Readers]
    default: return [UserGroup.Readers]
  }
}

function handleDailpError(err: any) {
  // Parse GraphQL errors and show user-friendly messages
  const message = err.message || 'An error occurred'
  
  if (message.includes('Invalid email or password')) {
    alert('Invalid email or password. Please try again.')
  } else if (message.includes('Email not verified')) {
    alert('Please verify your email before logging in. Check your inbox.')
  } else if (message.includes('User already exists')) {
    if (confirm('An account with this email already exists. Would you like to login instead?')) {
      navigate('/auth/login')
    }
  } else {
    alert(`Authentication error: ${message}`)
  }
}