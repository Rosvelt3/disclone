"use client";

import { databases } from "@/lib/appwrite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ID, Query } from "appwrite";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Item, ItemParams, Menu, useContextMenu } from "react-contexify";
import { AiOutlinePlus } from "react-icons/ai";
import { FaHashtag, FaTrash } from "react-icons/fa";

type ChannelListProps = { serverId: string };
const MENU_ID = "channel-menu";

export default function ChannelList({ serverId }: ChannelListProps) {
  const { show } = useContextMenu({ id: MENU_ID });
  const router = useRouter();
  const pathname = usePathname();
  const currentChannelId = pathname?.split("/")[4];
  const queryClient = useQueryClient();
  const [addChannelMode, setAddChannelMode] = useState(false);

  const useAddChannelMutation = () =>
    useMutation({
      mutationFn: async (channelName: string) => {
        const channel = await databases.createDocument(
          process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
          process.env.NEXT_PUBLIC_CHANNELS_COLLECTION as string,
          ID.unique(),
          {
            name: channelName,
            server: serverId,
          }
        );

        return channel;
      },
      onSuccess: (data) => {
        setAddChannelMode(false);
        queryClient.invalidateQueries({ queryKey: ["listChannelsInServer"] });
        router.replace(`/servers/${serverId}/channels/${data?.id}`);
      },
    });

  const useDeleteChannelMutation = () =>
    useMutation({
      mutationFn: async (channelId: string) => {
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
          process.env.NEXT_PUBLIC_CHANNELS_COLLECTION as string,
          channelId
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listChannelsInServer"] });
      },
    });

  const addChannelMutation = useAddChannelMutation();
  const deleteChannelMutation = useDeleteChannelMutation();

  const { data: channels } = useQuery({
    queryKey: ["listChannelsInServer", serverId],
    queryFn: async () => {
      const channels = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
        process.env.NEXT_PUBLIC_CHANNELS_COLLECTION as string,
        [Query.equal("server", serverId)]
      );
      return channels;
    },
    enabled: !!serverId,
  });

  const { data: currentServer } = useQuery({
    queryKey: ["getServer", serverId],
    queryFn: async () => {
      const server = await databases.getDocument(
        process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
        process.env.NEXT_PUBLIC_SERVERS_COLLECTION as string,
        serverId
      );
      return server;
    },
    enabled: !!serverId,
  });

  const onChannelRightClick = (e: React.MouseEvent, channelId: string) => {
    show({ event: e, props: { channelId } });
  };

  const handleChannelDelete = ({ props }: ItemParams) => {
    deleteChannelMutation.mutate(props.channelId);
  };

  useEffect(() => {
    if (channels?.documents?.length !== 0 && serverId && !currentChannelId) {
      router.replace(
        `/servers/${serverId}/channels/${channels?.documents?.[0].$id}`
      );
    }
  }, [serverId, channels?.documents, pathname, currentChannelId]);

  return (
    <>
      <div className="items-left flex h-full w-60 flex-col bg-slate-700 p-4">
        <h1 className="mb-4 text-xl font-bold text-white">
          {currentServer?.name}
        </h1>
        <div className=" mb-1 flex items-center justify-between text-white">
          <span className="text-md font-medium">Channels</span>
          <AiOutlinePlus
            role="button"
            onClick={() => {
              setAddChannelMode(!addChannelMode);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          {channels?.documents?.map(({ $id, name }) => {
            return (
              <Link
                href={`/servers/${serverId}/channels/${$id}`}
                key={$id}
                onContextMenu={(e) => onChannelRightClick(e, $id)}
              >
                <div
                  className={`flex items-center gap-4 rounded-md p-1 ${
                    currentChannelId === $id ? "bg-slate-600" : ""
                  }`}
                >
                  <span className="flex items-center gap-1 font-medium text-white">
                    <FaHashtag />
                    {name}
                  </span>
                </div>
              </Link>
            );
          })}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addChannelMutation.mutate(e.currentTarget.channelName.value);
              e.currentTarget.channelName.value = "";
              setAddChannelMode(false);
            }}
            hidden={!addChannelMode}
          >
            <div className="flex items-center pl-1">
              <FaHashtag className="text-white" />
              <input
                ref={(input) => input && input.focus()}
                name="channelName"
                type="text"
                placeholder="Channel Name"
                className="form-input w-full border-none bg-transparent pl-1 text-slate-100 placeholder:text-slate-300 focus:ring-transparent"
              />
              <input type="submit" hidden />
            </div>
          </form>
        </div>
      </div>
      <Menu id="channel-menu" animation={{ enter: false, exit: false }}>
        <Item onClick={handleChannelDelete}>
          <div className="flex items-center gap-2">
            <FaTrash className="text-red-400" />
            Delete Channel
          </div>
        </Item>
      </Menu>
    </>
  );
}
