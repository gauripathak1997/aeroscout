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
    return (
      d.aircraft.registration.toUpperCase().includes(query) ||
      d.aircraft.msn.includes(q) ||
      d.aircraft.icao_hex.toUpperCase().includes(query)
    );
  });

  const cost = matches.length;
  creditBalance = Math.max(0, creditBalance - cost);

  const results = matches.slice(0, 5).map((item, i) => {
    const reg = item.aircraft.registration.toUpperCase();
    const msn = item.aircraft.msn;
    const hex = item.aircraft.icao_hex.toUpperCase();

    let match_field = "registration";
    let match_value = item.aircraft.registration;
    let confidence = 0.7;

    if (reg === query) { confidence = 1.0; match_field = "registration"; match_value = item.aircraft.registration; }
    else if (msn === q) { confidence = 1.0; match_field = "msn"; match_value = msn; }
    else if (hex === query) { confidence = 1.0; match_field = "icao_hex"; match_value = item.aircraft.icao_hex; }
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

  return {
    aircraft_id: item.aircraft.id,
    msn: item.aircraft.msn,
    registration: item.aircraft.registration,
    icao_hex: item.aircraft.icao_hex,
    family: item.aircraft.family,
    variant: item.aircraft.variant,
    engine_model: item.aircraft.engine_model,
    yom: item.aircraft.year_of_manufacture,
    delivery_date: item.aircraft.delivery_date,
    total_flight_hours: item.aircraft.total_flight_hours,
    total_flight_cycles: item.aircraft.total_flight_cycles,
    avg_fh_per_fc: item.aircraft.avg_flight_hours_per_cycle,
    operational_status: item.aircraft.operational_status,
    storage_location: item.aircraft.storage_location_iata,
    on_market: item.aircraft.on_market,
    current_market_value: item.aircraft.current_market_value_usd,
    base_value: item.aircraft.base_value_usd,
    half_life_adjusted_value: item.aircraft.half_life_adjusted_value_usd,
    asking_price: item.aircraft.asking_price_usd,
    last_sold_price: item.aircraft.last_sold_price_usd,
    total_seats: item.aircraft.total_seats,
    seats_economy: item.aircraft.seats_economy,
    seats_business: item.aircraft.seats_business,
    seats_premium_economy: item.aircraft.seats_premium_economy,
    seats_first: item.aircraft.seats_first,
    seat_pitch_economy_inches: item.aircraft.seat_pitch_economy_inches,
    seat_manufacturer: item.aircraft.seat_manufacturer,
    cabin_config: null,
    ife_type: item.aircraft.ife_type,
    ife_manufacturer: item.aircraft.ife_manufacturer,
    connectivity_type: item.aircraft.connectivity_type,
    connectivity_provider: item.aircraft.connectivity_provider,
    usb_power_at_seat: item.aircraft.usb_power_at_seat,
    ac_power_at_seat: item.aircraft.ac_power_at_seat,
    last_cabin_refurb_date: null,
    etops_certified: item.aircraft.etops_certified,
    adsb_compliant: item.aircraft.ads_b_compliant,
    noise_chapter: item.aircraft.noise_chapter,
    operators: [{
      operator_name: item.operator.operator_name,
      operator_iata_code: item.operator.operator_iata_code,
      operator_type: item.operator.operator_type,
      credit_rating: item.operator.operator_credit_rating,
      operator_in_distress: item.operator.operator_in_distress,
      is_bankrupt: false,
      financial_health_score: item.operator.operator_financial_health_score,
      monthly_lease_rate_usd: item.operator.monthly_lease_rate_usd,
      lease_end_date: item.operator.lease_end_date,
      operation_start_date: item.operator.lease_start_date,
      operation_end_date: null,
      is_current_operator: item.operator.is_current_operator,
    }],
    maintenance_events: item.maintenance_events.map((e) => ({
      event_type: e.event_type,
      event_status: e.event_status,
      event_date: e.last_completed_date,
      next_due_date: e.next_due_date,
      engine_position: null,
      llp_cycles_remaining: e.llp_cycles_remaining,
      gear_position: null,
    })),
    final_score: item.score.final_score,
    tier: item.score.tier,
    data_completeness: item.score.data_completeness,
    flags: {
      distressed_operator: item.operator.operator_in_distress,
      overdue_maintenance: item.score.flags.overdue_maintenance ?? false,
      price_below_cmv: item.score.flags.price_below_cmv ?? false,
      near_lease_expiry: item.score.flags.near_lease_expiry ?? false,
      in_storage: item.aircraft.operational_status === "Stored",
      on_market: item.score.flags.on_market ?? item.aircraft.on_market,
      incomplete_data: false,
    },
    dimensions: item.score.reasoning.reduce((acc, r) => {
      const dimLabels: Record<string, string> = { age: "Aircraft Age & Generation", maintenance: "Maintenance Status", operator: "Operator & Lease Timing", market: "Market Pricing", liquidity: "Secondary Market Liquidity", cabin: "Cabin Quality" };
      const dimWeights: Record<string, number> = { age: 0.2, maintenance: 0.3, operator: 0.25, market: 0.2, liquidity: 0.05, cabin: 0.05 };
      let dim = acc.find((d) => d.label === (dimLabels[r.dimension] ?? r.dimension));
      if (!dim) {
        dim = { label: dimLabels[r.dimension] ?? r.dimension, raw_score: item.score.dimensions[r.dimension] ?? 0, weighted_score: (item.score.dimensions[r.dimension] ?? 0) * (dimWeights[r.dimension] ?? 0.1), weight: dimWeights[r.dimension] ?? 0.1, flags: [], rules: [] };
        acc.push(dim);
      }
      dim.rules.push({ rule_id: r.rule, label: r.rule.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), score: r.score, weight: 1 / item.score.reasoning.filter((x) => x.dimension === r.dimension).length, fired: true, rationale: r.rationale, data_used: {} });
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
