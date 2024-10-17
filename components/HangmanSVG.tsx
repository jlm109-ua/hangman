import * as React from "react";
import { cn } from "@/lib/utils";

interface HangmanSVGProps extends React.SVGProps<SVGSVGElement> {
  lives: number;
  color: string;
}

const HangmanSVG = React.forwardRef<SVGSVGElement, HangmanSVGProps>(
  ({ className, lives, color, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 250"
        width="200"
        height="200"
        ref={ref}
        className={cn(`stroke-${color} fill-none`, className)}
        {...props}
      >
        {/* Base del ahorcado */}
        <line x1="10" y1="200" x2="70" y2="200" strokeWidth="6" />

        {/* Poste vertical */}
        <line x1="40" y1="200" x2="40" y2="20" strokeWidth="6" />

        {/* Poste horizontal */}
        <line x1="40" y1="20" x2="120" y2="20" strokeWidth="6" />

        {/* Cuerda */}
        <line x1="120" y1="20" x2="120" y2="50" strokeWidth="6" />

        {/* Cabeza */}
        {lives <= 5 && <circle cx="120" cy="70" r="20" strokeWidth="6" />}

        {/* Cuerpo */}
        {lives <= 4 && <line x1="120" y1="90" x2="120" y2="150" strokeWidth="6" />}

        {/* Brazo izquierdo */}
        {lives <= 3 && <line x1="120" y1="110" x2="100" y2="130" strokeWidth="6" />}

        {/* Brazo derecho */}
        {lives <= 2 && <line x1="120" y1="110" x2="140" y2="130" strokeWidth="6" />}

        {/* Pierna izquierda */}
        {lives <= 1 && <line x1="120" y1="150" x2="100" y2="180" strokeWidth="6" />}

        {/* Pierna derecha */}
        {lives === 0 && <line x1="120" y1="150" x2="140" y2="180" strokeWidth="6" />}
      </svg>
    );
  }
);

HangmanSVG.displayName = "Hangman";

export { HangmanSVG };