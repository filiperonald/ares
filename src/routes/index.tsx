import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wind, Wrench, Snowflake, ShieldCheck, Sparkles, Cog, Filter, Gauge,
  ClipboardCheck, Building2, Home, Store, Hospital, UtensilsCrossed,
  Briefcase, Building, FileBadge, ThermometerSun, CheckCircle2, Zap,
  PhoneCall, Mail, MapPin, Menu, X, MessageCircle, ArrowRight,
  AlertTriangle, Droplets, Volume2, Lightbulb, Calculator, Settings,
  Star, Quote, ChevronLeft, ChevronRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { createServerFn } from "@tanstack/react-start";
import heroTechnician from "@/assets/hero-technician.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";


export const Route = createFileRoute("/")({ component: Index });

const fetchCemigKwh = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const url = new URL("https://dadosabertos.aneel.gov.br/api/3/action/datastore_search");
    url.searchParams.set("resource_id", "b1bd71e7-d0ad-4214-9053-cbd58e9564a7");
    url.searchParams.set("filters", JSON.stringify({
      SigAgente: "CEMIG-D",
      DscSubGrupoTarifario: "B1",
      DscModalidadeTarifaria: "Convencional",
    }));
    url.searchParams.set("limit", "1");
    url.searchParams.set("sort", "DatInicioVigencia desc");
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { kwh: "0.97", source: "fallback" };
    const json = await res.json() as { result?: { records?: Array<Record<string, string>> } };
    const rec = json?.result?.records?.[0];
    if (rec) {
      const te = parseFloat((rec["VlrTE"] ?? "0").replace(",", "."));
      const tusd = parseFloat((rec["VlrTUSD"] ?? "0").replace(",", "."));
      const total = te + tusd;
      if (total > 0.4 && total < 3.0) return { kwh: total.toFixed(4), source: "aneel" };
    }
  } catch { /* fallback */ }
  return { kwh: "0.97", source: "fallback" };
});

const WHATSAPP_URL = "https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

// Brand palette — aclima
const C = {
  cyan: "#0099CC",
  petrol: "#006E99",
  deep: "#004D73",
  light: "#7DD8F5",
  bgLight: "#F0F9FC",
  bgDark: "#002A40",
  text: "#0D2B3E",
  text2: "#4B6B7D",
};

function Index() {
  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: C.bgLight, color: C.text }}>
      <Header />
      <main>
        <Hero />
        <Services />
        <Problems />
        <Differentiators />
        <Gallery />
        <PMOC />
        <CalculatorSection />
        <Process />
        <Audiences />
        <Clients />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhats />
    </div>

  );
}

/* ---------------- LOGO ---------------- */
function AclimaLogo({ height = 40 }: { height?: number }) {
  return (
    <svg height={height} viewBox="0 0 220 46" xmlns="http://www.w3.org/2000/svg" aria-label="aclima">
      <text
        x="2" y="38"
        fontFamily="'Arial Rounded MT Bold','Trebuchet MS','Nunito',system-ui,sans-serif"
        fontWeight="900"
        fontSize="42"
        fill={C.cyan}
        letterSpacing="-1"
      >aclima</text>
      <path d="M2 43 Q18 37 34 43" stroke={C.light} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="131" cy="7" r="5" fill={C.light} opacity="0.85" />
    </svg>
  );
}

/* ---------------- HEADER ---------------- */
const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#trabalhos", label: "Trabalhos" },
  { href: "#pmoc", label: "PMOC" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#contato", label: "Contato" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(8,47,73,0.25)]" : ""
      }`}
      style={{ background: scrolled ? "rgba(244,251,252,0.85)" : "transparent" }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#inicio" className="flex items-center group" aria-label="aclima">
          <AclimaLogo height={40} />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors hover:opacity-100 opacity-80"
              style={{ color: C.deep }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg shadow-cyan-900/20 transition-transform hover:scale-[1.03] hover:shadow-xl relative overflow-hidden"
            style={{ background: C.cyan }}
          >
            <MessageCircle className="w-4 h-4" />
            Solicitar orçamento
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 rounded-xl grid place-items-center"
            style={{ background: "rgba(8,127,154,0.1)", color: C.deep }}
            aria-label="Abrir menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-4 mb-4 rounded-2xl p-4 backdrop-blur-md shadow-xl border"
            style={{ background: "rgba(255,255,255,0.95)", borderColor: "rgba(8,127,154,0.15)" }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-xl text-sm font-medium hover:bg-cyan-50 transition-colors"
                  style={{ color: C.deep }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold"
                style={{ background: C.cyan }}
              >
                <MessageCircle className="w-4 h-4" /> Solicitar orçamento
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section id="inicio" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden" style={{ background: C.bgLight }}>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: "rgba(8,127,154,0.08)", borderColor: "rgba(8,127,154,0.2)", color: C.petrol }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Atendimento técnico especializado
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
            style={{ color: C.deep }}
          >
            Climatização eficiente para sua{" "}
            <span style={{ color: C.cyan }}>
              casa, empresa
            </span>{" "}
            ou condomínio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 text-base sm:text-lg max-w-xl"
            style={{ color: C.text2 }}
          >
            Instalação, manutenção preventiva, manutenção corretiva, reparos e
            emissão de laudos técnicos com atendimento ágil e suporte
            especializado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold shadow-xl shadow-cyan-900/20 transition-transform hover:-translate-y-0.5 overflow-hidden"
              style={{ background: C.cyan }}
            >
              <MessageCircle className="w-4 h-4" /> Solicitar orçamento
            </a>
            <a
              href="#calculadora"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border-2 transition-colors hover:bg-white"
              style={{ borderColor: C.cyan, color: C.petrol, background: "rgba(255,255,255,0.6)" }}
            >
              <Calculator className="w-4 h-4" /> Calcular gasto de energia
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl"
          >
            {[
              ["Atendimento ágil", "24h úteis"],
              ["Garantia técnica", "100%"],
              ["Anos de atuação", "+10"],
              ["Clientes atendidos", "+1k"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xl font-bold" style={{ color: C.deep }}>{v}</div>
                <div className="text-xs" style={{ color: C.text2 }}>{k}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative h-[500px] sm:h-[560px] hidden sm:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img
              src={heroTechnician}
              alt="Técnico da Cnpjotas Ares ao lado de um ar condicionado instalado"
              width={1024}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating info cards */}
          <FloatingCard delay={0.2} className="top-4 -left-4 sm:left-0" icon={<Home className="w-4 h-4" />} title="Residencial & Comercial" />
          <FloatingCard delay={0.4} className="top-32 -right-4" icon={<FileBadge className="w-4 h-4" />} title="PMOC & Laudo técnico" />
          <FloatingCard delay={0.8} className="bottom-28 -right-2" icon={<ShieldCheck className="w-4 h-4" />} title="Instalação com segurança" />
        </div>

      </div>
    </section>
  );
}

function FloatingCard({
  icon, title, className = "", delay = 0,
}: { icon: React.ReactNode; title: string; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white shadow-[0_10px_30px_-12px_rgba(8,47,73,0.4)] border"
        style={{ borderColor: "rgba(8,127,154,0.15)" }}
      >
        <div className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: `${C.cyan}1A`, color: C.cyan }}>
          {icon}
        </div>
        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: C.deep }}>{title}</span>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- SERVICES ---------------- */
const services = [
  { icon: Wind, title: "Instalação de ar condicionado", text: "Instalação técnica e segura, com atenção a tubulação, dreno e parte elétrica do equipamento." },
  { icon: Wrench, title: "Manutenção preventiva e corretiva", text: "Revisões periódicas para evitar falhas e correções rápidas quando algo precisa de atenção." },
  { icon: Sparkles, title: "Higienização e limpeza de filtros", text: "Limpeza profunda de evaporador, condensador e filtros para um ar mais saudável." },
  { icon: Droplets, title: "Carga de gás e reparos técnicos", text: "Recarga com verificação de vazamentos e solução de falhas elétricas e mecânicas." },
  { icon: Gauge, title: "Avaliação técnica e troca de peças", text: "Diagnóstico claro do sistema e substituição de componentes com qualidade." },
  { icon: Building2, title: "Residencial, comercial e empresarial", text: "Atendimento personalizado conforme a rotina, o porte e o tipo do ambiente." },
];

function Services() {
  return (
    <Section id="servicos" eyebrow="O que fazemos" title="Serviços completos em climatização" subtitle="Soluções técnicas para instalar, manter e cuidar do seu ar condicionado com qualidade e tranquilidade.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative p-8 rounded-3xl bg-white border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
            style={{ borderColor: "rgba(0,153,204,0.15)", boxShadow: "0 6px 24px -12px rgba(0,77,115,0.12)" }}
          >
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `${C.cyan}08` }}
            />
            <div
              className="relative w-14 h-14 rounded-2xl grid place-items-center mb-5 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: C.cyan, color: "white" }}
            >
              <s.icon className="w-6 h-6" />
            </div>
            <h3 className="relative font-bold text-xl leading-snug mb-3" style={{ color: C.deep }}>{s.title}</h3>
            <p className="relative text-sm leading-relaxed" style={{ color: C.text2 }}>{s.text}</p>
            <div
              className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: C.cyan }}
            >
              Saiba mais <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- PROBLEMS ---------------- */
const problems = [
  { icon: Snowflake, t: "Ar não gela corretamente" },
  { icon: AlertTriangle, t: "Mau cheiro" },
  { icon: Droplets, t: "Vazamento de água" },
  { icon: Volume2, t: "Barulho excessivo" },
  { icon: Zap, t: "Consumo alto de energia" },
  { icon: Filter, t: "Filtro sujo" },
  { icon: Cog, t: "Falha no compressor" },
  { icon: Wrench, t: "Falta de manutenção periódica" },
];

function Problems() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Eyebrow>Diagnóstico técnico</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ color: C.deep }}>
              Seu ar condicionado está <span style={{ color: C.cyan }}>gastando mais</span>, gelando menos ou fazendo barulho?
            </h2>
            <p className="mt-4 text-base" style={{ color: C.text2 }}>
              A Cnpjotas Ares identifica o problema, orienta o cliente e executa o serviço com segurança técnica.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-lg"
              style={{ background: C.cyan }}
            >
              Falar com um técnico <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {problems.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border hover:shadow-md transition-all"
                style={{ borderColor: "rgba(8,127,154,0.12)" }}
              >
                <div className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
                  style={{ background: `${C.cyan}15`, color: C.cyan }}>
                  <p.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium" style={{ color: C.deep }}>{p.t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- DIFFERENTIATORS ---------------- */
const diffs = [
  { icon: ShieldCheck, t: "Atendimento técnico especializado", d: "Equipe treinada para diagnóstico e execução com total segurança." },
  { icon: FileBadge, t: "Laudo técnico e suporte PMOC", d: "Documentação clara, padronizada e apoio completo na manutenção registrada." },
  { icon: Gauge, t: "Diagnóstico antes da execução", d: "Você entende o problema e o orçamento antes de qualquer serviço." },
  { icon: Zap, t: "Foco em economia de energia", d: "Orientação prática para reduzir o consumo do seu equipamento." },
  { icon: Building, t: "Para todo tipo de ambiente", d: "Casas, lojas, escritórios, clínicas e condomínios — atendimento sob medida." },
  { icon: CheckCircle2, t: "Transparência e registro", d: "Orçamento justo, sem surpresas, com histórico técnico organizado." },
];

function Differentiators() {
  return (
    <Section id="diferenciais" eyebrow="Por que a Cnpjotas Ares" title="Diferenciais que fazem a diferença" subtitle="Confiança, técnica e clareza em cada atendimento — do orçamento à entrega.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {diffs.map((d, i) => (
          <motion.div
            key={d.t}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-xl group"
            style={{
              borderColor: "rgba(8,127,154,0.15)",
              background: "white",
            }}
          >
            <div className="w-11 h-11 rounded-2xl grid place-items-center mb-4"
              style={{ background: `${C.cyan}12`, color: C.petrol }}>
              <d.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold leading-snug" style={{ color: C.deep }}>{d.t}</h3>
            <p className="mt-2 text-sm" style={{ color: C.text2 }}>{d.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- PMOC ---------------- */
function PMOC() {
  const blocks = [
    { t: "O que é PMOC", d: "É o Plano de Manutenção, Operação e Controle: um conjunto de boas práticas que mantêm o ar condicionado seguro e eficiente." },
    { t: "Para quem é indicado", d: "Para empresas, escritórios, lojas, clínicas, condomínios e ambientes coletivos que precisam manter tudo em dia." },
    { t: "Por que é importante", d: "Garante qualidade do ar, reduz custos com falhas e ajuda a comprovar a manutenção correta dos equipamentos." },
    { t: "Como ajudamos", d: "Avaliamos, executamos a manutenção e entregamos a documentação técnica que sua operação precisa." },
  ];
  return (
    <section id="pmoc" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{
        background: "white",
      }} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Eyebrow>PMOC & Laudo técnico</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ color: C.deep }}>
              PMOC e laudo técnico para empresas que precisam manter tudo em dia
            </h2>
            <p className="mt-4 text-base" style={{ color: C.text2 }}>
              O Plano de Manutenção, Operação e Controle ajuda empresas a manterem
              seus sistemas de climatização seguros, limpos e funcionando de forma
              adequada. A Cnpjotas Ares pode apoiar na avaliação, manutenção e
              entrega da documentação técnica necessária.
            </p>
            <div className="mt-6 p-5 rounded-3xl border" style={{ borderColor: "rgba(8,127,154,0.2)", background: "white" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center text-white"
                  style={{ background: C.cyan }}>
                  <FileBadge className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold" style={{ color: C.deep }}>Precisa de PMOC ou laudo?</div>
                  <div className="text-sm" style={{ color: C.text2 }}>Avaliamos seu cenário sem compromisso.</div>
                </div>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold w-full sm:w-auto justify-center"
                style={{ background: C.deep }}
              >
                <MessageCircle className="w-4 h-4" /> Falar com a equipe
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {blocks.map((b, i) => (
              <motion.div
                key={b.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-6 rounded-3xl bg-white border hover:shadow-xl transition-shadow"
                style={{ borderColor: "rgba(8,127,154,0.12)" }}
              >
                <div className="w-9 h-9 rounded-xl grid place-items-center mb-3"
                  style={{ background: `${C.cyan}15`, color: C.cyan }}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold" style={{ color: C.deep }}>{b.t}</h3>
                <p className="mt-2 text-sm" style={{ color: C.text2 }}>{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CALCULATOR ---------------- */
const BTU_OPTIONS = [
  { v: 9000, kw: 0.75, label: "9.000" },
  { v: 12000, kw: 1.05, label: "12.000" },
  { v: 18000, kw: 1.6, label: "18.000" },
  { v: 24000, kw: 2.1, label: "24.000" },
  { v: 30000, kw: 2.7, label: "30.000" },
  { v: 0, kw: 0, label: "Personalizado" },
];

function CalculatorSection() {
  const [btu, setBtu] = useState(12000);
  const [customKw, setCustomKw] = useState<string>("1.20");
  const [type, setType] = useState<"conv" | "inv">("conv");
  const [hours, setHours] = useState<string>("8");
  const [days, setDays] = useState<string>("30");
  const [kwh, setKwh] = useState<string>("0.97");
  const [kwhAuto, setKwhAuto] = useState(true);
  const [shown, setShown] = useState(false);

  const result = useMemo(() => {
    const base = btu === 0
      ? parseFloat(customKw.replace(",", "."))
      : BTU_OPTIONS.find((o) => o.v === btu)?.kw ?? 0;
    const h = parseFloat(hours);
    const d = parseFloat(days);
    const tariff = parseFloat(kwh.replace(",", "."));
    if (!base || !h || !d || !tariff || base <= 0 || h <= 0 || d <= 0 || tariff <= 0) return null;
    const kwhMonth = base * h * d;
    const kwhInverter = kwhMonth * 0.7;
    const consumption = type === "inv" ? kwhInverter : kwhMonth;
    const cost = consumption * tariff;
    const costConv = kwhMonth * tariff;
    const costInv = kwhInverter * tariff;
    return {
      consumption: consumption.toFixed(1),
      cost: cost.toFixed(2),
      costConv: costConv.toFixed(2),
      costInv: costInv.toFixed(2),
      savings: (costConv - costInv).toFixed(2),
    };
  }, [btu, customKw, type, hours, days, kwh]);

  useEffect(() => {
    fetchCemigKwh()
      .then(({ kwh: k }) => { setKwh(k); setKwhAuto(true); })
      .catch(() => { /* mantém o default */ });
  }, []);

  function handleCalc() {
    setShown(false);
    setTimeout(() => setShown(true), 50);
  }

  return (
    <section id="calculadora" className="relative py-20 sm:py-28 overflow-hidden text-white" style={{ background: C.deep }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(103,232,249,0.15)", color: C.light }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.light }} />
            Calculadora
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Calcule o gasto mensal estimado do seu ar condicionado
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/75">
            Informe os dados do equipamento e descubra uma estimativa de consumo e custo mensal.
          </p>
        </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-white border shadow-[0_10px_40px_-20px_rgba(8,47,73,0.25)]"
          style={{ borderColor: "rgba(0,153,204,0.15)", color: C.text }}>
          <Field label="Potência do aparelho (BTUs)">
            <div className="flex flex-wrap gap-2">
              {BTU_OPTIONS.map((o) => (
                <button
                  key={o.label}
                  onClick={() => setBtu(o.v)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    btu === o.v ? "text-white shadow-md" : "bg-white hover:bg-cyan-50"
                  }`}
                  style={{
                    background: btu === o.v ? C.cyan : undefined,
                    borderColor: btu === o.v ? "transparent" : "rgba(8,127,154,0.2)",
                    color: btu === o.v ? "white" : C.deep,
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {btu === 0 && (
              <input
                type="number"
                min={0}
                step={0.05}
                value={customKw}
                onChange={(e) => setCustomKw(e.target.value)}
                placeholder="Potência em kW (ex: 1.20)"
                className="mt-3 w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2"
                style={{ borderColor: "rgba(8,127,154,0.25)" }}
              />
            )}
          </Field>

          <Field label="Tipo do aparelho">
            <div className="flex gap-2">
              {[
                { v: "conv", l: "Convencional" },
                { v: "inv", l: "Inverter" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setType(o.v as "conv" | "inv")}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all"
                  style={{
                    background: type === o.v ? C.cyan : "white",
                    color: type === o.v ? "white" : C.deep,
                    borderColor: type === o.v ? "transparent" : "rgba(8,127,154,0.2)",
                  }}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Horas de uso por dia">
              <input
                type="number" min={0} max={24} value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2"
                style={{ borderColor: "rgba(8,127,154,0.25)" }}
              />
            </Field>
            <Field label="Dias de uso por mês">
              <input
                type="number" min={0} max={31} value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2"
                style={{ borderColor: "rgba(8,127,154,0.25)" }}
              />
            </Field>
          </div>

          <Field label="Valor do kWh (R$)">
            <input
              type="text" inputMode="decimal" value={kwh}
              onChange={(e) => { setKwh(e.target.value); setKwhAuto(false); }}
              className="w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2"
              style={{ borderColor: "rgba(8,127,154,0.25)" }}
            />
            {kwhAuto && (
              <p className="mt-1.5 text-[11px] flex items-center gap-1.5" style={{ color: C.cyan }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 inline-block" style={{ background: C.cyan }} />
                Tarifa CEMIG estimada para Belo Horizonte — editável
              </p>
            )}
          </Field>

          <button
            onClick={handleCalc}
            disabled={!result}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: C.cyan }}
          >
            <Calculator className="w-4 h-4" /> Calcular estimativa
          </button>

          <p className="mt-4 text-xs leading-relaxed" style={{ color: C.text2 }}>
            Os valores são estimativas. O consumo real pode variar conforme modelo
            do equipamento, instalação, ambiente, tarifa de energia e rotina de uso.
          </p>
        </div>

        {/* Result */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden"
            style={{ background: C.deep }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `${C.cyan}66` }} />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest opacity-80">Estimativa mensal</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={result ? `${result.consumption}-${result.cost}-${shown}` : "empty"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mt-2 text-4xl font-extrabold">
                    {result ? `R$ ${result.cost.replace(".", ",")}` : "—"}
                  </div>
                  <div className="mt-1 text-sm opacity-90">
                    {result ? `${result.consumption} kWh / mês` : "Preencha os campos para calcular"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white border"
              style={{ borderColor: "rgba(8,127,154,0.15)" }}
            >
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.text2 }}>
                Convencional × Inverter
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl" style={{ background: C.bgLight }}>
                  <div className="text-[10px] font-semibold" style={{ color: C.text2 }}>CONVENCIONAL</div>
                  <div className="text-lg font-bold" style={{ color: C.deep }}>R$ {result.costConv.replace(".", ",")}</div>
                </div>
                <div className="p-3 rounded-2xl text-white" style={{ background: C.cyan }}>
                  <div className="text-[10px] font-semibold opacity-90">INVERTER</div>
                  <div className="text-lg font-bold">R$ {result.costInv.replace(".", ",")}</div>
                </div>
              </div>
              <div className="mt-3 text-sm" style={{ color: C.text }}>
                Economia estimada: <span className="font-bold" style={{ color: C.cyan }}>R$ {result.savings.replace(".", ",")}</span>
              </div>
            </motion.div>
          )}

          <div className="p-5 rounded-3xl border flex gap-3"
            style={{ borderColor: "rgba(8,127,154,0.15)", background: "white" }}>
            <div className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
              style={{ background: `${C.cyan}15`, color: C.cyan }}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: C.deep }}>Dica de economia</div>
              <div className="text-sm mt-1" style={{ color: C.text2 }}>
                Manter filtros limpos, portas fechadas e temperatura entre 23°C e 24°C pode ajudar a reduzir o consumo.
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>

  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2" style={{ color: C.deep }}>{label}</label>
      {children}
    </div>
  );
}

/* ---------------- PROCESS ---------------- */
const steps = [
  { t: "Solicitação", d: "Você nos chama pelo WhatsApp e conta o que precisa." },
  { t: "Avaliação técnica", d: "Analisamos o equipamento e o ambiente com cuidado." },
  { t: "Diagnóstico e orçamento", d: "Apresentamos o problema e o orçamento transparente." },
  { t: "Execução", d: "Realizamos o serviço com segurança e equipamento adequado." },
  { t: "Orientação final", d: "Você recebe orientações e o registro técnico do serviço." },
];

function Process() {
  return (
    <Section eyebrow="Como funciona" title="Um processo claro do início ao fim" subtitle="Atendimento simples, transparente e organizado em cada etapa.">
      <div className="relative">
        <div className="hidden md:block absolute left-0 right-0 top-9 h-px"
          style={{ background: `${C.cyan}40` }} />
        <div className="grid md:grid-cols-5 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-5 rounded-3xl bg-white border text-center md:text-left"
              style={{ borderColor: "rgba(8,127,154,0.15)" }}
            >
              <div className="mx-auto md:mx-0 w-14 h-14 rounded-2xl grid place-items-center text-white font-bold text-lg shadow-lg"
                style={{ background: C.cyan }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 font-bold" style={{ color: C.deep }}>{s.t}</h3>
              <p className="mt-1 text-sm" style={{ color: C.text2 }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- AUDIENCES ---------------- */
const audiences = [
  { icon: Home, t: "Residências" },
  { icon: Building2, t: "Empresas" },
  { icon: Briefcase, t: "Escritórios" },
  { icon: Store, t: "Lojas" },
  { icon: Building, t: "Condomínios" },
  { icon: Hospital, t: "Clínicas" },
  { icon: UtensilsCrossed, t: "Restaurantes" },
  { icon: Wind, t: "Ambientes comerciais" },
];

function Audiences() {
  return (
    <Section eyebrow="Para quem atendemos" title="Atendimento pensado para cada tipo de ambiente" subtitle="Atendimento pensado para cada tipo de ambiente, considerando conforto térmico, segurança, consumo de energia e rotina de uso.">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {audiences.map((a, i) => (
          <motion.div
            key={a.t}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            className="p-6 rounded-3xl bg-white border text-center hover:-translate-y-1 hover:shadow-xl transition-all"
            style={{ borderColor: "rgba(8,127,154,0.12)" }}
          >
            <div className="mx-auto w-12 h-12 rounded-2xl grid place-items-center mb-3"
              style={{ background: `${C.cyan}15`, color: C.cyan }}>
              <a.icon className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm" style={{ color: C.deep }}>{a.t}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section id="contato" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-14 text-white shadow-2xl"
          style={{ background: C.deep }}>
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl" style={{ background: `${C.light}66` }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl" style={{ background: `${C.cyan}66` }} />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Eyebrow light>Vamos conversar</Eyebrow>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Precisa instalar, revisar ou consertar seu ar condicionado?
              </h2>
              <p className="mt-4 text-base opacity-90 max-w-lg">
                Fale com a Cnpjotas Ares e receba uma orientação técnica para escolher o melhor caminho.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL} target="_blank" rel="noreferrer"
                  className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold shadow-xl transition-transform hover:-translate-y-0.5 overflow-hidden"
                  style={{ background: "white", color: C.deep }}
                >
                  <MessageCircle className="w-4 h-4" /> Chamar no WhatsApp
                </a>
                <a
                  href={WHATSAPP_URL} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  Solicitar avaliação <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="grid gap-3">
              <ContactRow icon={<PhoneCall className="w-4 h-4" />} label="WhatsApp" value="(XX) XXXXX-XXXX" />
              <ContactRow icon={<Mail className="w-4 h-4" />} label="E-mail" value="contato@cnpjotasareas.com.br" />
              <ContactRow icon={<MapPin className="w-4 h-4" />} label="Região de atendimento" value="Informe sua região para confirmarmos o atendimento" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md border"
      style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
      <div className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
        style={{ background: "rgba(255,255,255,0.15)" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest opacity-80">{label}</div>
        <div className="font-semibold truncate">{value}</div>
      </div>
    </div>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="pt-16 pb-10" style={{ background: C.bgDark, color: "rgba(255,255,255,0.85)" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <AclimaLogo height={36} />
            </div>
            <p className="mt-4 text-sm max-w-md opacity-80">
              Especialistas em climatização: instalação, manutenção preventiva e
              corretiva, higienização, reparos, PMOC e laudos técnicos com
              atendimento ágil e cuidadoso.
            </p>
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-3">Links rápidos</div>
            <ul className="space-y-2 text-sm opacity-80">
              {navLinks.map((l) => (
                <li key={l.href}><a href={l.href} className="hover:opacity-100">{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-3">Contato</div>
            <ul className="space-y-2 text-sm opacity-80">
              <li>(XX) XXXXX-XXXX</li>
              <li>contato@cnpjotasareas.com.br</li>
              <li>Atendimento sob agendamento</li>
            </ul>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{ background: C.cyan }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-70"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div>© {new Date().getFullYear()} Cnpjotas Ares. Todos os direitos reservados.</div>
          <div>Climatização • Manutenção • PMOC • Laudo Técnico</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING WHATSAPP ---------------- */
function FloatingWhats() {
  return (
    <a
      href={WHATSAPP_URL} target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full grid place-items-center text-white shadow-2xl transition-transform hover:scale-110"
      style={{ background: C.cyan }}
      aria-label="Falar no WhatsApp"
    >
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: C.cyan }} />
      <MessageCircle className="w-6 h-6 relative" />
    </a>
  );
}

/* ---------------- SHARED ---------------- */
function Section({
  id, eyebrow, title, subtitle, children,
}: { id?: string; eyebrow: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ color: C.deep }}>
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-base sm:text-lg" style={{ color: C.text2 }}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
      style={{
        background: light ? "rgba(255,255,255,0.15)" : "rgba(8,127,154,0.1)",
        color: light ? "white" : C.petrol,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: light ? "white" : C.cyan }} />
      {children}
    </span>
  );
}

/* ---------------- CLIENTS ---------------- */
const clients = [
  {
    name: "Vértice",
    tag: "Condomínios",
    color: "#1D4ED8",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,4 110,44 10,44" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
        <text x="60" y="40" textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="13" fill="currentColor">VÉRTICE</text>
      </svg>
    ),
  },
  {
    name: "Studio Norte",
    tag: "Arquitetura",
    color: "#7C3AED",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="40" y1="6" x2="40" y2="42" stroke="currentColor" strokeWidth="3" />
        <line x1="22" y1="24" x2="58" y2="24" stroke="currentColor" strokeWidth="3" />
        <text x="68" y="20" fontFamily="system-ui" fontWeight="800" fontSize="11" fill="currentColor">STUDIO</text>
        <text x="68" y="34" fontFamily="system-ui" fontWeight="800" fontSize="11" fill="currentColor">NORTE</text>
      </svg>
    ),
  },
  {
    name: "Café da Praça",
    tag: "Restaurante",
    color: "#B45309",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="20" width="28" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M46 26 Q58 26 58 33 Q58 40 46 40" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M26 20 Q26 12 32 8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="66" y="20" fontFamily="system-ui" fontWeight="800" fontSize="10" fill="currentColor">CAFÉ DA</text>
        <text x="66" y="34" fontFamily="system-ui" fontWeight="800" fontSize="10" fill="currentColor">PRAÇA</text>
      </svg>
    ),
  },
  {
    name: "Clínica Vitalis",
    tag: "Saúde",
    color: "#059669",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="26" y="14" width="8" height="22" rx="4" fill="currentColor" />
        <rect x="16" y="20" width="28" height="8" rx="4" fill="currentColor" />
        <text x="56" y="20" fontFamily="system-ui" fontWeight="800" fontSize="10" fill="currentColor">CLÍNICA</text>
        <text x="56" y="34" fontFamily="system-ui" fontWeight="800" fontSize="10" fill="currentColor">VITALIS</text>
      </svg>
    ),
  },
  {
    name: "Atlas Corp",
    tag: "Corporativo",
    color: "#D97706",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="4" />
        <ellipse cx="30" cy="24" rx="8" ry="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="14" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="2.5" />
        <text x="56" y="20" fontFamily="system-ui" fontWeight="800" fontSize="12" fill="currentColor">ATLAS</text>
        <text x="56" y="35" fontFamily="system-ui" fontWeight="800" fontSize="12" fill="currentColor">CORP</text>
      </svg>
    ),
  },
  {
    name: "Mar Azul",
    tag: "Varejo",
    color: "#0284C7",
    logo: (
      <svg viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30 Q20 18 30 30 Q40 42 50 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M10 20 Q20 8 30 20 Q40 32 50 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <text x="58" y="20" fontFamily="system-ui" fontWeight="800" fontSize="12" fill="currentColor">MAR</text>
        <text x="58" y="35" fontFamily="system-ui" fontWeight="800" fontSize="12" fill="currentColor">AZUL</text>
      </svg>
    ),
  },
];

function Clients() {
  return (
    <section className="py-16 sm:py-24 border-t" style={{ background: "white", borderColor: "rgba(0,153,204,0.1)" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center mb-12">
          <Eyebrow>Quem confia em nosso trabalho</Eyebrow>
          <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold" style={{ color: C.deep }}>
            Empresas e ambientes que já atendemos
          </h3>
          <p className="mt-3 text-sm" style={{ color: C.text2 }}>
            Passe o mouse sobre cada logo para ver a identidade completa.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {clients.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group flex flex-col items-center gap-2 cursor-default"
            >
              <div
                className="w-full flex items-center justify-center h-16 transition-all duration-300"
                style={{ color: "#9CA3AF" }}
              >
                <div
                  className="w-full transition-all duration-300 group-hover:scale-105"
                  style={{
                    color: "#9CA3AF",
                    filter: "grayscale(1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.color = c.color;
                    el.style.filter = "grayscale(0)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.color = "#9CA3AF";
                    el.style.filter = "grayscale(1)";
                  }}
                >
                  {c.logo}
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-center" style={{ color: C.text2 }}>{c.tag}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
const gallery = [
  { src: work1, title: "Instalação residencial", tag: "Split 12.000 BTUs" },
  { src: work2, title: "Instalação externa em condomínio", tag: "Condensadora" },
  { src: work5, title: "Sistema corporativo em rooftop", tag: "Empresarial" },
  { src: work4, title: "Higienização técnica", tag: "Limpeza profunda" },
  { src: work6, title: "Diagnóstico elétrico", tag: "Reparo técnico" },
  { src: work3, title: "Conforto térmico em sala de estar", tag: "Residencial" },
];

function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="trabalhos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <Eyebrow>Trabalhos realizados</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ color: C.deep }}>
              Resultados reais de quem cuida do ar com técnica
            </h2>
            <p className="mt-4 text-base sm:text-lg" style={{ color: C.text2 }}>
              Uma amostra de instalações, manutenções e serviços técnicos realizados pela nossa equipe.
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white shadow-lg w-fit"
            style={{ background: C.cyan }}
          >
            Quero um serviço assim <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="relative">
          <div className="overflow-hidden -mx-2" ref={emblaRef}>
            <div className="flex">
              {gallery.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 px-2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg group">
                    <img
                      src={g.src}
                      alt={g.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(180deg, transparent 40%, ${C.deep}e6 100%)` }}
                    />
                    <div className="absolute inset-x-4 bottom-4 text-white">
                      <div className="text-[10px] uppercase tracking-widest opacity-80">{g.tag}</div>
                      <div className="font-bold leading-tight">{g.title}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-4 w-10 h-10 rounded-full grid place-items-center text-white shadow-lg transition-transform hover:scale-110 z-10"
            style={{ background: C.cyan }}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-4 w-10 h-10 rounded-full grid place-items-center text-white shadow-lg transition-transform hover:scale-110 z-10"
            style={{ background: C.cyan }}
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

