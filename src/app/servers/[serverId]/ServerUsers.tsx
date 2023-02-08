"use client";

import pb from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Record } from "pocketbase";
import React from "react";

type User = { name: string; avatar: string } & Record;
type ServerUsersProps = { id: string };

export default function ServerUsers({ id }: ServerUsersProps) {
  const { data: users } = useQuery({
    queryKey: ["listUsersInServer", id],
    queryFn: async () => {
      const server = await pb.collection("servers").getOne(id!, {
        expand: "users",
      });
      return server.expand.users as User[];
    },
    enabled: !!id,
  });

  return (
    <div className="items-left flex h-full w-48 flex-col gap-4 bg-slate-800 p-4">
      <div className="flex items-center gap-4">
        {users?.map(({ name, id, avatar, collectionName }) => {
          const userAvatarUrl = avatar
            ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${collectionName}/${id}/${avatar}}`
            : "/defaultAvatar.webp";
          return (
            <React.Fragment key={id}>
              <Image
                src={userAvatarUrl}
                alt=""
                width={40}
                height={40}
                className="transition-border cursor-pointer rounded-lg transition-all hover:rounded-none"
              />
              <span className="text-lg text-white">{name}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
