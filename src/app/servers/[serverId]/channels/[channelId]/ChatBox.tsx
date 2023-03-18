"use client";

import { account, databases } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ID } from "appwrite";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const messageSchema = z.object({
  text: z.string().trim(),
});

type Message = {
  user: string | undefined;
  text: string;
  channel: string | undefined;
};
type MessageRecord = Message;

export default function ChatBox() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof messageSchema>
  >({
    resolver: zodResolver(messageSchema),
  });

  const channel = usePathname()?.split("/").pop();

  const { data: user } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const currentUser = await account.get();
      return currentUser;
    },
    enabled: !!channel,
  });

  const useSendMessageMutation = () =>
    useMutation({
      mutationFn: async (message: Message) => {
        if (!user || !channel) return;
        const messageData = await databases.createDocument(
          process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
          process.env.NEXT_PUBLIC_MESSAGES_COLLECTION as string,
          ID.unique(),
          {
            user: user?.$id,
            userName: user?.name,
            text: message.text,
            channel: channel,
          }
        );

        return messageData;
      },
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries({ queryKey: ["listMessagesInChannel"] });
      },
    });

  const sendMessageMutation = useSendMessageMutation();

  const onSubmit = (data: Message) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <div className="px-4 pt-2">
      <form
        onSubmit={handleSubmit((data) =>
          onSubmit({ user, channel, text: data.text })
        )}
        className="mx-auto mb-6 flex w-full"
      >
        <input
          type="text"
          placeholder="Send a Message"
          className="w-full rounded-lg border-none bg-slate-500 py-2.5 text-slate-100 placeholder:text-slate-300 focus:ring-transparent"
          {...register("text")}
        />
        <input type="submit" hidden />
      </form>
    </div>
  );
}
