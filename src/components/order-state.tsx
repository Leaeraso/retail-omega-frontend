import { Badge } from './ui/badge'

export function OrderState({ state }: { state: string }) {
  return (
    <>
      {state === 'PENDIENTE' && (
        <Badge className="bg-transparent text-black dark:text-white border border-yellow-500 text-center">
          PENDIENTE
        </Badge>
      )}
      {state === 'ENVIADA' && (
        <Badge className="bg-transparent text-black dark:text-white border border-blue-500 text-center">
          Enviada
        </Badge>
      )}
      {state === 'CANCELADA' && (
        <Badge className="bg-transparent text-black dark:text-white border border-red-500 text-center">
          Cancelada
        </Badge>
      )}
      {state === 'FINALIZADA' && (
        <Badge className="bg-transparent text-black dark:text-white border border-green-500 text-center">
          Finalizada
        </Badge>
      )}
    </>
  )
}
