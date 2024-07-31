"use client";

import { Button } from "~/components/ui/button";
import { Heading } from "../_components/heading";

import { useState } from "react";
import { Modal } from "../_components/modal";
import { api } from "~/trpc/react";
import { ServiceTable } from "./table/data-table";
import { FormService } from "./form";
import { GET_SERVICES } from "~/app/constants";
import { useSession } from "next-auth/react";
import { http } from "~/lib/axios";
import { useQuery } from "@tanstack/react-query";

async function fetchServices(userId: string) {
  return await http.get(`/api/services/${userId}`);
}
export default function Page() {
  const [open, setOpen] = useState(false);
  // const { data: services } = api.service.getAll.useQuery();
  const session = useSession();

  const { data: services, isLoading } = useQuery({
    queryKey: [GET_SERVICES, session?.data?.user.id],
    queryFn: () => fetchServices(session!.data!.user.id),
  });

  function handleModal(open: boolean) {
    setOpen(open);
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Serviços" />
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleModal(true)}>Novo</Button>
        </div>
      </div>

      <div className="h-4">
        <ServiceTable data={services?.data.services} />
      </div>
      <Modal title="Novo serviço" open={open} onClose={() => setOpen(false)}>
        <FormService onClose={setOpen} />
      </Modal>
    </>
  );
}
