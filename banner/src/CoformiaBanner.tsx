import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  Database,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const LOOP = 14;
const FADE = 0.5;

const spring = { type: "spring" as const, stiffness: 110, damping: 22, mass: 0.85 };

/** Opacity for a time window on a looping clock. `start > end` wraps past 0. */
function bandOpacity(t: number, start: number, end: number) {
  const span = end >= start ? end - start : LOOP - start + end;
  const pos = t >= start ? t - start : t + LOOP - start;
  if (pos < 0 || pos > span) return 0;
  return Math.min(1, pos / FADE, (span - pos) / FADE);
}

function useBand(clock: MotionValue<number>, start: number, end: number) {
  return useTransform(clock, (t) => bandOpacity(t, start, end));
}

const friction = [
  { icon: FileSpreadsheet, title: "roster_week32_v4.xlsx", note: "Last edited by someone" },
  { icon: Mail, title: "RE: RE: FW: formula change", note: "14 replies, no decision" },
  { icon: MessageCircle, title: "Group chat", note: "Who's coming Thursday?" },
  { icon: Database, title: "Retype into ERP", note: "By Friday, hopefully" },
];

const steps = [
  { label: "Formula change", detail: "One record" },
  { label: "AI prepares", detail: "Draft + spec check" },
  { label: "People approve", detail: "Nothing ships alone" },
  { label: "ERP stays in sync", detail: "SAP and the rest" },
];

function activeScene(t: number): 1 | 2 | 3 {
  if (t >= 13.5 || t < 4.45) return 1;
  if (t < 9.35) return 2;
  return 3;
}

export function CoformiaBanner() {
  const reduced = useReducedMotion();
  const clock = useMotionValue(reduced ? 11.2 : 0.2);
  const sceneRef = useRef<1 | 2 | 3>(reduced ? 3 : 1);
  const [scene, setScene] = useState<1 | 2 | 3>(reduced ? 3 : 1);
  const [plays, setPlays] = useState({ 1: 0, 2: 0, 3: 0 });

  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const t = ((performance.now() - start) / 1000) % LOOP;
      clock.set(t);
      const next = activeScene(t);
      if (next !== sceneRef.current) {
        sceneRef.current = next;
        setScene(next);
        setPlays((prev) => ({ ...prev, [next]: prev[next] + 1 }));
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [clock, reduced]);

  const s1 = useBand(clock, 13.5, 4.7);
  const s2 = useBand(clock, 4.2, 9.6);
  const s3 = useBand(clock, 9.1, 13.5);
  const y1 = useTransform(s1, [0, 1], [10, 0]);
  const y2 = useTransform(s2, [0, 1], [10, 0]);
  const y3 = useTransform(s3, [0, 1], [10, 0]);
  const pathDraw = useTransform(s2, [0, 1], [0, 1]);

  return (
    <section
      aria-label="Coformia: paper, spreadsheets, and chats become one connected process"
      className="relative isolate overflow-hidden bg-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(28,57,187,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(47,158,111,0.08),transparent_50%)]"
      />
      <div className="relative mx-auto flex min-h-[480px] w-full max-w-[1360px] items-center px-[22px] py-8 md:min-h-[560px] xl:min-h-[600px]">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-12">
          <Copy scene={scene} clock={clock} />
          <div className="relative aspect-[21/9] min-h-[280px] w-full sm:min-h-[320px] lg:aspect-auto lg:h-[420px]">
            <Scene opacity={s1} y={y1} label="Scattered work" hidden={scene !== 1}>
              <FrictionBoard key={plays[1]} />
            </Scene>
            <Scene opacity={s2} y={y2} label="Connected process" hidden={scene !== 2}>
              <FlowBoard key={plays[2]} pathDraw={pathDraw} />
            </Scene>
            <Scene opacity={s3} y={y3} label="Approved and in sync" hidden={scene !== 3}>
              <ResultBoard key={plays[3]} />
            </Scene>
          </div>
        </div>
      </div>
    </section>
  );
}

const lines = {
  1: { kicker: "The friction", title: "Paper, sheets, and chats.", accent: "Still the system of record." },
  2: { kicker: "The shift", title: "AI prepares the work.", accent: "People approve it." },
  3: { kicker: "The result", title: "One live record.", accent: "Right everywhere." },
} as const;

function Copy({ scene, clock }: { scene: 1 | 2 | 3; clock: MotionValue<number> }) {
  const line = lines[scene];
  const o1 = useBand(clock, 13.5, 4.7);
  const o2 = useBand(clock, 4.2, 9.6);
  const o3 = useBand(clock, 9.1, 13.5);

  return (
    <div className="relative max-w-xl">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-persian">
        Connected processes
      </p>
      <h1 className="sr-only">
        {line.title} {line.accent}
      </h1>
      <div aria-hidden className="relative mt-4 min-h-[240px] sm:min-h-[280px]">
        <StackedLine opacity={o1} {...lines[1]} />
        <StackedLine opacity={o2} {...lines[2]} />
        <StackedLine opacity={o3} {...lines[3]} />
      </div>
      <p className="mt-2 max-w-md text-base font-medium leading-snug text-soft sm:text-lg">
        Coformia turns the work food plants and operators still run by hand into one connected process — then keeps ERP in sync.
      </p>
      <a
        href="mailto:info@coformia.com?subject=One%20process%20to%20digitalize"
        className="group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-[15px] font-semibold text-white"
      >
        <span
          aria-hidden
          className="absolute inset-0 border border-white/60 bg-persian/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md transition group-hover:bg-persian-deep"
        />
        <span className="relative z-[1] inline-flex items-center gap-2">
          Talk to us
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </a>
    </div>
  );
}

function StackedLine({
  opacity,
  kicker,
  title,
  accent,
}: {
  opacity: MotionValue<number>;
  kicker: string;
  title: string;
  accent: string;
}) {
  const y = useTransform(opacity, [0, 1], [10, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <p className="text-sm font-medium text-soft">{kicker}</p>
      <p className="mt-1 text-[clamp(30px,3.6vw,48px)] font-bold leading-[1.05] tracking-[-0.03em]">
        {title}
        <span className="mt-1 block text-persian">{accent}</span>
      </p>
    </motion.div>
  );
}

function Scene({
  opacity,
  y,
  label,
  hidden,
  children,
}: {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  label: string;
  hidden: boolean;
  children: React.ReactNode;
}) {
  const scale = useTransform(opacity, [0, 1], [0.95, 1]);
  return (
    <motion.div
      aria-hidden={hidden}
      role="group"
      aria-label={label}
      style={{ opacity, y, scale }}
      className={`absolute inset-0 ${hidden ? "pointer-events-none" : ""}`}
    >
      {children}
    </motion.div>
  );
}

function FrictionBoard() {
  return (
    <div className="grid h-full grid-cols-2 content-center gap-3">
      {friction.map((item, i) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
          transition={{
            opacity: { delay: i * 0.1, duration: 0.35 },
            scale: { ...spring, delay: i * 0.1 },
            y: { delay: 0.4 + i * 0.12, duration: 3.2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="rounded-xl border border-line bg-white p-3 shadow-card"
          style={{ rotate: i % 2 === 0 ? -1.25 : 1.25 }}
        >
          <div className="flex items-start gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-paper text-persian">
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold">{item.title}</span>
              <span className="block truncate text-xs text-soft">{item.note}</span>
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function FlowBoard({ pathDraw }: { pathDraw: MotionValue<number> }) {
  return (
    <div className="relative flex h-full items-center">
      <svg className="absolute inset-x-6 top-1/2 hidden h-16 w-[calc(100%-3rem)] -translate-y-1/2 md:block" viewBox="0 0 600 40" fill="none" aria-hidden>
        <motion.path
          d="M8 20 H592"
          stroke="#1C39BB"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: pathDraw }}
        />
      </svg>
      <ol className="relative grid w-full grid-cols-2 gap-3 md:grid-cols-4">
        {steps.map((step, i) => (
          <motion.li
            key={step.label}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.08 * i }}
            className="rounded-xl border border-line bg-white p-3 shadow-lift"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-persian">
              0{i + 1}
            </span>
            <span className="mt-2 block text-sm font-semibold leading-tight">{step.label}</span>
            <span className="mt-1 block text-xs text-soft">{step.detail}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function ResultBoard() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const id = window.setTimeout(() => setCount(1), 280);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="flex h-full items-center">
      <div className="w-full rounded-2xl border border-line bg-white p-5 shadow-lift sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-soft">Live record</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">Vanilla 2% — spec 14</p>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...spring, delay: 0.16 }}
            className="inline-flex items-center gap-1 rounded-full bg-ok/10 px-2.5 py-1 text-xs font-semibold text-ok"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
            Approved
          </motion.span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Metric value={String(count)} label="source of truth" delay={0.08} />
          <Metric value="AI" label="prepared the draft" delay={0.16} />
          <Metric value="Sync" label="ERP matches" delay={0.24} />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.32 }}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-persian"
        >
          <Sparkles className="h-4 w-4" />
          Change once. The connected record stays right.
        </motion.p>
      </div>
    </div>
  );
}

function Metric({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring, delay }}
      className="rounded-xl bg-paper px-3 py-3"
    >
      <span className="block text-2xl font-bold tracking-tight text-ink">{value}</span>
      <span className="mt-0.5 block text-[11px] leading-tight text-soft">{label}</span>
    </motion.div>
  );
}
