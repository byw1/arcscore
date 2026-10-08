import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DemoProvider, useDemo } from "@/demo/store";
import { Landing } from "@/site/Landing";
import { Login } from "@/site/Login";
import { Shell } from "@/app/Shell";
import { Overview } from "@/app/pages/Overview";
import { Athletes } from "@/app/pages/Athletes";
import { AthleteProfile } from "@/app/pages/AthleteProfile";
import { Discover } from "@/app/pages/Discover";
import { Campaigns, CampaignDetail } from "@/app/pages/Campaigns";
import { Roster } from "@/app/pages/Roster";
import { Deals } from "@/app/pages/Deals";
import { Opportunities } from "@/app/pages/Opportunities";
import { Team } from "@/app/pages/Team";
import { Settings } from "@/app/pages/Settings";
import type { PersonaKey } from "@/demo/data";

/** Sends a page to Overview when the current workspace doesn't have it. */
function Only({ for: allowed, children }: { for: PersonaKey[]; children: React.ReactNode }) {
  const { state } = useDemo();
  return state.persona && allowed.includes(state.persona) ? <>{children}</> : <Navigate to="/app" replace />;
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Shell />}>
            <Route index element={<Overview />} />
            <Route path="athletes" element={<Only for={["brand", "school"]}><Athletes /></Only>} />
            <Route path="athletes/:id" element={<AthleteProfile />} />
            <Route path="discover" element={<Only for={["brand"]}><Discover /></Only>} />
            <Route path="campaigns" element={<Only for={["brand"]}><Campaigns /></Only>} />
            <Route path="campaigns/:id" element={<Only for={["brand"]}><CampaignDetail /></Only>} />
            <Route path="roster" element={<Only for={["school"]}><Roster /></Only>} />
            <Route path="deals" element={<Deals />} />
            <Route path="opportunities" element={<Only for={["athlete"]}><Opportunities /></Only>} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  );
}
