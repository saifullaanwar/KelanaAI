/* ================================================================
   Itinerary Parser

   Converts the raw AI itinerary into structured data.

   Structure:

   Trip
   ├── Day 1
   │   ├── Morning
   │   │   ├── 08:00 AM — Activity
   │   │   ├── 09:30 AM — Activity
   │   │   └── 11:00 AM — Activity
   │   │
   │   ├── Afternoon
   │   └── Evening
   │
   ├── Day 2
   │   └── ...
   │
   ├── General Tips
   │   ├── Transportation
   │   ├── Accommodation
   │   ├── Local Etiquette
   │   ├── Currency
   │   ├── Recommended Attractions & Activities
   │   └── Other tips
   │
   └── Trip Summary
================================================================ */

/* ================================================================
   Types
================================================================ */

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  cost: string;

  /**
   * Unknown activity-level fields.
   *
   * IMPORTANT:
   * General trip-level information should NOT end up here.
   */
  extras: string[];
}

export interface DaySummary {
  estimatedDailyBudget: string;
  transportation: string;
  recommendedAttractions: string;
}

export interface TimeSlot {
  label: "Morning" | "Afternoon" | "Evening";
  activities: Activity[];
  rawFallback: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  slots: TimeSlot[];
  summary: DaySummary;
  rawFallback: string;
}

export interface GeneralTips {
  transportation: string;
  accommodation: string;
  localEtiquette: string;
  currency: string;

  /**
   * Trip-wide attractions / activities.
   *
   * Example:
   * - Historical Museum
   * - Local Market
   * - Cultural Workshop
   * - National Park
   */
  recommendedAttractions: string[];

  /**
   * Other trip-wide tips that do not fit
   * into the known categories.
   */
  extras: string[];
}

export interface TripSummary {
  budgetLines: string[];
  closingNote: string;
}

/* ================================================================
   Helpers
================================================================ */

/**
 * Remove Markdown formatting.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .trim();
}

/**
 * Remove Markdown bullet prefix.
 */
function stripBullet(text: string): string {
  return text
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/^\s*•\s+/, "")
    .replace(/^\s*\d+\.\s+/, "")
    .trim();
}

/**
 * Clean a line for parsing.
 */
function cleanLine(text: string): string {
  return stripMarkdown(stripBullet(text)).trim();
}

/**
 * Values that genuinely mean "empty".
 *
 * IMPORTANT:
 * "Free" is valid and must NOT be treated as empty.
 */
const EMPTY_VALUES =
  /^[-–—]+$|^n\/a$|^none$|^unknown$/i;

function sanitizeValue(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (EMPTY_VALUES.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/* ================================================================
   Field Extraction
================================================================ */

/**
 * Extract:
 *
 * Location: Central Jakarta
 * Cost: USD 10
 * Description: Visit the museum
 */
function extractField(
  text: string,
  fields: string[]
): string | null {
  const clean = cleanLine(text);

  const escapedFields = fields.map((field) =>
    field.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )
  );

  const regex = new RegExp(
    `^(?:${escapedFields.join("|")})\\s*:\\s*(.+)$`,
    "i"
  );

  const match = regex.exec(clean);

  if (!match) {
    return null;
  }

  return sanitizeValue(match[1]);
}

/* ================================================================
   Time Detection
================================================================ */

/**
 * Recognize common time formats:
 *
 * 8:00 AM
 * 08:00 AM
 * 8:00AM
 * 1:00 PM
 * 13:00
 */
function extractTime(
  text: string
): {
  time: string;
  remainder: string;
} | null {
  const clean = cleanLine(text);

  /*
   * 12-hour format
   */
  const twelveHour =
    /^(\d{1,2}:\d{2}\s*(?:AM|PM))\s*(?:[-–—:]\s*)?(.+)$/i.exec(
      clean
    );

  if (twelveHour) {
    return {
      time: twelveHour[1]
        .replace(/\s+/g, " ")
        .toUpperCase()
        .trim(),

      remainder: twelveHour[2]
        .trim()
        .replace(/[.:]$/, "")
        .trim(),
    };
  }

  /*
   * 24-hour format
   */
  const twentyFourHour =
    /^(\d{1,2}:\d{2})\s*(?:[-–—:]\s*)?(.+)$/i.exec(
      clean
    );

  if (twentyFourHour) {
    return {
      time: twentyFourHour[1].trim(),

      remainder: twentyFourHour[2]
        .trim()
        .replace(/[.:]$/, "")
        .trim(),
    };
  }

  return null;
}

/* ================================================================
   Activity Title Detection
================================================================ */

function extractActivityTitle(
  text: string
): string | null {
  const clean = cleanLine(text);

  /*
   * Activity 1: Visit Monas
   */
  const numberedActivity =
    /^Activity\s+\d+\s*:\s*(.+)$/i.exec(clean);

  if (numberedActivity) {
    return numberedActivity[1]
      .trim()
      .replace(/[.:]$/, "");
  }

  /*
   * Activity: Visit Monas
   */
  const simpleActivity =
    /^Activity\s*:\s*(.+)$/i.exec(clean);

  if (simpleActivity) {
    return simpleActivity[1]
      .trim()
      .replace(/[.:]$/, "");
  }

  /*
   * 1. Visit Monas
   */
  const numbered =
    /^\d+\.\s+(.+)$/i.exec(text.trim());

  if (numbered) {
    return numbered[1]
      .trim()
      .replace(/[.:]$/, "");
  }

  return null;
}

/* ================================================================
   Global Tip Detection
================================================================ */

/**
 * These fields belong to the entire trip.
 *
 * They must NEVER become Activity.extras.
 */
const GLOBAL_TIP_FIELDS = [
  "Transportation Suggestions",
  "Recommended Attractions and Activities",
  "Recommended Attractions & Activities",
  "Recommended Attractions",
  "Recommended Attraction",
  "Public Transport",
  "Walking",
  "Bike Rentals",
  "Bike Rental",
  "Accommodation",
  "Hotel",
  "Lodging",
  "Local Etiquette",
  "Etiquette",
  "Currency",
];

/**
 * Check whether a line starts a trip-level General Tips section.
 */
function isGlobalTipLine(text: string): boolean {
  const clean = cleanLine(text);

  const escapedFields = GLOBAL_TIP_FIELDS.map((field) =>
    field.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )
  );

  const regex = new RegExp(
    `^(?:${escapedFields.join("|")})(?:\\s*:|\\s*$)`,
    "i"
  );

  return regex.test(clean);
}

/* ================================================================
   Activity Parser
================================================================ */

function parseActivities(
  lines: string[]
): {
  activities: Activity[];
  rawFallback: string;
} {
  const activities: Activity[] = [];

  let current: Activity | null = null;

  for (
    let index = 0;
    index < lines.length;
    index++
  ) {
    const rawLine = lines[index];

    const trimmed = rawLine.trim();

    if (!trimmed) {
      continue;
    }

    /*
     * IMPORTANT:
     *
     * If a global tip somehow reaches this function,
     * stop treating it as activity content.
     *
     * This is a second safety layer.
     */
    if (isGlobalTipLine(trimmed)) {
      continue;
    }

    /*
     * Ignore Markdown headings.
     */
    if (/^#{1,6}\s+/.test(trimmed)) {
      continue;
    }

    /* ------------------------------------------------------------
       TIME-BASED ACTIVITY
       ------------------------------------------------------------ */

    const timeMatch = extractTime(trimmed);

    if (timeMatch) {
      if (current) {
        activities.push(current);
      }

      current = {
        time: timeMatch.time,
        title: timeMatch.remainder,
        description: "",
        location: "",
        cost: "",
        extras: [],
      };

      continue;
    }

    /* ------------------------------------------------------------
       Activity: ...
       ------------------------------------------------------------ */

    const activityTitle =
      extractActivityTitle(trimmed);

    if (activityTitle) {
      if (current) {
        activities.push(current);
      }

      current = {
        time: "",
        title: activityTitle,
        description: "",
        location: "",
        cost: "",
        extras: [],
      };

      continue;
    }

    /* ------------------------------------------------------------
       Description
       ------------------------------------------------------------ */

    const description =
      extractField(trimmed, [
        "Description",
        "Activity Description",
      ]);

    if (description && current) {
      current.description = description;
      continue;
    }

    /* ------------------------------------------------------------
       Location
       ------------------------------------------------------------ */

    const location =
      extractField(trimmed, [
        "Location",
        "Place",
        "Venue",
      ]);

    if (location && current) {
      current.location = location;
      continue;
    }

    /* ------------------------------------------------------------
       Cost
       ------------------------------------------------------------ */

    const cost =
      extractField(trimmed, [
        "Estimated Cost",
        "Cost",
        "Price",
      ]);

    if (cost && current) {
      current.cost = cost;
      continue;
    }

    /* ------------------------------------------------------------
       Activity: description
       ------------------------------------------------------------ */

    const activityDescription =
      extractField(trimmed, [
        "Activity",
      ]);

    if (activityDescription && current) {
      current.description =
        activityDescription;
      continue;
    }

    /* ------------------------------------------------------------
       Ignore daily summary fields.
       ------------------------------------------------------------ */

    const dailySummaryFields =
      [
        "Estimated Daily Budget",
        "Daily Budget",
        "Transportation",
        "Transport",
        "Recommended Attractions",
        "Recommended Attraction",
      ];

    const isDailySummary =
      extractField(
        trimmed,
        dailySummaryFields
      );

    if (isDailySummary) {
      continue;
    }

    /* ------------------------------------------------------------
       Ignore headings.
       ------------------------------------------------------------ */

    if (/^#{1,6}\s+/.test(trimmed)) {
      continue;
    }

    /* ------------------------------------------------------------
       Continuation text.
       ------------------------------------------------------------ */

    if (current) {
      const extra =
        sanitizeValue(
          cleanLine(trimmed)
        );

      if (extra) {
        current.extras.push(extra);
      }

      continue;
    }
  }

  if (current) {
    activities.push(current);
  }

  /*
   * Remove obviously invalid activities.
   */
  const validActivities =
    activities.filter(
      (activity) =>
        activity.title &&
        activity.title !== "--" &&
        activity.title !== "-"
    );

  return {
    activities: validActivities,
    rawFallback: lines.join("\n"),
  };
}

/* ================================================================
   Daily Summary
================================================================ */

function parseDaySummary(
  dayBody: string
): {
  bodyWithoutSummary: string;
  summary: DaySummary;
} {
  const summary: DaySummary = {
    estimatedDailyBudget: "",
    transportation: "",
    recommendedAttractions: "",
  };

  const remainingLines: string[] = [];

  for (const rawLine of dayBody.split("\n")) {
    const clean = cleanLine(rawLine);

    if (!clean) {
      remainingLines.push(rawLine);
      continue;
    }

    /*
     * Estimated Daily Budget
     */
    const dailyBudget =
      extractField(clean, [
        "Estimated Daily Budget",
        "Daily Budget",
      ]);

    if (dailyBudget) {
      summary.estimatedDailyBudget =
        dailyBudget;

      continue;
    }

    /*
     * Transportation
     *
     * NOTE:
     * This is the daily field "Transportation".
     *
     * "Transportation Suggestions" is NOT daily.
     */
    const transportation =
      extractField(clean, [
        "Transportation",
        "Transport",
      ]);

    if (
      transportation &&
      !/^Transportation Suggestions\s*:/i.test(clean)
    ) {
      summary.transportation =
        transportation;

      continue;
    }

    /*
     * Recommended Attractions
     *
     * This is the daily recommendation.
     *
     * "Recommended Attractions and Activities"
     * is trip-wide and handled separately.
     */
    const attractions =
      extractField(clean, [
        "Recommended Attractions",
        "Recommended Attraction",
      ]);

    if (
      attractions &&
      !/^Recommended Attractions and Activities\s*:/i.test(
        clean
      ) &&
      !/^Recommended Attractions & Activities\s*:/i.test(
        clean
      )
    ) {
      summary.recommendedAttractions =
        attractions;

      continue;
    }

    remainingLines.push(rawLine);
  }

  return {
    bodyWithoutSummary:
      remainingLines.join("\n"),

    summary,
  };
}

/* ================================================================
   Embedded General Tips Extraction
================================================================ */

/**
 * Some AI responses do NOT create:
 *
 * ## General Tips
 *
 * Instead they append global information after
 * the final activity of the final day.
 *
 * Example:
 *
 * 8:00 PM - Attend a Local Theater Performance
 * Description: Enjoy a performance...
 *
 * Transportation Suggestions: Use public transport or walk.
 * Recommended Attractions and Activities:
 * Historical Museum
 * Local Market
 * Cultural Workshop
 * Public Transport: Use buses and trams.
 * Walking: Walk as much as possible.
 *
 * Everything from the first global marker onward
 * belongs to the trip-level General Tips.
 */
function extractEmbeddedGeneralTips(
  dayBody: string
): {
  bodyWithoutTips: string;
  tips: GeneralTips | null;
} {
  const lines = dayBody.split("\n");

  let globalTipsStartIndex = -1;

  for (
    let index = 0;
    index < lines.length;
    index++
  ) {
    if (isGlobalTipLine(lines[index])) {
      globalTipsStartIndex = index;
      break;
    }
  }

  /*
   * Nothing found.
   */
  if (globalTipsStartIndex === -1) {
    return {
      bodyWithoutTips: dayBody,
      tips: null,
    };
  }

  const itineraryLines =
    lines.slice(0, globalTipsStartIndex);

  const generalTipLines =
    lines.slice(globalTipsStartIndex);

  const tips =
    parseGeneralTips(
      generalTipLines.join("\n")
    );

  return {
    bodyWithoutTips:
      itineraryLines.join("\n").trim(),

    tips,
  };
}

/* ================================================================
   Slot Detection
================================================================ */

type SlotLabel =
  | "Morning"
  | "Afternoon"
  | "Evening";

const SLOT_LABELS: SlotLabel[] = [
  "Morning",
  "Afternoon",
  "Evening",
];

/**
 * Detect:
 *
 * ## Morning
 * ### Morning
 * ### Morning:
 * ### 🌅 Morning
 * ### Morning Activities
 */
function detectSlotHeading(
  line: string
): SlotLabel | null {
  const clean =
    stripMarkdown(line)
      .replace(
        /^[#\s🌅☀️🌙🌄🌞☀️]+/,
        ""
      )
      .trim();

  const match =
    /^(Morning|Afternoon|Evening)(?:\s+Activities?)?\s*:?\s*$/i.exec(
      clean
    );

  if (!match) {
    return null;
  }

  return (
    SLOT_LABELS.find(
      (label) =>
        label.toLowerCase() ===
        match[1].toLowerCase()
    ) ?? null
  );
}

/* ================================================================
   Slot Parser
================================================================ */

function parseSlots(
  dayBody: string
): TimeSlot[] {
  const sections: Array<{
    label: SlotLabel;
    lines: string[];
  }> = [];

  let current:
    | {
        label: SlotLabel;
        lines: string[];
      }
    | null = null;

  for (const line of dayBody.split("\n")) {
    const slot =
      detectSlotHeading(line);

    if (slot) {
      if (current) {
        sections.push(current);
      }

      current = {
        label: slot,
        lines: [],
      };

      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections.map(
    ({
      label,
      lines,
    }) => {
      const cleanedLines =
        lines
          .map((line) =>
            line.trim()
          )
          .filter(Boolean);

      const parsed =
        parseActivities(
          cleanedLines
        );

      return {
        label,

        activities:
          parsed.activities,

        rawFallback:
          parsed.activities.length === 0
            ? parsed.rawFallback
            : "",
      };
    }
  );
}

/* ================================================================
   General Tips
================================================================ */

function createEmptyGeneralTips(): GeneralTips {
  return {
    transportation: "",
    accommodation: "",
    localEtiquette: "",
    currency: "",
    recommendedAttractions: [],
    extras: [],
  };
}

/**
 * Parse trip-wide General Tips.
 */
function parseGeneralTips(
  text: string
): GeneralTips {
  const tips =
    createEmptyGeneralTips();

  let collectingRecommendedAttractions =
    false;

  for (const rawLine of text.split("\n")) {
    const line =
      cleanLine(rawLine);

    if (!line) {
      continue;
    }

    /*
     * Ignore headings.
     */
    if (/^#{1,6}\s+/.test(line)) {
      continue;
    }

    if (
      /^General Tips$/i.test(line)
    ) {
      continue;
    }

    /* ------------------------------------------------------------
       Recommended Attractions & Activities
       ------------------------------------------------------------ */

    const recommendedMatch =
      /^Recommended Attractions(?:\s+and\s+|\s*&\s*)Activities?\s*:?\s*(.*)$/i.exec(
        line
      );

    if (recommendedMatch) {
      collectingRecommendedAttractions =
        true;

      const inlineValue =
        sanitizeValue(
          recommendedMatch[1]
        );

      if (inlineValue) {
        addRecommendedAttractions(
          tips,
          inlineValue
        );
      }

      continue;
    }

    /*
     * Alternative heading:
     *
     * Recommended Attractions:
     */
    const recommendedSimple =
      /^Recommended Attractions?\s*:\s*(.*)$/i.exec(
        line
      );

    if (recommendedSimple) {
      collectingRecommendedAttractions =
        true;

      const inlineValue =
        sanitizeValue(
          recommendedSimple[1]
        );

      if (inlineValue) {
        addRecommendedAttractions(
          tips,
          inlineValue
        );
      }

      continue;
    }

    /* ------------------------------------------------------------
       If we are inside the recommended attraction list,
       stop when a known General Tip field begins.
       ------------------------------------------------------------ */

    if (
      collectingRecommendedAttractions
    ) {
      const knownGlobalField =
        extractGeneralTipField(
          line
        );

      if (!knownGlobalField) {
        /*
         * Plain list item:
         *
         * Historical Museum
         * Local Market
         * Cooking Class
         */
        addRecommendedAttractions(
          tips,
          line
        );

        continue;
      }

      /*
       * A new global field starts.
       */
      collectingRecommendedAttractions =
        false;
    }

    /* ------------------------------------------------------------
       Transportation Suggestions
       ------------------------------------------------------------ */

    const transportation =
      extractField(line, [
        "Transportation Suggestions",
      ]);

    if (transportation) {
      tips.transportation =
        transportation;

      continue;
    }

    /* ------------------------------------------------------------
       Public Transport
       ------------------------------------------------------------ */

    const publicTransport =
      extractField(line, [
        "Public Transport",
      ]);

    if (publicTransport) {
      tips.extras.push(
        `Public Transport: ${publicTransport}`
      );

      continue;
    }

    /* ------------------------------------------------------------
       Walking
       ------------------------------------------------------------ */

    const walking =
      extractField(line, [
        "Walking",
      ]);

    if (walking) {
      tips.extras.push(
        `Walking: ${walking}`
      );

      continue;
    }

    /* ------------------------------------------------------------
       Bike Rentals
       ------------------------------------------------------------ */

    const bikeRental =
      extractField(line, [
        "Bike Rentals",
        "Bike Rental",
      ]);

    if (bikeRental) {
      tips.extras.push(
        `Bike Rentals: ${bikeRental}`
      );

      continue;
    }

    /* ------------------------------------------------------------
       Accommodation
       ------------------------------------------------------------ */

    const accommodation =
      extractField(line, [
        "Accommodation",
        "Hotel",
        "Lodging",
      ]);

    if (accommodation) {
      tips.accommodation =
        accommodation;

      continue;
    }

    /* ------------------------------------------------------------
       Local Etiquette
       ------------------------------------------------------------ */

    const etiquette =
      extractField(line, [
        "Local Etiquette",
        "Etiquette",
      ]);

    if (etiquette) {
      tips.localEtiquette =
        etiquette;

      continue;
    }

    /* ------------------------------------------------------------
       Currency
       ------------------------------------------------------------ */

    const currency =
      extractField(line, [
        "Currency",
      ]);

    if (currency) {
      tips.currency =
        currency;

      continue;
    }

    /*
     * Ignore remaining headings.
     */
    if (/^#{1,6}\s+/.test(line)) {
      continue;
    }

    /*
     * Unknown trip-level tip.
     */
    const extra =
      sanitizeValue(line);

    if (extra) {
      tips.extras.push(extra);
    }
  }

  return tips;
}

/**
 * Parse a global tip field so we can determine whether
 * a line marks the beginning of another global section.
 */
function extractGeneralTipField(
  text: string
): {
  label: string;
  value: string | null;
} | null {
  const clean =
    cleanLine(text);

  const escapedFields =
    GLOBAL_TIP_FIELDS.map(
      (field) =>
        field.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
    );

  const regex =
    new RegExp(
      `^(${escapedFields.join(
        "|"
      )})\\s*:\\s*(.*)$`,
      "i"
    );

  const match =
    regex.exec(clean);

  if (!match) {
    return null;
  }

  return {
    label: match[1],
    value:
      sanitizeValue(match[2]),
  };
}

/**
 * Add one or multiple attraction names.
 *
 * Supports:
 *
 * Historical Museum
 *
 * Historical Museum, Local Market, Cultural Workshop
 *
 * Historical Museum
 * - Local Market
 * - Cultural Workshop
 */
function addRecommendedAttractions(
  tips: GeneralTips,
  value: string
): void {
  const clean =
    cleanLine(value);

  if (!clean) {
    return;
  }

  /*
   * Split comma / semicolon separated values.
   */
  const parts =
    clean
      .split(/[,;|]/)
      .map((item) =>
        item.trim()
      )
      .filter(Boolean);

  for (const part of parts) {
    if (
      !tips.recommendedAttractions.some(
        (existing) =>
          existing.toLowerCase() ===
          part.toLowerCase()
      )
    ) {
      tips.recommendedAttractions.push(
        part
      );
    }
  }
}

/* ================================================================
   Merge General Tips
================================================================ */

function mergeGeneralTips(
  target: GeneralTips,
  source: GeneralTips
): void {
  if (
    source.transportation &&
    !target.transportation
  ) {
    target.transportation =
      source.transportation;
  }

  if (
    source.accommodation &&
    !target.accommodation
  ) {
    target.accommodation =
      source.accommodation;
  }

  if (
    source.localEtiquette &&
    !target.localEtiquette
  ) {
    target.localEtiquette =
      source.localEtiquette;
  }

  if (
    source.currency &&
    !target.currency
  ) {
    target.currency =
      source.currency;
  }

  for (
    const attraction
    of source.recommendedAttractions
  ) {
    if (
      !target.recommendedAttractions.some(
        (existing) =>
          existing.toLowerCase() ===
          attraction.toLowerCase()
      )
    ) {
      target.recommendedAttractions.push(
        attraction
      );
    }
  }

  for (
    const extra
    of source.extras
  ) {
    if (
      !target.extras.some(
        (existing) =>
          existing.toLowerCase() ===
          extra.toLowerCase()
      )
    ) {
      target.extras.push(
        extra
      );
    }
  }
}

/* ================================================================
   Trip Summary
================================================================ */

function parseTripSummary(
  text: string
): TripSummary | null {
  const budgetLines: string[] = [];
  const noteLines: string[] = [];

  for (const rawLine of text.split("\n")) {
    const line =
      cleanLine(rawLine);

    if (!line) {
      continue;
    }

    /*
     * Ignore headings.
     */
    if (/^#{1,6}\s+/.test(line)) {
      continue;
    }

    const isBudget =
      /budget|cost|total|average|per\s+day|daily|expense|spending/i.test(
        line
      );

    if (isBudget) {
      budgetLines.push(line);
    } else {
      noteLines.push(line);
    }
  }

  if (
    budgetLines.length === 0 &&
    noteLines.length === 0
  ) {
    return null;
  }

  return {
    budgetLines,

    closingNote:
      noteLines.join(" ").trim(),
  };
}

/* ================================================================
   Main Parser
================================================================ */

export function parseItinerary(
  raw: string | null | undefined
): {
  days: ItineraryDay[];
  generalTips: GeneralTips | null;
  tripSummary: TripSummary | null;
} {
  if (
    !raw ||
    !raw.trim()
  ) {
    return {
      days: [],
      generalTips: null,
      tripSummary: null,
    };
  }

  let normalized =
    raw
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim();

  /*
   * Remove excessive blank lines.
   */
  normalized =
    normalized.replace(
      /\n{3,}/g,
      "\n\n"
    );

  /* ==============================================================
     Trip Summary
  ============================================================== */

  let tripSummary:
    | TripSummary
    | null = null;

  const summaryMatch =
    /(?:^|\n)#{1,3}\s*(?:Trip Summary|Summary|Budget Summary)\s*:?\s*\n?/i.exec(
      normalized
    );

  if (summaryMatch) {
    const summaryStart =
      (summaryMatch.index ?? 0) +
      summaryMatch[0].length;

    const summaryText =
      normalized
        .slice(summaryStart)
        .trim();

    tripSummary =
      parseTripSummary(
        summaryText
      );

    normalized =
      normalized
        .slice(
          0,
          summaryMatch.index
        )
        .trim();
  }

  /* ==============================================================
     Explicit General Tips
  ============================================================== */

  let generalTips:
    | GeneralTips
    | null = null;

  const tipsMatch =
    /(?:^|\n)#{1,3}\s*General Tips\s*:?\s*\n?/i.exec(
      normalized
    );

  if (tipsMatch) {
    const tipsStart =
      (tipsMatch.index ?? 0) +
      tipsMatch[0].length;

    const tipsText =
      normalized
        .slice(tipsStart)
        .trim();

    generalTips =
      parseGeneralTips(
        tipsText
      );

    normalized =
      normalized
        .slice(
          0,
          tipsMatch.index
        )
        .trim();
  }

  /* ==============================================================
     Find first Day
  ============================================================== */

  const firstDayMatch =
    /^##\s+Day\s+\d+/im.exec(
      normalized
    );

  const textBeforeDays =
    firstDayMatch
      ? normalized
          .slice(
            0,
            firstDayMatch.index
          )
          .trim()
      : "";

  const textFromDays =
    firstDayMatch
      ? normalized.slice(
          firstDayMatch.index
        )
      : normalized;

  /*
   * If there was content before Day 1 and no explicit Trip Summary,
   * treat it as a possible trip summary.
   */
  if (
    !tripSummary &&
    textBeforeDays
  ) {
    tripSummary =
      parseTripSummary(
        textBeforeDays
      );
  }

  /* ==============================================================
     Split Days
  ============================================================== */

  const daySections =
    textFromDays
      .split(
        /(?=^##\s+Day\s+\d+)/im
      )
      .map((section) =>
        section.trim()
      )
      .filter((section) =>
        /^##\s+Day\s+\d+/i.test(
          section
        )
      );

  if (
    daySections.length === 0
  ) {
    return {
      days: [],
      generalTips,
      tripSummary,
    };
  }

  /* ==============================================================
     Parse Days
  ============================================================== */

  const embeddedGeneralTips: GeneralTips[] = [];

  const days =
    daySections
      .map(
        (
          section
        ): ItineraryDay | null => {
          const lines =
            section.split("\n");

          const heading =
            lines[0]?.trim() ??
            "";

          const headingMatch =
            /^##\s+Day\s+(\d+)(?:\s*[:\-–—]\s*(.+))?$/i.exec(
              heading
            );

          if (!headingMatch) {
            return null;
          }

          const dayNumber =
            Number(
              headingMatch[1]
            );

          const title =
            headingMatch[2]
              ?.trim() ||
            `Day ${dayNumber}`;

          const body =
            lines
              .slice(1)
              .join("\n")
              .trim();

          /*
           * --------------------------------------------------------
           * Step 1:
           *
           * Extract information that belongs specifically
           * to this DAY.
           * --------------------------------------------------------
           */
          const {
            bodyWithoutSummary,
            summary,
          } =
            parseDaySummary(
              body
            );

          /*
           * --------------------------------------------------------
           * Step 2:
           *
           * Extract trip-wide information that AI sometimes
           * places after the final activity of a day.
           *
           * This prevents:
           *
           * Transportation Suggestions
           * Recommended Attractions
           * Public Transport
           * Walking
           * Bike Rentals
           *
           * from becoming Activity.extras.
           * --------------------------------------------------------
           */
          const {
            bodyWithoutTips,
            tips,
          } =
            extractEmbeddedGeneralTips(
              bodyWithoutSummary
            );

          if (tips) {
            embeddedGeneralTips.push(
              tips
            );
          }

          /*
           * --------------------------------------------------------
           * Step 3:
           *
           * Only the actual itinerary goes into slot parsing.
           * --------------------------------------------------------
           */
          const slots =
            parseSlots(
              bodyWithoutTips
            );

          return {
            dayNumber,
            title,
            slots,
            summary,

            rawFallback:
              slots.length === 0
                ? bodyWithoutTips
                : "",
          };
        }
      )
      .filter(
        (
          day
        ): day is ItineraryDay =>
          day !== null
      );

  /* ==============================================================
     Merge Embedded General Tips
  ============================================================== */

  if (
    embeddedGeneralTips.length > 0
  ) {
    if (!generalTips) {
      generalTips =
        createEmptyGeneralTips();
    }

    for (
      const tips
      of embeddedGeneralTips
    ) {
      mergeGeneralTips(
        generalTips,
        tips
      );
    }
  }

  /* ==============================================================
     Clean Empty General Tips
  ============================================================== */

  if (generalTips) {
    const hasGeneralTips =
      Boolean(
        generalTips.transportation ||
        generalTips.accommodation ||
        generalTips.localEtiquette ||
        generalTips.currency ||
        generalTips.recommendedAttractions.length > 0 ||
        generalTips.extras.length > 0
      );

    if (!hasGeneralTips) {
      generalTips = null;
    }
  }

  return {
    days,
    generalTips,
    tripSummary,
  };
}