import "react-contexify/dist/ReactContexify.css";
import ContextMenuBlocker from "./ContextMenuBlocker";
import "./globals.css";
import ReactQueryWrapper from "./ReactQueryWrapper";
import RouteGuard from "./RouteGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="overflow-hidden">
        <RouteGuard>
          <ReactQueryWrapper><ContextMenuBlocker>{children}</ContextMenuBlocker></ReactQueryWrapper>
        </RouteGuard>
      </body>
    </html>
  );
}
