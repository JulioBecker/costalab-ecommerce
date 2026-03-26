export default function ReturnsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col pt-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b-2 border-foreground pb-8">
        Trocas e Devoluções
      </h1>
      
      <div className="font-mono text-sm leading-relaxed uppercase space-y-12 font-bold opacity-80">
        <p>Queremos que você tenha a melhor experiência possível com nossos produtos. Por isso, seguimos o Código de Defesa do Consumidor:</p>
        <p>Você pode solicitar a devolução em até 7 dias corridos após o recebimento da compra, em caso de arrependimento.</p>
        <p>O produto deve estar em perfeitas condições, sem sinais de uso, e com a embalagem original quando possível.</p>
        <p>Assim que o produto chegar até nós, o valor será reembolsado de acordo com a forma de pagamento escolhida na compra.</p>
        <p>Caso o item apresente defeito de fabricação, você pode solicitar a troca ou devolução em até 30 dias.</p>
        <p>Para iniciar o processo, basta entrar em contato pelo nosso e-mail ou redes sociais.</p>
      </div>
    </div>
  );
}
