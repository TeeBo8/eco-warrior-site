"use client";

import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { SendIcon, LoaderIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/animated-ai-chat";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";

// Composant pour les dots d'animation de typing
function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-foreground rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
          style={{
            boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)"
          }}
        />
      ))}
    </div>
  );
}

// Un composant moderne pour afficher les messages
function ChatMessage({ role, content }: { role: 'user' | 'assistant', content: string }) {
  const isUser = role === 'user';
  return (
    <motion.div 
      className={cn("flex items-start gap-3 mb-4", isUser ? "justify-end" : "justify-start")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="w-8 h-7 rounded-full bg-muted flex items-center justify-center text-center">
          <span className="text-xs font-medium text-foreground mb-0.5">🌱</span>
        </div>
      )}
      <div className={cn(
        "p-3 rounded-2xl max-w-lg backdrop-blur-sm", 
        isUser 
          ? "bg-primary text-primary-foreground border border-primary/20" 
          : "bg-muted text-foreground border border-border"
      )}>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && (
        <div className="w-8 h-7 rounded-full bg-muted flex items-center justify-center text-center">
          <span className="text-xs font-medium text-foreground mb-0.5">👤</span>
        </div>
      )}
    </motion.div>
  );
}

export function EcoChat() {
  const t = useTranslations("ChatAssistant");
  const { user } = useUser();
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    onFinish: () => {
      // Recharger les crédits après chaque message
      refetchCredits();
    }
  });
  const [inputFocused, setInputFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Récupérer le vrai compteur depuis la base de données
  const { data: credits, refetch: refetchCredits } = trpc.chat.getCredits.useQuery(undefined, {
    enabled: !!user,
    refetchOnWindowFocus: false,
  });
  
  const isPremium = user?.publicMetadata?.role === 'admin' || credits?.isPremium || Boolean((user?.publicMetadata?.stripe as { isSubscribed?: boolean })?.isSubscribed);
  const messagesLeft = credits?.creditsLeft === 'unlimited' ? 'unlimited' : (credits?.creditsLeft ?? 0);
  const canChat = user && (isPremium || (typeof messagesLeft === 'number' && messagesLeft > 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col w-full items-center justify-center bg-transparent text-foreground p-6 relative overflow-hidden">
      {/* Effets de background comme dans l'original */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-2xl mx-auto relative">
        <motion.div 
          className="relative z-10 space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header avec le style original */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <h1 className="text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 pb-1">
                {t('title')}
              </h1>
              <motion.div 
                className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Posez une question ou tapez une commande
            </motion.p>
          </div>

          {/* Section d'affichage des messages avec scroll */}
          {messages.length > 0 && (
            <motion.div 
              className="max-h-[50vh] overflow-y-auto pr-4 space-y-4 backdrop-blur-xl bg-background/80 rounded-2xl border border-border p-6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence>
                {messages.map((m) => (
                  <ChatMessage key={m.id} role={m.role as 'user' | 'assistant'} content={m.content} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Section de l'input avec le style original */}
          <motion.div 
            className="relative backdrop-blur-2xl bg-background/80 rounded-2xl border border-border shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Messages d'erreur */}
            {error && (
              <div className="text-center text-sm text-red-500 mb-4 p-4">
                {t('error.limitReached')} <Link href="/pricing" className="underline font-semibold text-primary">{t('error.becomeMember')}</Link>
              </div>
            )}

            <div className="p-4">
              <Textarea
                value={input}
                onChange={handleInputChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={
                  !user ? t('loginToChat') : 
                  canChat ? t('placeholder') : t('limitReached')
                }
                disabled={!user || !canChat || isLoading}
                containerClassName="w-full"
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-foreground text-sm",
                  "focus:outline-none",
                  "placeholder:text-muted-foreground",
                  "min-h-[60px]"
                )}
                style={{
                  overflow: "hidden",
                }}
                showRing={false}
              />
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Indicateur de statut */}
                <div className="text-xs text-muted-foreground">
                  {!user ? "Connectez-vous" : isPremium ? "Premium ✨" : `${messagesLeft} messages gratuits restants`}
                </div>
              </div>
              
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !input.trim() || !canChat}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "flex items-center gap-2",
                  input.trim() && canChat
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isLoading ? (
                  <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
                <span>Envoyer</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animation de typing */}
      <AnimatePresence>
        {isLoading && (
                  <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-2xl bg-background/90 rounded-full px-4 py-2 shadow-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
                      <div className="flex items-center gap-3">
            <div className="w-8 h-7 rounded-full bg-muted flex items-center justify-center text-center">
              <span className="text-xs font-medium text-foreground mb-0.5">🌱</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>EcoBot réfléchit</span>
              <TypingDots />
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effet de focus comme dans l'original */}
      {inputFocused && (
        <motion.div 
          className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  );
} 