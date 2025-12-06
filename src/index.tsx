import { lazy, Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import SearchBar from "./searchbar";
import type { ICategory, ICategoryInfo, IEmoji } from "./types";
import Footer from "./footer";
import SidebarCategory from "./sidebarCategory";
import SkinSelector from "./skinselector";
import render from "./render";
import "./styles.css";
import { cn } from "./cn";
import rawemojisData from "./emojilib.json";

const CategoryDisplay = lazy(() => import("./categoryDisplay"));

export default function EmojiSelector({
  categories = {},
  customEmojis = {},
  className = "",
  onEmojiSelect = () => {},
  onEmojiMouseEnter = () => {},
  onEmojiMouseLeave = () => {},
  showFooter = true,
  showNav = true,
  showSidebar = true,
  toneSelector = true,
  searchPlaceholder = "Find the perfect emoji",
  height = 500,
  width = 520,
}: {
  categories?: {
    recentlyUsed?: ICategoryInfo;
    people?: ICategoryInfo;
    nature?: ICategoryInfo;
    food?: ICategoryInfo;
    activities?: ICategoryInfo;
    travel?: ICategoryInfo;
    objects?: ICategoryInfo;
    symbols?: ICategoryInfo;
    flags?: ICategoryInfo;
  };
  toneSelector?: boolean;
  className?: string;
  customEmojis?: {
    serverName?: string;
    serverIconURL?: string;
    emojis?: string[];
  };
  searchPlaceholder?: string;
  height?: number;
  onEmojiSelect?: (emoji: IEmoji) => void;
  onEmojiMouseEnter?: (emoji: IEmoji) => void;
  onEmojiMouseLeave?: (emoji: IEmoji) => void;
  showFooter?: boolean;
  showNav?: boolean;
  showSidebar?: boolean;
  width?: number;
}) {
  // NOTE: No usestates should be used here as it would cause a BUNCH of lag.
  // This has to be the fastest as possible.

  const recentlyUsed = useMemo(
    () =>
      JSON.parse(
        (localStorage || { getItem: (a) => "[]" }).getItem(
          "hokkiemojipicker-recentlyused"
        ) || "[]"
      ),
    []
  );
  const categoryData = {
    recentlyUsed:
      recentlyUsed.length > 0
        ? {
            name: "Recently Used",
            icon: (
              <svg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1-18a1 1 0 1 0-2 0v7c0 .27.1.52.3.7l3 3a1 1 0 0 0 1.4-1.4L13 11.58V5Z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            ),
          }
        : false,
    customServerIcons:
      (customEmojis.emojis || []).length > 0
        ? {
            name: customEmojis.serverName,
            icon: (
              <div className="relative rounded-full overflow-hidden">
                <img
                  src={customEmojis.serverIconURL}
                  className="w-full h-full object-cover"
                />
              </div>
            ),
          }
        : false,
    separator: true,
    people: {
      name: "People",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
      ...categories.people,
    },
    nature: {
      name: "Nature",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M9.8 14.6c-.45.31-.9.6-1.37.89l-.02.01-1.15.73c-.85.57-1.68 1.2-2.4 2.1a7.75 7.75 0 0 0-.7 1.03c-.39.69-.7 1.48-.94 2.42a1 1 0 0 0 1.94.49c.12-.49.26-.9.42-1.28 1.98.08 9.05-.04 12.73-5.34 3.5-5.02 2.89-10.16 2.01-13.89-.19-.81-1.26-1-1.85-.42-1.8 1.8-3.69 2.32-5.67 2.86-2.34.63-4.8 1.3-7.35 4.15a9.13 9.13 0 0 0-2.13 8.7c.9-1.11 1.92-1.88 2.84-2.48.4-.28.8-.53 1.18-.76a13.7 13.7 0 0 0 3.55-2.83 1 1 0 1 1 1.52 1.3A13.44 13.44 0 0 1 9.8 14.6Z"
          ></path>
        </svg>
      ),
      ...categories.nature,
    },
    food: {
      name: "Food",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 1a1 1 0 0 0-1 1v.2c0 .79-.4 1.53-1.05 1.97A4.37 4.37 0 0 0 3 7.8V8a1 1 0 0 0 2 0v-.2c0-.79.4-1.53 1.05-1.97A4.37 4.37 0 0 0 8 2.2V2a1 1 0 0 0-1-1ZM10 3a1 1 0 1 1 2 0v.42a3.2 3.2 0 0 1-2.18 3.03A1.2 1.2 0 0 0 9 7.58V8a1 1 0 0 1-2 0v-.42c0-1.37.88-2.6 2.18-3.03.5-.16.82-.62.82-1.13V3ZM2 11a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1 10 10 0 0 1-4.7 8.49.6.6 0 0 0-.3.51 2 2 0 0 1-2 2H9a2 2 0 0 1-2-2 .6.6 0 0 0-.3-.51A10 10 0 0 1 2 11ZM20.85 8.02c.16.52-.3.98-.85.98h-8c-.55 0-1.01-.46-.85-.98a4.07 4.07 0 0 1 1.31-1.84 5.23 5.23 0 0 1 1.63-.88 6.1 6.1 0 0 1 3.82 0c.61.2 1.16.5 1.63.87a4.07 4.07 0 0 1 1.3 1.85Z"
          ></path>
        </svg>
      ),
      ...categories.food,
    },
    activities: {
      name: "Activities",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3 1.24.75 3.7.75 7.09v4.91a3.09 3.09 0 0 1-5.85 1.38l-1.76-3.51a1.09 1.09 0 0 0-1.23-.55c-.57.13-1.36.27-2.16.27s-1.6-.14-2.16-.27c-.49-.11-1 .1-1.23.55l-1.76 3.51A3.09 3.09 0 0 1 1 17.91V13c0-3.38.46-5.85.75-7.1.15-.6.49-1.13 1.04-1.4a.47.47 0 0 0 .24-.44c0-.7.48-1.32 1.2-1.47l2.93-.62c.5-.1 1 .06 1.36.4.35.34.78.71 1.28.68a42.4 42.4 0 0 1 4.4 0c.5.03.93-.34 1.28-.69.35-.33.86-.5 1.36-.39l2.94.62c.7.15 1.19.78 1.19 1.47ZM20 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 7a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2H7v1a1 1 0 1 1-2 0v-1H4a1 1 0 1 1 0-2h1V7Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
      ...categories.activities,
    },
    travel: {
      name: "Travel",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M15 4a1 1 0 0 0-.95 1.32l.9 2.68h-4.6l-.92-2.36A1 1 0 0 0 8.5 5H5a1 1 0 0 0 0 2h2.82l.5 1.27a1 1 0 0 0-.2.26L6.7 11.16a4.5 4.5 0 1 0 1.76.95l.78-1.45 1.83 4.7a1 1 0 1 0 1.86-.72L11.13 10h4.48l.55 1.65a4.5 4.5 0 1 0 1.9-.63L16.4 6h1.86c.41 0 .75.34.75.75V7a1 1 0 1 0 2 0v-.25A2.75 2.75 0 0 0 18.25 4H15Zm-9.3 9-1.08 2.03a1 1 0 0 0 1.76.94l1.09-2.01A2.5 2.5 0 1 1 5.7 13Zm11.13.64.72 2.18a1 1 0 0 0 1.9-.64l-.73-2.17a2.5 2.5 0 1 1-1.9.63Z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
      ...categories.travel,
    },
    objects: {
      name: "Objects",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10.41 3.59 11.6 2.4a2 2 0 0 1 2.82 0l1.3 1.3a1 1 0 0 0 .7.29h4.18a1.41 1.41 0 0 1 1 2.41L14.4 13.6a1.41 1.41 0 0 1-2.41-1V8.4l-3.11 3.12a2 2 0 0 0-.53 1.87L9.9 20H15a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h4.86L6.4 13.86a4 4 0 0 1 1.06-3.75L10.8 6.8l-.38-.38a2 2 0 0 1 0-2.82Z"
          ></path>
          <path
            fill="currentColor"
            d="M16.99 12.43c-.21.2-.2.55.06.7a3 3 0 0 0 4.08-4.08c-.15-.26-.5-.27-.7-.06l-3.44 3.44Z"
          ></path>
        </svg>
      ),
      ...categories.objects,
    },
    symbols: {
      name: "Symbols",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12.47 21.73a.92.92 0 0 1-.94 0C9.43 20.48 1 15.09 1 8.75A5.75 5.75 0 0 1 6.75 3c2.34 0 3.88.9 5.25 2.26A6.98 6.98 0 0 1 17.25 3 5.75 5.75 0 0 1 23 8.75c0 6.34-8.42 11.73-10.53 12.98Z"
          ></path>
        </svg>
      ),
      ...categories.symbols,
    },
    flags: {
      name: "Flags",
      icon: (
        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 1a1 1 0 0 1 1 1v.82l8.67-1.45A2 2 0 0 1 15 3.35v1.47l5.67-.95A2 2 0 0 1 23 5.85v7.3a2 2 0 0 1-1.67 1.98l-9 1.5a2 2 0 0 1-1.78-.6c-.2-.21-.08-.54.18-.68a5.01 5.01 0 0 0 1.94-1.94c.18-.32-.1-.66-.46-.6L4 14.18V21a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1Z"
          ></path>
        </svg>
      ),
      ...categories.flags,
    },
  };

  const emojis = useMemo(() => {
    return [
      recentlyUsed.length > 0
        ? {
            name: "recentlyUsed",
            emojis: recentlyUsed,
          }
        : undefined,
      (customEmojis?.emojis || []).length > 0
        ? {
            name: "customServerIcons",
            emojis: customEmojis.emojis.map((a) => {
              return { name: a.split(":")[1].split(":")[0], char: a };
            }),
          }
        : undefined,
      ...rawemojisData,
    ].filter((a) => a !== undefined);
  }, [recentlyUsed, customEmojis]);

  const navHeight = showNav ? Math.floor(height / 7) : 0;
  const id = useMemo(() => Math.random().toString(36).substring(2, 15), []);
  const picker = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    el.scrollTo({ top: el.scrollTop + e.deltaY, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className="HOKKIEMOJIPICKER-emojiContainer">
      <div
        ref={picker}
        id={"emojipicker-" + id}
        className={cn(
          "HOKKIEMOJIPICKER-emojiSelector overflow-hidden flex flex-col rounded-xl border-1 bg-[#131416] border-[#363639]/10",
          className
        )}
        style={{
          height: height,
          maxHeight: height,
          minHeight: height,

          width: width,
          maxWidth: width,
          minWidth: width,
        }}
      >
        {showNav && (
          <div
            className="HOKKIEMOJIPICKER-nav flex items-center gap-4 p-3 relative z-50"
            style={{
              height: navHeight,
              maxHeight: navHeight,
              minHeight: navHeight,
            }}
          >
            <SearchBar id={id} searchPlaceholder={searchPlaceholder} />
            {toneSelector && <SkinSelector id={id} />}
          </div>
        )}
        <div className="flex h-full">
          {showSidebar && (
            <div className="HOKKIEMOJIPICKER-sidebar rounded-t-md bg-[#070709]  flex p-2 gap-1 flex-col">
              {Object.keys(categoryData)
                .filter((categoryName) => categoryData[categoryName] !== false)
                .map((categoryName) => {
                  const category = categoryData[categoryName];
                  if (category === true) {
                    return <div className="w-full h-0 border-b-1 my-2" />;
                  }
                  const icon = category.icon;
                  return (
                    <SidebarCategory
                      id={id}
                      key={categoryName}
                      picker={picker}
                      categoryName={categoryName}
                      icon={icon}
                    />
                  );
                })}
              <div className="h-24" />
            </div>
          )}

          <div
            style={{
              height: height - navHeight,
              maxHeight: height - navHeight,
              minHeight: height - navHeight,
            }}
            className="HOKKIEMOJIPICKER-emojidisplaycontainer overflow-hidden flex flex-col w-full"
          >
            <div
              ref={scrollRef}
              style={{
                flexBasis: "fit-content",
              }}
              className="HOKKIEMOJIPICKER-emojidisplay overflow-y-scroll bg-[#131416] h-full w-full flex flex-wrap px-2 items-start justfy-start justify-self-start gap-y-0.5"
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center mt-2">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin size-8 border-2 border-white/20 border-t-white/80 rounded-full"></div>
                    </div>
                  </div>
                }
              >
                {emojis.map((category: ICategory) => {
                  if (!category) return;
                  const categoryInfo: ICategoryInfo =
                    categoryData[category.name];
                  return (
                    <CategoryDisplay
                      onEmojiMouseEnter={onEmojiMouseEnter}
                      onEmojiMouseLeave={onEmojiMouseLeave}
                      isToneSelectorEnabled={toneSelector}
                      onEmojiSelect={(a) => {
                        onEmojiSelect(a);
                        if (a.char.startsWith("<")) return;
                        let newRecentlyUsed = JSON.parse(
                          localStorage.getItem(
                            "hokkiemojipicker-recentlyused"
                          ) || "[]"
                        );
                        newRecentlyUsed = newRecentlyUsed.filter(
                          (b: IEmoji) => b.char !== a.char
                        );
                        newRecentlyUsed.push(a);
                        newRecentlyUsed = newRecentlyUsed.slice(0, 20);
                        localStorage.setItem(
                          "hokkiemojipicker-recentlyused",
                          JSON.stringify(newRecentlyUsed)
                        );
                      }}
                      key={category.name}
                      category={category}
                      pickerId={id}
                      categoryInfo={categoryInfo}
                    />
                  );
                })}
              </Suspense>
            </div>
            {showFooter && <Footer id={id} firstEmoji={emojis[0].emojis[0]} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export { render };
