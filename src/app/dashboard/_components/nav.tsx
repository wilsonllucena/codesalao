import { Calendar, Home, HouseIcon, Package, Users } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Calendar className="h-4 w-4" />
            Agenda
          </Link>
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Users className="h-4 w-4" />
            Clientes
          </Link>
          <Link
            href="/dashboard/services"
            // className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Package className="h-4 w-4" />
            Serviços{" "}
          </Link>

          <Link
            href="/dashboard/company"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <HouseIcon className="h-4 w-4" />
            Empresa
          </Link>
        </nav>
      </div>
    </>
  );
}
