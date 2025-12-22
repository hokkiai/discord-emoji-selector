<div align="center">
  <br>Our <b>discord emoji selector</b> is a lightweight and powerful Discord-style emoji picker for React.<br>
  <br><a href="https://www.hokki.app/library-demos/discord-emoji-selector">Demo</a>
  <br><br><img width="420" alt="Discord Emoji Selector example output" src="https://github.com/hokkiai/discord-emoji-selector/blob/main/assets/image.png?raw=true">
  <br><br><a href="https://www.hokki.app"><img width="30" src="https://api.hokki.app/favicon.png"></a>
  <br>Brought to you by the <a href="https://www.hokki.app">HokkiAI</a> team
</div>
<br>
<br>
<br>

## Installation

```bash
npm install @hokkiai/discord-emoji-selector
```

## Usage

```tsx
import EmojiSelector from "@hokkiai/discord-emoji-selector";
import "@hokkiai/discord-emoji-selector/fix.css"; // fixes if you don't have tailwind installed.

export default function App() {
  return <EmojiSelector />;
}
```

## Props

### `categories`

Customize the title and icon of each category.

**Available categories:**
`recentlyUsed`, `people`, `nature`, `food`, `activities`, `travel`, `objects`, `symbols`, `flags`

You can set a `name` and `icon` for each category. The `icon` must be a React component.

**Example:**

```tsx
categories: {
  recentlyUsed: {
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
          fillRule="evenodd"
          d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1-18a1 1 0 1 0-2 0v7c0 .27.1.52.3.7l3 3a1 1 0 0 0 1.4-1.4L13 11.58V5Z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
  },
}
```

### `searchPlaceholder`

The placeholder text for the search bar.

### `customEmojis`

An object to add custom Discord server emojis:

- `serverName`: Name of the server.
- `serverIconURL`: URL of the server icon.
- `emojis`: Array of emojis in Discord custom emoji markdown format (`<:emoji:id>`). **Supports animated emojis.**

### `height` & `width`

Set the height and width of the emoji picker.

### `onEmojiSelect`

Function called when an emoji is selected. Receives an object with:

- `name`: Emoji name.
- `char`: Emoji character.

### `toneSelector`

Whether to show the tone selector. Defaults to `true`.

### `className`

Custom class name for the emoji picker.

### `onEmojiMouseEnter` & `onEmojiMouseLeave`

Functions called when the mouse enters or leaves an emoji.

### `showFooter`

Whether to show the footer.

### `showNav`

Whether to show the navigation bar.

### `showSidebar`

Whether to show the sidebar.
