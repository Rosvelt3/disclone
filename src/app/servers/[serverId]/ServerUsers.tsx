"use client";

// import pb from "@/lib/appwrite";
// import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
// import { Record } from "pocketbase";

// export type User = { name: string; avatar: string; owner: boolean } & Record;
// type ServerUsersProps = { serverId: string };

export default function ServerUsers({ serverId }: any) {
// export default function ServerUsers({ serverId }: ServerUsersProps) {
//   const { data: users } = useQuery({
//     queryKey: ["listUsersInServer", serverId],
//     queryFn: async () => {
//       const server = await pb.collection("servers").getOne(serverId!, {
//         expand: "users",
//       });

//       const serverUsers = server?.expand?.users as User[];
//       const newServerUsers = serverUsers?.map((user) => {
//         return {
//           ...user,
//           owner: user.id === server.owner,
//         };
//       });

//       return newServerUsers || [];
//     },
//     enabled: !!serverId,
//   });

return <div></div>
//   if (users?.length === 0)
//     return (
//       <div className="items-left flex h-full w-48 flex-col gap-4 bg-slate-800 p-4 text-white">
//         There are no users in this server
//       </div>
//     );
//   return (
//     <div className="items-left flex h-full w-48 flex-col gap-4 bg-slate-800 p-4">
//       <h2 className="text-white">Owner</h2>
//       {users?.map(({ name, id, avatar, owner, collectionName }) => {
//         if (!owner) return null;
//         const userAvatarUrl = avatar
//           ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${collectionName}/${id}/${avatar}`
//           : "/defaultAvatar.webp";
//         return (
//           <div className="flex items-center gap-4" key={id}>
//             <Image
//               src={userAvatarUrl}
//               alt=""
//               width={40}
//               height={40}
//               className="rounded-full"
//             />
//             <span className="text-lg text-white">{name}</span>
//           </div>
//         );
//       })}

//       {users && users?.length > 1 && <h2 className="text-white">Users</h2>}
//       {users?.map(({ name, id, avatar, owner, collectionName }) => {
//         if (owner) return null;
//         const userAvatarUrl = avatar
//           ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${collectionName}/${id}/${avatar}`
//           : "/defaultAvatar.webp";
//         return (
//           <div className="flex items-center gap-4" key={id}>
//             <Image
//               src={userAvatarUrl}
//               alt=""
//               width={40}
//               height={40}
//               className="rounded-full"
//             />
//             <span className="text-lg text-white">{name}</span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
}