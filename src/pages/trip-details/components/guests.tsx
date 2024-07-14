import { CheckCircle2, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../../../components/button";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { InviteGuestsModal } from "../../create-trip/components/invite-guests-modal";

interface Participant {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function openAddGuestModal() {
    setIsAddGuestModalOpen(true)
  }

  function closeAddGuestModal() {
    setIsAddGuestModalOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    if (participants.some(participant => participant.email === email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  useEffect(() => {
    api.get(`/trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId, closeAddGuestModal])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>
      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div key={participant.id} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
                <span className="block text-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="size-5 text-green-400" />
              ) : (
                <CircleDashed className="size-5 text-zinc-400" />
              )}
            </div>
          )
        })}
      </div>

      <Button variant="secondary" size="full" onClick={openAddGuestModal}>
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>

      {isAddGuestModalOpen && (
        <InviteGuestsModal
          addNewEmailToInvite={addNewEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
          closeGuestsModal={closeAddGuestModal}
          emailsToInvite={emailsToInvite}
          tripId={tripId}
          isManageGuests
        />
      )}

    </div>
  )
}