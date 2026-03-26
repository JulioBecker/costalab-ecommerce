// Exporting Terms Page
export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 flex flex-col pt-12">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b-2 border-foreground pb-8">
        Termos de Uso
      </h1>
      <div className="font-mono text-sm leading-relaxed uppercase space-y-4 font-bold opacity-80">
        <p>Bem-vindo ao site da COSTALAB! Ao acessar e utilizar nosso site, você concorda com os presentes Termos de Uso. Leia atentamente antes de navegar ou realizar qualquer compra.</p>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">1. Aceitação dos Termos</h2>
          <p>Ao utilizar este site, você concorda com todas as condições aqui descritas. Caso não concorde com algum dos termos, solicitamos que não utilize nossos serviços.</p>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">2. Uso do Site</h2>
          <p>Você se compromete a utilizar o site apenas para fins legais e de acordo com a legislação vigente. É proibido:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
            <li>Inserir conteúdo ilegal, ofensivo ou que viole direitos de terceiros;</li>
            <li>Interferir ou prejudicar o funcionamento do site;</li>
            <li>Utilizar o site para práticas comerciais não autorizadas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">3. Cadastro e Segurança</h2>
          <p>Para realizar compras ou acessar determinados serviços, pode ser necessário criar uma conta. Você é responsável por:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
            <li>Fornecer informações corretas, atualizadas e completas;</li>
            <li>Manter a confidencialidade de sua senha;</li>
            <li>Todas as atividades realizadas através de sua conta.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">4. Compras e Pagamentos</h2>
          <p>Ao realizar uma compra, você concorda com os preços, formas de pagamento e condições de entrega apresentadas no site. Todas as compras estão sujeitas à nossa Política de Devolução e à legislação vigente.</p>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">5. Propriedade Intelectual</h2>
          <p>Todo o conteúdo do site da COSTALAB, incluindo textos, imagens, vídeos, logotipos e marcas, é de propriedade exclusiva da loja ou de terceiros que nos autorizaram seu uso. É proibida a reprodução, distribuição ou utilização não autorizada de qualquer material.</p>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">6. Limitação de Responsabilidade</h2>
          <p>O site é fornecido “como está” e não garantimos a disponibilidade contínua, a precisão das informações ou que o site esteja livre de erros ou vírus. A COSTALAB não será responsável por danos decorrentes do uso ou da impossibilidade de uso do site.</p>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">7. Alterações nos Termos</h2>
          <p>Podemos atualizar estes Termos de Uso a qualquer momento, sem aviso prévio. Recomendamos que você revise esta página periodicamente para estar ciente de alterações.</p>
        </section>

        <section>
          <h2 className="text-xl mt-8 mb-4 border-l-4 border-foreground pl-4">8. Legislação Aplicável</h2>
          <p>Estes Termos de Uso são regidos pelas leis brasileiras, especialmente as aplicáveis ao comércio eletrônico e à proteção de dados.</p>
        </section>
      </div>
    </div>
  );
}
