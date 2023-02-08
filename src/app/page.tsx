import ServerList from "./ServerList";

export default async function Home() {
  return (
    <main className="flex h-full">
      <ServerList />
      <div className="flex grow bg-slate-700"></div>
    </main>
  );
}
