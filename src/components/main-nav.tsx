import Link from "next/link";
import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/appointments"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Agenda
      </Link>
      <Link
        href="/dashboard/clients"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Clientes
      </Link>
      <Link
        href="/dashboard/services"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Serviços
      </Link>
      {/* <Link
        href="/dashboard/company"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Empresa
      </Link> */}
      <Link
        href="/dashboard/settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Configurações
      </Link>
    </nav>
  );
}
