// Types matching the API contract exactly

export interface SearchQuery {
  family: string;
  variant: string | null;
  yom_min: number | null;
  yom_max: number | null;
  status: string | null;
  on_market_only: boolean;
  max_price_usd: number | null;
  min_score: number | null;
  tier: string | null;
  near_lease_expiry_only: boolean;
  distressed_operator_only: boolean;
  limit: number;
}

export interface Dimension {
  label: string;
  score: number;
  weight: number;
  contribution: number;
}

export interface Flags {
  distressed_operator: boolean;
  overdue_maintenance: boolean;
  price_below_cmv: boolean;
  near_lease_expiry: boolean;
  in_storage: boolean;
  on_market: boolean;
  incomplete_data: boolean;
}

export interface SearchResult {
  rank: number;
  aircraft_id: string;
  msn: string;
  registration: string;
  family: string;
  variant: string;
  yom: number;
  final_score: number;
  tier: string;
  data_completeness: number;
  dimensions: Dimension[];
  flags: Flags;
  current_operator: string;
  operator_type: string;
  months_to_lease_end: number;
  asking_price: number | null;
  current_market_value: number;
  detail_credit_cost: number;
  // fuzzy search fields
  match_confidence?: number;
  match_field?: string;
  match_value?: string;
}

export interface Credits {
  session_id: string;
  cost: number;
  balance_after: number;
}

export interface SearchResponse {
  query: SearchQuery;
  total_matched: number;
  results_shown: number;
  results: SearchResult[];
  credits: Credits;
  scored_at: string;
}

export interface FuzzySearchQuery {
  q: string;
  match_type: string;
  fields_searched: string[];
  limit: number;
}

export interface FuzzySearchResponse {
  query: FuzzySearchQuery;
  total_matched: number;
  results_shown: number;
  results: SearchResult[];
  credits: Credits;
  scored_at: string;
}

// Detail types
export interface Operator {
  operator_name: string;
  operator_iata_code: string;
  operator_type: string;
  credit_rating: string;
  operator_in_distress: boolean;
  is_bankrupt: boolean;
  financial_health_score: number;
  monthly_lease_rate_usd: number;
  lease_end_date: string;
  operation_start_date: string;
  operation_end_date: string | null;
  is_current_operator: boolean;
}

export interface MaintenanceEvent {
  event_type: string;
  event_status: string;
  event_date: string;
  next_due_date: string;
  engine_position: string | null;
  llp_cycles_remaining: number | null;
  gear_position: string | null;
}

export interface DetailDimensionRule {
  rule_id: string;
  label: string;
  score: number;
  weight: number;
  fired: boolean;
  rationale: string;
  data_used: Record<string, unknown>;
}

export interface DetailDimension {
  label: string;
  raw_score: number;
  weighted_score: number;
  weight: number;
  flags: string[];
  rules: DetailDimensionRule[];
}

export interface AircraftDetail {
  aircraft_id: string;
  msn: string;
  registration: string;
  icao_hex: string;
  family: string;
  variant: string;
  engine_model: string;
  yom: number;
  delivery_date: string;
  total_flight_hours: number;
  total_flight_cycles: number;
  avg_fh_per_fc: number;
  operational_status: string;
  storage_location: string | null;
  on_market: boolean;
  current_market_value: number;
  base_value: number;
  half_life_adjusted_value: number | null;
  asking_price: number | null;
  last_sold_price: number | null;
  total_seats: number;
  seats_economy: number;
  seats_business: number;
  seats_premium_economy: number;
  seats_first: number;
  seat_pitch_economy_inches: number;
  seat_manufacturer: string;
  cabin_config: string | null;
  ife_type: string;
  ife_manufacturer: string;
  connectivity_type: string;
  connectivity_provider: string;
  usb_power_at_seat: boolean;
  ac_power_at_seat: boolean;
  last_cabin_refurb_date: string | null;
  etops_certified: boolean;
  adsb_compliant: boolean | null;
  noise_chapter: number;
  operators: Operator[];
  maintenance_events: MaintenanceEvent[];
  final_score: number;
  tier: string;
  data_completeness: number;
  flags: Flags;
  dimensions: DetailDimension[];
  scoring_version: string;
  scored_at: string;
  credits: Credits;
}

// Frontend sample data types (for directory)
export interface FrontendAircraft {
  aircraft: {
    id: string;
    msn: string;
    registration: string;
    icao_hex: string;
    family: string;
    variant: string;
    engine_model: string;
    year_of_manufacture: number;
    delivery_date: string;
    mtow_kg: number;
    winglet_type: string;
    operational_status: string;
    storage_location_iata: string | null;
    total_flight_hours: number;
    total_flight_cycles: number;
    avg_flight_hours_per_cycle: number;
    avg_daily_flight_hours: number;
    avg_daily_flight_cycles: number;
    seats_economy: number;
    seats_business: number;
    seats_premium_economy: number;
    seats_first: number;
    total_seats: number;
    seat_pitch_economy_inches: number;
    seat_manufacturer: string;
    ife_type: string;
    ife_manufacturer: string;
    connectivity_type: string;
    connectivity_provider: string;
    usb_power_at_seat: boolean;
    ac_power_at_seat: boolean;
    current_market_value_usd: number;
    base_value_usd: number;
    half_life_adjusted_value_usd: number | null;
    asking_price_usd: number | null;
    monthly_lease_rate_market_usd: number;
    last_sold_price_usd: number | null;
    on_market: boolean;
    months_on_market: number | null;
    noise_chapter: number;
    etops_certified: boolean;
    rvsm_compliant: boolean;
    ads_b_compliant: boolean;
    data_confidence_score: number;
    created_at: string;
    updated_at: string;
  };
  operator: {
    id: string;
    aircraft_id: string;
    operator_name: string;
    operator_iata_code: string;
    operator_icao_code: string;
    operator_country: string;
    operator_type: string;
    alliance_membership: string;
    lease_type: string;
    lease_start_date: string;
    lease_end_date: string;
    monthly_lease_rate_usd: number;
    maintenance_reserve_rate_usd: number;
    security_deposit_usd: number;
    operator_credit_rating: string;
    operator_financial_health_score: number;
    operator_in_distress: boolean;
    is_current_operator: boolean;
    primary_base_iata: string;
    route_type: string;
    avg_daily_flight_hours: number;
    avg_daily_flight_cycles: number;
    created_at: string;
  };
  maintenance_events: Array<{
    id: string;
    aircraft_id: string;
    event_type: string;
    event_status: string;
    last_completed_date: string;
    next_due_date: string;
    flight_hours_at_event: number;
    flight_cycles_at_event: number;
    shop_name: string;
    cost_usd: number;
    llp_cycles_remaining: number | null;
    open_airworthiness_directives: number;
    created_at: string;
  }>;
  score: {
    id: string;
    aircraft_id: string;
    triggered_by_user_id: string | null;
    final_score: number;
    tier: string;
    composite_score: number;
    confidence_adj: number;
    data_completeness: number;
    dimensions: Record<string, number>;
    flags: Record<string, boolean>;
    reasoning: Array<{
      dimension: string;
      rule: string;
      score: number;
      rationale: string;
    }>;
    scoring_version: string;
    scored_at: string;
    created_at: string;
  };
}
