import { useDemo } from "@/demo/store";
import { Button, Card, CardHeader, Input, PageHeader, Status } from "@/components/ui/primitives";

const INTEGRATIONS: Record<string, { name: string; desc: string; on: boolean }[]> = {
  brand: [
    { name: "Shopify", desc: "Attribute sales to athlete content", on: true },
    { name: "Meta Ads", desc: "Boost athlete posts as partnership ads", on: true },
    { name: "Slack", desc: "Deal and campaign updates in #partnerships", on: false },
    { name: "DocuSign", desc: "Contracts and signatures", on: true },
  ],
  school: [
    { name: "Teamworks", desc: "Sync rosters and revenue-share payments", on: true },
    { name: "NIL Go", desc: "Submit deal files to the clearinghouse", on: true },
    { name: "Slack", desc: "Compliance alerts in #nil-compliance", on: true },
    { name: "Okta", desc: "Single sign-on for staff", on: false },
  ],
  admin: [
    { name: "Stripe", desc: "Subscriptions and invoicing", on: true },
    { name: "HubSpot", desc: "Client CRM and renewals", on: true },
    { name: "PagerDuty", desc: "Data-source incident alerts", on: true },
    { name: "Okta", desc: "Staff single sign-on", on: true },
  ],
  athlete: [
    { name: "Instagram", desc: "Audience and engagement", on: true },
    { name: "TikTok", desc: "Audience and engagement", on: true },
    { name: "YouTube", desc: "Audience and engagement", on: true },
    { name: "Bank account", desc: "Payouts within 2 business days", on: false },
  ],
};

export function Settings() {
  const { state, dispatch, persona } = useDemo();
  return (
    <>
      <PageHeader title="Settings" sub={persona.org} />
      <div className="grid max-w-3xl gap-5">
        <Card>
          <CardHeader title={persona.key === "athlete" ? "Profile" : "Organization"} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[13px] text-ink-2">Name<Input className="mt-1.5" defaultValue={persona.org} /></label>
            <label className="text-[13px] text-ink-2">Contact email<Input className="mt-1.5" defaultValue={persona.user.email} /></label>
          </div>
          <div className="mt-4 flex justify-end"><Button onClick={() => dispatch({ type: "toast", text: "Saved" })}>Save</Button></div>
        </Card>
        <Card>
          <CardHeader title="Integrations" />
          <ul className="divide-y divide-line">
            {INTEGRATIONS[state.persona!].map((i) => (
              <li key={i.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div><div className="text-[13.5px] font-medium">{i.name}</div><div className="text-[12.5px] text-ink-3">{i.desc}</div></div>
                {i.on ? <Status tone="good">Connected</Status> : <Button size="sm" onClick={() => dispatch({ type: "toast", text: `${i.name} isn't connected in the demo` })}>Connect</Button>}
              </li>
            ))}
          </ul>
        </Card>
        {persona.key !== "athlete" && persona.key !== "admin" && (
          <Card>
            <CardHeader title="Plan" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-medium">{persona.key === "school" ? "Athletic Department" : "Brand Pro"}</div>
                <div className="text-[13px] text-ink-3">{persona.key === "school" ? "Unlimited staff seats, full roster, API access" : "10 seats, unlimited campaigns, deal files included"}</div>
              </div>
              <Button variant="ghost" onClick={() => dispatch({ type: "toast", text: "Billing is disabled in the demo" })}>Manage</Button>
            </div>
          </Card>
        )}
        <Card>
          <CardHeader title="Demo data" sub="Put every athlete, deal and teammate back the way they started." />
          <Button variant="danger" onClick={() => dispatch({ type: "reset" })}>Reset demo</Button>
        </Card>
      </div>
    </>
  );
}
