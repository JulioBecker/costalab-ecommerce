import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full px-6 py-12 md:py-24 bg-background text-foreground shrink-0 border-t-2 border-foreground pb-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <span className="font-bold text-lg mb-2 tracking-tighter">COSTALAB</span>
          <p className="opacity-80 leading-relaxed">
            Minimalismo underground. Streetwear focado em design puro, cortes retos e estética brutalista.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 font-bold">
          <span className="mb-2 opacity-50">Explorar</span>
          <Link href="/produtos" className="hover:underline underline-offset-4">Catálogo</Link>
          <Link href="/sobre" className="hover:underline underline-offset-4">Sobre Nós</Link>
          <Link href="/carrinho" className="hover:underline underline-offset-4">Carrinho</Link>
        </div>

        <div className="flex flex-col gap-3 font-bold">
          <span className="mb-2 opacity-50">Legal</span>
          <Link href="/trocas" className="hover:underline underline-offset-4">Trocas e devoluções</Link>
          <Link href="/privacidade" className="hover:underline underline-offset-4">Política de Privacidade</Link>
          <Link href="/termos" className="hover:underline underline-offset-4">Termos de uso</Link>
        </div>

        <div className="flex flex-col gap-3 font-bold">
          <span className="mb-2 opacity-50">Contato</span>
          <a href="mailto:costalab.co@gmail.com" className="hover:underline underline-offset-4">costalab.co@gmail.com</a>
          <a href="https://wa.me/5547988723787" className="hover:underline underline-offset-4">+55 (47) 98872-3787</a>
          <span className="text-xs opacity-60 font-medium">De Seg. a Sex., das 9h às 18h.</span>
        </div>
      </div>
      
      <div className="border-t-2 border-foreground mt-12 pt-6 text-center opacity-60 font-bold flex flex-col justify-center items-center gap-4">
        <span>&copy; {new Date().getFullYear()} COSTALAB. TODOS OS DIREITOS RESERVADOS.</span>
      </div>
    </footer>
  );
}
