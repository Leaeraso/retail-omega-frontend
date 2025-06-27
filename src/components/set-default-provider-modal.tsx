'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductProvider } from '@/types/product-provider.types'
import { useState } from 'react'

interface SetDefaultProviderModalProps {
  isOpen: boolean
  onClose: () => void
  providers: ProductProvider[]
  currentDefaultId?: number
  onSelect: (providerId: number) => void
}

export function SetDefaultProviderModal({
  isOpen,
  onClose,
  providers,
  currentDefaultId,
  onSelect,
}: SetDefaultProviderModalProps) {
  const [selectedId, setSelectedId] = useState<number>(currentDefaultId || 0)

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar proveedor predeterminado</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {providers.map((provider) => (
            <label
              key={provider.id}
              className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
            >
              <input
                type="radio"
                checked={selectedId === provider.id}
                onChange={() => setSelectedId(provider.id)}
              />
              <span>{provider.providerName}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
