import { CircleCheck, CircleDashed } from "lucide-react";
import { api } from "../../../lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

export function Activities() {
  const { tripId } = useParams()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    api.get(`/trips/${tripId}/activities`).then(response => setActivities(response.data.activities))
  }, [tripId])

  return (
    <div className="space-y-8">
      {activities.map(category => {

        const alreadyHappened = isBefore(new Date(category.date), new Date())

        return (
          <div key={category.date} className="space-y-2.5">
            <div className="flex gap-2 items-baseline">
              <span className={`text-xl text-zinc-300 font-semibold ${alreadyHappened && "text-zinc-300/80"}`}>Dia {format(category.date, 'd')}</span>
              <span className={`text-xs capitalize text-zinc-500 ${alreadyHappened && "text-zinc-500/80"}`}>{format(category.date, 'EEEE', { locale: ptBR })}</span>
            </div>
            {category.activities.length > 0 ? (
              <div>
                {category.activities.map(activity => {
                  return (
                    <div key={activity.id} className="space-y-2.5">
                      <div className={`px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3 ${alreadyHappened && "bg-zinc-900/50"}`}>
                        {isBefore(new Date(activity.occurs_at), new Date()) ? (
                          <CircleCheck className={`text-lime-300 size-5 ${alreadyHappened && "text-lime-300/60"}`} />
                        ) : (
                          <CircleDashed className="text-zinc-300 size-5" />
                        )}
                        <span className={`text-zinc-100 ${alreadyHappened && "text-zinc-100/60"}`}>{activity.title}</span>
                        <span className={`text-zinc-400 text-sm ml-auto ${alreadyHappened && "text-zinc-400/60"}`}>
                          {format(activity.occurs_at, 'HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className={`text-sm text-zinc-500 ${alreadyHappened && "text-zinc-500/80"}`}>Nenhuma atividade cadastrada nessa data.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}