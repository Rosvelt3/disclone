"use client";

import pb from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Record } from "pocketbase";

type Message = { user: string; text: string; channel: string } & Record;

export default function Messages() {
  const currentChannelId = usePathname()?.split("/").pop();
  const { data: messages } = useQuery({
    queryKey: ["listMessagesInChannel", currentChannelId],
    queryFn: async () => {
      const messages = await pb
        .collection("messages")
        .getFullList<Message>(200, {
          filter: `channel = "${currentChannelId}"`,
        });
      return messages;
    },
    enabled: !!currentChannelId,
  });

  if (!messages?.length)
    return (
      <div className="m-auto text-lg text-white">There are no messages.</div>
    );

  return (
    <div className="flex grow flex-col gap-6 p-3">
      {messages?.map(({ id, text, created }) => {
        return (
          <div className="flex items-center gap-3" key={id}>
            <Image
              src="/defaultAvatar.webp"
              alt=""
              className="w-fit rounded-full"
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start" key={id}>
              <div>
                <span className="text-white">Test User</span>{" "}
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
