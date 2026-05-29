import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/logo_c.png';
import hero from '../../assets/header.png';
import negocio from '../../assets/concessionaria.png';
import paisagem from '../../assets/carro_paisagem.png';
import logo2 from '../../assets/logo_completo.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F2] selection:bg-blue-200">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-4 sticky top-0 z-50 bg-[#F3F3F2]/80 backdrop-blur-sm">
        <Image src={logo} alt="Logo" width={60} height={60} className='opacity-80 md:w-17.5 md:h-17.5' />
        <div className="flex gap-4 md:gap-8 text-xs md:text-sm font-medium uppercase tracking-widest font-zetta">
          <Link href="/catalogo" className="hover:opacity-70 transition-all ">Catálogo</Link>
          <Link href="/login" className="border-b-2 border-black pb-1 hover:opacity-70 transition-all">Login</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      {/* Ajuste: no mobile usamos flex-col para controlar a ordem exata. No desktop usamos block para sobreposição. */}
      <section className="relative min-h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] w-full overflow-hidden flex flex-col bg-[#F3F3F2]">

        {/* 1. SLOGAN DO TOPO (Sempre no alto) */}
        <div className="relative z-20 text-center w-full pt-8 md:pt-10 px-6 md:px-10">
          <p className="text-[10px] md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] text-black font-zetta">
            Ecossistema . Performance . Inteligência
          </p>
        </div>

        {/* CONTAINER DINÂMICO (Em coluna no Mobile, em camadas absolutas no Desktop) */}
        <div className="relative md:absolute md:inset-0 flex flex-col md:flex-row w-full h-full pointer-events-none md:p-10 z-10 grow">

          {/* 2. LOGO E SUBTÍTULO (Mobile: Vem depois do slogan | Desktop: Fica na Esquerda) */}
          <div className="relative z-10 order-1 md:order-0 flex flex-col items-center md:items-start text-center md:text-left px-6 md:px-0 mt-8 md:mt-0 pointer-events-auto h-auto md:h-full md:justify-center">
            <h1 className="text-6xl md:text-7xl leading-[0.9] uppercase font-exa tracking-tighter text-black">
              CODE<br /><span className="font-bold">CARROS</span>
            </h1>
            <p className="text-xs md:text-sm text-black mt-4 font-zetta tracking-wider">
              Venda e marketing online<br />de automóveis
            </p>

            {/* BOTÃO DESKTOP (Aparece só no PC, escondido no celular) */}
            <button className="hidden md:block mt-8 bg-blue-600 text-white px-10 py-4 rounded-xl shadow-xl font-exa text-lg hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer">
              FALE CONOSCO
            </button>
          </div>

          {/* 3. IMAGEM DO CARRO (Mobile: Fica no meio | Desktop: Fica no fundo ocupando tudo) */}
          <div className="relative order-2 md:order-0 w-full h-[35vh] min-h-62.5 md:h-full md:absolute md:inset-0 z-0 my-6 md:my-0 flex items-center justify-center pointer-events-none">
            <Image
              src={hero}
              alt="Carro"
              fill
              priority
              /* scale-[1.3] deixa o carro bem grande no celular, scale-100 reseta no PC */
              className="object-contain scale-[1.3] md:scale-100"
            />
          </div>

          {/* 4. BOTÃO E FRASE (Mobile: Ficam no final | Desktop: Ficam no canto inferior direito) */}
          <div className="relative z-10 order-3 md:order-0 flex flex-col items-center md:items-end justify-end px-6 md:px-0 pb-10 md:pb-0 md:absolute md:right-10 md:bottom-20 pointer-events-auto w-full md:w-auto mt-auto">

            {/* BOTÃO MOBILE (Aparece só no celular, escondido no PC) */}
            <button className="md:hidden mb-6 w-full max-w-70 bg-blue-600 text-white px-8 py-4 rounded-xl shadow-xl font-exa text-sm font-bold hover:bg-blue-700 transition-all cursor-pointer">
              FALE CONOSCO
            </button>

            <p className="text-[10px] md:text-base uppercase tracking-[0.2em] font-zetta leading-tight text-center md:text-right text-black">
              Aumente a velocidade<br />da sua concessionária
            </p>
          </div>

        </div>
      </section>

      {/* SEÇÃO OBJETIVO */}
      <section className="py-10 bg-[#F3F3F2] flex justify-center px-6 md:px-10">
        <div className="flex flex-col md:flex-row w-full max-w-6xl overflow-hidden shadow-sm rounded-2xl md:rounded-none">
          <div className="relative w-full md:w-1/2 h-75 md:h-100">
            <Image 
              src={negocio} alt="Parceria de negócios Code Carros" fill className="object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 bg-[#E5E7EB] flex flex-col justify-center items-center md:items-start p-8 md:p-12 lg:p-20 text-center md:text-left">
            <h2 className="font-exa font-bold text-2xl lg:text-3xl uppercase leading-tight">
              SEU OBJETIVO<br /> NOSSO <span className="text-blue-600">NEGÓCIO</span>
            </h2>
            <p className="font-exa mt-4 md:mt-6 text-sm md:text-base text-gray-700 leading-relaxed max-w-md">
              Trabalhamos para alavancar suas vendas e leva-las para lugares que sua empresa ainda não alcança.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO DIFERENCIAIS (STEPS) */}
      <section className="py-16 md:py-12 bg-[#F3F3F2] flex justify-center px-6 md:px-10">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 text-center">
          {[
            { id: 3, title: "ATENDIMENTO\nHUMANIZADO" },
            { id: 2, title: "PLATAFORMA\nPARA SEU USO" },
            { id: 1, title: "ZERO\nCOMPLICAÇÕES" },
          ].map((step) => (
            <div key={step.id} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="font-exa text-3xl font-black text-white">
                  {step.id}
                </span>
              </div>
              <h3 className="font-exa text-base md:text-lg font-black leading-tight text-black whitespace-pre-line tracking-tighter">
                {step.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO CTA - MELHORE SUAS VENDAS */}
      <section className="relative w-full overflow-hidden bg-[#0f172a] flex flex-col md:block">
        <div className="relative z-0 w-full">
          <Image 
            src={paisagem} alt="Paisagem" className="w-full h-auto block object-cover" priority
          />
          <div className="absolute inset-0 bg-black/10 z-1" />
        </div>
        <div className="relative md:absolute md:inset-0 z-10 flex items-center justify-center md:justify-start px-6 py-12 md:py-0 md:px-10">
          <div className="p-8 md:p-12 rounded-2xl border border-white/20 bg-white/10 md:backdrop-blur-md max-w-lg shadow-2xl text-center md:text-left w-full md:w-auto">
            <h2 className="font-exa text-2xl md:text-4xl font-bold text-white leading-tight uppercase">
              Melhore suas vendas com a gente
            </h2>
            <button className="mt-8 bg-blue-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl shadow-lg font-exa text-base md:text-lg hover:bg-blue-700 hover:scale-105 transition-all w-full md:w-auto cursor-pointer">
              FALE CONOSCO
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER - FINAL DA PÁGINA */}
      <footer className="py-10 bg-[#F3F3F2] flex flex-col items-center justify-center px-6 text-center">
        <Image 
          src={logo2} alt="Logo Code Carros 2" width={160} className="opacity-80 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer md:w-50"
        />
        <p className="font-zetta text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] text-gray-400 uppercase mt-4">
          © 2026 Code Carros . Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}