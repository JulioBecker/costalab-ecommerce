export default function ContactPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col pt-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b-2 border-foreground pb-8">
        Contato
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono uppercase font-bold text-sm">
        <div className="flex flex-col gap-8">
          <div>
             <h2 className="text-xl mb-4 tracking-tighter">Atendimento via E-mail</h2>
             <a href="mailto:costalab.co@gmail.com" className="opacity-60 hover:opacity-100 hover:underline underline-offset-4 text-lg">
               COSTALAB.CO@GMAIL.COM
             </a>
             <p className="mt-2 opacity-40 text-xs">RESPOSTA EM ATÉ 48 HORAS ÚTEIS.</p>
          </div>
          <div>
             <h2 className="text-xl mb-4 tracking-tighter">Atendimento via WhatsApp</h2>
             <a href="https://wa.me/5547988723787" className="opacity-60 hover:opacity-100 hover:underline underline-offset-4 text-lg">
               +55 (47) 98872-3787
             </a>
             <p className="mt-2 opacity-40 text-xs">ATENDIMENTO DE SEGUNDA A SEXTA, DAS 9H ÀS 18H.</p>
          </div>
        </div>

        <form className="flex flex-col gap-6">
           <div className="flex flex-col gap-2">
             <label htmlFor="name" className="opacity-60">NOME COMPLETO</label>
             <input type="text" id="name" className="border-2 border-foreground bg-background p-4 outline-none focus:ring-2 ring-foreground ring-offset-2 ring-offset-background" required />
           </div>
           <div className="flex flex-col gap-2">
             <label htmlFor="email" className="opacity-60">E-MAIL</label>
             <input type="email" id="email" className="border-2 border-foreground bg-background p-4 outline-none focus:ring-2 ring-foreground ring-offset-2 ring-offset-background" required />
           </div>
           <div className="flex flex-col gap-2">
             <label htmlFor="message" className="opacity-60">MENSAGEM / DÚVIDA / RECLAMAÇÃO</label>
             <textarea id="message" rows={5} className="border-2 border-foreground bg-background p-4 outline-none focus:ring-2 ring-foreground ring-offset-2 ring-offset-background resize-none" required></textarea>
           </div>
           <button type="submit" className="border-2 border-foreground bg-foreground text-background p-4 hover:bg-background hover:text-foreground transition-all">
             ENVIAR MENSAGEM
           </button>
        </form>
      </div>
    </div>
  );
}
