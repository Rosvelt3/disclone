"use client";

import pb from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Record } from "pocketbase";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type Server = { name: string } & Record;

export default function ServerList() {
  const router = useRouter();
  const { data: servers } = useQuery({
    queryKey: ["listCurrentUserWithServers", pb.authStore.model?.id],
    queryFn: async () => {
      const user = await pb.collection("users").getOne(pb.authStore.model!.id, {
        expand: "serversJoined",
      });
      return user.expand.serversJoined as Server[];
    },
    enabled: !!pb.authStore.model,
  });

  const handleServerClick = (id: string) => {
    router.push(`/servers/${id}`);
  }

  return (
    <div className="flex h-full w-16 flex-col items-center gap-4 bg-slate-800 py-4">
      {servers?.map(({ name, id }) => (
        <div key={id} onClick={() => handleServerClick(id)}>
          <Image
            src="/defaultAvatar.webp"
            alt={`Server ${name}`}
            width={48}
            height={48}
            id={id}
            className="transition-border cursor-pointer rounded-lg transition-all hover:rounded-none"
          />
          <Tooltip
            anchorId={id}
            content={name}
            place="right"
            className="bg-gray-800 text-white"
          />
        </div>
      ))}
    </div>
  );
}
