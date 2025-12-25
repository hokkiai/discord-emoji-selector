import tw from "@twemoji/api";

export default function render(txt: string) {
  let twemojiparsed = tw
    .parse(txt)
    .replaceAll("<img", '<img style="object-fit: cover;" loading="lazy"');

  if (txt.startsWith("<:") || txt.startsWith("<a:")) {
    const id = txt.split(":")[2].split(">")[0];
    const isAnimated = txt.startsWith("<a:");
    const url = `https://cdn.discordapp.com/emojis/${id}.${
      isAnimated ? "gif" : "webp"
    }`;
    twemojiparsed = `<img style="object-fit: cover;" src="${url}" loading="lazy" />`;
  }

  return twemojiparsed;
}
