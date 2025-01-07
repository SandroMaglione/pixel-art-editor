"use client";

import { StorageSchemaData } from "@/lib/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";
import InputButton from "./InputButton";
import InputText from "./InputText";
import type { pipe, Effect } from "effect";

export default function Page(): ReactElement {
  const [filename, setFilename] = useState("");
  const [fileList, setFileList] = useState<StorageSchemaData>({});
  const isValidFilename = filename.length > 0;
  const router = useRouter();

  const onNew = () => {
    if (isValidFilename) {
      const findName = fileList[filename];
      const canCreate =
        !findName || confirm(`Overwrite file with name ${filename}?`);

      if (canCreate) {
        pipe(newFile(filename), Effect.runSync);
        router.push(`/edit/${filename}`);
      }
    }
  };

  useEffect(() => {
    const loadFileList = pipe(getFileList, Effect.runSync);
    setFileList(loadFileList);
  }, []);

  return (
    <div className="p-4">
      <form
        className="flex flex-col gap-y-1"
        onSubmit={(e) => {
          e.preventDefault();
          onNew();
        }}
      >
        <InputText
          value={filename}
          onChange={(file) => setFilename(file.replace(/ /g, "-"))}
          placeholder="New filename"
        />
        <InputButton disabled={!isValidFilename}>Create new</InputButton>
      </form>

      <div className="mt-6">
        {Object.entries(fileList).map(([, file]) => (
          <Link key={file.name} href={`/edit/${file.name}`}>
            <div className="border rounded-md border-gray-200 p-4">
              <p className="text-xl font-light">{file.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
