'use client'

import { useProviders } from '@/hooks/use-providers'
import { Button } from './ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'
import { useEffect, useState } from 'react'
import { ProductState } from './product-state'
import { ClipboardPlus, Eye, EyeClosed, Pen, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProviderModal } from './provider-modal'
import { deleteProvider } from '@/services/provider.service'
import { Provider } from '@/types/provider.types'
import toast from 'react-hot-toast'

export function ProviderTable() {
  const {
    providers,
    fetchProviders,
    addProvider,
    updateProvider,
    deleteProvider: softDeleteProvider,
  } = useProviders()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider)
    openModal()
  }

  const handleDeleteProvider = async (id: number) => {
    try {
      const res = await deleteProvider(id)

      if (res?.success) {
        softDeleteProvider(id, new Date().toISOString())
        fetchProviders()
        toast.success('Proveedor eliminado correctamente')
      } else {
        toast.error(res?.error || 'No se pudo eliminar el proveedor')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al eliminar proveedor')
    }
  }

  return (
    <main className="p-4">
      <div className="flex flex-row justify-end items-center gap-x-2 mx-2 my-4">
        <Button className="hover:cursor-pointer" onClick={openModal}>
          <ClipboardPlus className="h-4 w-4 text-white" />
        </Button>
      </div>

      <ProviderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={addProvider}
        onUpdate={updateProvider}
        provider={editingProvider}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.id}</TableCell>
              <TableCell>{provider.name}</TableCell>
              <TableCell>{provider.email}</TableCell>
              <TableCell>{provider.phone}</TableCell>
              <TableCell>
                <ProductState state={provider.providerState} />
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center gap-x-2">
                  <Button
                    className=" text-white group hover:cursor-pointer p-2 "
                    onClick={() =>
                      router.push(`/dashboard/providers/${provider.id}`)
                    }
                  >
                    <EyeClosed className="h-3 w-3 text-white group-hover:hidden" />
                    <Eye className="h-3  w-3 text-white hidden group-hover:inline" />
                  </Button>

                  <Button
                    className=" text-white group hover:cursor-pointer p-2"
                    onClick={() => handleEdit(provider)}
                  >
                    <Pen className="h-3 w-3 text-white" />
                  </Button>
                  <Button
                    className="hover:cursor-pointer"
                    onClick={() => handleDeleteProvider(provider.id)}
                  >
                    <Trash className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
