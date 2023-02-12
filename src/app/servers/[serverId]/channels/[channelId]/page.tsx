import ChatBox from "./ChatBox";
import Messages from "./Messages";

export default function ChannelPage() {
  return (
    <div className="flex w-full flex-col overflow-y-scroll">
      <Messages />
      <ChatBox />
    </div>
  );
}
