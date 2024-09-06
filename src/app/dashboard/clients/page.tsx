"use client";

import { Button } from "~/components/ui/button";
import { Heading } from "../_components/heading";

import { Modal } from "../_components/modal";
import { FormClient } from "./form";
import { ClientTable } from "./table/data-table";
import { http } from "~/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { GET_CLIENTS } from "~/app/constants";
import { useState } from "react";

async function fetchClients(userId: string) {
  const clients = await http.get(`/api/client/${userId}`);
  return clients;
}

export default function Clients() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const { data: clients, isLoading } = useQuery({
    queryKey: [GET_CLIENTS, session?.data?.user.id],
    queryFn: () => fetchClients(session!.data!.user.id),
  });

  function handleModal(open: boolean) {
    setOpen(open);
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Clientes" />
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleModal(true)}>Novo</Button>
        </div>
      </div>

      <div className="h-4">
        <ClientTable data={clients?.data.clients} />
      </div>
      <Modal title="Novo cliente" open={open} onClose={() => setOpen(false)}>
        <FormClient onClose={setOpen} />
      </Modal>
    </>
  );
}
