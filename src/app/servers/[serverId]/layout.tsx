import dynamic from "next/dynamic";
import ServerList from "../../ServerList";
const ServerUsers = dynamic(() => import("./ServerUsers"), { ssr: false });

export default function ServersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  return (
    <main className="flex h-full">
      <ServerList />
      <div className="flex grow bg-slate-700">{children}</div>
      <ServerUsers id={params.serverId} />
    </main>
  );
}
