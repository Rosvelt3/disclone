"use client";

import pb from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Record } from "pocketbase";

type User = { name: string; avatar: string } & Record;
type ServerUsersProps = { serverId: string };

export default function ServerUsers({ serverId }: ServerUsersProps) {
  const { data: users } = useQuery({
    queryKey: ["listUsersInServer", serverId],
    queryFn: async () => {
      const server = await pb.collection("servers").getOne(serverId!, {
        expand: "users",
      });
      return (server.expand.users as User[]) || [];
    },
    enabled: !!serverId,
  });

  if (users?.length === 0)
    return (
      <div className="items-left flex h-full w-48 flex-col gap-4 bg-slate-800 text-white p-4">
        There are no users in this server
      </div>
    );
  return (
    <div className="items-left flex h-full w-48 flex-col gap-4 bg-slate-800 p-4">
      {users?.map(({ name, id, avatar, collectionName }) => {
        const userAvatarUrl = avatar
          ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${collectionName}/${id}/${avatar}`
          : "/defaultAvatar.webp";
        return (
          <div className="flex items-center gap-4" key={id}>
            <Image
              src={userAvatarUrl}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-lg text-white">{name}</span>
          </div>
        );
      })}
    </div>
  );
}
