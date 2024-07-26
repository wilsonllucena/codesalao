import { type Metadata } from "next";
import { Heading } from "~/components/heading";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard | Clientes",
};

export default function Clients() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Configurações" />
        <div className="flex items-center space-x-2">
          <Button>Novo</Button>
        </div>
      </div>
    </>
  );
}
