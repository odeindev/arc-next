"use client";

// @/features/minecraft-link/ui/MinecraftLinkCard.tsx
// Используется внутри InfoCard в UserProfile.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, RefreshCw, Unlink } from "lucide-react";
import { cn } from "@/components/shared/lib/utils";

interface MinecraftLinkCardProps {
  /** Уже привязанный никнейм, если есть */
  linkedUsername?: string | null;
  className?: string;
}

type CardState = "idle" | "loading" | "code_shown" | "success" | "error";

export const MinecraftLinkCard: React.FC<MinecraftLinkCardProps> = ({
  linkedUsername,
  className,
}) => {
  const [state, setState] = useState<CardState>("idle");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLinked, setIsLinked] = useState(!!linkedUsername);
  const [currentUsername, setCurrentUsername] = useState(
    linkedUsername ?? null,
  );

  // Запрашиваем код у API
  const handleGenerateCode = async () => {
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/link/generate", { method: "POST" });
      if (!res.ok) throw new Error("Ошибка сервера");
      const data = await res.json();
      setCode(data.code);
      setState("code_shown");
    } catch {
      setErrorMsg("Не удалось получить код. Попробуй ещё раз.");
      setState("error");
    }
  };

  // Копируем команду в буфер
  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(`/link ${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Отвязка аккаунта (заглушка — реализуешь эндпоинт позже)
  const handleUnlink = async () => {
    try {
      const res = await fetch("/api/link/unlink", { method: "POST" });
      if (!res.ok) throw new Error();
      setIsLinked(false);
      setCurrentUsername(null);
      setState("idle");
    } catch {
      setErrorMsg("Не удалось отвязать аккаунт.");
      setState("error");
    }
  };

  // --- Состояние: аккаунт уже привязан ---
  if (isLinked && currentUsername) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="flex items-center gap-3 bg-slate-800/60 rounded-lg px-4 py-3 border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 leading-none mb-1">
              Привязан никнейм
            </p>
            <p className="text-white font-semibold truncate">
              {currentUsername}
            </p>
          </div>
          <button
            onClick={handleUnlink}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors shrink-0 ml-2"
          >
            <Unlink size={14} />
            Отвязать
          </button>
        </div>

        {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
      </div>
    );
  }

  // --- Состояние: ошибка ---
  if (state === "error") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <p className="text-sm text-red-400">{errorMsg}</p>
        <button
          onClick={() => setState("idle")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} /> Попробовать снова
        </button>
      </div>
    );
  }

  // --- Состояние: код сгенерирован ---
  if (state === "code_shown" && code) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="code"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("flex flex-col gap-4", className)}
        >
          {/* Инструкция */}
          <p className="text-sm text-gray-400 leading-relaxed">
            Введи команду в игре в течение{" "}
            <span className="text-white font-medium">10 минут</span>:
          </p>

          {/* Код-команда */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-900 rounded-lg px-4 py-3 text-lg tracking-widest text-blue-300 border border-slate-600 select-all">
              /link {code}
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "p-3 rounded-lg border transition-all",
                copied
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-slate-800 border-slate-600 text-gray-400 hover:text-white hover:border-slate-400",
              )}
              title="Скопировать"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {/* Прогресс-бар 10 минут */}
          <CodeTimer
            durationMs={10 * 60 * 1000}
            onExpire={() => setState("idle")}
          />

          <button
            onClick={handleGenerateCode}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors w-fit"
          >
            <RefreshCw size={12} /> Сгенерировать новый код
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // --- Состояние: idle / loading ---
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-sm text-gray-400 leading-relaxed">
        Привяжи свой Minecraft-аккаунт, чтобы донат выдавался автоматически.
      </p>

      <motion.button
        onClick={handleGenerateCode}
        disabled={state === "loading"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium text-sm transition-all",
          state === "loading"
            ? "bg-slate-700 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30",
        )}
      >
        {state === "loading" ? (
          <>
            <RefreshCw size={15} className="animate-spin" />
            Генерация кода...
          </>
        ) : (
          <>
            <Link2 size={15} />
            Получить код привязки
          </>
        )}
      </motion.button>
    </div>
  );
};

// --- Вспомогательный компонент: таймер ---
interface CodeTimerProps {
  durationMs: number;
  onExpire: () => void;
}

const CodeTimer: React.FC<CodeTimerProps> = ({ durationMs, onExpire }) => {
  const [remaining, setRemaining] = React.useState(durationMs);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onExpire]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const progress = remaining / durationMs;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Код действителен</span>
        <span
          className={cn("", progress < 0.2 ? "text-red-400" : "text-gray-400")}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            progress < 0.2 ? "bg-red-500" : "bg-blue-500",
          )}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </div>
    </div>
  );
};
