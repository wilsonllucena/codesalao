import { NextRequest } from "next/server";
import { api } from "~/trpc/server";

export async function POST(req: NextRequest) {      
    const body = await req.json();
    const { name, hour, date, description, clientId, serviceId } = body;
    await api.appointment.create({
        name,
        hour,
        date,
        description,
        clientId,
        serviceId
    });
    return new Response(JSON.stringify({ 
        message: 'Appointment created successfully',
    }));
    
   
}