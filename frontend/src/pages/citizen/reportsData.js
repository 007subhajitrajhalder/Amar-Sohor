export const REGISTERED_FACILITIES = {
  1: {
    id: 1,
    name: "College Street Public Toilet",
    address: "College Street, Kolkata",
    category: "toilet",
    categoryLabel: "Public Toilet",
    agency: "Kolkata Municipal Corporation - Sanitation Dept",
  },
  2: {
    id: 2,
    name: "Gariahat Community Dustbin",
    address: "Gariahat, Kolkata",
    category: "dustbin",
    categoryLabel: "Waste Management",
    agency: "Kolkata Municipal Corporation - Solid Waste Management",
  },
  3: {
    id: 3,
    name: "Sealdah Drinking Water Point",
    address: "Sealdah, Kolkata",
    category: "water",
    categoryLabel: "Drinking Water",
    agency: "Kolkata Municipal Corporation - Water Supply Wing",
  },
  4: {
    id: 4,
    name: "New Market Parking Area",
    address: "New Market, Kolkata",
    category: "parking",
    categoryLabel: "Parking Zone",
    agency: "Kolkata Municipal Corporation - Parking Dept",
  },
  5: {
    id: 5,
    name: "Park Street Dustbin",
    address: "Park Street, Kolkata",
    category: "dustbin",
    categoryLabel: "Waste Management",
    agency: "Kolkata Municipal Corporation - Solid Waste Management",
  },
  6: {
    id: 6,
    name: "Howrah Parking Zone",
    address: "Howrah Station Area, Howrah",
    category: "parking",
    categoryLabel: "Parking Zone",
    agency: "Howrah Municipal Corporation - Traffic & Parking",
  },
};

export const SEED_REPORTS = [
  {
    id: 1,
    title: "Dustbin Overflowing & Litter Spread",
    facilityId: 2,
    facility: "Gariahat Community Dustbin",
    facilityAddress: "Gariahat, Kolkata",
    facilityCategory: "dustbin",
    issueCategory: "Cleanliness & Overflow",
    severity: "Urgent",
    status: "Pending",
    date: "09 Sep 2026",
    description:
      "The secondary waste container is overflowing onto the sidewalk. Stray animals are scattering plastic waste across the street.",
    photoUrl:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    assignedAgency: "KMC Solid Waste Management - Borough VIII",
    assignedOfficer: "Subhashis Roy (Zonal Inspector)",
    agencyNotes:
      "Complaint received and queued for morning waste compactor truck routing. Team expected on site within 24 hours.",
    stage: 1, // 1: Submitted, 2: Under Investigation, 3: Work In Progress, 4: Resolved
  },
  {
    id: 2,
    title: "Water Dispenser Tap Broken - No Water Available",
    facilityId: 3,
    facility: "Sealdah Drinking Water Point",
    facilityAddress: "Sealdah, Kolkata",
    facilityCategory: "water",
    issueCategory: "Damage / Broken Structure",
    severity: "High",
    status: "Under Investigation",
    date: "04 Sep 2026",
    description:
      "The main water dispensing tap is broken and water supply appears to be shut off. Commuters outside Sealdah station cannot access drinking water.",
    photoUrl:
      "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80",
    assignedAgency: "KMC Water Supply Directorate - Central Division",
    assignedOfficer: "P. K. Banerjee (Maintenance Engineer)",
    agencyNotes:
      "Technician visited the water point on 06 Sep. Main supply line valve functional; replacement push-cock tap ordered. Repair underway.",
    stage: 2,
  },
  {
    id: 3,
    title: "Parking Barrier Malfunction Resolved",
    facilityId: 4,
    facility: "New Market Parking Area",
    facilityAddress: "New Market, Kolkata",
    facilityCategory: "parking",
    issueCategory: "Maintenance & Repairs",
    severity: "Normal",
    status: "Resolved",
    date: "28 Aug 2026",
    resolvedDate: "30 Aug 2026",
    description:
      "Entry boom barrier was jammed in closed position causing traffic tailback onto Lindsay Street.",
    photoUrl:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80",
    resolvedPhotoUrl:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80",
    assignedAgency: "KMC Parking Enforcement Wing",
    assignedOfficer: "Amitava Sen (Traffic Operations)",
    agencyNotes:
      "Electrical motor sensor recalibrated and manual release tested. Barrier returned to full operational service on 30 Aug 2026.",
    stage: 4,
  },
];

export function getStoredReports() {
  try {
    const stored = JSON.parse(
      localStorage.getItem("citizen_reports") || "[]"
    );

    const formattedStored = stored.map((item) => ({
      ...item,
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently",
      stage: item.stage || (item.status === "Resolved" ? 4 : item.status === "Under Investigation" ? 2 : 1),
      assignedAgency:
        item.assignedAgency || "Kolkata Municipal Corporation - Civic Redressal Cell",
      agencyNotes:
        item.agencyNotes ||
        "Complaint registered with the civic operations team. Field inspection has been scheduled.",
    }));

    const existingIds = new Set(formattedStored.map((r) => String(r.id)));
    return [
      ...formattedStored,
      ...SEED_REPORTS.filter((seed) => !existingIds.has(String(seed.id))),
    ];
  } catch {
    return SEED_REPORTS;
  }
}

export function getReportById(reportId) {
  const allReports = getStoredReports();
  const found = allReports.find(
    (item) => String(item.id).toLowerCase() === String(reportId).toLowerCase()
  );

  if (found) {
    return found;
  }

  // Safe fallback if random ID visited
  return {
    id: reportId,
    title: "Civic Facility Complaint",
    facility: "Registered Municipal Facility",
    facilityAddress: "Kolkata Municipal Area",
    facilityCategory: "dustbin",
    issueCategory: "General Maintenance",
    severity: "Normal",
    status: "Under Investigation",
    date: "Recently",
    description: "Issue submitted by citizen regarding public facility maintenance.",
    assignedAgency: "Kolkata Municipal Corporation",
    assignedOfficer: "Duty Civic Officer",
    agencyNotes:
      "Complaint logged in central municipal tracking system. Inspection in progress.",
    stage: 2,
  };
}

