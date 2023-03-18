"use client";

// import { Server } from "@/app/ServerList";
// import pb from "@/lib/appwrite";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

export default function JoinServerCard({ serverId }: { serverId: string }) {
//   const router = useRouter();

//   const { data: server } = useQuery({
//     queryKey: ["server", serverId],
//     queryFn: async () => {
//       const server = await pb.collection("servers").getOne<Server>(serverId);
//       return server;
//     },
//   });

//   const useJoinServerMutation = () =>
//     useMutation({
//       mutationFn: async () => {
//         if (!server) return;
//         const userId = await pb.authStore.model?.id;
//         await pb.collection("servers").update(serverId, {
//           users: [...server.users, userId],
//         });
//       },
//       onSuccess: () => {
//         router.push(`/servers/${serverId}`);
//       },
//     });

//   const joinServerMutation = useJoinServerMutation();
return <div></div>
//   return (
//     <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-600 to-blue-800">
//       <div className="w-1/2 max-w-lg rounded-sm bg-slate-700 p-8 shadow-sm">
//         <h1 className="mb-6 text-center text-2xl text-white">
//           Join the {server?.name} server
//         </h1>
//         <div className="mx-auto flex h-[4rem] w-[4rem] items-center justify-center rounded-lg bg-slate-600">
//           <div className="flex cursor-pointer items-center justify-center rounded-lg text-4xl text-white transition-all hover:rounded-none">
//             {server?.name[0].toUpperCase()}
//           </div>
//         </div>
//         <button
//           onClick={() => joinServerMutation.mutate()}
//           type="button"
//           className="mx-auto mt-6 mb-4 block w-32 rounded-md bg-sky-500 p-2 font-medium text-white transition-colors hover:bg-sky-600"
//         >
//           Join
//         </button>
//       </div>
//     </div>
//   );
}
