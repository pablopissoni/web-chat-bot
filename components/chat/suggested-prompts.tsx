import { DollarSign, Sparkles, UserCog, Wrench } from "lucide-react";

export interface SuggestedPrompt {
  icon: React.ReactNode;
  title: string;
  prompt: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: <Wrench className="size-4" />,
    title: "Conocer servicios",
    prompt: "¿Qué servicios ofrece CallBotIA?",
  },
  {
    icon: <DollarSign className="size-4" />,
    title: "Ver planes y precios",
    prompt: "¿Cuáles son los planes y precios?",
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "Quiero contratar",
    prompt: "Me interesa contratar sus servicios",
  },
  {
    icon: <UserCog className="size-4" />,
    title: "Hablar con un humano",
    prompt: "Quiero hablar con una persona",
  },
];
