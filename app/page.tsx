"use client";

import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import InputButton from "./InputButton";
import InputText from "./InputText";

export default function Page() {
  const router = useRouter();
  const files = useLiveQuery(() => db.file.toArray());
  const [_, action, pending] = useActionState(
    async (_: null, formData: FormData) => {
      const filename = formData.get("filename")?.toString() ?? "";
      await db.file.add({
        name: filename,
        cells: [],
        pixelHeight: 16,
        pixelWidth: 16,
      });
      router.push(`/edit?name=${filename}`);
      return null;
    },
    null
  );

  return (
    <div className="p-4">
      <form className="flex flex-col gap-y-1" action={action}>
        <InputText name="filename" placeholder="New filename" required />
        <InputButton disabled={pending}>Create new</InputButton>
      </form>

      <div className="mt-6">
        {(files ?? []).map((file) => (
          <Link key={file.name} href={`/edit?name=${file.name}`}>
            <div className="border rounded-md border-gray-200 p-4">
              <p className="text-xl font-light">{file.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
