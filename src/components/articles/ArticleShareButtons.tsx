'use client';

import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import {
  Share2,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Mail,
  MessageCircle,
  Facebook,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareData {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
}

interface ArticleShareButtonsProps {
  data: ShareData;
  variant?: 'horizontal' | 'vertical' | 'floating' | 'compact';
  showLabels?: boolean;
  className?: string;
}

// Configuration des plateformes de partage
const shareConfig = {
  twitter: {
    name: 'Twitter / X',
    icon: Twitter,
    color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30',
    darkColor: 'dark:hover:bg-[#1DA1F2]/20',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30',
    darkColor: 'dark:hover:bg-[#0A66C2]/20',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30',
    darkColor: 'dark:hover:bg-[#1877F2]/20',
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30',
    darkColor: 'dark:hover:bg-[#25D366]/20',
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: 'hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30',
    darkColor: 'dark:hover:bg-orange-500/20',
  },
  copy: {
    name: 'Copier le lien',
    icon: Link2,
    color: 'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
    darkColor: 'dark:hover:bg-primary/20',
  },
};

export function ArticleShareButtons({
  data,
  variant = 'horizontal',
  showLabels = true,
  className,
}: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareCount] = useState<number | null>(null);
  const { toast } = useToast();

  // Obtenir l'URL de partage
  const getShareUrl = useCallback(() => {
    if (data.url) return data.url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [data.url]);

  // Partage Twitter/X
  const shareOnTwitter = useCallback(() => {
    const url = getShareUrl();
    const text = data.title;
    const hashtags = data.hashtags?.join(',') || 'climat,écologie';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  }, [data.title, data.hashtags, getShareUrl]);

  // Partage LinkedIn
  const shareOnLinkedIn = useCallback(() => {
    const url = getShareUrl();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  }, [getShareUrl]);

  // Partage Facebook
  const shareOnFacebook = useCallback(() => {
    const url = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  }, [getShareUrl]);

  // Partage WhatsApp
  const shareOnWhatsApp = useCallback(() => {
    const url = getShareUrl();
    const text = `${data.title}\n\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [data.title, getShareUrl]);

  // Partage par Email
  const shareByEmail = useCallback(() => {
    const url = getShareUrl();
    const subject = data.title;
    const body = `${data.description || 'Je pense que cet article pourrait t\'intéresser :'}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [data.title, data.description, getShareUrl]);

  // Copier le lien
  const copyToClipboard = useCallback(async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'Lien copié !',
        description: 'Le lien a été copié dans le presse-papiers.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  }, [getShareUrl, toast]);

  // Partage natif (mobile)
  const shareNative = useCallback(async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Erreur de partage:', err);
        }
      }
    }
  }, [data.title, data.description, getShareUrl]);

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const buttons = [
    { key: 'twitter', onClick: shareOnTwitter, ...shareConfig.twitter },
    { key: 'linkedin', onClick: shareOnLinkedIn, ...shareConfig.linkedin },
    { key: 'facebook', onClick: shareOnFacebook, ...shareConfig.facebook },
    { key: 'whatsapp', onClick: shareOnWhatsApp, ...shareConfig.whatsapp },
    { key: 'email', onClick: shareByEmail, ...shareConfig.email },
    {
      key: 'copy',
      onClick: copyToClipboard,
      ...shareConfig.copy,
      icon: copied ? Check : Link2,
      name: copied ? 'Copié !' : 'Copier le lien',
    },
  ];

  // Styles par variant
  const containerStyles = {
    horizontal: 'flex flex-wrap items-center gap-2',
    vertical: 'flex flex-col gap-2',
    floating: 'fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 bg-card/90 backdrop-blur-sm p-2 rounded-xl border border-border shadow-lg',
    compact: 'flex items-center gap-1',
  };

  const buttonStyles = {
    horizontal: showLabels
      ? 'flex items-center gap-2 px-4 py-2 rounded-lg'
      : 'p-2.5 rounded-lg',
    vertical: 'flex items-center gap-3 px-4 py-3 rounded-lg w-full',
    floating: 'p-2.5 rounded-lg',
    compact: 'p-2 rounded-md',
  };

  const iconSize = {
    horizontal: 'w-4 h-4',
    vertical: 'w-5 h-5',
    floating: 'w-5 h-5',
    compact: 'w-4 h-4',
  };

  return (
    <div className={cn(containerStyles[variant], className)}>
      {/* Bouton de partage natif (mobile) */}
      {hasNativeShare && variant !== 'floating' && (
        <button
          onClick={shareNative}
          className={cn(
            buttonStyles[variant],
            'border border-border bg-card text-foreground',
            'transition-all duration-200',
            'hover:bg-primary hover:text-primary-foreground hover:border-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary/50'
          )}
        >
          <Share2 className={iconSize[variant]} />
          {showLabels && variant !== 'compact' && (
            <span className="text-sm font-medium">Partager</span>
          )}
        </button>
      )}

      {/* Boutons de partage */}
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <button
            key={button.key}
            onClick={button.onClick}
            className={cn(
              buttonStyles[variant],
              'border border-border bg-card text-muted-foreground',
              'transition-all duration-200',
              button.color,
              button.darkColor,
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              button.key === 'copy' && copied && 'bg-green-500/10 text-green-500 border-green-500/30'
            )}
            title={button.name}
          >
            <Icon className={iconSize[variant]} />
            {showLabels && variant === 'vertical' && (
              <span className="text-sm font-medium">{button.name}</span>
            )}
          </button>
        );
      })}

      {/* Compteur de partages (si disponible) */}
      {shareCount !== null && variant !== 'compact' && (
        <div className="text-xs text-muted-foreground ml-2">
          {shareCount.toLocaleString('fr-FR')} partages
        </div>
      )}
    </div>
  );
}

// Version compacte pour le header sticky
export function ShareButtonCompact({ data }: { data: ShareData }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getShareUrl = useCallback(() => {
    if (data.url) return data.url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [data.url]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: getShareUrl(),
        });
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        // Fallback: copy to clipboard
        await copyToClipboard();
      }
    } else {
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      toast({
        title: 'Lien copié !',
        description: 'Le lien a été copié dans le presse-papiers.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
        'border border-border bg-card text-muted-foreground',
        'transition-all duration-200',
        'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        copied && 'bg-green-500/10 text-green-500 border-green-500/30'
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Copié</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Partager</span>
        </>
      )}
    </button>
  );
}
