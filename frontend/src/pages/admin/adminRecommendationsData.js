import { SEED_RECOMMENDATIONS } from "../citizen/recommendationsData";

export const FACILITY_AGENCIES = {
  dustbin: {
    id: 1,
    name: "KMC SWM Department",
    department: "Solid Waste Management",
    badgeColor: "text-amber-300 border-amber-300/30 bg-amber-400/10",
    phone: "033 2286 1000",
    email: "swm@kmc.gov.in"
  },
  toilet: {
    id: 2,
    name: "KMC Sanitation Department",
    department: "Public Sanitation",
    badgeColor: "text-emerald-300 border-emerald-300/30 bg-emerald-400/10",
    phone: "033 2286 1001",
    email: "sanitation@kmc.gov.in"
  },
  water: {
    id: 3,
    name: "KMC Water Department",
    department: "Water Services",
    badgeColor: "text-cyan-300 border-cyan-300/30 bg-cyan-400/10",
    phone: "033 2286 1002",
    email: "water@kmc.gov.in"
  },
  parking: {
    id: 4,
    name: "Kolkata Police",
    department: "Parking Management",
    badgeColor: "text-blue-300 border-blue-300/30 bg-blue-400/10",
    phone: "033 2214 3644",
    email: "traffic@kolkatapolice.gov.in"
  }
};

export const AGENCY_MEMBERS = [
  {
    id: 1,
    fullName: "Amit Kumar",
    email: "amit@kmc.example.com",
    phone: "9876543210",
    role: "AGENCY_MEMBER",
    designation: "Field Waste Supervisor",
    agencyId: 1,
    category: "dustbin",
    activeCases: 4,
    completedCases: 29
  },
  {
    id: 2,
    fullName: "Rohit Das",
    email: "rohit@kmc.example.com",
    phone: "9876543211",
    role: "AGENCY_ADMIN",
    designation: "SWM Regional Lead",
    agencyId: 1,
    category: "dustbin",
    activeCases: 2,
    completedCases: 45
  },
  {
    id: 3,
    fullName: "Priya Sen",
    email: "priya@kmc.example.com",
    phone: "9876543212",
    role: "AGENCY_MEMBER",
    designation: "Sanitation Works Inspector",
    agencyId: 2,
    category: "toilet",
    activeCases: 3,
    completedCases: 38
  },
  {
    id: 4,
    fullName: "Arjun Roy",
    email: "arjun@kmc.example.com",
    phone: "9876543213",
    role: "AGENCY_MEMBER",
    designation: "Civic Amenities Officer",
    agencyId: 2,
    category: "toilet",
    activeCases: 1,
    completedCases: 22
  },
  {
    id: 5,
    fullName: "Suman Ghosh",
    email: "suman@water.example.com",
    phone: "9876543214",
    role: "AGENCY_ADMIN",
    designation: "Water Supply Chief Engineer",
    agencyId: 3,
    category: "water",
    activeCases: 5,
    completedCases: 51
  },
  {
    id: 6,
    fullName: "Ananya Paul",
    email: "ananya@water.example.com",
    phone: "9876543215",
    role: "AGENCY_MEMBER",
    designation: "Hydraulic Network Surveyor",
    agencyId: 3,
    category: "water",
    activeCases: 2,
    completedCases: 17
  },
  {
    id: 7,
    fullName: "Rajib Dutta",
    email: "rajib@police.example.com",
    phone: "9876543216",
    role: "AGENCY_MEMBER",
    designation: "Traffic & Parking In-Charge",
    agencyId: 4,
    category: "parking",
    activeCases: 3,
    completedCases: 34
  },
  {
    id: 8,
    fullName: "Neha Sharma",
    email: "neha@police.example.com",
    phone: "9876543217",
    role: "AGENCY_MEMBER",
    designation: "Civic Transit Liaison",
    agencyId: 4,
    category: "parking",
    activeCases: 2,
    completedCases: 40
  }
];

export const DEFAULT_ADMIN_OVERRIDES = {
  "REC-101": {
    assignedMember: null,
    assignedAgency: FACILITY_AGENCIES.dustbin,
    status: "PENDING_ALLOCATION",
    statusLabel: "Pending Allocation",
    stage: 1,
    citizen: {
      name: "Ananya Sen",
      email: "ananya@example.com",
      phone: "9876543210"
    },
    inspectionNotes: "Awaiting field supervisor allocation for on-site sidewalk feasibility study.",
    history: [
      {
        date: "08 Sep 2026",
        actor: "Ananya Sen (Citizen)",
        action: "Proposal submitted online via citizen portal"
      }
    ]
  },
  "REC-102": {
    assignedMember: AGENCY_MEMBERS[4], // Suman Ghosh
    assignedAgency: FACILITY_AGENCIES.water,
    status: "APPROVED",
    statusLabel: "Approved",
    stage: 3,
    citizen: {
      name: "Rahul Das",
      email: "rahul@example.com",
      phone: "9876543211"
    },
    inspectionNotes: "Site survey completed. Pipeline tapping point identified near the tram depot electrical substation. Approved under FY26 Civic Amenity Plan.",
    history: [
      {
        date: "24 Aug 2026",
        actor: "Rahul Das (Citizen)",
        action: "Proposal submitted online"
      },
      {
        date: "26 Aug 2026",
        actor: "Municipal Admin",
        action: "Allocated responsibility to Suman Ghosh (KMC Water Department)"
      },
      {
        date: "02 Sep 2026",
        actor: "Suman Ghosh",
        action: "Site feasibility survey completed. Tapping point confirmed."
      },
      {
        date: "05 Sep 2026",
        actor: "Municipal Works Committee",
        action: "Budget approved under FY26 Civic Amenity Plan"
      }
    ]
  },
  "REC-103": {
    assignedMember: null,
    assignedAgency: FACILITY_AGENCIES.toilet,
    status: "PENDING_ALLOCATION",
    statusLabel: "Pending Allocation",
    stage: 1,
    citizen: {
      name: "Priya Ghosh",
      email: "priya@example.com",
      phone: "9123456780"
    },
    inspectionNotes: "Awaiting sanitation inspector allocation to review proximity to sewer line.",
    history: [
      {
        date: "15 Aug 2026",
        actor: "Priya Ghosh (Citizen)",
        action: "Proposal submitted online"
      }
    ]
  },
  "REC-104": {
    assignedMember: AGENCY_MEMBERS[6], // Rajib Dutta
    assignedAgency: FACILITY_AGENCIES.parking,
    status: "INSTALLED",
    statusLabel: "Installed & Active",
    stage: 4,
    citizen: {
      name: "Vikram Roy",
      email: "vikram@example.com",
      phone: "9988776655"
    },
    inspectionNotes: "Bay markings and e-ticketing kiosk commissioned on 20 Aug 2026. Parking zone is now operational.",
    history: [
      {
        date: "02 Jul 2026",
        actor: "Vikram Roy (Citizen)",
        action: "Proposal submitted online"
      },
      {
        date: "05 Jul 2026",
        actor: "Municipal Admin",
        action: "Allocated responsibility to Rajib Dutta (Kolkata Police)"
      },
      {
        date: "18 Jul 2026",
        actor: "Rajib Dutta",
        action: "Traffic volume survey completed. Road width deemed sufficient."
      },
      {
        date: "20 Aug 2026",
        actor: "Rajib Dutta",
        action: "Bay markings and e-ticketing kiosk commissioned and operational."
      }
    ]
  }
};

const STORAGE_KEY = "admin_recommendation_overrides";

export function getAdminOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_OVERRIDES));
      return DEFAULT_ADMIN_OVERRIDES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMIN_OVERRIDES;
  }
}

export function saveAdminOverrides(overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error("Failed to save admin overrides:", err);
  }
}

export function getAgencyMembersForCategory(category) {
  const normCategory = (category || "").toLowerCase();
  return AGENCY_MEMBERS.filter((m) => m.category === normCategory);
}

export function getAdminRecommendations() {
  const overrides = getAdminOverrides();

  // 1. Citizen stored recommendations
  let citizenList = [];
  try {
    const raw = localStorage.getItem("citizen_recommendations");
    if (raw) {
      citizenList = JSON.parse(raw);
    }
  } catch {
    citizenList = [];
  }

  // Combine seeds and citizenList (avoiding duplicate IDs)
  const combinedMap = new Map();

  SEED_RECOMMENDATIONS.forEach((seed) => {
    combinedMap.set(String(seed.id), {
      ...seed,
      citizen: {
        name: "Verified Citizen",
        email: "citizen@kolkata.gov.in",
        phone: "9876543210"
      }
    });
  });

  citizenList.forEach((item) => {
    const existing = combinedMap.get(String(item.id)) || {};
    combinedMap.set(String(item.id), {
      ...existing,
      ...item,
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })
        : item.date || "Recently",
      citizen: {
        name: item.citizenName || "Subhajit Halder",
        email: item.citizenEmail || "subhajit@example.com",
        phone: item.citizenPhone || "9830112233"
      }
    });
  });

  // Apply overrides
  const result = Array.from(combinedMap.values()).map((rec) => {
    const idKey = String(rec.id);
    const override = overrides[idKey] || {};
    const categoryKey = (rec.facilityType || "dustbin").toLowerCase();
    const defaultAgency = FACILITY_AGENCIES[categoryKey] || FACILITY_AGENCIES.dustbin;

    const assignedMember = override.assignedMember !== undefined ? override.assignedMember : null;
    const assignedAgency = override.assignedAgency || defaultAgency;
    const status = override.status || (assignedMember ? "ALLOTTED" : "PENDING_ALLOCATION");
    const stage = override.stage || (assignedMember ? 2 : 1);
    const inspectionNotes = override.inspectionNotes || rec.reviewNotes || "No review notes entered yet.";
    const history = override.history || [
      {
        date: rec.date || "Recently",
        actor: "Citizen Proposer",
        action: "Proposal submitted"
      }
    ];

    const citizen = {
      ...(rec.citizen || {}),
      ...(override.citizen || {})
    };

    return {
      ...rec,
      assignedMember,
      assignedAgency,
      status,
      stage,
      inspectionNotes,
      history,
      citizen
    };
  });

  return result;
}

export function getRecommendationForAdmin(id) {
  const all = getAdminRecommendations();
  return all.find((item) => String(item.id).toLowerCase() === String(id).toLowerCase()) || null;
}

export function allocateMemberToRecommendation(recId, member, notes) {
  const overrides = getAdminOverrides();
  const idKey = String(recId);
  const existing = overrides[idKey] || {};
  const agency = FACILITY_AGENCIES[member.category] || FACILITY_AGENCIES.dustbin;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const newHistory = [
    ...(existing.history || [
      {
        date: today,
        actor: "Citizen Proposer",
        action: "Proposal submitted"
      }
    ]),
    {
      date: today,
      actor: "Municipal Admin",
      action: `Allocated responsibility to ${member.fullName} (${agency.name})`
    }
  ];

  if (notes && notes.trim()) {
    newHistory.push({
      date: today,
      actor: "Municipal Admin",
      action: `Allocation note: ${notes.trim()}`
    });
  }

  overrides[idKey] = {
    ...existing,
    assignedMember: member,
    assignedAgency: agency,
    status: "UNDER_INVESTIGATION",
    stage: 2,
    inspectionNotes: notes?.trim() || existing.inspectionNotes || `Allocated to ${member.fullName} for field inspection.`,
    history: newHistory
  };

  saveAdminOverrides(overrides);

  // Synchronize with citizen_recommendations if present
  try {
    const citizenRaw = localStorage.getItem("citizen_recommendations");
    if (citizenRaw) {
      const citizenList = JSON.parse(citizenRaw);
      const updated = citizenList.map((item) => {
        if (String(item.id).toLowerCase() === String(recId).toLowerCase()) {
          return {
            ...item,
            status: "Site Survey Scheduled",
            stage: 2,
            reviewDepartment: agency.name,
            reviewNotes: notes?.trim() || `Assigned to field officer ${member.fullName} for survey.`
          };
        }
        return item;
      });
      localStorage.setItem("citizen_recommendations", JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Failed to sync citizen recommendation:", e);
  }

  return overrides[idKey];
}

export function updateRecommendationProgress(recId, { stage, status, inspectionNotes, historyNote }) {
  const overrides = getAdminOverrides();
  const idKey = String(recId);
  const existing = overrides[idKey] || {};

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const updatedHistory = [...(existing.history || [])];
  if (historyNote) {
    updatedHistory.push({
      date: today,
      actor: "Municipal Admin",
      action: historyNote
    });
  }

  overrides[idKey] = {
    ...existing,
    stage: stage !== undefined ? stage : existing.stage || 1,
    status: status || existing.status || "UNDER_INVESTIGATION",
    inspectionNotes: inspectionNotes !== undefined ? inspectionNotes : existing.inspectionNotes,
    history: updatedHistory
  };

  saveAdminOverrides(overrides);

  // Synchronize with citizen_recommendations if present
  try {
    const citizenRaw = localStorage.getItem("citizen_recommendations");
    if (citizenRaw) {
      const citizenList = JSON.parse(citizenRaw);
      const updated = citizenList.map((item) => {
        if (String(item.id).toLowerCase() === String(recId).toLowerCase()) {
          return {
            ...item,
            status: status === "INSTALLED" ? "Installed" : status === "APPROVED" ? "Approved" : "In Progress",
            stage: stage !== undefined ? stage : item.stage,
            reviewNotes: inspectionNotes || item.reviewNotes
          };
        }
        return item;
      });
      localStorage.setItem("citizen_recommendations", JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Failed to sync citizen recommendation:", e);
  }

  return overrides[idKey];
}

