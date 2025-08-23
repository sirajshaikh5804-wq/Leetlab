import React from 'react'
import LoginForm from '../components/LoginForm'
import AuthImagePattern from '../components/AuthImagePattern'
const LoginPage = () => {
  return (
    <div className='h-screen grid lg:grid-cols-2'>
      <LoginForm/>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome Back!"}
        subtitle={
          "Sign in to continue your journey with us. Don't have an account? Create now."
        }
      />
    </div>
  )
}

export default LoginPage