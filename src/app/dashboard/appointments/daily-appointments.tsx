"use client"
import React from "react";
import { api } from "~/trpc/react";
import { add, addDays, format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

type Appointment = {
  id: string;
  name: string;
  date_start: string;
    client: {
        name: string;
    };
};

const DailyAppointmentsTable: React.FC = () => {
  const { data, error, isLoading } = api.appointment.getAll.useQuery();

    const appointments = data?.filter((appointment: any) => {
      const today = new Date();
      const appointmentDate = new Date(appointment.date_start);
      return today.getDate() === appointmentDate.getDate();
    });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Error loading appointments</div>;

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 bg-gray-50">Nome</TableHead>
            <TableHead className="px-6 py-3 bg-gray-50">Serviço</TableHead>
            <TableHead className="px-6 py-3 bg-gray-50">Horário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments?.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap">{appointment.client?.name}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{appointment.service?.name}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{format(new Date(appointment.date_start), "HH:mm")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DailyAppointmentsTable;