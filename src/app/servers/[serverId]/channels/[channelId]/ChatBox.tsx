"use client";

import pb from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Record } from "pocketbase";
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
type MessageRecord = Message & Record;

export default function ChatBox() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof messageSchema>
  >({
    resolver: zodResolver(messageSchema),
  });

  const user = pb.authStore.model?.id;
  const channel = usePathname()?.split("/").pop();

  const useSendMessageMutation = () =>
    useMutation({
      mutationFn: async (message: Message) => {
        if (!user || !channel) return;
        const messageData = await pb
          .collection("messages")
          .create<MessageRecord>(message);
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
