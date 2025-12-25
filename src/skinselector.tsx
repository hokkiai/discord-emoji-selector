import { useCallback, useEffect, useMemo, useState } from "react";
import render from "./render";

export default function SkinSelector({ id }: { id: string }) {
  const skins = useMemo(() => ["👏", "👏🏻", "👏🏼", "👏🏽", "👏🏾", "👏🏿"], []);
  const [selectedTone, setSelectedTone] = useState(() => {
    const cached = localStorage?.getItem("hokkiemojipicker-skin");
    return cached ? parseInt(cached, 10) : 0;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window["emojipicker-" + id].skin = selectedTone;
  }, [selectedTone, id]);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  const handleSkinSelect = useCallback((i: number) => {
    setOpen(false);
    setSelectedTone(i);
    try {
      localStorage?.setItem("hokkiemojipicker-skin", String(i));
    } catch (e) {}
  }, []);

  const renderedCurrentSkin = useMemo(
    () => render(skins[selectedTone] || ""),
    [skins, selectedTone]
  );

  const availableSkins = useMemo(
    () =>
      skins
        .map((skin, i) => (skin === skins[selectedTone] ? null : { skin, i }))
        .filter(Boolean),
    [skins, selectedTone]
  );

  return (
    <div className="relative mr-1">
      <div
        className="HOKKIEMOJIPICKER-skinselector-trigger opacity-75 hover:opacity-100 cursor-pointer *:size-7 *:min-w-7"
        onClick={toggleOpen}
        dangerouslySetInnerHTML={{ __html: renderedCurrentSkin }}
      />
      <div
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
        }}
        className="absolute flex transition-all flex-col cursor-pointer top-full translate-y-2 overflow-hidden -left-2 rounded-sm border-1 bg-neutral-900"
      >
        {availableSkins.map((item: any) => {
          const { skin, i } = item;
          return (
            <div
              key={i}
              className="HOKKIEMOJIPICKER-skinselector-skinoption *:size-7 *:min-w-7 hover:bg-white/5 p-2 transition-all"
              onClick={() => handleSkinSelect(i)}
              dangerouslySetInnerHTML={{
                __html: render(skin || ""),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
