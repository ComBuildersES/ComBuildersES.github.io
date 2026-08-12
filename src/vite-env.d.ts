/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ote-events": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        feed?: string;
        limit?: string;
        layout?: "list" | "cards" | "calendar";
        fields?: string;
        theme?: "auto" | "light" | "dark";
        lang?: "auto" | "en" | "es";
        "show-past"?: "true" | "false";
        "group-events"?: "series" | "multipart" | "series,multipart";
      };
    }
  }
}
