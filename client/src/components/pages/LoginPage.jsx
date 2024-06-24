import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '../ui/button'

const LoginPage = () => {
  return (
    <div className='max-w-lg mx-auto mt-12 rounded-md bg-card drop-shadow-md p-7'>
        <h1 className='text-3xl font-bold mb-7'>Login</h1>
        <Label htmlFor="email">Email</Label>
        <Input className="mb-5" id="email" type="email" placeholder="Email" />
        <Label htmlFor="password">Password</Label>
        <Input className="mb-5" id="password" type="password" placeholder="Password" />
        <p className='my-4 text-sm'>Don't have an account? <a href="/register" className='text-blue-600 underline hover:text-blue-700'>Register here.</a></p>
        <Button>Login</Button>
    </div>
  )
}

export default LoginPage