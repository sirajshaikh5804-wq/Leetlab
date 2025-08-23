
import AuthImagePattern from '../components/AuthImagePattern'
import SignupForm from '../components/SignupForm';
import Signup from '../components/SignupForm';



const SignupPage = () => {

  return (
    <div className='h-screen grid lg:grid-cols-2'>
      <SignupForm/>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome to our platform!"}
        subtitle={
          "Sign up to access our platform and start using our services."
        }
      />
    </div>
  )
}

export default SignupPage