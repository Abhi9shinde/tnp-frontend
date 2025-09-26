import SignupFormDemo from '@/components/signup-form-demo'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import React from 'react'

type Props = {}

const Profile = (props: Props) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-white'>
        <BackgroundRippleEffect />
        <div className="relative z-10">
          <SignupFormDemo/>
        </div>
    </div>
  )
}

export default Profile