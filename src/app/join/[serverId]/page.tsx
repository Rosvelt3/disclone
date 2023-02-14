import JoinServerCard from "./JoinServerCard";

export default function JoinServerPage({
  params,
}: {
  params: { serverId: string };
}) {
  return <JoinServerCard serverId={params.serverId} />;
}
