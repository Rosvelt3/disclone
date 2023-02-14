"use client";

import { useEffect } from "react";

const allowContextMenuElements = ["input"];

export default function ContextMenuBlocker({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.addEventListener("contextmenu", (event: any) => {
      for (const selector of allowContextMenuElements) {
        if (event.target?.matches(selector)) {
          return;
        }
      }
      event.preventDefault();
    });
    return () => {
      document.removeEventListener("contextmenu", (event: any) => {
        for (const selector of allowContextMenuElements) {
          if (event.target?.matches(selector)) {
            return;
          }
        }
        event.preventDefault();
      });
    };
  }, []);

  return <>{children}</>;
}
