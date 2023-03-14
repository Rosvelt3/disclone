"use client";

import pb from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Record } from "pocketbase";
import { useEffect, useRef } from "react";
import { User } from "../../ServerUsers";

type Message = { user: string; text: string; channel: string } & Record;

export default function Messages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChannelId = usePathname()?.split("/")[4];
  const { data: messages, refetch } = useQuery({
    queryKey: ["listMessagesInChannel", currentChannelId],
    queryFn: async () => {
      const messages = await pb
        .collection("messages")
        .getFullList<Message>(200, {
          filter: `channel = "${currentChannelId}"`,
          expand: "user",
        });
      return messages;
    },
    enabled: !!currentChannelId,
  });

  useEffect(() => {
    pb.collection("messages").subscribe("*", function (e) {
      refetch();
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messagesEndRef, messages?.length]);

  if (!messages?.length)
    return (
      <div className="m-auto text-lg text-white">There are no messages.</div>
    );

  return (
    <div
      ref={messagesEndRef}
      className="flex grow flex-col gap-6 overflow-y-auto p-3"
    >
      {messages?.map(({ id, text, created, expand }) => {
        const user = expand.user as User;
        const userAvatarUrl = user.avatar
          ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${user.collectionName}/${user.id}/${user.avatar}`
          : "/defaultAvatar.webp";
        return (
          <div className="flex items-center gap-3" key={id}>
            <Image
              src={userAvatarUrl}
              alt=""
              className="w-fit rounded-full"
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start" key={id}>
              <div>
                <span className="text-white">{user.name}</span>{" "}
                <span className="text-xs text-gray-400">
                  {created.split(" ").slice(0, 1).join("")}
                </span>
              </div>
              <span
                className="text-gray-300"
                dangerouslySetInnerHTML={{ __html: text }}
              ></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
