import ServerList from "@/app/ServerList";
import ChannelList from "./ChannelList";
import ServerUsers from "./ServerUsers";

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
      <ChannelList serverId={params.serverId}/>
      <div className="flex grow bg-slate-600">{children}</div>
      <ServerUsers serverId={params.serverId} />
    </main>
  );
}
