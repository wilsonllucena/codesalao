/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

import { Modal } from "../../_components/modal";
import { FormClient } from "../form";
import { AlertModal } from "~/components/alert-modal";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<any>(null);
  const { toast } = useToast();

  const { mutate } = api.client.delete.useMutation();

  function handleModal(open: boolean) {
    setClient(data);
    setOpen(open);
  }

  function handleDelete() {
    try {
      setLoading(true);
      mutate(data);
      setOpenDelete(false);
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso",
      });
    } catch (error) {
      console.error("Error removing client" + JSON.stringify(error));
      toast({
        title: "Erro ao remover cliente",
        description: "Erro ao remover cliente",
      });
    }
  }

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <Modal title="Editar cliente" open={open} onClose={() => setOpen(false)}>
        <FormClient onClose={setOpen} client={client} />
      </Modal>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleModal(true)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
