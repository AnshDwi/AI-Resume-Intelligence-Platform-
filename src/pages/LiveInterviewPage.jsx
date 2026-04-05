import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import PageContainer from "../components/PageContainer";
import { bookInterviewSession, createInterviewSession, getInterviewSessions, getMyInterviewBookings, joinInterviewSession } from "../services/api";

function LiveInterviewPage() {
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    domain: "Frontend Developer",
    session_date: "2026-04-10",
    session_time: "19:00",
    capacity: 10
  });

  const loadData = async () => {
    try {
      const [sessionData, bookingData] = await Promise.all([getInterviewSessions(), getMyInterviewBookings()]);
      setSessions(sessionData);
      setBookings(bookingData);
    } catch {
      toast.error("Could not load live interview data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const bookingsMap = useMemo(() => {
    const map = new Map();
    bookings.forEach((entry) => map.set(entry.session?.id, entry));
    return map;
  }, [bookings]);

  const createSession = async () => {
    try {
      await createInterviewSession({ ...form, capacity: Number(form.capacity) });
      toast.success("Session created.");
      loadData();
    } catch {
      toast.error("Failed to create session (instructor role required). ");
    }
  };

  const bookSlot = async (sessionId) => {
    try {
      await bookInterviewSession(sessionId);
      toast.success("Slot booked.");
      loadData();
    } catch {
      toast.error("Unable to book slot.");
    }
  };

  const joinSlot = async (bookingId) => {
    try {
      const response = await joinInterviewSession(bookingId);
      toast.success("Joined session successfully.");
      window.open(response.meeting_link, "_blank", "noopener,noreferrer");
      loadData();
    } catch {
      toast.error("Could not join session.");
    }
  };

  return (
    <PageContainer className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Instructor Dashboard" subtitle="Create live interview sessions.">
          <div className="grid gap-3">
            <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Session title" />
            <select value={form.domain} onChange={(event) => setForm((prev) => ({ ...prev, domain: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
              <option>Software Developer</option>
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
              <option>DevOps Engineer</option>
              <option>Cybersecurity</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={form.session_date} onChange={(event) => setForm((prev) => ({ ...prev, session_date: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <input type="time" value={form.session_time} onChange={(event) => setForm((prev) => ({ ...prev, session_time: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </div>
            <input type="number" value={form.capacity} onChange={(event) => setForm((prev) => ({ ...prev, capacity: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" min={1} />
            <button type="button" onClick={createSession} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
              Create Session
            </button>
          </div>
        </Card>

        <Card title="Student Dashboard" subtitle="Calendar-style session list, booking, and join actions.">
          <div className="space-y-3">
            {sessions.map((session) => {
              const booking = bookingsMap.get(session.id);
              return (
                <div key={session.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{session.title}</p>
                      <p className="text-xs text-slate-500">
                        {session.domain} | {session.session_date} | {session.session_time}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{session.booked}/{session.capacity} seats booked</p>
                    </div>
                    {!booking ? (
                      <button type="button" onClick={() => bookSlot(session.id)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                        Book Slot
                      </button>
                    ) : (
                      <button type="button" onClick={() => joinSlot(booking.booking_id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                        Join Session
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

export default LiveInterviewPage;
