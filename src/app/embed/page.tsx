import EmbedClient from '@/components/EmbedClient'
import { getSession } from '@/lib/getSession'
import { get } from 'http'
import React from 'react'

async function page() {
    const session = await getSession()
  return (
    <>
     <EmbedClient ownerId={session?.user?.id!} /> 
    </>
  )
}

export default page
