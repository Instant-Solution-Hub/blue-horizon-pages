// Simple shared store using localStorage + custom events so FE and Admin pages stay in sync.

export type PrescriptionType = "RP" | "OP" | "NP";
export const PRESCRIPTION_ORDER: Record<PrescriptionType, number> = { RP: 3, OP: 2, NP: 1 };

export interface AssignedDoctor {
  id: string;
  name: string;
  hospital: string;
  location: string;
  contact: string;
  prescriptionType: PrescriptionType;
  fieldExecutiveId: string;
  fieldExecutiveName: string;
}

export interface PrescriptionChangeRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  fieldExecutiveId: string;
  fieldExecutiveName: string;
  currentType: PrescriptionType;
  requestedType: PrescriptionType;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  reviewedAt?: string;
}

const DOCTORS_KEY = "prescription_doctors_v1";
const REQUESTS_KEY = "prescription_requests_v1";
const EVENT = "prescription-store-change";

// Seed data
const seedDoctors: AssignedDoctor[] = [
  { id: "d1", name: "Dr. Arun Mehta", hospital: "Apollo Hospital", location: "Hyderabad", contact: "+91 98765 43210", prescriptionType: "RP", fieldExecutiveId: "fe1", fieldExecutiveName: "Rahul Kumar" },
  { id: "d2", name: "Dr. Sunita Rao", hospital: "KIMS", location: "Hyderabad", contact: "+91 98765 43211", prescriptionType: "OP", fieldExecutiveId: "fe1", fieldExecutiveName: "Rahul Kumar" },
  { id: "d3", name: "Dr. Kiran Shah", hospital: "Yashoda Hospital", location: "Secunderabad", contact: "+91 98765 43212", prescriptionType: "NP", fieldExecutiveId: "fe1", fieldExecutiveName: "Rahul Kumar" },
  { id: "d4", name: "Dr. Manish Joshi", hospital: "Care Hospital", location: "Banjara Hills", contact: "+91 98765 43213", prescriptionType: "OP", fieldExecutiveId: "fe1", fieldExecutiveName: "Rahul Kumar" },
  { id: "d5", name: "Dr. Pooja Nair", hospital: "Continental", location: "Gachibowli", contact: "+91 98765 43214", prescriptionType: "NP", fieldExecutiveId: "fe1", fieldExecutiveName: "Rahul Kumar" },
  { id: "d6", name: "Dr. Ravi Verma", hospital: "Star Hospital", location: "Kukatpally", contact: "+91 98765 43215", prescriptionType: "RP", fieldExecutiveId: "fe2", fieldExecutiveName: "Priya Singh" },
  { id: "d7", name: "Dr. Anita Reddy", hospital: "Rainbow", location: "Madhapur", contact: "+91 98765 43216", prescriptionType: "OP", fieldExecutiveId: "fe2", fieldExecutiveName: "Priya Singh" },
  { id: "d8", name: "Dr. Vikram Sethi", hospital: "Sunshine", location: "Begumpet", contact: "+91 98765 43217", prescriptionType: "NP", fieldExecutiveId: "fe3", fieldExecutiveName: "Vikram Patel" },
];

// Current logged-in FE (mock)
export const CURRENT_FE = { id: "fe1", name: "Rahul Kumar" };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getDoctors(): AssignedDoctor[] {
  const existing = read<AssignedDoctor[] | null>(DOCTORS_KEY, null);
  if (!existing) {
    write(DOCTORS_KEY, seedDoctors);
    return seedDoctors;
  }
  return existing;
}

export function getRequests(): PrescriptionChangeRequest[] {
  return read<PrescriptionChangeRequest[]>(REQUESTS_KEY, []);
}

export function createRequest(req: Omit<PrescriptionChangeRequest, "id" | "status" | "requestedAt">) {
  const reqs = getRequests();
  reqs.unshift({
    ...req,
    id: `req_${Date.now()}`,
    status: "PENDING",
    requestedAt: new Date().toISOString(),
  });
  write(REQUESTS_KEY, reqs);
}

export function reviewRequest(id: string, approve: boolean) {
  const reqs = getRequests();
  const idx = reqs.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const req = reqs[idx];
  if (req.status !== "PENDING") return;
  req.status = approve ? "APPROVED" : "REJECTED";
  req.reviewedAt = new Date().toISOString();
  reqs[idx] = req;
  write(REQUESTS_KEY, reqs);

  if (approve) {
    const docs = getDoctors();
    const dIdx = docs.findIndex((d) => d.id === req.doctorId);
    if (dIdx !== -1) {
      docs[dIdx] = { ...docs[dIdx], prescriptionType: req.requestedType };
      write(DOCTORS_KEY, docs);
    }
  }
}

export function subscribe(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// Up = moved toward higher priority (e.g. NP->OP or OP->RP or NP->RP)
// Down = moved toward lower priority
export function getChangeCounts(feId: string) {
  const reqs = getRequests().filter((r) => r.fieldExecutiveId === feId && r.status === "APPROVED");
  let up = 0;
  let down = 0;
  for (const r of reqs) {
    const delta = PRESCRIPTION_ORDER[r.requestedType] - PRESCRIPTION_ORDER[r.currentType];
    if (delta > 0) up++;
    else if (delta < 0) down++;
  }
  return { up, down };
}

export function getPendingCount(feId?: string) {
  const reqs = getRequests().filter((r) => r.status === "PENDING");
  return feId ? reqs.filter((r) => r.fieldExecutiveId === feId).length : reqs.length;
}
