import { Badge } from './ui/badge'

export function ProductState({ state }: { state: string }) {
  return (
    <>
      {state === 'ALTA' ? (
        <Badge className="bg-transparent text-black dark:text-white border border-green-500 text-center">
          Alta
        </Badge>
      ) : (
        <Badge className="bg-transparent text-black dark:text-white border border-red-500 text-center">
          Baja
        </Badge>
      )}
    </>
  )
}
