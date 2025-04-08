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
    { label: "Discord", href: "/discord" },
    { label: "VK", href: "/vk" },
    { label: "Telegram", href: "/telegram" },
    { label: "YouTube", href: "/youtube" },
  ];