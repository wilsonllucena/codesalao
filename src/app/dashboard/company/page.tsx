"use client";
import { Button } from "~/components/ui/button";
import { Heading } from "../_components/heading";

import { useState } from "react";
import { Modal } from "../_components/modal";
import { CompanyTable } from "./table/data-table";
import { GET_COMPANIES } from "~/app/constants";
import { http } from "~/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { FormCompany } from "./form";

async function getCompanies() {
  return await http.get(`/api/company`);
}
export default function Company() {
  const [open, setOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: [GET_COMPANIES],
    queryFn: () => getCompanies(),
  });

  function handleModal(open: boolean) {
    setOpen(open);
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Empresa" />
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleModal(true)}>Novo</Button>
        </div>
      </div>

      <div className="h-4">
        <CompanyTable data={services?.data.services} />
      </div>
      <Modal title="Nova empresa" open={open} onClose={() => setOpen(false)}>
        <FormCompany onClose={setOpen} />
      </Modal>
    </>
  );
}
