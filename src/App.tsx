import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DemoProvider, useDemo } from "@/demo/store";
import { Landing } from "@/site/Landing";
import type { PersonaKey } from "@/demo/data";
import { loadLogin, loadOverview, loadShell } from "@/lib/prefetch";

// The landing page ships in the entry chunk; everything behind "Try the demo"
// loads on demand (and is prefetched once the landing page is idle).
const named = <T extends Record<string, unknown>, K extends keyof T>(load: () => Promise<T>, key: K) =>
  lazy(() => load().then((m) => ({ default: m[key] as React.ComponentType })));
const Login = named(loadLogin, "Login");
const Shell = named(loadShell, "Shell");
const Overview = named(loadOverview, "Overview");
const Athletes = named(() => import("@/app/pages/Athletes"), "Athletes");
const AthleteProfile = named(() => import("@/app/pages/AthleteProfile"), "AthleteProfile");
const Discover = named(() => import("@/app/pages/Discover"), "Discover");
const Campaigns = named(() => import("@/app/pages/Campaigns"), "Campaigns");
const CampaignDetail = named(() => import("@/app/pages/Campaigns"), "CampaignDetail");
const Roster = named(() => import("@/app/pages/Roster"), "Roster");
const Deals = named(() => import("@/app/pages/Deals"), "Deals");
const Opportunities = named(() => import("@/app/pages/Opportunities"), "Opportunities");
const Team = named(() => import("@/app/pages/Team"), "Team");
const Settings = named(() => import("@/app/pages/Settings"), "Settings");
const loadAdmin = () => import("@/app/pages/Admin");
const Clients = named(loadAdmin, "Clients");
const ScoreModel = named(loadAdmin, "ScoreModel");
const Sources = named(loadAdmin, "Sources");
const AuditLog = named(loadAdmin, "AuditLog");
const MediaKit = named(() => import("@/site/MediaKit"), "MediaKit");

/** Sends a page to Overview when the current workspace doesn't have it. */
function Only({ for: allowed, children }: { for: PersonaKey[]; children: React.ReactNode }) {
  const { state } = useDemo();
  return state.persona && allowed.includes(state.persona) ? <>{children}</> : <Navigate to="/app" replace />;
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kit/:id" element={<MediaKit />} />
          <Route path="/app" element={<Shell />}>
            <Route index element={<Overview />} />
            <Route path="athletes" element={<Only for={["brand", "school", "admin"]}><Athletes /></Only>} />
            <Route path="athletes/:id" element={<AthleteProfile />} />
            <Route path="discover" element={<Only for={["brand"]}><Discover /></Only>} />
            <Route path="campaigns" element={<Only for={["brand"]}><Campaigns /></Only>} />
            <Route path="campaigns/:id" element={<Only for={["brand"]}><CampaignDetail /></Only>} />
            <Route path="roster" element={<Only for={["school"]}><Roster /></Only>} />
            <Route path="deals" element={<Only for={["brand", "school", "athlete"]}><Deals /></Only>} />
            <Route path="opportunities" element={<Only for={["athlete"]}><Opportunities /></Only>} />
            <Route path="clients" element={<Only for={["admin"]}><Clients /></Only>} />
            <Route path="model" element={<Only for={["admin"]}><ScoreModel /></Only>} />
            <Route path="sources" element={<Only for={["admin"]}><Sources /></Only>} />
            <Route path="audit" element={<Only for={["admin"]}><AuditLog /></Only>} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </DemoProvider>
  );
}
