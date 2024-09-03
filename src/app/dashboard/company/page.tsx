"use client";

import { Button } from "~/components/ui/button";
import { Heading } from "../_components/heading";

import { useState } from "react";
import { Modal } from "../_components/modal";
import { CompanyTable } from "./table/data-table";
import { FormCompany } from "./form";
import { GET_COMPANIES } from "~/app/constants";
import { http } from "~/lib/axios";
import { useQuery } from "@tanstack/react-query";

async function getCompanies() {
  return await http.get(`/api/cpmpany`);
}
export default function Page() {
  const [open, setOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: [GET_COMPANIES],
    queryFn: () => getCompanies(),
  });

  function handleModal() {
    setOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Empresa" />
        <div className="flex items-center space-x-2">
          <Button onClick={handleModal}>Novo</Button>
        </div>
      </div>

      <div className="h-4">
        <CompanyTable data={services?.data.services} />
      </div>
      <Modal title="Nova empresa" open={open} onClose={() => setOpen(false)}>
        {/* <FormCompany onClose={setOpen} /> */}
        <p>Modal</p>
      </Modal>
    </>
  );
}
