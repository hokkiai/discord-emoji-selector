import { useEffect, useState } from "react";
import type { IEmoji } from "./types";
import render from "./render";
export default function Footer({
  id,
  firstEmoji,
}: {
  id: string;
  firstEmoji: IEmoji;
}) {
  const [footerEmoji, setFooterEmoji] = useState<IEmoji>(firstEmoji);
  useEffect(() => {
    window["emojipicker-" + id].changeFooterEmoji = (emoji: IEmoji) => {
      setFooterEmoji(emoji);
    };
  }, []);
  return (
    <div className="HOKKIEMOJIPICKER-footer relative mt-auto flex gap-2 items-center px-4 py-3 bg-[#070709]">
      <div
        style={
          {
            cssText: `
    left: 0;
    position: absolute;
    background-color: transparent;
    top: 0;
    width: 12px;
    height: 12px;
    transform: translateY(-100%);
    border-radius: 100%;
    box-shadow: -14px 14px 0px 10px #070709;`,
          } as any
        }
      />
      <div
        className="*:size-9 *:min-w-9 *:max-w-9"
        dangerouslySetInnerHTML={{ __html: render(footerEmoji.char) }}
      />
      <p className="text-lg whitespace-nowrap overflow-hidden text-ellipsis font-gg font-semibold">
        {(footerEmoji.name || "")
          .split(" ")
          .map((e) => `:${e || ""}:`)
          .join(" ")}
      </p>
    </div>
  );
}
