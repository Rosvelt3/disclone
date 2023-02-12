"use client";

import pb from "@/lib/pocketbase";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Record } from "pocketbase";
import { useEffect, useState } from "react";
import { Item, ItemParams, Menu, useContextMenu } from "react-contexify";
import { AiOutlinePlus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export type Server = { name: string; users: string[]; owner: string } & Record;
const MENU_ID = "server-menu";
export default function ServerList() {
  const { show } = useContextMenu({ id: MENU_ID });
  const router = useRouter();
  const currentServer = usePathname()?.split("/")[2];
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const useDeleteServerMutation = () =>
    useMutation({
      mutationFn: async (serverId: string) => {
        await pb.collection("servers").delete(serverId);
      },
      onSuccess: () => {
        router.replace("/servers");
      },
    });

  const deleteServerMutation = useDeleteServerMutation();

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

  const onServerRightClick = (e: React.MouseEvent, serverId: string) => {
    show({ event: e, props: { serverId } });
  };

  const handleServerDelete = ({ props }: ItemParams) => {
    deleteServerMutation.mutate(props.serverId);
  };

  useEffect(() => {
    if (servers?.length !== 0 && !currentServer) {
      router.replace(`/servers/${servers?.[0].id}`);
    }
  }, [servers, currentServer]);

  return (
    <>
      <div className="flex h-full w-16 flex-col items-center gap-4 bg-slate-800 py-4">
        <button
          onClick={() => setShowAddServerModal(true)}
          id="addServer"
          className="flex h-[3rem] w-[3rem] items-center justify-center rounded-lg bg-slate-600 transition-all hover:rounded-none"
        >
          <AiOutlinePlus size={28} className="text-sky-400" />
        </button>
        <Tooltip
          anchorId="addServer"
          content="Add Server"
          place="right"
          className="bg-gray-900 text-white opacity-100"
        />
        {servers?.map(({ name, id }) => (
          <Link
            key={id}
            href={`/servers/${id}`}
            onContextMenu={(e) => onServerRightClick(e, id)}
          >
            <Image
              src="/defaultAvatar.webp"
              alt={`Server ${name}`}
              width={48}
              height={48}
              id={id}
              className="cursor-pointer rounded-lg transition-all hover:rounded-none"
            />
            <Tooltip
              anchorId={id}
              content={name}
              place="right"
              className="bg-gray-900 text-white opacity-100"
            />
          </Link>
        ))}
      </div>
      <Menu id="server-menu" animation={{ enter: false, exit: false }}>
        <Item onClick={handleServerDelete}>
          <div className="flex items-center gap-2">
            <FaTrash className="text-red-400" />
            Delete Server
          </div>
        </Item>
      </Menu>
    </>
  );
}
