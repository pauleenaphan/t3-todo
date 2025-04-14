import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { Todopage } from "./_components/todo";

export default async function Home() {


  return (
    <main>
      <Todopage/>
    </main>
  );
}
