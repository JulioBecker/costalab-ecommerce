"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  material?: string;
  imageUrl?: string;
  isNew?: boolean;
}

export function ProductCard({ id, name, price, category, material, imageUrl, isNew }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group border-2 border-foreground flex flex-col bg-background relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isNew && (
        <div className="absolute top-4 left-4 z-10 bg-foreground text-background font-mono text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
          NEW
        </div>
      )}
      
      <Link href={`/produtos/${id}`} className="aspect-[4/5] bg-foreground/5 border-b-2 border-foreground p-8 flex items-center justify-center overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full border-2 border-dashed border-foreground/30 flex items-center justify-center font-mono opacity-50 font-bold mix-blend-difference uppercase text-sm text-center px-4">
            NO_IMAGE.RAW
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col gap-2 font-mono uppercase bg-background">
        <Link href={`/produtos/${id}`} className="flex justify-between items-start font-bold">
          <h3 className="tracking-tight hover:underline underline-offset-4 line-clamp-1">{name}</h3>
          <span className="shrink-0 ml-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
          </span>
        </Link>
        <div className="flex justify-between items-center text-xs tracking-widest opacity-60">
          <span>{category}</span>
          {material && <span>{material}</span>}
        </div>
        <Link 
          href={`/produtos/${id}`}
          className="mt-4 border-2 border-foreground w-full py-3 font-bold hover:bg-foreground hover:text-background transition-colors text-sm tracking-widest uppercase text-center block"
        >
          {isHovered ? 'Selecionar Tamanho' : 'Adicionar'}
        </Link>
      </div>
    </div>
  );
}
