import { useEffect, useState } from "react";

export function useSkin({ pickerId }: { pickerId: string }) {
  const [skin, setSkin] = useState(0);
  useEffect(() => {
    let raf: number;
    const loop = () => {
      const newSkin = window["emojipicker-" + pickerId]?.skin;
      setSkin(newSkin || 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [pickerId]);

  return skin;
}

export function useSearchValue({ pickerId }: { pickerId: string }) {
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    let raf: number;
    const loop = () => {
      const newSearchValue =
        window["emojipicker-" + pickerId]?.searchValue || "";
      setSearchValue(newSearchValue);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [pickerId]);

  return searchValue;
}
