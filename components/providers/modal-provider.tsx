"use client"

import { CreateServerModal } from "@/components/modals/create-server-modal"
import { InviteModal } from '@/components/modals/invite-modal'
import { EditServerMoadl } from "@/components/modals/edit-server-modal"
import { ManageMembersModal } from "@/components/modals/manage-members-modal"
import { CreateChannelModal } from "@/components/modals/create-channel-modal"

import { useEffect, useState } from "react"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerMoadl />
      <ManageMembersModal />
      <CreateChannelModal />
    </>
  )
}
