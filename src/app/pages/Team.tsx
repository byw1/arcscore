import { useState } from "react";
import { useDemo } from "@/demo/store";
import { ROLES, type Role } from "@/demo/data";
import { Avatar, Button, Card, Input, Modal, PageHeader, Select, Status } from "@/components/ui/primitives";

export function Team() {
  const { state, dispatch, persona } = useDemo();
  const members = state.members[state.persona!];
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Analyst");
  const [team, setTeam] = useState(persona.teams[0]);
  const me = persona.user.email;

  return (
    <>
      <PageHeader title="Team" sub={`${members.length} people in ${persona.org}`} actions={<Button variant="primary" onClick={() => setInvite(true)}>Invite people</Button>} />
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <Card pad={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-[13.5px]">
              <thead className="border-b border-line text-[12px] text-ink-3">
                <tr>
                  <th className="px-4 py-2.5 text-left font-normal">Name</th>
                  <th className="px-3 py-2.5 text-left font-normal">Team</th>
                  <th className="px-3 py-2.5 text-left font-normal">Role</th>
                  <th className="px-3 py-2.5 text-left font-normal">Last active</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-line/70 last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={m.name.split(" ").map((w) => w[0]).slice(-2).join("")} />
                        <span><span className="block font-medium">{m.name}{m.email === me && <span className="ml-1.5 text-ink-4">you</span>}</span><span className="block text-[12px] text-ink-3">{m.email}</span></span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-ink-2">{m.team}</td>
                    <td className="px-3 py-2.5">
                      {m.email === me ? (
                        <span className="text-ink-2">{m.role}</span>
                      ) : (
                        <Select label={`Role for ${m.name}`} value={m.role} onChange={(r) => { dispatch({ type: "setRole", id: m.id, role: r as Role }); dispatch({ type: "toast", text: `${m.name} is now ${r}` }); }} options={ROLES.map((r) => r.role)} className="h-8 text-[13px]" />
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-ink-3">{m.pending ? <Status tone="pending">Invited</Status> : m.lastActive}</td>
                    <td className="pr-3 text-right">
                      {m.email !== me && (
                        <Button variant="danger" size="sm" onClick={() => { dispatch({ type: "removeMember", id: m.id }); dispatch({ type: "toast", text: `${m.name} removed` }); }}>Remove</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2 className="title mb-3 text-[15px]">Roles</h2>
          <ul className="space-y-3">
            {ROLES.map((r) => (
              <li key={r.role} className="text-[13px]">
                <div className="font-medium">{r.role}</div>
                <div className="text-ink-3">{r.desc}</div>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-line pt-4 text-[12.5px] text-ink-3">
            Teams: {persona.teams.join(", ")}. Members only see the athletes, deals and campaigns their team owns.
          </div>
        </Card>
      </div>
      <Modal open={invite} onClose={() => setInvite(false)} title="Invite people">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const list = email.split(/[,\s]+/).filter((x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
            list.forEach((addr, i) =>
              dispatch({ type: "invite", member: { id: `inv${Date.now()}${i}`, name: addr.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email: addr, role, team, lastActive: "", pending: true } })
            );
            dispatch({ type: "toast", text: list.length ? `${list.length} invite${list.length > 1 ? "s" : ""} sent` : "Enter at least one valid email" });
            if (list.length) { setEmail(""); setInvite(false); }
          }}
        >
          <label className="block text-[13px] text-ink-2">Emails<Input className="mt-1.5" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com, another@company.com" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-[13px] text-ink-2">Role<Select label="Role" value={role} onChange={(v) => setRole(v as Role)} options={ROLES.filter((r) => r.role !== "Owner").map((r) => r.role)} className="mt-1.5 w-full" /></label>
            <label className="block text-[13px] text-ink-2">Team<Select label="Team" value={team} onChange={setTeam} options={persona.teams} className="mt-1.5 w-full" /></label>
          </div>
          <p className="text-[12.5px] text-ink-3">Demo only: no email is sent.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setInvite(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Send invites</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
