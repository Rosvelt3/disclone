"use client";

import { client, databases } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import { Query } from "appwrite";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Messages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChannelId = usePathname()?.split("/")[4];
  const { data: messages, refetch } = useQuery({
    queryKey: ["listMessagesInChannel", currentChannelId],
    queryFn: async () => {
      const messages = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
        process.env.NEXT_PUBLIC_MESSAGES_COLLECTION as string,
        [Query.search("channel", currentChannelId)]
      );
      return messages;
    },
    enabled: !!currentChannelId,
  });

  useEffect(() => {
    const unsubscribe = client.subscribe("messages", (response) => {
      if (
        response.events.includes("messages.create") ||
        response.events.includes("messages.delete") ||
        response.events.includes("messages.update")
      ) {
        refetch();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messagesEndRef, messages?.documents?.length]);

  if (!messages?.documents?.length) {
    return (
      <div className="m-auto text-lg text-white">There are no messages.</div>
    );
  }

  return (
    <div
      ref={messagesEndRef}
      className="flex grow flex-col gap-6 overflow-y-auto p-3"
    >
      {messages?.documents?.map(({ $id, user, userName, text, $createdAt }) => {
        const userAvatarUrl = user
          ? `https://be.isaiasdev.com/v1/storage/buckets/640fc7985bb2d090636f/files/${user}-avatar/view?project=640fb1566bf66af19142`
          : "/defaultAvatar.webp";

        return (
          <div className="flex items-center gap-3" key={$id}>
            <Image
              src={userAvatarUrl || "/defaultAvatar.webp"}
              alt=""
              className="object rounded-full object-cover w-10 h-10"
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start" key={$id}>
              <div>
                <span className="text-white">{userName}</span>{" "}
                <span className="text-xs text-gray-400">
                  {$createdAt.split("T").slice(0, 1).join("")}
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
