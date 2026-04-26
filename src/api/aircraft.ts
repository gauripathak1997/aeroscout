import type {
  SearchResponse,
  FuzzySearchResponse,
  AircraftDetail,
  FrontendAircraft,
} from "@/types/aircraft";
import sampleData from "@/data/frontend_sample.json";

const dataset = sampleData as FrontendAircraft[];

// Simulate credit balance
let creditBalance = 20;

export function getCreditBalance(): number {
  return creditBalance;
}

export function resetCredits(): void {
  creditBalance = 20;
}

// Delay to simulate network
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function searchAircraft(params: {
  intent: "lease" | "buy";
  horizon: string;
  on_market_only?: boolean;
}): Promise<SearchResponse> {
  await delay(600);

  // Filter & sort from sample data
  let filtered = [...dataset];
  if (params.on_market_only) {
    filtered = filtered.filter((d) => d.aircraft.on_market);
  }

  // Sort by score descending
  filtered.sort((a, b) => b.score.final_score - a.score.final_score);

  const top5 = filtered.slice(0, 5);
  const cost = top5.length;

  creditBalance = Math.max(0, creditBalance - cost);

  const results = top5.map((item, i) => {
    const flags = item.score.flags;
    return {
      rank: i + 1,
      aircraft_id: item.aircraft.id,
      msn: item.aircraft.msn,
      registration: item.aircraft.registration,
      family: item.aircraft.family,
      variant: item.aircraft.variant,
      yom: item.aircraft.year_of_manufacture,
      final_score: item.score.final_score,
      tier: item.score.tier,
      data_completeness: item.score.data_completeness,
      dimensions: Object.entries(item.score.dimensions).map(([key, score]) => {
        const weights: Record<string, number> = {
          age: 0.2,
          maintenance: 0.3,
          operator: 0.25,
          market: 0.2,
          liquidity: 0.05,
          cabin: 0.05,
        };
        const labels: Record<string, string> = {
          age: "Aircraft Age & Generation",
          maintenance: "Maintenance Status",
          operator: "Operator & Lease Timing",
          market: "Market Pricing",
          liquidity: "Secondary Market Liquidity",
          cabin: "Cabin Quality",
        };
        const w = weights[key] ?? 0.1;
        return {
          label: labels[key] ?? key,
          score: score as number,
          weight: w,
          contribution: Math.round((score as number) * w * 100) / 100,
        };
      }),
      flags: {
        distressed_operator: item.operator.operator_in_distress,
        overdue_maintenance: flags.overdue_maintenance ?? false,
        price_below_cmv: flags.price_below_cmv ?? false,
        near_lease_expiry: flags.near_lease_expiry ?? false,
        in_storage: item.aircraft.operational_status === "Stored",
        on_market: flags.on_market ?? item.aircraft.on_market,
        incomplete_data: false,
      },
      current_operator: item.operator.operator_name,
      operator_type: item.operator.operator_type,
      months_to_lease_end: (() => {
        const end = new Date(item.operator.lease_end_date);
        const now = new Date();
        return Math.round(((end.getTime() - now.getTime()) / (30.44 * 24 * 60 * 60 * 1000)) * 10) / 10;
      })(),
      asking_price: item.aircraft.asking_price_usd,
      current_market_value: item.aircraft.current_market_value_usd,
      detail_credit_cost: 1,
    };
  });

  return {
    query: {
      family: "A320",
      variant: null,
      yom_min: null,
      yom_max: null,
      status: null,
      on_market_only: params.on_market_only ?? false,
      max_price_usd: null,
      min_score: null,
      tier: null,
      near_lease_expiry_only: false,
      distressed_operator_only: false,
      limit: 5,
    },
    total_matched: filtered.length,
    results_shown: top5.length,
    results,
    credits: {
      session_id: "sess_mock_001",
      cost,
      balance_after: creditBalance,
    },
    scored_at: new Date().toISOString().split("T")[0],
  };
}

export async function fuzzySearchAircraft(q: string): Promise<FuzzySearchResponse> {
  await delay(400);

  const query = q.toUpperCase();
  const matches = dataset.filter((d) => {
    const reg = (d.aircraft.registration ?? "").toUpperCase();
    const msn = d.aircraft.msn ?? "";
    const hex = (d.aircraft.icao_hex ?? "").toUpperCase();
    return reg.includes(query) || msn.includes(q) || (hex && hex.includes(query));
  });

  const cost = matches.length;
  creditBalance = Math.max(0, creditBalance - cost);

  const results = matches.slice(0, 5).map((item, i) => {
    const reg = (item.aircraft.registration ?? "").toUpperCase();
    const msn = item.aircraft.msn ?? "";
    const hex = (item.aircraft.icao_hex ?? "").toUpperCase();

    let match_field = "registration";
    let match_value = item.aircraft.registration ?? "";
    let confidence = 0.7;

    if (reg === query) { confidence = 1.0; match_field = "registration"; match_value = item.aircraft.registration ?? ""; }
    else if (msn === q) { confidence = 1.0; match_field = "msn"; match_value = msn; }
    else if (hex && hex === query) { confidence = 1.0; match_field = "icao_hex"; match_value = item.aircraft.icao_hex ?? ""; }
    else if (reg.includes(query)) { confidence = 0.8; }

    return {
      rank: i + 1,
      aircraft_id: item.aircraft.id,
      msn: item.aircraft.msn,
      registration: item.aircraft.registration,
      family: item.aircraft.family,
      variant: item.aircraft.variant,
      yom: item.aircraft.year_of_manufacture,
      final_score: item.score.final_score,
      tier: item.score.tier,
      data_completeness: item.score.data_completeness,
      dimensions: Object.entries(item.score.dimensions).map(([key, score]) => {
        const weights: Record<string, number> = { age: 0.2, maintenance: 0.3, operator: 0.25, market: 0.2, liquidity: 0.05, cabin: 0.05 };
        const labels: Record<string, string> = { age: "Aircraft Age & Generation", maintenance: "Maintenance Status", operator: "Operator & Lease Timing", market: "Market Pricing", liquidity: "Secondary Market Liquidity", cabin: "Cabin Quality" };
        const w = weights[key] ?? 0.1;
        return { label: labels[key] ?? key, score: score as number, weight: w, contribution: Math.round((score as number) * w * 100) / 100 };
      }),
      flags: {
        distressed_operator: item.operator.operator_in_distress,
        overdue_maintenance: item.score.flags.overdue_maintenance ?? false,
        price_below_cmv: item.score.flags.price_below_cmv ?? false,
        near_lease_expiry: item.score.flags.near_lease_expiry ?? false,
        in_storage: item.aircraft.operational_status === "Stored",
        on_market: item.score.flags.on_market ?? item.aircraft.on_market,
        incomplete_data: false,
      },
      current_operator: item.operator.operator_name,
      operator_type: item.operator.operator_type,
      months_to_lease_end: (() => {
        const end = new Date(item.operator.lease_end_date);
        const now = new Date();
        return Math.round(((end.getTime() - now.getTime()) / (30.44 * 24 * 60 * 60 * 1000)) * 10) / 10;
      })(),
      asking_price: item.aircraft.asking_price_usd,
      current_market_value: item.aircraft.current_market_value_usd,
      detail_credit_cost: 1,
      match_confidence: confidence,
      match_field,
      match_value,
    };
  });

  return {
    query: { q, match_type: "fuzzy", fields_searched: ["registration", "msn", "icao_hex"], limit: 5 },
    total_matched: matches.length,
    results_shown: results.length,
    results,
    credits: { session_id: "sess_mock_001", cost, balance_after: creditBalance },
    scored_at: new Date().toISOString().split("T")[0],
  };
}

export async function getAircraftDetail(aircraftId: string): Promise<AircraftDetail | null> {
  await delay(500);

  const item = dataset.find((d) => d.aircraft.id === aircraftId);
  if (!item) return null;

  creditBalance = Math.max(0, creditBalance - 1);

  // Derive per-dimension rule rationale from the item itself (reasoning is no longer stored).
  const today = new Date();
  const monthsBetween = (iso: string | null | undefined): number | null => {
    if (!iso) return null;
    return Math.round(((new Date(iso).getTime() - today.getTime()) / (30.44 * 24 * 60 * 60 * 1000)) * 10) / 10;
  };
  const ac = item.aircraft;
  const op = item.operator;
  const dims = item.score.dimensions;
  const variant = ac.variant ?? "";
  const age = ac.year_of_manufacture ? today.getFullYear() - ac.year_of_manufacture : null;
  const cmv = ac.current_market_value_usd ?? 0;
  const asking = ac.asking_price_usd ?? 0;
  const cCheck = item.maintenance_events.find((e) => e.event_type === "C_CHECK");
  const esv = item.maintenance_events.find((e) => e.event_type === "ENGINE_SHOP_VISIT_1");
  const llp = item.maintenance_events.find((e) => e.event_type === "LLP_REPLACEMENT");
  const leaseMonths = monthsBetween(op.lease_end_date);
  const cCheckMonths = monthsBetween(cCheck?.next_due_date);
  const esvMonths = monthsBetween(esv?.next_due_date);

  const dimLabels: Record<string, string> = { age: "Aircraft Age & Generation", maintenance: "Maintenance Status", operator: "Operator & Lease Timing", market: "Market Pricing", liquidity: "Secondary Market Liquidity", cabin: "Cabin Quality" };
  const dimWeights: Record<string, number> = { age: 0.2, maintenance: 0.3, operator: 0.25, market: 0.2, liquidity: 0.05, cabin: 0.05 };

  const reasoning: { dimension: string; rule: string; score: number; rationale: string }[] = [];
  if (age !== null) {
    let r = `${age <= 5 ? "Very young" : age <= 8 ? "Young" : age <= 12 ? "Mid-life" : age <= 18 ? "Mature" : "Aged"} airframe, ${age} years old`;
    if (/neo|xlr/i.test(variant)) r += " (NEO generation +10)";
    reasoning.push({ dimension: "age", rule: "airframe_age", score: dims.age ?? 0, rationale: r });
  }
  if (cCheckMonths !== null) {
    const r = cCheckMonths > 18 ? `C-Check fresh (${cCheckMonths.toFixed(0)}mo remaining)` : cCheckMonths > 6 ? `C-Check due in ${cCheckMonths.toFixed(0)}mo` : cCheckMonths >= 0 ? `C-Check imminent (${cCheckMonths.toFixed(0)}mo)` : "C-Check overdue";
    reasoning.push({ dimension: "maintenance", rule: "c_check_timing", score: dims.maintenance ?? 0, rationale: r });
  }
  if (esvMonths !== null) {
    const r = esvMonths > 18 ? `ESV fresh (${esvMonths.toFixed(0)}mo remaining)` : esvMonths > 6 ? `ESV due in ${esvMonths.toFixed(0)}mo` : esvMonths >= 0 ? `ESV imminent (${esvMonths.toFixed(0)}mo)` : "ESV overdue";
    reasoning.push({ dimension: "maintenance", rule: "esv_timing", score: dims.maintenance ?? 0, rationale: r });
  }
  if (llp?.llp_cycles_remaining != null) {
    const c = llp.llp_cycles_remaining;
    const r = c > 10000 ? `LLP cycles healthy (${c.toLocaleString()} remaining)` : c > 5000 ? `LLP cycles moderate (${c.toLocaleString()} remaining)` : c > 2000 ? `LLP cycles low (${c.toLocaleString()} remaining)` : `LLP cycles critical (${c.toLocaleString()} remaining)`;
    reasoning.push({ dimension: "maintenance", rule: "llp_cycles", score: dims.maintenance ?? 0, rationale: r });
  }
  if (leaseMonths !== null) {
    const r = leaseMonths < 0 ? `Lease expired ${Math.abs(leaseMonths).toFixed(0)}mo ago — available now` : leaseMonths < 6 ? `Lease expiring in ${leaseMonths.toFixed(0)}mo` : leaseMonths < 18 ? `Lease expires in ${leaseMonths.toFixed(0)}mo` : `Long lease remaining (${leaseMonths.toFixed(0)}mo)`;
    reasoning.push({ dimension: "operator", rule: "lease_timing", score: dims.operator ?? 0, rationale: r });
  }
  if (op.operator_financial_health_score) {
    const fh = op.operator_financial_health_score;
    const lbl = fh > 75 ? "strong" : fh > 50 ? "moderate" : "weak";
    reasoning.push({ dimension: "operator", rule: "operator_financial_health", score: dims.operator ?? 0, rationale: `Operator financially ${lbl} (${fh}/100)` });
  }
  if (cmv && asking) {
    const ratio = asking / cmv;
    const r = ratio < 0.85 ? `Asking price ${(ratio*100).toFixed(0)}% of CMV — significant discount` : ratio < 0.95 ? `Asking price ${(ratio*100).toFixed(0)}% of CMV — slight discount` : ratio < 1.05 ? "Asking price at CMV" : `Asking price above CMV (${(ratio*100).toFixed(0)}%)`;
    reasoning.push({ dimension: "market", rule: "price_vs_cmv", score: dims.market ?? 0, rationale: r });
  }
  reasoning.push({ dimension: "market", rule: "on_market", score: dims.market ?? 0, rationale: ac.on_market ? "Aircraft actively listed for sale or lease" : "Aircraft not currently listed" });
  reasoning.push({ dimension: "liquidity", rule: "variant_market_depth", score: dims.liquidity ?? 0, rationale: `${variant} secondary market depth rating` });
  reasoning.push({ dimension: "cabin", rule: "ife_and_connectivity", score: dims.cabin ?? 0, rationale: `IFE: ${ac.ife_type ?? "—"}, Connectivity: ${ac.connectivity_type ?? "—"}` });

  return {
    aircraft_id: ac.id,
    msn: ac.msn,
    registration: ac.registration,
    icao_hex: ac.icao_hex ?? "",
    family: ac.family,
    variant: ac.variant,
    engine_model: ac.engine_model,
    yom: ac.year_of_manufacture,
    delivery_date: ac.delivery_date,
    total_flight_hours: ac.total_flight_hours,
    total_flight_cycles: ac.total_flight_cycles,
    avg_fh_per_fc: ac.avg_flight_hours_per_cycle,
    operational_status: ac.operational_status,
    storage_location: ac.storage_location_iata ?? null,
    on_market: ac.on_market,
    current_market_value: ac.current_market_value_usd,
    base_value: ac.base_value_usd,
    half_life_adjusted_value: ac.half_life_adjusted_value_usd,
    asking_price: ac.asking_price_usd,
    last_sold_price: ac.last_sold_price_usd,
    total_seats: ac.total_seats,
    seats_economy: ac.seats_economy,
    seats_business: ac.seats_business,
    seats_premium_economy: ac.seats_premium_economy,
    seats_first: ac.seats_first,
    seat_pitch_economy_inches: ac.seat_pitch_economy_inches,
    seat_manufacturer: ac.seat_manufacturer ?? "—",
    cabin_config: null,
    ife_type: ac.ife_type ?? "—",
    ife_manufacturer: ac.ife_manufacturer ?? "—",
    connectivity_type: ac.connectivity_type ?? "—",
    connectivity_provider: ac.connectivity_provider ?? "—",
    usb_power_at_seat: ac.usb_power_at_seat,
    ac_power_at_seat: ac.ac_power_at_seat,
    last_cabin_refurb_date: null,
    etops_certified: ac.etops_certified,
    adsb_compliant: ac.ads_b_compliant,
    noise_chapter: ac.noise_chapter,
    operators: [{
      operator_name: op.operator_name,
      operator_iata_code: op.operator_iata_code,
      operator_type: op.operator_type,
      credit_rating: op.operator_credit_rating ?? "—",
      operator_in_distress: op.operator_in_distress,
      is_bankrupt: false,
      financial_health_score: op.operator_financial_health_score,
      monthly_lease_rate_usd: op.monthly_lease_rate_usd,
      lease_end_date: op.lease_end_date,
      operation_start_date: op.lease_start_date,
      operation_end_date: null,
      is_current_operator: op.is_current_operator,
    }],
    maintenance_events: item.maintenance_events.map((e) => ({
      event_type: e.event_type,
      event_status: e.event_status,
      event_date: e.last_completed_date ?? null,
      next_due_date: e.next_due_date ?? null,
      engine_position: null,
      llp_cycles_remaining: e.llp_cycles_remaining ?? null,
      gear_position: null,
    })),
    final_score: item.score.final_score,
    tier: item.score.tier,
    data_completeness: item.score.data_completeness,
    flags: {
      distressed_operator: op.operator_in_distress,
      overdue_maintenance: item.score.flags.overdue_maintenance ?? false,
      price_below_cmv: item.score.flags.price_below_cmv ?? false,
      near_lease_expiry: item.score.flags.near_lease_expiry ?? false,
      in_storage: ac.operational_status === "Stored",
      on_market: item.score.flags.on_market ?? ac.on_market,
      incomplete_data: false,
    },
    dimensions: reasoning.reduce((acc, r) => {
      const label = dimLabels[r.dimension] ?? r.dimension;
      const w = dimWeights[r.dimension] ?? 0.1;
      let dim = acc.find((d) => d.label === label);
      if (!dim) {
        const raw = dims[r.dimension] ?? 0;
        dim = { label, raw_score: raw, weighted_score: raw * w, weight: w, flags: [], rules: [] };
        acc.push(dim);
      }
      const ruleCount = reasoning.filter((x) => x.dimension === r.dimension).length;
      dim.rules.push({ rule_id: r.rule, label: r.rule.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), score: r.score, weight: 1 / ruleCount, fired: true, rationale: r.rationale, data_used: {} });
      return acc;
    }, [] as AircraftDetail["dimensions"]),
    scoring_version: item.score.scoring_version,
    scored_at: item.score.scored_at,
    credits: { session_id: "sess_mock_001", cost: 1, balance_after: creditBalance },
  };
}

export function getDirectoryPreview(operatorFilter?: string): Array<{ registration: string; variant: string; yom: number; tier: string; final_score: number; operator: string; on_market: boolean; aircraft_id: string }> {
  let filtered = dataset;
  if (operatorFilter && operatorFilter.trim()) {
    const q = operatorFilter.trim().toLowerCase();
    filtered = dataset.filter((d) => d.operator.operator_name.toLowerCase().includes(q));
  }
  return filtered.slice(0, 8).map((d) => ({
    registration: d.aircraft.registration,
    variant: d.aircraft.variant,
    yom: d.aircraft.year_of_manufacture,
    tier: d.score.tier,
    final_score: d.score.final_score,
    operator: d.operator.operator_name,
    on_market: d.aircraft.on_market,
    aircraft_id: d.aircraft.id,
  }));
}

export function getOperators(): string[] {
  const set = new Set<string>();
  dataset.forEach((d) => set.add(d.operator.operator_name));
  return Array.from(set).sort();
}

export function countAircraftByOperator(operatorName: string): number {
  return dataset.filter((d) => d.operator.operator_name === operatorName).length;
}

/** Pick a strong, representative aircraft to showcase as an "example". */
export function getExampleAircraftId(): string {
  const onMarket = dataset.filter((d) => d.aircraft.on_market);
  const pool = onMarket.length ? onMarket : dataset;
  const best = pool.reduce((a, b) =>
    b.score.final_score > a.score.final_score ? b : a
  );
  return best.aircraft.id;
}
