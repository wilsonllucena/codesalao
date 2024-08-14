import { addHours, parseISO, set } from "date-fns";

    type DateHour = {
        date: string;
        hour: string;
    };
    export function formatDate({ date, hour }: DateHour) {
        const dateFormat = set(parseISO(date), {
            hours: Number(hour.split(":")[0]),
            minutes: Number(hour.split(":")[1]),
          });
        return  addHours(dateFormat, -3);
    }