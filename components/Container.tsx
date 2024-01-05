import { JSX } from "preact";
import { Header } from "./Header.tsx";

export function Container(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class="">
      <Header />
      <div class="container mx-auto p-4">{props.children}</div>
    </div>
  );
}
