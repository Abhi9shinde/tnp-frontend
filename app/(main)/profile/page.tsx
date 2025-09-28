'use client'
import SignupFormDemo from '@/components/signup-form-demo'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { BACKEND_URL } from '@/lib/config'
import axios from 'axios'
import React from 'react'

type Props = {}


const Profile = (props: Props) => {
  const fields = [
    { name: "firstname", label: "First name", placeholder: "Pranav", group: "name" },
    { name: "middlename", label: "Middle name", placeholder: "Prakash", group: "name" },
    { name: "lastname", label: "Last name", placeholder: "Turkar", group: "name" },
    { name: "personalEmail", label: "Email Address", type: "email", placeholder: "your@email.com" },
    { name: "phoneNo", label: "Phone Number", type: "tel", placeholder: "9876543210" },
    { name: "dob", label: "Date of Birth", type: "date" },
  ];

  const onSubmitHandler = async(formsData:Record<any, any>) =>{
      
      const res= await axios.post(`${BACKEND_URL}/api/v1/student/registerStudent`,
        formsData,
        {withCredentials:true}
      )
      console.log(res);
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-white'>
        
        <div className="relative z-10">
          <SignupFormDemo
          fields={fields}
          onSubmit={(formData)=>{
            onSubmitHandler(formData)
          }}
          />
        </div>
    </div>
  )
}

export default Profile