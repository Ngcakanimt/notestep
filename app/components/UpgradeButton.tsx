"use client"

import { Button } from './ui/button'
import { trpc } from '@/app/_trpc/client'

const UpgradeButton = () => {

  const {mutate: createPaystackSession} = trpc.createPaystackSession.useMutation({
    onSuccess: ({url}) => {
        window.location.href = url ?? "/dashboard/billing";
    }
  })

  return (
    <Button onClick={() => createPaystackSession()} className='w-full'>
      Upgrade now
    </Button>
  )
}

export default UpgradeButton
