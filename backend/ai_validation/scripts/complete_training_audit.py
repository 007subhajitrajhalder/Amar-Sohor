import csv
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPORT_DIR = SCRIPT_DIR.parent / "reports"
CSV_PATH = REPORT_DIR / "training_audit.csv"

# Map of corrections where actual != correct
# filename -> (correct_label, reason)
CORRECTIONS = {
    # From Sheet 1 (Actual: broken_bin)
    "Garbage_Bin_overflow_00964.jpg": (
        "irrelevant_image",
        "Informational public flyer graphic poster ('BROKEN LID? Replace your lids for FREE'), not a field photograph of a broken bin."
    ),
    "Garbage_Bin_overflow_01451.jpg": (
        "irrelevant_image",
        "Cropped informational graphic flyer banner ('BROKEN LID? Replace your lids for FREE'), not a field photograph."
    ),

    # From Sheet 2 (Actual: irrelevant_image)
    "Garbage_Bin_overflow_00327.jpg": (
        "overflowing_dustbin",
        "Large wall of black garbage bags piled along commercial city sidewalk awaiting municipal collection."
    ),
    "Garbage_Bin_overflow_00432.jpg": (
        "overflowing_dustbin",
        "Row of discarded containers and waste dumped on concrete ledge above outdoor drainage ditch requiring cleanup."
    ),

    # From Sheet 3 (Actual: irrelevant_image)
    "Garbage_Bin_overflow_00975.jpg": (
        "overflowing_dustbin",
        "Illegal roadside fly-tipping with dumped wooden furniture, boards, and bulk waste along street hedge."
    ),
    "Garbage_Bin_overflow_01214.jpg": (
        "overflowing_dustbin",
        "Multiple black trash bags sitting on outdoor brick sidewalk curb requiring municipal collection."
    ),

    # From Sheet 4 (Actual: normal_bin)
    "Garbage_Bin_overflow_01825.jpg": (
        "broken_bin",
        "Plastic dumpster has a large jagged chunk broken off top rim and a severe vertical body crack."
    ),
    "Garbage_Bin_overflow_00303.jpg": (
        "overflowing_dustbin",
        "Surveillance view showing popped bin lid with trash bags and rotten food waste/litter scattered over ground and platform."
    ),

    # From Sheet 5 (Actual: overflowing_dustbin)
    "Garbage_Bin_overflow_00782.jpg": (
        "irrelevant_image",
        "Freeway traffic collision scene with flipped vehicle, emergency response vehicles, and highway debris."
    ),
    "Garbage_Bin_overflow_01019.jpg": (
        "broken_bin",
        "Red residential wheelie bin with broken/missing left wheel and damaged base, unable to stand upright and leaning on pole."
    ),
}

# Specific reasons for keep_label items to ensure clear, high-quality documentation
KEEP_REASONS = {
    # broken_bin
    "Garbage_Bin_overflow_01456.jpg": "Severely damaged and crushed metal dumpster in scrap yard.",
    "Garbage_Bin_overflow_00362.jpg": "Blue plastic wheelie bin with split body crack and trash protruding.",
    "Garbage_Bin_overflow_01520.jpg": "Crushed and crumpled blue metal dumpster body in salvage yard.",
    "Garbage_Bin_overflow_01507.jpg": "Broken crushed metal dumpster panels.",
    "Garbage_Bin_overflow_01500.jpg": "Damaged crushed dumpster base and body section.",
    "Garbage_Bin_overflow_01463.jpg": "Ripped and fractured metal dumpster wall with missing sections.",
    "Garbage_Bin_overflow_01454.jpg": "Twisted and crushed metal dumpster frame.",
    "Garbage_Bin_overflow_01645.jpg": "Dented and battered blue metal dumpster with bent wheel.",
    "Garbage_Bin_overflow_00264.jpg": "Green plastic bin with split/cracked rim and detached lid hinge.",
    "Garbage_Bin_overflow_00239.jpg": "Severely bent and crumpled green dumpster side panel.",
    "Garbage_Bin_overflow_00571.jpg": "Wheelie bin with large jagged hole broken through the front wall.",
    "Garbage_Bin_overflow_01455.jpg": "Crushed scrap green metal dumpster frame.",
    "Garbage_Bin_overflow_01457.jpg": "Crushed cracked blue container body.",
    "Garbage_Bin_overflow_01512.jpg": "Damaged metal dumpster with split side seam and detached parts.",
    "Garbage_Bin_overflow_01527.jpg": "Blue metal dumpster with large vertical crack and tear in front panel.",
    "Garbage_Bin_overflow_01796.jpg": "Deformed metal dumpster with broken/cut top edge.",
    "Garbage_Bin_overflow_01521.jpg": "Crushed blue metal dumpster scrap in storage yard.",
    "Garbage_Bin_overflow_01549.jpg": "Deformed blue scrap metal dumpster with bent side.",
    "Garbage_Bin_overflow_01535.jpg": "Crushed and flattened metal dumpster plates.",
    "Garbage_Bin_overflow_01547.jpg": "Damaged blue metal dumpster with dented corner and fractured wall.",
    "Garbage_Bin_overflow_01519.jpg": "Crushed, rusted broken metal dumpster interior.",
    "Garbage_Bin_overflow_01489.jpg": "Blue metal dumpster with torn jagged hole and crushed corner.",
    "Garbage_Bin_overflow_01972.jpg": "Ripped open and deformed blue metal dumpster body.",

    # irrelevant_image
    "Garbage_Bin_overflow_01211.jpg": "Isolated black trash bags on pure white studio background.",
    "Garbage_Bin_overflow_01384.jpg": "Digital conceptual 3D art of earth globe formed of trash.",
    "Garbage_Bin_overflow_01059.jpg": "Miniature toy green bin next to broken smartphone on colored craft paper.",
    "Garbage_Bin_overflow_00003.jpg": "3D computer rendering / CGI graphic of green bins.",
    "Garbage_Bin_overflow_01187.jpg": "Stock photo of e-waste pile isolated on white background.",
    "Garbage_Bin_overflow_01146.jpg": "Stock photo of mixed trash pile isolated on pure white background.",
    "Garbage_Bin_overflow_01887.jpg": "Clipart vector illustration of a gray trash can with rubbish.",
    "Garbage_Bin_overflow_00240.jpg": "Pile of discarded clothes/junk isolated on white background.",
    "Garbage_Bin_overflow_00472.jpg": "Surveillance camera footage of people unloading bags into clothing donation bank.",
    "Garbage_Bin_overflow_01901.jpg": "Flat vector graphic of broken glass bottles on solid background.",
    "Garbage_Bin_overflow_00167.jpg": "3D CGI render of concept solar smart bin.",
    "Garbage_Bin_overflow_00163.jpg": "Stock advertising composite on blue studio background.",
    "Garbage_Bin_overflow_00116.jpg": "Cartoon educational illustration of green bin and boxes.",
    "Garbage_Bin_overflow_00397.jpg": "Highway industrial accident with rolled steel coil on roadway; no dustbin.",
    "Garbage_Bin_overflow_01419.jpg": "Auto show indoor showroom display with cars on stage.",
    "Garbage_Bin_overflow_01947.jpg": "Vector graphic infographics for recycling glass items.",
    "Garbage_Bin_overflow_01097.jpg": "Diagram poster comparing bin dimensions and cardboard boxes.",
    "Garbage_Bin_overflow_00200.jpg": "Promotional before-and-after yard clearance advertisement with text/logo.",
    "Garbage_Bin_overflow_00008.jpg": "Vector cartoon illustration of hand throwing crumpled paper into basket.",
    "Garbage_Bin_overflow_01373.jpg": "Flat vector illustration of yellow recycling bin on beige background.",
    "Garbage_Bin_overflow_01213.jpg": "Food scraps and vegetable peels isolated on pure white background.",

    # normal_bin
    "Garbage_Bin_overflow_00251.jpg": "Surveillance camera view of normal empty street bins.",
    "Garbage_Bin_overflow_01326.jpg": "Standard clean green wheelie bin product catalog photograph.",
    "Garbage_Bin_overflow_00736.jpg": "Vehicle camera view showing intact normal street bin.",
    "Garbage_Bin_overflow_01783.jpg": "Intact blue metal municipal dumpster on street, empty/normal.",
    "Garbage_Bin_overflow_01606.jpg": "Intact blue metal dumpster with closed lid outdoors, no overflow.",
    "Garbage_Bin_overflow_01598.jpg": "Closed blue metal dumpster on asphalt, properly contained with no spillage.",
    "Garbage_Bin_overflow_01850.jpg": "Clean indoor stainless steel triple recycling station in facility.",
    "Garbage_Bin_overflow_01821.jpg": "Clean, intact blue dumpster container interior.",
    "Garbage_Bin_overflow_00857.jpg": "Surveillance camera view of intact bins at collection point.",
    "Garbage_Bin_overflow_01343.jpg": "Clean intact residential rollout trash cart on white background.",
    "Garbage_Bin_overflow_00537.jpg": "Surveillance camera view of normal intact street bins.",
    "Garbage_Bin_overflow_01677.jpg": "Intact metal dumpster on street with no overflow or damage.",
    "Garbage_Bin_overflow_00230.jpg": "Night surveillance camera view of intact bin.",
    "Garbage_Bin_overflow_00182.jpg": "Surveillance camera view of intact yellow bin with closed lid.",
    "Garbage_Bin_overflow_01634.jpg": "Normal blue metal dumpster on sidewalk, undamaged and clean.",
    "Garbage_Bin_overflow_00634.jpg": "Overhead downward view of normal intact bins.",
    "Garbage_Bin_overflow_01737.jpg": "Intact blue metal dumpster placed against building wall.",
    "Garbage_Bin_overflow_00734.jpg": "Surveillance camera view of normal bins on sidewalk.",
    "Garbage_Bin_overflow_01816.jpg": "Intact metal dumpster on street with no damage or overflow.",
    "Garbage_Bin_overflow_00639.jpg": "Street bin station with closed yellow bins and clean surroundings.",
    "Garbage_Bin_overflow_00870.jpg": "Sanitation worker servicing intact closed yellow bins.",
    "Garbage_Bin_overflow_00711.jpg": "Overhead view of intact bin openings on clean pavement.",
    "Garbage_Bin_overflow_00972.jpg": "Sanitation worker by yellow bins at night, lids closed and no overflow.",

    # overflowing_dustbin
    "Garbage_Bin_overflow_00908.jpg": "Massive overflow of garbage bags and trash spilling onto sidewalk.",
    "Garbage_Bin_overflow_00352.jpg": "Metal dumpster overfilled with trash bags protruding above rim and bag on ground.",
    "Garbage_Bin_overflow_00942.jpg": "Yellow street bins with loose litter and trash scattered on the ground around base.",
    "Garbage_Bin_overflow_00871.jpg": "Public dome bin overflowing with bottles, cups, and litter heaped on top and around base.",
    "Garbage_Bin_overflow_00453.jpg": "Green dumpster overflowing with large mound of garbage spilling across road.",
    "Garbage_Bin_overflow_00617.jpg": "Yellow street bins with lids propped wide open and overfilled with trash bags.",
    "Garbage_Bin_overflow_00143.jpg": "Trash cart overflowing with white bags and loose trash scattered around base.",
    "Garbage_Bin_overflow_00376.jpg": "Roadside illegal open dump site with trash piled along road cordoned by police.",
    "Garbage_Bin_overflow_01763.jpg": "Metal dumpster filled to capacity with bags bulging past open lid.",
    "Garbage_Bin_overflow_00562.jpg": "Overhead view of yellow bin overflowing with trash bags spilling out.",
    "Garbage_Bin_overflow_00353.jpg": "Metal dumpster overfilled with trash bags and boxes piled high above rim.",
    "Garbage_Bin_overflow_01182.jpg": "Massive pile of black trash bags stacked on city sidewalk awaiting cleanup.",
    "Garbage_Bin_overflow_00954.jpg": "Open municipal dump site with large accumulation of trash under open sky.",
    "Garbage_Bin_overflow_00630.jpg": "Overhead view of street bins with garbage bags and litter spilled on ground.",
    "Garbage_Bin_overflow_01918.jpg": "Black bin overfilled with trash bags lifting lid completely open.",
    "Garbage_Bin_overflow_00484.jpg": "Overhead night surveillance of yellow bins overfilled with trash bags.",
    "Garbage_Bin_overflow_00115.jpg": "Two black bins bulging with oversized trash bags protruding out of top.",
    "Garbage_Bin_overflow_00520.jpg": "Yellow bins overflowing with bags and boxes piled around base.",
    "Garbage_Bin_overflow_00056.jpg": "Open dumpster filled beyond capacity with trash spilling over.",
    "Garbage_Bin_overflow_00769.jpg": "Street collection station with food waste and organic scraps spilled on tray in front.",
    "Garbage_Bin_overflow_00626.jpg": "Green dumpster overflowing with tree branches and bulk waste over top.",
    "Garbage_Bin_overflow_00134.jpg": "Dumpster in alley surrounded by extensive spilled trash covering the floor.",
    "Garbage_Bin_overflow_00470.jpg": "Urban residential street completely inundated with mounds of trash bags and spilled garbage.",
}

def main():
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Auditing {len(rows)} training samples...")
    updated_rows = []
    correction_count = 0
    keep_count = 0

    for r in rows:
        fn = r["filename"]
        actual = r["actual"]

        if fn in CORRECTIONS:
            correct_label, reason = CORRECTIONS[fn]
            decision = "correct_label"
            correction_count += 1
        else:
            decision = "keep_label"
            correct_label = actual
            reason = KEEP_REASONS.get(fn, f"Clearly shows {actual.replace('_', ' ')}.")
            keep_count += 1

        updated_rows.append({
            "filename": fn,
            "actual": actual,
            "image_path": r["image_path"],
            "review_decision": decision,
            "correct_label": correct_label,
            "reason": reason,
            "review_status": "reviewed",
        })

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        fieldnames = [
            "filename",
            "actual",
            "image_path",
            "review_decision",
            "correct_label",
            "reason",
            "review_status",
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(updated_rows)

    print(f"Successfully reviewed all {len(updated_rows)} samples:")
    print(f"  keep_label:    {keep_count}")
    print(f"  correct_label: {correction_count}")
    print(f"Saved to {CSV_PATH}")

if __name__ == "__main__":
    main()
