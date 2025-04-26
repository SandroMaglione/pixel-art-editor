import { useColorActor } from "@/lib/machine";
import { ColorPercentage } from "@/lib/schema";
import { useSelector } from "@xstate/react";
import ColorPickerBar from "./ColorPickerBar";

export default function ColorSelection() {
  const colorActor = useColorActor();
  const { color } = useSelector(colorActor, (snapshot) => snapshot.context);
  const colorPercentage = color.toPercentage;
  return (
    <>
      <div
        style={
          {
            "--hue": `${color.hue}deg`,
            "--sat": `${color.saturation}%`,
            "--lig": `${color.lightness}%`,
          } as React.CSSProperties
        }
        className="bg-[hsl(var(--hue),var(--sat),var(--lig))] w-full h-[16px] border-2 border-white mb-1"
      />

      <ColorPickerBar
        style={{
          background:
            "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 17, 0), rgb(255, 34, 0), rgb(255, 51, 0), rgb(255, 68, 0), rgb(255, 85, 0), rgb(255, 102, 0), rgb(255, 119, 0), rgb(255, 136, 0), rgb(255, 153, 0), rgb(255, 170, 0), rgb(255, 187, 0), rgb(255, 204, 0), rgb(255, 221, 0), rgb(255, 238, 0), rgb(255, 255, 0), rgb(238, 255, 0), rgb(221, 255, 0), rgb(204, 255, 0), rgb(187, 255, 0), rgb(170, 255, 0), rgb(153, 255, 0), rgb(136, 255, 0), rgb(119, 255, 0), rgb(102, 255, 0), rgb(85, 255, 0), rgb(68, 255, 0), rgb(51, 255, 0), rgb(34, 255, 0), rgb(17, 255, 0), rgb(0, 255, 0), rgb(0, 255, 17), rgb(0, 255, 34), rgb(0, 255, 51), rgb(0, 255, 68), rgb(0, 255, 85), rgb(0, 255, 102), rgb(0, 255, 119), rgb(0, 255, 136), rgb(0, 255, 153), rgb(0, 255, 170), rgb(0, 255, 187), rgb(0, 255, 204), rgb(0, 255, 221), rgb(0, 255, 238), rgb(0, 255, 255), rgb(0, 238, 255), rgb(0, 221, 255), rgb(0, 204, 255), rgb(0, 187, 255), rgb(0, 170, 255), rgb(0, 153, 255), rgb(0, 136, 255), rgb(0, 119, 255), rgb(0, 102, 255), rgb(0, 85, 255), rgb(0, 68, 255), rgb(0, 51, 255), rgb(0, 34, 255), rgb(0, 17, 255), rgb(0, 0, 255), rgb(17, 0, 255), rgb(34, 0, 255), rgb(51, 0, 255), rgb(68, 0, 255), rgb(85, 0, 255), rgb(102, 0, 255), rgb(119, 0, 255), rgb(136, 0, 255), rgb(153, 0, 255), rgb(170, 0, 255), rgb(187, 0, 255), rgb(204, 0, 255), rgb(221, 0, 255), rgb(238, 0, 255), rgb(255, 0, 255), rgb(255, 0, 238), rgb(255, 0, 221), rgb(255, 0, 204), rgb(255, 0, 187), rgb(255, 0, 170), rgb(255, 0, 153), rgb(255, 0, 136), rgb(255, 0, 119), rgb(255, 0, 102), rgb(255, 0, 85), rgb(255, 0, 68), rgb(255, 0, 51), rgb(255, 0, 34), rgb(255, 0, 17))",
        }}
        value={colorPercentage.hue}
        onValueChange={(value) =>
          colorActor.send({
            type: "update",
            value: new ColorPercentage({
              hue: value,
              saturation: colorPercentage.saturation,
              lightness: colorPercentage.lightness,
            }),
          })
        }
      />

      <ColorPickerBar
        style={
          {
            "--hue": `${color.hue}deg`,
            background:
              "linear-gradient(to right, hsl(var(--hue) 100% 50% / 0), hsl(var(--hue) 100% 50% / 1))",
          } as React.CSSProperties
        }
        value={colorPercentage.saturation}
        onValueChange={(value) =>
          colorActor.send({
            type: "update",
            value: new ColorPercentage({
              hue: colorPercentage.hue,
              saturation: value,
              lightness: colorPercentage.lightness,
            }),
          })
        }
      />

      <ColorPickerBar
        style={{
          background: "linear-gradient(to right, rgb(0,0,0), rgb(255,255,255))",
        }}
        value={colorPercentage.lightness}
        onValueChange={(value) =>
          colorActor.send({
            type: "update",
            value: new ColorPercentage({
              hue: colorPercentage.hue,
              saturation: colorPercentage.saturation,
              lightness: value,
            }),
          })
        }
      />
    </>
  );
}
