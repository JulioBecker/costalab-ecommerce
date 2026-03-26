import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5547988723787"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-foreground text-background p-4 rounded-none border-2 border-background shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all dark:shadow-[4px_4px_0px_#FFF]"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 stroke-[2px]" />
    </a>
  );
}
