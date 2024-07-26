/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Service, type Client } from "@prisma/client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

type SelectProps = {
  data: any[] | Service[] | Client[] | undefined;
  register: any;
  name: string;
};

export function SelectCustom({ data, register, name }: SelectProps) {
  return (
    <Select {...register(name)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data?.length &&
            data.map((data: any) => (
              <SelectItem key={data.id} value={data.id}>
                {data.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
