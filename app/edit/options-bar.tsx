import { type machine } from "@/lib/machine";
import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import ModeButton from "./ModeButton";

export default function OptionsBar({
  actor,
}: {
  actor: ActorRefFrom<typeof machine>;
}) {
  const context = useSelector(actor, (snapshot) => snapshot.context);
  return (
    <div className="flex">
      <ModeButton
        mode="color"
        onClick={() => actor.send({ type: "mode.update", value: "color" })}
        currentMode={context.mode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
      </ModeButton>
      <ModeButton
        mode="picker"
        onClick={() => actor.send({ type: "mode.update", value: "picker" })}
        currentMode={context.mode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m2 22 1-1h3l9-9" />
          <path d="M3 21v-3l9-9" />
          <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
        </svg>
      </ModeButton>
      <ModeButton
        mode="erase"
        onClick={() => actor.send({ type: "mode.update", value: "erase" })}
        currentMode={context.mode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
          <path d="M22 21H7" />
          <path d="m5 11 9 9" />
        </svg>
      </ModeButton>
      <ModeButton
        mode="fill"
        onClick={() => actor.send({ type: "mode.update", value: "fill" })}
        currentMode={context.mode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
          <path d="m5 2 5 5" />
          <path d="M2 13h15" />
          <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
        </svg>
      </ModeButton>
      <ModeButton
        mode="swap-color"
        onClick={() => actor.send({ type: "mode.update", value: "swap-color" })}
        currentMode={context.mode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M14 4c0-1.1.9-2 2-2" />
          <path d="M20 2c1.1 0 2 .9 2 2" />
          <path d="M22 8c0 1.1-.9 2-2 2" />
          <path d="M16 10c-1.1 0-2-.9-2-2" />
          <path d="m3 7 3 3 3-3" />
          <path d="M6 10V5c0-1.7 1.3-3 3-3h1" />
          <rect width="8" height="8" x="2" y="14" rx="2" />
        </svg>
      </ModeButton>
    </div>
  );
}
