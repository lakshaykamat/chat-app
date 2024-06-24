import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '../ui/button'

const RegisterPage = () => {
  return (
    <div className='max-w-lg mx-auto mt-12 rounded-md bg-card drop-shadow-md p-7'>
        <h1 className='text-3xl font-bold mb-7'>Register</h1>
        <Label htmlFor="name">Name</Label>
        <Input className="mb-5" id="name" required type="text" placeholder="Name" />


        <Label htmlFor="email">Email</Label>
        <Input className="mb-5" id="email" type="email" placeholder="Email" />

        <Label htmlFor="password">Password</Label>
        <Input className="mb-5" id="password" type="password" placeholder="Password" />
        
        <Label htmlFor="picture">Avatar</Label>
        <Input id="picture" type="file" />
        
        <p className='my-4 text-sm'>Already have an account? <a href="/login" className='text-blue-600 underline hover:text-blue-700'>Login here.</a></p>
        <Button>Create Account</Button>
    </div>
  )
}

export default RegisterPage