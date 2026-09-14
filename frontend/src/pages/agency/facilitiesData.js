export const DEFAULT_FACILITIES = [
  {
    id: 1,
    name: "College Street Public Toilet",
    facilityName: "College Street Public Toilet",
    category: "toilet",
    address: "College Street, Kolkata, West Bengal",
    latitude: 22.5745,
    longitude: 88.3637,
    status: "Open",
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    rating: 4.5
  },
  {
    id: 2,
    name: "Salt Lake Water Point",
    facilityName: "Salt Lake Water Point",
    category: "water",
    address: "Sector V, Salt Lake, Kolkata",
    latitude: 22.5726,
    longitude: 88.432,
    status: "Under Repair",
    imageUrl:
      "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
    rating: 4.4
  },
  {
    id: 3,
    name: "Gariahat Community Dustbin",
    facilityName: "Gariahat Community Dustbin",
    category: "dustbin",
    address: "Gariahat Road, Kolkata",
    latitude: 22.5197,
    longitude: 88.3655,
    status: "Open",
    imageUrl:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
    rating: 4.2
  },
  {
    id: 4,
    name: "New Market Parking Area",
    facilityName: "New Market Parking Area",
    category: "parking",
    address: "New Market, Kolkata",
    latitude: 22.5598,
    longitude: 88.353,
    status: "Open",
    imageUrl:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80",
    rating: 4.1
  }
];

export function getStoredFacilities() {
  try {
    const raw = localStorage.getItem("agency_facilities");
    const stored = raw ? JSON.parse(raw) : [];

    const storedMap = new Map();
    stored.forEach((item) => {
      storedMap.set(String(item.id), item);
    });

    // Merge: stored overrides defaults, and new ones are appended
    const merged = DEFAULT_FACILITIES.map((seed) => {
      const storedItem = storedMap.get(String(seed.id));
      if (storedItem) {
        storedMap.delete(String(seed.id));
        return { ...seed, ...storedItem };
      }
      return seed;
    });

    // Remaining newly created facilities
    storedMap.forEach((newFacility) => {
      merged.unshift(newFacility);
    });

    return merged;
  } catch {
    return DEFAULT_FACILITIES;
  }
}

export function findFacilityById(id) {
  const all = getStoredFacilities();
  return all.find((f) => String(f.id) === String(id)) || null;
}

export function saveFacilityUpdate(facilityId, updatedFields) {
  try {
    const raw = localStorage.getItem("agency_facilities");
    const stored = raw ? JSON.parse(raw) : [];
    const index = stored.findIndex((f) => String(f.id) === String(facilityId));

    const existing = findFacilityById(facilityId) || {};
    const updated = {
      ...existing,
      ...updatedFields,
      id: existing.id || facilityId,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      stored[index] = updated;
    } else {
      stored.push(updated);
    }

    localStorage.setItem("agency_facilities", JSON.stringify(stored));
    window.dispatchEvent(new Event("storage"));
    return updated;
  } catch (err) {
    console.error("Failed to save facility update:", err);
    return null;
  }
}

