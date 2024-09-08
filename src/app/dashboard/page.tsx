import { Heading } from "./_components/heading";
import { CardDashboard } from "./_components/card-dashboard";
import DailyAppointmentsTable from "./appointments/daily-appointments";

export default function Dashboard() {
  return (
    <>
      <Heading title="Dashboard" />
      <CardDashboard />
      <DailyAppointmentsTable />
    </>
  );
}
