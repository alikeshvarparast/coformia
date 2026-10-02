import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CoformiaBanner } from "./CoformiaBanner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="min-h-screen bg-white text-ink">
      <CoformiaBanner />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-persian">
          Preview
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Banner sits above the page.
        </h2>
        <p className="mt-3 max-w-xl text-lg text-soft">
          The loop above is the production component. This block is only here so
          you can see how the hero meets the rest of the page.
        </p>
      </section>
    </main>
  </StrictMode>,
);
