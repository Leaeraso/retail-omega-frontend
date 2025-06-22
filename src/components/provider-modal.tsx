'use client'

import {
  createProviderSchema,
  ProviderFormData,
} from '@/schemas/provider.schema'
import { Provider } from '@/types/provider.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { createProvider, updateProvider } from '@/services/provider.service'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (p: Provider) => void
  onUpdate: (id: number, p: Partial<Provider>) => void
  provider?: Provider | null
}

export function ProviderModal({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  provider,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  useEffect(() => {
    if (provider) {
      setValue('name', provider.name)
      setValue('email', provider.email)
      setValue('phone', provider.phone)
    } else {
      reset()
    }
  }, [provider, setValue, reset])

  const onSubmit = async (providerData: ProviderFormData) => {
    if (provider) {
      await updateProvider(provider.id, providerData)
      onUpdate(provider.id, providerData)
      toast.success('Proveedor actualizado correctamente')
    } else {
      const createdProvider = await createProvider(providerData)
      if (createdProvider) {
        onCreate(createdProvider)
        toast.success('Proveedor creado correctamente')
      } else {
        toast.error('Error al crear proveedor')
        return
      }
    }

    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="w-full flex justify-center items-center">
            <DialogTitle className="text-2xl font-bold">
              {provider ? 'Editar proveedor' : 'Crear proveedor'}
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="name" className="py-2">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Perez"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="py-2">
              Email
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="juanperez@gmail.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="py-2">
              Telefono
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="2613546754"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex flex-row justify-center items-center gap-x-4 pt-4">
            <Button
              type="submit"
              className=" text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : provider ? (
                'Actualizar'
              ) : (
                'Crear'
              )}
            </Button>
            <Button className="text-white px-4 py-2 rounded" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
