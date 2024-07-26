"use client";

import { Button } from "~/components/ui/button";
import { Heading } from "../_components/heading";

import { useState } from "react";
import { Modal } from "../_components/modal";
import { api } from "~/trpc/react";
import { CompanyTable } from "./table/data-table";
import { FormCompany } from "./form";

export default function Page() {
  const [open, setOpen] = useState(false);
  const { data: resultData } = api.company.getAll.useQuery();

  function handleModal(open: boolean) {
    setOpen(open);
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Unidades" />
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleModal(true)}>Novo</Button>
        </div>
      </div>

      <div className="h-4">
        <CompanyTable data={resultData} />
      </div>
      <Modal title="Nova unidade" open={open} onClose={() => setOpen(false)}>
        <FormCompany onClose={setOpen} />
      </Modal>
    </>
  );
}
