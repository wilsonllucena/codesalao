"use client";
import { Button } from "~/components/ui/button";
import { Heading } from "../_components/heading";

import { useState } from "react";
import { Modal } from "../_components/modal";
import { AppointmentTable } from "./table/data-table";
import { FormAppointment } from "./form";
import { useSession } from "next-auth/react";
import { http } from "~/lib/axios";
import { GET_APPOINTMENTS } from "~/app/constants";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";

async function fetchAppointments(userId: string) {
  return await http.get(`/api/appointments/${userId}`);
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const session = useSession();

  const { data: results } = useQuery({
    queryKey: [GET_APPOINTMENTS, session?.data?.user.id],
    queryFn: () => fetchAppointments(session!.data!.user.id),
  });

  function handleModal(open: boolean) {
    setOpen(open);
  }

  const appointments = results?.data.appointments.map((appointment: any) => ({
    ...appointment,
    name: appointment!.client?.name
      ? appointment!.client?.name
      : appointment?.name,
    date: addDays(new Date(appointment!.date), 1).toLocaleDateString("pt-BR"),
    service: appointment!.service?.name,
  }));

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Agendamentos" />
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleModal(true)}>Novo</Button>
        </div>
      </div>

      <div className="h-4">
        <AppointmentTable data={appointments} />
      </div>
      <Modal
        title="Novo agendamento"
        open={open}
        onClose={() => setOpen(false)}
      >
        <FormAppointment onClose={setOpen} />
      </Modal>
    </>
  );
}
