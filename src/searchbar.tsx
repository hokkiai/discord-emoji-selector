import { useEffect, useRef, useState } from "react";
import { MagniferLinear } from "./icons";

export default function SearchBar({
  searchPlaceholder,
  id,
}: {
  searchPlaceholder: string;
  id: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const [inputPlaceholder, setInputPlaceholder] =
    useState<string>(searchPlaceholder);
  useEffect(() => {
    window["emojipicker-" + id].changeSearchbarPlaceholder = (
      emoji: string
    ) => {
      setInputPlaceholder(emoji);
    };
    window["emojipicker-" + id].setSearchValue = (value: string) => {
      inputRef.current.value = value;
      window["emojipicker-" + id].searchValue = value;
    };
  }, []);
  return (
    <div
      data-focused={isFocused ? "true" : "false"}
      className="bg-white/5 items-center w-full border-1 border-[#323337] p-2 px-3 flex rounded-md data-[focused=true]:border-[#3687E9]"
    >
      <input
        ref={inputRef}
        onChange={(e) =>
          (window["emojipicker-" + id].searchValue = e.target.value)
        }
        className="!outline-0 text-lg w-full"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={inputPlaceholder}
      />
      <MagniferLinear className="size-5 opacity-50" />
    </div>
  );
}
