export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col pt-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b-2 border-foreground pb-8">
        A Marca
      </h1>

      <div className="font-mono text-lg leading-relaxed uppercase space-y-8 font-bold opacity-80">
        <p>
          A *COSTALAB* é um pequeno estúdio criativo dedicado a transformar ideias em peças úteis para o dia a dia, como panos de prato e acessórios feitos com cuidado e personalidade.
        </p>
        <p>
          Aqui funciona como um laboratório: criamos, testamos e produzimos itens simples, mas com identidade e propósito.
        </p>
        <p>
          Mais do que uma loja, a COSTALAB é um projeto com um objetivo especial, cada produto vendido ajuda a financiar nosso grande sonho de fazer uma Eurotrip.
        </p>
        <p>
          TODO PRODUTO COSTALAB É DESENVOLVIDO, TESTADO E APROVADO COMO UMA FERRAMENTA DE EXPRESSÃO E RESISTÊNCIA.
        </p>
      </div>

      <div className="mt-16 aspect-video bg-foreground border-2 border-foreground flex items-center justify-center relative overflow-hidden">
        <img src="/logo-branca.png" alt="Sobre a CostaLAB" className="w-[80vw] md:w-[60vw] max-w-2xl h-auto object-contain drop-shadow-2xl dark:invert px-8" />
      </div>
    </div>
  );
}
