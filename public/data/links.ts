export interface LinkItem {
  label: string;
  href: string;
  icon?: string; // Опционально, если в будущем потребуются иконки
}

// Навигационные ссылки для хедера
export const navLinks: LinkItem[] = [
  { label: "Обзор", href: "/" },
  { label: "Помощь", href: "/faq" },
  { label: "Правила", href: "/rules" },
  { label: "Магазин", href: "/shop" },
];

// Социальные ссылки для футера
export const socialLinks: LinkItem[] = [
  { label: "Discord", href: "https://discord.gg/arc-craft-mc" },
  { label: "VK", href: "https://vk.com/arc-craft-mc" },
  { label: "Telegram", href: "https://t.me/arc-craft-mc" },
  { label: "YouTube", href: "https://youtube.com/@arc-craft-mc" },
];
