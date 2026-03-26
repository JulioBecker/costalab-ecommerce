export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col pt-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b-2 border-foreground pb-8">
        Política de Privacidade
      </h1>
      <div className="font-mono text-sm leading-relaxed uppercase space-y-4 font-bold opacity-80">
        <p>SEUS DADOS SÃO TRATADOS CONFIDENCIALMENTE (LGPD). NÃO VENDEMOS SUAS INFORMAÇÕES PESSOAIS. COLETAMOS APENAS OS DADOS NECESSÁRIOS PARA PROCESSAMENTO DO SEU PEDIDO (NOME, CPF, ENDEREÇO, E-MAIL, TELEFONE) E PARA MELHORIA DA NOSSA PLATAFORMA (COOKIES ANALÍTICOS).</p>
        <p>O PAGAMENTO É PROCESSADO POR GATEWAYS TERCEIROS CERTIFICADOS. A COSTA LAB NÃO ARMAZENA DADOS DE CARTÃO DE CRÉDITO EM SEUS SERVIDORES.</p>
      </div>
    </div>
  );
}
