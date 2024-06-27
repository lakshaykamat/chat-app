import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from './ui/card'


export const ChatSkeleton = () => {
  return (
    <Card className='flex items-center gap-3 p-3'>
    <Skeleton className="w-[60px] h-[50px] rounded-full" />
    <Skeleton className="w-full h-[30px]" />
    </Card>

  )
}
