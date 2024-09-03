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
import { AlertModal } from "~/components/alert-modal";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { GET_COMPANIES } from "~/app/constants";
import { FormCompany } from "../form";

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const { toast } = useToast();

  const { mutate: deleteService } = api.company.delete.useMutation({
    onSuccess: () => {
      setLoading(false);
      setOpenDelete(false);
      queryClient.invalidateQueries({
        queryKey: [GET_COMPANIES],
      });
      toast({
        title: "Sucesso",
        description: "Empresa excluida com sucesso",
      });
    },
  });

  function handleModal(open: boolean) {
    setCompany(data);
    setOpen(open);
  }

  function handleDelete() {
    try {
      setLoading(true);
      deleteService(data);
    } catch (error) {
      toast({
        title: "Erro ao remover empresa",
        description: "Erro ao remover empresa",
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
      <Modal title="Editar empresa" open={open} onClose={() => setOpen(false)}>
        <FormCompany onClose={setOpen} company={company} />
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
