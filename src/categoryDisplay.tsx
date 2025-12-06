import { ChevronDown } from "lucide-react";
import { memo, useEffect, useState, useCallback, useMemo } from "react";
import render from "./render";
import type { ICategory, ICategoryInfo, IEmoji } from "./types";
import { useSearchValue, useSkin } from "./hooks";

const Emoji = memo(function Emoji({
  pickerId,
  emoji,
  onEmojiMouseEnter,
  onEmojiMouseLeave,
  onEmojiSelect,
}: {
  pickerId: string;
  emoji: IEmoji;
  onEmojiMouseEnter: (emoji: IEmoji) => void;
  onEmojiMouseLeave: (emoji: IEmoji) => void;
  onEmojiSelect: (emoji: IEmoji) => void;
}) {
  const handleMouseEnter = useCallback(() => {
    window["emojipicker-" + pickerId].changeFooterEmoji(emoji);
    window["emojipicker-" + pickerId].changeSearchbarPlaceholder(emoji.name);
    onEmojiMouseEnter(emoji);
  }, [pickerId, emoji, onEmojiMouseEnter]);
  const handleMouseLeave = useCallback(() => {
    onEmojiMouseLeave(emoji);
  }, [emoji, onEmojiMouseLeave]);
  const handleClick = useCallback(() => {
    onEmojiSelect(emoji);
  }, [emoji, onEmojiSelect]);
  const html = useMemo(() => render(emoji.char), [emoji.char]);
  return (
    <div
      tabIndex={-1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="HOKKIEMOJIPICKER-emoji text-4xl p-1 cursor-pointer hover:bg-white/15 focus:bg-white/20 rounded-sm size-12.5 flex items-center justify-center overflow-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
const SkinEmoji = memo(function SkinEmoji({
  pickerId,
  emoji,
  onEmojiSelect,
  onEmojiMouseEnter,
  onEmojiMouseLeave,
}: {
  pickerId: string;
  emoji: IEmoji;
  onEmojiSelect: (emoji: IEmoji) => void;
  onEmojiMouseEnter: (emoji: IEmoji) => void;
  onEmojiMouseLeave: (emoji: IEmoji) => void;
}) {
  const skin = useSkin({ pickerId });
  const fakeEmoji: IEmoji = useMemo(() => {
    const charForSkin = [1, 2, 3, 4, 5].includes(skin)
      ? emoji.tones.find((a) => a.tone.find((b) => b === skin) === skin)?.char
      : emoji.char;
    return {
      ...emoji,
      char: charForSkin,
      preRendered: true,
      tones: [
        {
          name: emoji.tones[0].name.replaceAll("1", "0"),
          tone: [0],
          char: emoji.char,
        },
        ...emoji.tones,
      ],
    };
  }, [emoji, skin]);
  const handleMouseEnter = useCallback(() => {
    window["emojipicker-" + pickerId].changeFooterEmoji(fakeEmoji);
    window["emojipicker-" + pickerId].changeSearchbarPlaceholder(emoji.name);
    onEmojiMouseEnter(fakeEmoji);
  }, [pickerId, fakeEmoji, emoji.name, onEmojiMouseEnter]);
  const handleMouseLeave = useCallback(() => {
    onEmojiMouseLeave(fakeEmoji);
  }, [fakeEmoji, onEmojiMouseLeave]);
  const handleClick = useCallback(() => {
    onEmojiSelect(fakeEmoji);
  }, [fakeEmoji, onEmojiSelect]);
  const html = useMemo(() => render(fakeEmoji.char), [fakeEmoji.char]);
  return (
    <div
      tabIndex={-1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="HOKKIEMOJIPICKER-skinemoji text-4xl p-1 cursor-pointer hover:bg-white/15 focus:bg-white/20 rounded-sm size-12.5 flex items-center justify-center overflow-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

const CategoryDisplay = memo(function CategoryDisplay({
  category,
  categoryInfo,
  isToneSelectorEnabled,
  onEmojiSelect,
  onEmojiMouseEnter,
  onEmojiMouseLeave,
  pickerId,
}: {
  category: ICategory;
  categoryInfo: ICategoryInfo;
  isToneSelectorEnabled: boolean;
  onEmojiSelect: (emoji: IEmoji) => void;
  onEmojiMouseEnter: (emoji: IEmoji) => void;
  onEmojiMouseLeave: (emoji: IEmoji) => void;
  pickerId: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const searchValue = useSearchValue({ pickerId });
  useEffect(() => {
    setIsOpen(
      (localStorage.getItem(
        "hokkiemojipicker-category-" + category.name + "-open"
      ) || "true") === "true"
    );
  }, [category.name]);

  const searchLower = useMemo(
    () => (searchValue || "").toLowerCase().replace(/_/g, " "),
    [searchValue]
  );

  const filteredEmojis = useMemo(() => {
    if (!searchLower) return null;
    return category.emojis.filter((emoji) =>
      emoji.name.toLowerCase().replace(/_/g, " ").includes(searchLower)
    );
  }, [category.emojis, searchLower]);

  if (searchLower) {
    if (category.name === "recentlyUsed")
      return <div className="h-1.5 w-full"></div>;
    return (
      <>
        {filteredEmojis!.map((emoji: IEmoji) => {
          if (emoji.hasTone && !emoji.preRendered) {
            return (
              <SkinEmoji
                onEmojiSelect={onEmojiSelect}
                pickerId={pickerId}
                onEmojiMouseEnter={onEmojiMouseEnter}
                onEmojiMouseLeave={onEmojiMouseLeave}
                emoji={emoji}
                key={emoji.name}
              />
            );
          }
          return (
            <Emoji
              onEmojiSelect={onEmojiSelect}
              pickerId={pickerId}
              emoji={emoji}
              onEmojiMouseEnter={onEmojiMouseEnter}
              onEmojiMouseLeave={onEmojiMouseLeave}
              key={emoji.name}
            />
          );
        })}
      </>
    );
  }
  return (
    <div className="HOKKIEMOJIPICKER-categorydisplay flex flex-col relative w-full pt-2">
      <div
        className={
          "HOKKIEMOJIPICKER-categoryHeader sticky top-0 pt-2 cursor-pointer text-white px-2 flex bg-[#131416] p-1 pb-2 " +
          category.name
        }
        onClick={() => {
          const newOpen = !isOpen;
          setIsOpen(newOpen);
          localStorage.setItem(
            "hokkiemojipicker-category-" + category.name + "-open",
            newOpen ? "true" : "false"
          );
        }}
      >
        <span className="flex gap-1.5 items-center opacity-75 hover:opacity-100">
          <span className="*:size-4.5">{categoryInfo.icon}</span>{" "}
          <span className="text-md font-semibold font-gg">
            {categoryInfo.name}
          </span>
          <ChevronDown
            strokeWidth={2}
            className="transition-all size-5 data-[open=false]:-rotate-90"
            data-open={isOpen ? "true" : "false"}
          />
        </span>
      </div>

      {isOpen && (
        <div className="flex flex-wrap gap-y-0.5">
          {category.emojis.map((emoji: IEmoji) => {
            if (emoji.hasTone && !emoji.preRendered && isToneSelectorEnabled) {
              return (
                <SkinEmoji
                  onEmojiSelect={onEmojiSelect}
                  pickerId={pickerId}
                  emoji={emoji}
                  onEmojiMouseEnter={onEmojiMouseEnter}
                  onEmojiMouseLeave={onEmojiMouseLeave}
                  key={emoji.name}
                />
              );
            }
            return (
              <Emoji
                onEmojiSelect={onEmojiSelect}
                pickerId={pickerId}
                onEmojiMouseEnter={onEmojiMouseEnter}
                onEmojiMouseLeave={onEmojiMouseLeave}
                emoji={emoji}
                key={emoji.name}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

export default CategoryDisplay;
