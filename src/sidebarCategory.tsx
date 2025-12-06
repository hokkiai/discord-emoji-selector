import { useEffect, useState } from "react";
import { useSearchValue } from "./hooks";

export default function SidebarCategory({
  categoryName,
  picker,
  icon,
  id,
}: {
  categoryName: string;
  picker: React.RefObject<HTMLDivElement>;
  icon: React.ReactNode;
  id: string;
}) {
  const searchValue = useSearchValue({ pickerId: id });
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if ((searchValue || "").length > 0) {
      setIsActive(false);
      return;
    }

    const elem = picker.current;
    const updateActive = () => {
      if (!elem) return;
      const header: any = elem.querySelector(
        ".HOKKIEMOJIPICKER-categoryHeader." + categoryName
      );
      if (!header) return;
      const categoryContainer: any = header.parentElement;
      const scrollElem: any = elem.querySelector(
        ".HOKKIEMOJIPICKER-emojidisplay"
      );
      if (!scrollElem) return;
      const containerRect = scrollElem.getBoundingClientRect();
      const categoryRect = categoryContainer.getBoundingClientRect();
      const headerHeight = header.offsetHeight;
      const categoryTop =
        categoryRect.top - containerRect.top + scrollElem.scrollTop;
      const categoryBottom = categoryTop + categoryContainer.offsetHeight;
      const sTop = scrollElem.scrollTop;
      const inView =
        sTop >= categoryTop - headerHeight &&
        sTop < categoryBottom - headerHeight;
      setIsActive(inView);
    };
    elem
      .querySelector(".HOKKIEMOJIPICKER-emojidisplay")
      .addEventListener("scroll", updateActive);
    updateActive();
    return () => {
      elem
        .querySelector(".HOKKIEMOJIPICKER-emojidisplay")
        .removeEventListener("scroll", updateActive);
    };
  }, [picker, searchValue]);
  return (
    <button
      onClick={() => {
        const elem = picker.current;
        if (!elem) return;
        const doScroll = () => {
          const header: any = elem.querySelector(
            ".HOKKIEMOJIPICKER-categoryHeader." + categoryName
          );
          if (!header) return;
          const categoryContainer: any = header.parentElement;
          const scrollElem: any = elem.querySelector(
            ".HOKKIEMOJIPICKER-emojidisplay"
          );
          if (!scrollElem) return;
          const containerRect = scrollElem.getBoundingClientRect();
          const categoryRect = categoryContainer.getBoundingClientRect();
          const headerHeight = header.offsetHeight;
          const targetTop =
            categoryRect.top -
            containerRect.top +
            scrollElem.scrollTop -
            headerHeight;
          scrollElem.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth",
          });
        };
        if ((searchValue || "").length > 0) {
          window["emojipicker-" + id].setSearchValue("");
          setTimeout(doScroll, 50);
        } else {
          doScroll();
        }
      }}
      data-active={isActive ? "true" : "false"}
      className="!outline-0 HOKKIEMOJIPICKER-sidebarButton cursor-pointer size-8 data-[active=true]:bg-white/5 hover:bg-white/10 overflow-hidden *:!size-6.5 transition-all hover:*:!opacity-85 data-[active=true]:*:!opacity-100 flex items-center justify-center rounded-sm *:opacity-50"
    >
      {icon}
    </button>
  );
}
