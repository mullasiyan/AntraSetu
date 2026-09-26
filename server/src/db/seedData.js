import bcrypt from 'bcryptjs';

const passwordHash = bcrypt.hashSync('antarsetu123', 10);

export const defaultUsers = [
  {
    id: 'usr-001',
    email: 'commander.bharati@antarsetu.gov.in',
    password_hash: passwordHash,
    full_name: 'Dr. Rajesh Nair',
    role: 'STATION_COMMANDER',
    station_code: 'BHARATI',
    designation: 'Station Commander & Chief Geophysicist'
  },
  {
    id: 'usr-002',
    email: 'engineer.maitri@antarsetu.gov.in',
    password_hash: passwordHash,
    full_name: 'Lt. Cdr. Priya Sundaram',
    role: 'OPERATIONS_ENGINEER',
    station_code: 'MAITRI',
    designation: 'Lead Power & Life-Support Systems Engineer'
  },
  {
    id: 'usr-003',
    email: 'logistics.hq@antarsetu.gov.in',
    password_hash: passwordHash,
    full_name: 'Anand Verma',
    role: 'LOGISTICS_OFFICER',
    station_code: 'HQ_GOA',
    designation: 'NCPOR Antarctic Logistics Director'
  },
  {
    id: 'usr-004',
    email: 'scientist.glaciology@antarsetu.gov.in',
    password_hash: passwordHash,
    full_name: 'Dr. Sunita Deshmukh',
    role: 'SCIENCE_OBSERVER',
    station_code: 'BHARATI',
    designation: 'Senior Glaciologist & Climate Observer'
  }
];

export const defaultStations = [
  {
    id: 'stn-bharati',
    code: 'BHARATI',
    name: 'Bharati Antarctic Research Station',
    established_year: 2012,
    latitude: -69.4069,
    longitude: 76.1906,
    location_description: 'Larsemann Hills, East Antarctica (Coast)',
    status: 'NOMINAL',
    personnel_count: 28,
    max_capacity: 47,
    comms_status: 'ONLINE',
    comms_type: 'High-Throughput Ku-Band VSAT (12 Mbps Dedicated)',
    power_source: 'Combined Heat & Power Cogeneration (3x 100 kVA Scania Generators) + 25 kW Solar Array',
    habitat_description: 'State-of-the-art 3-story prefabricated modular container building elevated on stilts to prevent snow drift accumulation. Features advanced optical, atmospheric and geomagnetism laboratories.',
    last_ping_at: new Date().toISOString()
  },
  {
    id: 'stn-maitri',
    code: 'MAITRI',
    name: 'Maitri Antarctic Research Station',
    established_year: 1989,
    latitude: -70.7667,
    longitude: 11.7333,
    location_description: 'Schirmacher Oasis, Queen Maud Land (Inland Rocky Oasis)',
    status: 'WARNING',
    personnel_count: 22,
    max_capacity: 25,
    comms_status: 'ONLINE',
    comms_type: 'Inmarsat & Ku-Band VSAT (4 Mbps Backup Link)',
    power_source: 'Triple Diesel Generator Plant (2x 62.5 kVA Kirloskar + 1x Standby) + Pilot Wind Turbines',
    habitat_description: 'India second permanent Antarctic station located next to Lake Priyadarshini. Steel-framed insulated building complex housing biology, meteorology, and solid-earth physics labs.',
    last_ping_at: new Date().toISOString()
  },
  {
    id: 'stn-dakshin-gangotri',
    code: 'DAKSHIN_GANGOTRI',
    name: 'Dakshin Gangotri Depot & Automated Station',
    established_year: 1983,
    latitude: -70.0900,
    longitude: 12.0000,
    location_description: 'Princess Astrid Coast, Ice Shelf (Glacial Shelf Zone)',
    status: 'CRITICAL',
    personnel_count: 0,
    max_capacity: 0,
    comms_status: 'DEGRADED',
    comms_type: 'Automated Iridium SBD Beacon & VHF Relay (Sub-GHz telemetry)',
    power_source: 'Extreme-Cold Solar Array + RTG / Lithium-Thionyl Chloride Battery Bank',
    habitat_description: 'Historic first Indian Antarctic base; the original main station submerged under ice sheet subsidence by 1990. Currently operating as an unmanned autonomous meteorological & transit logistics depot.',
    last_ping_at: new Date(Date.now() - 42 * 60000).toISOString()
  }
];

export const defaultTelemetry = [
  {
    id: 'tel-001',
    station_id: 'stn-bharati',
    outdoor_temp_c: -26.4,
    indoor_temp_c: 20.2,
    wind_speed_knots: 28.5,
    wind_direction: 'ESE',
    atmospheric_pressure_hpa: 984.2,
    humidity_pct: 54,
    generator_load_kw: 168.0,
    generator_capacity_pct: 68.5,
    fuel_level_pct: 78.4,
    fuel_pressure_psi: 42.1,
    battery_reserve_pct: 92.0,
    solar_generation_kw: 14.2,
    satellite_latency_ms: 385,
    satellite_bandwidth_mbps: 11.4,
    life_support_status: 'NOMINAL',
    air_quality_co2_ppm: 520,
    freshwater_litres: 14200,
    recorded_at: new Date().toISOString()
  },
  {
    id: 'tel-002',
    station_id: 'stn-maitri',
    outdoor_temp_c: -37.8,
    indoor_temp_c: 18.1,
    wind_speed_knots: 52.4, // Katabatic wind
    wind_direction: 'S',
    atmospheric_pressure_hpa: 968.7,
    humidity_pct: 42,
    generator_load_kw: 194.5,
    generator_capacity_pct: 88.2,
    fuel_level_pct: 21.5, // Low fuel alert
    fuel_pressure_psi: 36.8,
    battery_reserve_pct: 64.0,
    solar_generation_kw: 2.1,
    satellite_latency_ms: 740,
    satellite_bandwidth_mbps: 3.1,
    life_support_status: 'WARNING',
    air_quality_co2_ppm: 680,
    freshwater_litres: 5800,
    recorded_at: new Date().toISOString()
  },
  {
    id: 'tel-003',
    station_id: 'stn-dakshin-gangotri',
    outdoor_temp_c: -44.2,
    indoor_temp_c: -18.5, // Unheated depot shelter
    wind_speed_knots: 64.0, // Blizzard conditions
    wind_direction: 'SSW',
    atmospheric_pressure_hpa: 955.0,
    humidity_pct: 78,
    generator_load_kw: 0.0,
    generator_capacity_pct: 0.0,
    fuel_level_pct: 35.0,
    fuel_pressure_psi: 0.0,
    battery_reserve_pct: 38.5, // Degraded battery
    solar_generation_kw: 0.0,
    satellite_latency_ms: 2450,
    satellite_bandwidth_mbps: 0.05,
    life_support_status: 'OFFLINE',
    air_quality_co2_ppm: 400,
    freshwater_litres: 0,
    recorded_at: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

// RESOURCE MANAGEMENT INVENTORY (Covering all 7 requested categories: Diesel Fuel, Food, Water, Medical, Oxygen, Batteries, Spares)
export const defaultInventory = [
  // 1. DIESEL FUEL
  {
    id: 'inv-001',
    station_id: 'stn-bharati',
    name: 'Polar Diesel / Aviation Turbine Fuel (ATF-K)',
    category: 'FUEL',
    sku: 'POL-ATF-01',
    quantity: 48500,
    unit: 'Litres',
    daily_consumption_rate: 340,
    min_threshold: 15000,
    storage_zone: 'Bulk Fuel Farm Bunker B',
    unit_cost_inr: 185,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-002',
    station_id: 'stn-maitri',
    name: 'Polar Diesel / Low-Pour Heating Fuel (ATF-K)',
    category: 'FUEL',
    sku: 'POL-ATF-02',
    quantity: 8400, // 8400 / 380 = ~22 days remaining (LOW / Warning)
    unit: 'Litres',
    daily_consumption_rate: 380,
    min_threshold: 14000,
    storage_zone: 'Main Tank Farm & Day Tanks',
    unit_cost_inr: 185,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-003',
    station_id: 'stn-dakshin-gangotri',
    name: 'Emergency Surface Depot Fuel Drums (ATF-K)',
    category: 'FUEL',
    sku: 'POL-DRUM-DG',
    quantity: 3200,
    unit: 'Litres',
    daily_consumption_rate: 15,
    min_threshold: 2000,
    storage_zone: 'Depot Surface Container 1',
    unit_cost_inr: 210,
    last_updated: new Date().toISOString()
  },

  // 2. FOOD SUPPLIES
  {
    id: 'inv-004',
    station_id: 'stn-bharati',
    name: 'Dehydrated Scientific Crew Expedition Rations',
    category: 'FOOD',
    sku: 'RAT-CREW-A',
    quantity: 3400,
    unit: 'kg',
    daily_consumption_rate: 32,
    min_threshold: 1200,
    storage_zone: 'Habitat Level-1 Cold Storage',
    unit_cost_inr: 450,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-005',
    station_id: 'stn-maitri',
    name: 'Expedition Food Provisions & Grain Supplies',
    category: 'FOOD',
    sku: 'RAT-MAI-01',
    quantity: 1850,
    unit: 'kg',
    daily_consumption_rate: 26,
    min_threshold: 800,
    storage_zone: 'Annexe Dry Provisions Store',
    unit_cost_inr: 380,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-006',
    station_id: 'stn-dakshin-gangotri',
    name: 'Emergency Blizzard High-Calorie Survival Rations',
    category: 'FOOD',
    sku: 'RAT-BLIZ-DG',
    quantity: 380,
    unit: 'kg',
    daily_consumption_rate: 4,
    min_threshold: 300,
    storage_zone: 'Depot Surface Container 2',
    unit_cost_inr: 520,
    last_updated: new Date().toISOString()
  },

  // 3. DRINKING WATER
  {
    id: 'inv-007',
    station_id: 'stn-bharati',
    name: 'Desalinated Freshwater Potable Storage Reserves',
    category: 'WATER',
    sku: 'WAT-POT-BH',
    quantity: 14200,
    unit: 'Litres',
    daily_consumption_rate: 280,
    min_threshold: 5000,
    storage_zone: 'Water Treatment Holding Tanks',
    unit_cost_inr: 12,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-008',
    station_id: 'stn-maitri',
    name: 'Lake Priyadarshini Treated Potable Water',
    category: 'WATER',
    sku: 'WAT-POT-MT',
    quantity: 5800, // 5800 / 240 = ~24 days (LOW)
    unit: 'Litres',
    daily_consumption_rate: 240,
    min_threshold: 4000,
    storage_zone: 'Insulated Lake Pumping Reservoir',
    unit_cost_inr: 15,
    last_updated: new Date().toISOString()
  },

  // 4. MEDICAL SUPPLIES
  {
    id: 'inv-009',
    station_id: 'stn-bharati',
    name: 'Trauma Care, Suture & Antibiotic Surgical Packs',
    category: 'MEDICAL',
    sku: 'MED-SURG-01',
    quantity: 35,
    unit: 'Packs',
    daily_consumption_rate: 0.1,
    min_threshold: 15,
    storage_zone: 'Medical Bay Trauma Locker',
    unit_cost_inr: 8500,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-010',
    station_id: 'stn-maitri',
    name: 'Emergency Hypothermia & Frostbite Treatment Kits',
    category: 'MEDICAL',
    sku: 'MED-HYPO-01',
    quantity: 8, // Below min_threshold: 10! (CRITICAL)
    unit: 'Kits',
    daily_consumption_rate: 0.1,
    min_threshold: 10,
    storage_zone: 'Dispensary Critical Case',
    unit_cost_inr: 24000,
    last_updated: new Date().toISOString()
  },

  // 5. OXYGEN
  {
    id: 'inv-011',
    station_id: 'stn-bharati',
    name: 'Medical Grade Oxygen Cylinders (47L / 150 Bar)',
    category: 'OXYGEN',
    sku: 'MED-OXY-47',
    quantity: 42,
    unit: 'Cylinders',
    daily_consumption_rate: 0.2,
    min_threshold: 12,
    storage_zone: 'Medical Bay High-Pressure Bay',
    unit_cost_inr: 6500,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-012',
    station_id: 'stn-maitri',
    name: 'Emergency High-Altitude & Trauma Oxygen Tanks (47L)',
    category: 'OXYGEN',
    sku: 'MED-OXY-MT',
    quantity: 14,
    unit: 'Cylinders',
    daily_consumption_rate: 0.25,
    min_threshold: 8,
    storage_zone: 'Dispensary Gas Locker',
    unit_cost_inr: 6500,
    last_updated: new Date().toISOString()
  },

  // 6. BATTERIES
  {
    id: 'inv-013',
    station_id: 'stn-bharati',
    name: 'Solar Renewable Gel-Electrolyte Backup Battery Banks',
    category: 'BATTERIES',
    sku: 'BAT-GEL-48',
    quantity: 48,
    unit: 'Units',
    daily_consumption_rate: 0.05,
    min_threshold: 20,
    storage_zone: 'Solar Inverter Room B',
    unit_cost_inr: 32000,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-014',
    station_id: 'stn-maitri',
    name: 'Deep-Cycle Cold-Resistant Nickel-Cadmium Battery Cells',
    category: 'BATTERIES',
    sku: 'BAT-NICD-12',
    quantity: 18,
    unit: 'Units',
    daily_consumption_rate: 0.1,
    min_threshold: 12,
    storage_zone: 'Generator Emergency DC Room',
    unit_cost_inr: 28000,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-015',
    station_id: 'stn-dakshin-gangotri',
    name: 'Extreme Sub-Zero Lithium-Thionyl Chloride Packs',
    category: 'BATTERIES',
    sku: 'BAT-LITC-DG',
    quantity: 12,
    unit: 'Packs',
    daily_consumption_rate: 0.08,
    min_threshold: 8,
    storage_zone: 'Depot Electronics Weather Box',
    unit_cost_inr: 14500,
    last_updated: new Date().toISOString()
  },

  // 7. SPARE PARTS
  {
    id: 'inv-016',
    station_id: 'stn-bharati',
    name: 'Engine Lubricant Mobil Delvac 1 ESP 5W-40',
    category: 'SPARES',
    sku: 'LUB-GEN-04',
    quantity: 620,
    unit: 'Litres',
    daily_consumption_rate: 2.8,
    min_threshold: 200,
    storage_zone: 'Generator Shed Spares Rack',
    unit_cost_inr: 580,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-017',
    station_id: 'stn-bharati',
    name: 'Reverse Osmosis Desalination Replacement Membranes',
    category: 'SPARES',
    sku: 'WAT-ROM-02',
    quantity: 16,
    unit: 'Units',
    daily_consumption_rate: 0.05,
    min_threshold: 6,
    storage_zone: 'Water Treatment Spares Locker',
    unit_cost_inr: 18500,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-018',
    station_id: 'stn-maitri',
    name: 'Kirloskar Generator Fuel Injection Nozzles & Seals',
    category: 'SPARES',
    sku: 'SPAR-INJ-08',
    quantity: 5, // Below min_threshold: 8! (CRITICAL)
    unit: 'Units',
    daily_consumption_rate: 0.08,
    min_threshold: 8,
    storage_zone: 'Workshop Spares Cabinet A',
    unit_cost_inr: 7200,
    last_updated: new Date().toISOString()
  },
  {
    id: 'inv-019',
    station_id: 'stn-maitri',
    name: 'Silicone Pneumatic Airlock Weather Gasket Spools',
    category: 'SPARES',
    sku: 'SPAR-SEAL-01',
    quantity: 6,
    unit: 'Spools',
    daily_consumption_rate: 0.04,
    min_threshold: 4,
    storage_zone: 'Maintenance Annex Spares Bay',
    unit_cost_inr: 11000,
    last_updated: new Date().toISOString()
  }
];

// ALERT INTELLIGENCE DEMO ALERTS (Covering Critical, High, Medium, Low across Bharati, Maitri, Dakshin Gangotri, all categories, active and resolved)
export const defaultAlerts = [
  // 1. CRITICAL ALERTS
  {
    id: 'alt-001',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    category: 'TEMPERATURE',
    severity: 'CRITICAL',
    title: '[DEMO] Extreme Katabatic Gale Storm (-37.8°C / 58.5 kts)',
    message: 'SIMULATED DATA: Severe katabatic winds exceeding 58 knots with equivalent wind chill of -58°C reported across Schirmacher Oasis. Station Commander enforced Code Red curfew; all 22 crew sheltered in main habitat.',
    is_acknowledged: true,
    acknowledged_by_user_id: 'usr-002',
    acknowledged_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    is_resolved: false,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'alt-002',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    category: 'FUEL',
    severity: 'CRITICAL',
    title: '[DEMO] Polar Diesel Fuel Storage Below 20% Reserve',
    message: 'SIMULATED DATA: Available fuel reserves at Maitri have decreased to 8,400 Litres (~22.1 days remaining runway at 380 L/day). Energy conservation protocol engaged; non-critical labs on standby power.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'alt-003',
    station_id: 'stn-dakshin-gangotri',
    station_code: 'DAKSHIN_GANGOTRI',
    category: 'COMMS',
    severity: 'CRITICAL',
    title: '[DEMO] Automated Depot Iridium Uplink Latency Spike (2,450 ms)',
    message: 'SIMULATED DATA: Princess Astrid Coast unmanned depot telemetry transponder latency spiked to 2,450 ms with 22% packet loss on Sub-GHz meteorological payload radio link.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString()
  },

  // 2. HIGH SEVERITY ALERTS
  {
    id: 'alt-004',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    category: 'TEMPERATURE',
    severity: 'HIGH',
    title: '[DEMO] Exterior Air Intake Duct Frost Accretion Warning',
    message: 'SIMULATED DATA: Ambient temperature -26.4°C with moist onshore blizzard drift caused partial icing on Hab Ventilation Intake C. Trace heating coils operating at 92% load.',
    is_acknowledged: true,
    acknowledged_by_user_id: 'usr-001',
    acknowledged_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    is_resolved: false,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'alt-005',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    category: 'COMMS',
    severity: 'HIGH',
    title: '[DEMO] Ku-Band VSAT 3.8m Tracking Gimbal Azimuth Jitter',
    message: 'SIMULATED DATA: Sastrugi snow pack vibration causing 1.5° intermittent tracking error on Ku-band satellite uplink. Bandwidth throttled to 8.2 Mbps.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 9 * 3600000).toISOString()
  },
  {
    id: 'alt-006',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    category: 'MAINTENANCE',
    severity: 'HIGH',
    title: '[DEMO] North Airlock Silicone Door Seal Inspection Overdue',
    message: 'SIMULATED DATA: Scheduled thermal inspection of pneumatic insulated seals on North Hab Airlock is 3 days overdue. Thermal imaging detected frost bridge along threshold.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString()
  },

  // 3. MEDIUM SEVERITY ALERTS
  {
    id: 'alt-007',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    category: 'INVENTORY',
    severity: 'MEDIUM',
    title: '[DEMO] Emergency Hypothermia Kits Below Safety Buffer',
    message: 'SIMULATED DATA: Available dispensary inventory has dropped to 8 kits (minimum safety baseline is 10 kits). Resupply requested for next seasonal tractor convoy.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: 'alt-008',
    station_id: 'stn-dakshin-gangotri',
    station_code: 'DAKSHIN_GANGOTRI',
    category: 'INVENTORY',
    severity: 'MEDIUM',
    title: '[DEMO] High-Calorie Survival Rations Depletion Warning',
    message: 'SIMULATED DATA: Unmanned depot container #2 ration cache is down to 380 kg (safety baseline 300 kg). Runway remains at ~95 days for transit personnel.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 20 * 3600000).toISOString()
  },
  {
    id: 'alt-009',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    category: 'FUEL',
    severity: 'MEDIUM',
    title: '[DEMO] Cogeneration Secondary Coolant Loop Pressure Swing',
    message: 'SIMULATED DATA: Secondary heat recovery circuit reported minor pressure oscillations between 2.2 and 3.4 bar. Bypass valve engaged smoothly.',
    is_acknowledged: true,
    acknowledged_by_user_id: 'usr-001',
    acknowledged_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    is_resolved: false,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString()
  },

  // 4. LOW SEVERITY ALERTS
  {
    id: 'alt-010',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    category: 'MAINTENANCE',
    severity: 'LOW',
    title: '[DEMO] Reverse Osmosis Unit #2 Inspection Scheduled',
    message: 'SIMULATED DATA: Desalination filter membrane 500-hour routine cleaning scheduled within 48 hours to preserve freshwater production efficiency.',
    is_acknowledged: true,
    acknowledged_by_user_id: 'usr-001',
    acknowledged_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    is_resolved: false,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: 'alt-011',
    station_id: 'stn-dakshin-gangotri',
    station_code: 'DAKSHIN_GANGOTRI',
    category: 'MAINTENANCE',
    severity: 'LOW',
    title: '[DEMO] Meteorological Mast Guy Wire Rigging Inspection Due',
    message: 'SIMULATED DATA: Periodic tension test on stainless steel anchor guy wires due within 12 days prior to winter storm season.',
    is_acknowledged: false,
    acknowledged_by_user_id: null,
    acknowledged_at: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 36 * 3600000).toISOString()
  },

  // 5. RESOLVED ALERTS (To test Resolved / All filters)
  {
    id: 'alt-012',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    category: 'TEMPERATURE',
    severity: 'MEDIUM',
    title: '[DEMO] Optical Observatory Roof Heater Circuit Tripped',
    message: 'SIMULATED DATA: Overload protection tripped circuit breaker CB-12 on optical aurora camera dome heater during heavy riming.',
    is_acknowledged: true,
    acknowledged_by_user_id: 'usr-001',
    acknowledged_at: new Date(Date.now() - 40 * 3600000).toISOString(),
    is_resolved: true,
    resolved_at: new Date(Date.now() - 32 * 3600000).toISOString(),
    resolution_notes: 'Thermal breaker reset, frost cleared, heating tape load verified nominal at 2.4 kW.',
    created_at: new Date(Date.now() - 44 * 3600000).toISOString()
  },
  {
    id: 'alt-013',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    category: 'FUEL',
    severity: 'HIGH',
    title: '[DEMO] Generator #1 Fuel Pre-Heater Temperature Drift',
    message: 'SIMULATED DATA: Viscosity heating coil RTD probe registered +6°C drift during diesel pre-heating cycle.',
    is_acknowledged: true,
    acknowledged_by_user_id: 'usr-002',
    acknowledged_at: new Date(Date.now() - 50 * 3600000).toISOString(),
    is_resolved: true,
    resolved_at: new Date(Date.now() - 42 * 3600000).toISOString(),
    resolution_notes: 'Replaced faulty PT100 sensor with spare from workshop locker. Output stabilized.',
    created_at: new Date(Date.now() - 52 * 3600000).toISOString()
  }
];

// OPERATIONAL INCIDENTS (Covering P1, P2, P3, P4, Emergency and Resolved, with workflow Open -> Assigned -> In Progress -> Resolved)
export const defaultIncidents = [
  {
    id: 'inc-001',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] Greywater Bioseparator Heating Coil Failure in -38°C Gale',
    description: 'SIMULATED DATA: Thermal overload sensor tripped breaker Q4 in waste treatment module during sub-zero katabatic wind. Emergency heat tracing required to prevent biological separator tank freeze-up.',
    priority: 'P1_CRITICAL',
    category: 'LIFE_SUPPORT_EMERGENCY',
    status: 'IN_PROGRESS',
    reported_by_name: 'Lt. Cdr. Priya Sundaram',
    assigned_team: 'Life-Support Rapid Response Crew',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    resolved_at: null
  },
  {
    id: 'inc-002',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] Katabatic Gale Damage to Sonic Anemometer Mast B',
    description: 'SIMULATED DATA: Wind gusts exceeding 58 knots caused structural whipping on Mast B, severing signal cable to sonic anemometer #3. Surface wind telemetry operating on backup cup anemometer.',
    priority: 'P2_HIGH',
    category: 'METEOROLOGY_EQUIPMENT',
    status: 'ASSIGNED',
    reported_by_name: 'Lt. Cdr. Priya Sundaram',
    assigned_team: 'Electrical & Instrumentation Team',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    resolved_at: null
  },
  {
    id: 'inc-003',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Heat Exchanger Loop B Pressure Oscillation',
    description: 'SIMULATED DATA: Cogeneration secondary coolant loop reported periodic pressure swings between 2.1 and 3.8 bar. Automated bypass valve engaged smoothly. No drop in habitat heating detected.',
    priority: 'P3_MEDIUM',
    category: 'HVAC_POWER',
    status: 'OPEN',
    reported_by_name: 'Dr. Rajesh Nair',
    assigned_team: 'Station Mechanical Support',
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    resolved_at: null
  },
  {
    id: 'inc-004',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Airlock 2 Exterior Apron LED Floodlight Glaze-Over',
    description: 'SIMULATED DATA: Wind-driven sastrugi snow pack partially obscured safety floodlight #4 outside Hab Airlock 2. Advisory issued for outdoor night travel.',
    priority: 'P4_LOW',
    category: 'FACILITY_LIGHTING',
    status: 'OPEN',
    reported_by_name: 'Dr. Sunita Deshmukh',
    assigned_team: 'Station General Maintenance',
    created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
    resolved_at: null
  },
  {
    id: 'inc-005',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] Diesel Transfer Pump B Vapor Lock During Bunker Transfer',
    description: 'SIMULATED DATA: Auxiliary transfer pump B lost suction during fuel transfer from Bunker 3. Purged air bleed port and replaced delivery check valve gasket.',
    priority: 'P2_HIGH',
    category: 'FUEL_LOGISTICS',
    status: 'RESOLVED',
    reported_by_name: 'Anand Verma',
    assigned_team: 'Power Station Technicians',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 40 * 3600000).toISOString(),
    resolution_summary: 'Air lock cleared, pump primed, and transfer completed at 45 L/min nominal rate.'
  },
  {
    id: 'inc-006',
    station_id: 'stn-dakshin-gangotri',
    station_code: 'DAKSHIN_GANGOTRI',
    title: '[DEMO] Iridium SBD Beacon Packet Loss at Automated Depot',
    description: 'SIMULATED DATA: Automated depot beacon is dropping 22% of scheduled telemetry packets during high-ionospheric-noise periods. Remote reset completed; antenna feed and backup VHF relay require inspection.',
    priority: 'P2_HIGH',
    category: 'SATELLITE_NETWORK',
    equipment_system: 'Iridium SBD telemetry terminal and VHF relay mast',
    status: 'OPEN',
    reported_by_name: 'AntarSetu Remote Monitoring Cell',
    assigned_team: 'Communications & Network Response Team',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    resolved_at: null
  },
  {
    id: 'inc-007',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Atmospheric LIDAR Laser Chiller Temperature Drift',
    description: 'SIMULATED DATA: Laboratory LIDAR chiller outlet temperature is 4.2°C above its calibration envelope, placing the next upper-atmosphere observation run on hold pending a coolant loop inspection.',
    priority: 'P3_MEDIUM',
    category: 'LABORATORY_EQUIPMENT',
    equipment_system: 'Atmospheric LIDAR laser chiller loop',
    status: 'ASSIGNED',
    reported_by_name: 'Dr. Sunita Deshmukh',
    assigned_team: 'Science Instrumentation Team',
    created_at: new Date(Date.now() - 16 * 3600000).toISOString(),
    resolved_at: null
  },
  {
    id: 'inc-008',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] PistenBully Cargo Sled Brake-Line Pressure Drop',
    description: 'SIMULATED DATA: Scheduled resupply vehicle reported intermittent hydraulic brake pressure loss while maneuvering near the fuel farm. Vehicle grounded until the line is pressure-tested and the spare seal kit is installed.',
    priority: 'P4_LOW',
    category: 'VEHICLE',
    equipment_system: 'PistenBully tracked utility vehicle PB-02',
    status: 'RESOLVED',
    reported_by_name: 'Anand Verma',
    assigned_team: 'Field Vehicles & Logistics Crew',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 60 * 3600000).toISOString(),
    resolution_summary: 'Brake hose flare retorqued, seal replaced, and static/load tests passed before vehicle release.'
  }
];

// PREVENTIVE & OVERDUE MAINTENANCE TASKS
export const defaultMaintenanceTasks = [
  {
    id: 'mnt-001',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] Biannual Insulated Airlock Door Seal & De-Icer Inspection',
    description: 'SIMULATED DATA: Inspect silicone pneumatic weather seals on Main North Airlock and South Survival Shelter. Test electric resistive heating tape along door thresholds.',
    system_type: 'HABITAT_STRUCTURAL',
    priority: 'CRITICAL',
    due_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], // OVERDUE by 3 days!
    status: 'IN_PROGRESS',
    assigned_person: 'Lt. Cdr. Priya Sundaram',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-002',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Solar Photovoltaic Array Snow Clearing & Inverter Calibration',
    description: 'SIMULATED DATA: Clear sastrugi snow pack from rooftop south-facing solar modules (25 kW array). Check string voltages and ground fault protection relays.',
    system_type: 'SOLAR_RENEWABLE',
    priority: 'MEDIUM',
    due_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // OVERDUE by 1 day!
    status: 'OPEN',
    assigned_person: 'Dr. Sunita Deshmukh',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-003',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Monthly Oil & Filter Change - Scania Generator Unit #1',
    description: 'SIMULATED DATA: Drain lubricant, replace Mobil Delvac 5W-40 (60L), replace primary and secondary fuel filter elements, inspect belt tension and coolant inhibitor.',
    system_type: 'POWER_GEN',
    priority: 'HIGH',
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Due in 2 days
    status: 'ASSIGNED',
    assigned_person: 'Er. Sandeep Rawat (Chief GenTech)',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-004',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] Lake Priyadarshini Water Extraction Line De-Icing Service',
    description: 'SIMULATED DATA: Inspect vacuum trace heating cables along 450m insulated freshwater supply pipe running from Lake Priyadarshini to station holding tanks.',
    system_type: 'WATER_TREATMENT',
    priority: 'HIGH',
    due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    status: 'OPEN',
    assigned_person: 'Anand Verma',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-005',
    station_id: 'stn-dakshin-gangotri',
    station_code: 'DAKSHIN_GANGOTRI',
    title: '[DEMO] Seasonal Transit Depot Survival Shelter Rigging Audit',
    description: 'SIMULATED DATA: Inspect snow ablation around emergency cargo containers, check guy wires on met mast, replace Iridium antenna desiccant cartridges.',
    system_type: 'DEPOT_INFRASTRUCTURE',
    priority: 'MEDIUM',
    due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    status: 'ASSIGNED',
    assigned_person: 'Expedition Convoy Team Alpha',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-006',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Atmospheric LIDAR Laser Chiller Coolant Inspection',
    description: 'SIMULATED DATA: Checked ethylene glycol concentration ratio (-50°C freeze rating verified). Refilled closed-loop chiller reservoir to nominal marker.',
    system_type: 'SCIENCE_EQUIPMENT',
    priority: 'LOW',
    due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: 'RESOLVED',
    assigned_person: 'Dr. Sunita Deshmukh',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'mnt-007',
    station_id: 'stn-dakshin-gangotri',
    station_code: 'DAKSHIN_GANGOTRI',
    title: '[DEMO] Iridium Antenna Desiccant and Backup Relay Preventive Service',
    description: 'SIMULATED DATA: Replace moisture cartridges, inspect coaxial connectors, and validate the backup VHF relay before the next autonomous telemetry window.',
    system_type: 'SATELLITE_NETWORK',
    priority: 'HIGH',
    due_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: 'OPEN',
    assigned_person: 'Communications & Network Response Team',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-008',
    station_id: 'stn-bharati',
    station_code: 'BHARATI',
    title: '[DEMO] Potable Water UV Sterilizer and Flow Sensor Calibration',
    description: 'SIMULATED DATA: Verify UV dose output, clean the quartz sleeve, and calibrate the outlet flow sensor on the potable water treatment skid.',
    system_type: 'WATER_TREATMENT',
    priority: 'MEDIUM',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'ASSIGNED',
    assigned_person: 'Station Mechanical Support',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    completed_at: null
  },
  {
    id: 'mnt-009',
    station_id: 'stn-maitri',
    station_code: 'MAITRI',
    title: '[DEMO] Snowcat Emergency Beacon and Cabin Safety Kit Inspection',
    description: 'SIMULATED DATA: Inspect vehicle beacon batteries, cabin fire suppressor seals, emergency oxygen kit, and tow-line condition before the next winter traverse.',
    system_type: 'VEHICLE_SAFETY',
    priority: 'LOW',
    due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    status: 'OPEN',
    assigned_person: 'Field Vehicles & Logistics Crew',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    completed_at: null
  }
];

export const defaultActivityLogs = [
  {
    id: 'act-001',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    action: 'TELEMETRY_SYNC',
    station_code: 'BHARATI',
    user_name: 'Automated VSAT Uplink',
    details: '[DEMO SIMULATION] Ingested 60-second telemetry packet: Outdoor -26.4°C, Cogeneration Load 68.5%.'
  },
  {
    id: 'act-002',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    action: 'ALERT_ACKNOWLEDGED',
    station_code: 'MAITRI',
    user_name: 'Lt. Cdr. Priya Sundaram',
    details: '[DEMO SIMULATION] Acknowledged CRITICAL Alert: Severe Katabatic Wind Storm (58.5 kts).'
  },
  {
    id: 'act-003',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    action: 'INVENTORY_CONSUMPTION',
    station_code: 'BHARATI',
    user_name: 'Dr. Rajesh Nair',
    details: '[DEMO SIMULATION] Logged daily generator diesel consumption: -340 Litres (ATF-K).'
  },
  {
    id: 'act-004',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    action: 'INCIDENT_CREATED',
    station_code: 'MAITRI',
    user_name: 'Lt. Cdr. Priya Sundaram',
    details: '[DEMO SIMULATION] Logged P1 Incident: Greywater Bioseparator Heating Coil Failure.'
  }
];

// ─── PERSONNEL ──────────────────────────────────────────────────────────────
export const defaultPersonnel = [
  // BHARATI (8 personnel)
  {
    id: 'per-001', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Dr. Rajesh Nair', role: 'STATION_COMMANDER',
    designation: 'Station Commander & Chief Geophysicist',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Meera Nair', relationship: 'Spouse', phone: '+91-9876543210' },
    notes: '[DEMO] Expedition Leader for 43rd Indian Antarctic Expedition.'
  },
  {
    id: 'per-002', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Dr. Sunita Deshmukh', role: 'SCIENTIST',
    designation: 'Senior Glaciologist & Climate Observer',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Prakash Deshmukh', relationship: 'Spouse', phone: '+91-9823456710' },
    notes: '[DEMO] Leading ice-core paleoclimate research program.'
  },
  {
    id: 'per-003', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Dr. Arjun Menon', role: 'SCIENTIST',
    designation: 'Atmospheric Chemist',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'REQUIRES_MONITORING', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Lakshmi Menon', relationship: 'Mother', phone: '+91-9845671230' },
    notes: '[DEMO] Monitoring for mild altitude-related fatigue. Under observation.'
  },
  {
    id: 'per-004', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Sgt. Vikram Chauhan', role: 'ENGINEER',
    designation: 'Senior Power Systems Engineer',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Asha Chauhan', relationship: 'Spouse', phone: '+91-9887654321' },
    notes: '[DEMO] Responsible for cogeneration plant and solar array maintenance.'
  },
  {
    id: 'per-005', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Dr. Kavitha Pillai', role: 'DOCTOR',
    designation: 'Medical Officer & Physiologist',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Ravi Pillai', relationship: 'Spouse', phone: '+91-9765432109' },
    notes: '[DEMO] Station Medical Officer. All personnel cleared for field operations.'
  },
  {
    id: 'per-006', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Ravi Iyer', role: 'TECHNICIAN',
    designation: 'VSAT & Communications Technician',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Geetha Iyer', relationship: 'Mother', phone: '+91-9812345678' },
    notes: '[DEMO] Maintains Ku-band VSAT link and HF radio systems.'
  },
  {
    id: 'per-007', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Chef Mohan Tripathi', role: 'COOK',
    designation: 'Catering & Nutrition Specialist',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Sita Tripathi', relationship: 'Spouse', phone: '+91-9876501234' },
    notes: '[DEMO] Managing nutrition for 28-person crew in extreme cold conditions.'
  },
  {
    id: 'per-008', station_id: 'stn-bharati', station_code: 'BHARATI',
    name: 'Dr. Priya Krishnan', role: 'SCIENTIST',
    designation: 'Marine Biologist',
    deployment_start: '2024-11-15', expected_return: '2025-04-10',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Suresh Krishnan', relationship: 'Father', phone: '+91-9871234560' },
    notes: '[DEMO] Studying krill population dynamics in Prydz Bay.'
  },

  // MAITRI (7 personnel)
  {
    id: 'per-009', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Lt. Cdr. Priya Sundaram', role: 'STATION_COMMANDER',
    designation: 'Station Commander & Lead Power Systems Engineer',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Karthik Sundaram', relationship: 'Spouse', phone: '+91-9901234567' },
    notes: '[DEMO] Commanding Maitri during critical generator failure recovery.'
  },
  {
    id: 'per-010', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Dr. Anand Kulkarni', role: 'SCIENTIST',
    designation: 'Geomagnetism & Upper Atmosphere Researcher',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Radha Kulkarni', relationship: 'Spouse', phone: '+91-9923456789' },
    notes: '[DEMO] Operates USIG-07 variometer and riometer arrays.'
  },
  {
    id: 'per-011', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Eng. Suresh Patil', role: 'ENGINEER',
    designation: 'Mechanical Systems & HVAC Engineer',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'REQUIRES_MONITORING', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Savita Patil', relationship: 'Spouse', phone: '+91-9934567890' },
    notes: '[DEMO] Under observation after minor cold injury at -47°C outdoor maintenance.'
  },
  {
    id: 'per-012', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Dr. Neeraj Sharma', role: 'DOCTOR',
    designation: 'Medical Officer & Emergency Physician',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Reena Sharma', relationship: 'Spouse', phone: '+91-9945678901' },
    notes: '[DEMO] Treating Patil for grade-1 frostbite on right hand — recovery good.'
  },
  {
    id: 'per-013', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Rohan Gupta', role: 'TECHNICIAN',
    designation: 'Electrical & Instrumentation Technician',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'FIT', comm_status: 'INTERMITTENT',
    emergency_contact: { name: 'Amit Gupta', relationship: 'Father', phone: '+91-9956789012' },
    notes: '[DEMO] Intermittent comms — deployed to remote seismic array calibration site.'
  },
  {
    id: 'per-014', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Chef Ganesh Bhat', role: 'COOK',
    designation: 'Catering & Field Rations Specialist',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Usha Bhat', relationship: 'Spouse', phone: '+91-9967890123' },
    notes: '[DEMO] Managing high-calorie nutrition program for cold-weather operations.'
  },
  {
    id: 'per-015', station_id: 'stn-maitri', station_code: 'MAITRI',
    name: 'Dr. Deepa Joshi', role: 'SCIENTIST',
    designation: 'Meteorologist & Ozone Column Observer',
    deployment_start: '2024-11-20', expected_return: '2025-03-20',
    health_status: 'FIT', comm_status: 'REACHABLE',
    emergency_contact: { name: 'Vinod Joshi', relationship: 'Spouse', phone: '+91-9978901234' },
    notes: '[DEMO] Operating Dobson ozone spectrophotometer and AWS network.'
  },

  // DAKSHIN GANGOTRI (4 personnel)
  {
    id: 'per-016', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI',
    name: 'Cdr. Ashok Singh', role: 'STATION_COMMANDER',
    designation: 'Station Commander & Structural Safety Officer',
    deployment_start: '2025-01-05', expected_return: '2025-02-28',
    health_status: 'FIT', comm_status: 'INTERMITTENT',
    emergency_contact: { name: 'Poonam Singh', relationship: 'Spouse', phone: '+91-9989012345' },
    notes: '[DEMO] Managing emergency evacuation planning for the partially-submerged station structure.'
  },
  {
    id: 'per-017', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI',
    name: 'Eng. Tarun Mehta', role: 'ENGINEER',
    designation: 'Structural Engineer & Crisis Response Lead',
    deployment_start: '2025-01-05', expected_return: '2025-02-28',
    health_status: 'REQUIRES_MONITORING', comm_status: 'INTERMITTENT',
    emergency_contact: { name: 'Rani Mehta', relationship: 'Spouse', phone: '+91-9990123456' },
    notes: '[DEMO] Monitoring structural integrity of glacier-submerged wing. Elevated stress markers.'
  },
  {
    id: 'per-018', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI',
    name: 'Dr. Lalita Banerjee', role: 'SCIENTIST',
    designation: 'Glaciologist & Ice Sheet Monitor',
    deployment_start: '2025-01-05', expected_return: '2025-02-28',
    health_status: 'FIT', comm_status: 'UNREACHABLE',
    emergency_contact: { name: 'Ayan Banerjee', relationship: 'Spouse', phone: '+91-9901235678' },
    notes: '[DEMO] UNREACHABLE — deployed to Princess Astrid Coast for ice-penetrating radar survey. Last contact 18h ago. ELT activated.'
  },
  {
    id: 'per-019', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI',
    name: 'Dr. Sanjay Pillai', role: 'DOCTOR',
    designation: 'Medical Officer & Emergency Rescue Coordinator',
    deployment_start: '2025-01-05', expected_return: '2025-02-28',
    health_status: 'FIT', comm_status: 'INTERMITTENT',
    emergency_contact: { name: 'Ananya Pillai', relationship: 'Spouse', phone: '+91-9912346789' },
    notes: '[DEMO] On standby alert for potential evacuation medical support.'
  }
];

// ─── WEATHER ─────────────────────────────────────────────────────────────────
const _now = new Date();
function _daysAhead(d) { return new Date(_now.getTime() + d * 86400000).toISOString(); }

export const defaultWeather = [
  {
    id: 'wx-001', station_id: 'stn-bharati', station_code: 'BHARATI',
    recorded_at: _now.toISOString(),
    temperature_c: -22.4, feels_like_c: -34.1,
    wind_speed_knots: 18, wind_direction: 'NNE',
    humidity_pct: 71, pressure_hpa: 987.2, visibility_km: 14.5,
    cloud_cover: 'OVERCAST', precipitation: 'NONE',
    severity: 'MODERATE', outdoor_recommendation: 'CAUTION',
    outdoor_note: '[DEMO] Moderate winds with overcast skies. Full polar PPE required. Buddy-system mandatory.',
    source: '[DEMO SIMULATION — AWS Bharati-01]',
    forecast: [
      { date: _daysAhead(1), label: 'Tomorrow', temp_min: -25, temp_max: -19, wind_knots: 22, severity: 'MODERATE', condition: 'Drifting Snow', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(2), label: 'Day 2', temp_min: -28, temp_max: -21, wind_knots: 31, severity: 'SEVERE', condition: 'Blowing Snow/Storm', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(3), label: 'Day 3', temp_min: -30, temp_max: -24, wind_knots: 38, severity: 'SEVERE', condition: 'Katabatic Winds', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(4), label: 'Day 4', temp_min: -26, temp_max: -20, wind_knots: 24, severity: 'MODERATE', condition: 'Partly Cloudy', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(5), label: 'Day 5', temp_min: -21, temp_max: -16, wind_knots: 14, severity: 'CALM', condition: 'Clear Skies', outdoor_rec: 'SAFE' },
      { date: _daysAhead(6), label: 'Day 6', temp_min: -19, temp_max: -14, wind_knots: 10, severity: 'CALM', condition: 'Clear, Light Winds', outdoor_rec: 'SAFE' },
      { date: _daysAhead(7), label: 'Day 7', temp_min: -23, temp_max: -17, wind_knots: 17, severity: 'MODERATE', condition: 'Increasing Cloud', outdoor_rec: 'CAUTION' }
    ]
  },
  {
    id: 'wx-002', station_id: 'stn-maitri', station_code: 'MAITRI',
    recorded_at: _now.toISOString(),
    temperature_c: -47.3, feels_like_c: -61.8,
    wind_speed_knots: 35, wind_direction: 'SSE',
    humidity_pct: 58, pressure_hpa: 964.5, visibility_km: 2.8,
    cloud_cover: 'STORM', precipitation: 'HEAVY_BLOWING_SNOW',
    severity: 'SEVERE', outdoor_recommendation: 'UNSAFE',
    outdoor_note: '[DEMO] SEVERE katabatic storm in progress. All outdoor operations SUSPENDED. Emergency tether lines active.',
    source: '[DEMO SIMULATION — AWS Maitri-02 + Radiosonde 06:00 UTC]',
    forecast: [
      { date: _daysAhead(1), label: 'Tomorrow', temp_min: -50, temp_max: -43, wind_knots: 42, severity: 'EXTREME', condition: 'Severe Blizzard', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(2), label: 'Day 2', temp_min: -52, temp_max: -46, wind_knots: 55, severity: 'EXTREME', condition: 'Polar Storm', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(3), label: 'Day 3', temp_min: -48, temp_max: -41, wind_knots: 38, severity: 'SEVERE', condition: 'Subsiding Storm', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(4), label: 'Day 4', temp_min: -44, temp_max: -38, wind_knots: 26, severity: 'MODERATE', condition: 'Post-Storm Drift', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(5), label: 'Day 5', temp_min: -42, temp_max: -35, wind_knots: 18, severity: 'MODERATE', condition: 'Partly Cloudy', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(6), label: 'Day 6', temp_min: -40, temp_max: -33, wind_knots: 14, severity: 'CALM', condition: 'Clearing Skies', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(7), label: 'Day 7', temp_min: -38, temp_max: -31, wind_knots: 12, severity: 'CALM', condition: 'Clear & Cold', outdoor_rec: 'SAFE' }
    ]
  },
  {
    id: 'wx-003', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI',
    recorded_at: _now.toISOString(),
    temperature_c: -33.8, feels_like_c: -48.2,
    wind_speed_knots: 52, wind_direction: 'SE',
    humidity_pct: 64, pressure_hpa: 952.1, visibility_km: 0.4,
    cloud_cover: 'WHITEOUT', precipitation: 'EXTREME_BLIZZARD',
    severity: 'EXTREME', outdoor_recommendation: 'UNSAFE',
    outdoor_note: '[DEMO] EXTREME BLIZZARD — WHITEOUT CONDITIONS. Complete lockdown. Emergency beacon armed.',
    source: '[DEMO SIMULATION — AWS DG-03 (last contact 18h ago — estimated from forecast model)]',
    forecast: [
      { date: _daysAhead(1), label: 'Tomorrow', temp_min: -36, temp_max: -30, wind_knots: 58, severity: 'EXTREME', condition: 'Extreme Blizzard', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(2), label: 'Day 2', temp_min: -38, temp_max: -32, wind_knots: 61, severity: 'EXTREME', condition: 'Peak Storm', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(3), label: 'Day 3', temp_min: -35, temp_max: -28, wind_knots: 48, severity: 'SEVERE', condition: 'Subsiding Blizzard', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(4), label: 'Day 4', temp_min: -31, temp_max: -25, wind_knots: 32, severity: 'SEVERE', condition: 'Heavy Drift', outdoor_rec: 'UNSAFE' },
      { date: _daysAhead(5), label: 'Day 5', temp_min: -29, temp_max: -22, wind_knots: 22, severity: 'MODERATE', condition: 'Post-Storm', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(6), label: 'Day 6', temp_min: -27, temp_max: -20, wind_knots: 15, severity: 'MODERATE', condition: 'Partly Cloudy', outdoor_rec: 'CAUTION' },
      { date: _daysAhead(7), label: 'Day 7', temp_min: -25, temp_max: -18, wind_knots: 11, severity: 'CALM', condition: 'Clear & Cold', outdoor_rec: 'SAFE' }
    ]
  }
];

// ─── COMMUNICATIONS ───────────────────────────────────────────────────────────
export const defaultCommWindows = [
  { id: 'win-001', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'PRIMARY_VSAT', scheduled_utc: new Date(_now.getTime() + 3600000).toISOString(), duration_min: 60, status: 'SCHEDULED', notes: '[DEMO] Daily primary VSAT window — HQ Goa operations sync.' },
  { id: 'win-002', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'DATA_SYNC', scheduled_utc: new Date(_now.getTime() + 7200000).toISOString(), duration_min: 30, status: 'SCHEDULED', notes: '[DEMO] Automated science data uplink batch — glaciology datasets.' },
  { id: 'win-003', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'VOICE', scheduled_utc: new Date(_now.getTime() + 18 * 3600000).toISOString(), duration_min: 20, status: 'SCHEDULED', notes: '[DEMO] Monthly personnel welfare voice call — families in India.' },
  { id: 'win-004', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'PRIMARY_VSAT', scheduled_utc: new Date(_now.getTime() + 2 * 3600000).toISOString(), duration_min: 45, status: 'SCHEDULED', notes: '[DEMO] Daily VSAT window — reduced to 45 min due to storm antenna vibration.' },
  { id: 'win-005', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'HF_RADIO', scheduled_utc: new Date(_now.getTime() + 4 * 3600000).toISOString(), duration_min: 15, status: 'SCHEDULED', notes: '[DEMO] Backup HF radio check-in — 14.3 MHz USB (storm protocol).' },
  { id: 'win-006', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'EMERGENCY', scheduled_utc: new Date(_now.getTime() + 30 * 60000).toISOString(), duration_min: 10, status: 'SCHEDULED', notes: '[DEMO] Emergency INMARSAT check — verifying personnel safety during blizzard.' },
  { id: 'win-007', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI', type: 'HF_RADIO', scheduled_utc: new Date(_now.getTime() + 5 * 3600000).toISOString(), duration_min: 10, status: 'SCHEDULED', notes: '[DEMO] HF emergency check — primary VSAT down due to blizzard. 8.2 MHz USB.' },
  { id: 'win-008', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI', type: 'EMERGENCY', scheduled_utc: new Date(_now.getTime() + 60 * 60000).toISOString(), duration_min: 5, status: 'SCHEDULED', notes: '[DEMO] IRIDIUM satellite phone ping — confirming personnel status.' }
];

export const defaultCommLogs = [
  { id: 'log-001', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'PRIMARY_VSAT', status: 'COMPLETED', scheduled_utc: new Date(_now - 24 * 3600000).toISOString(), actual_utc: new Date(_now - 24 * 3600000 + 120000).toISOString(), duration_min: 58, signal_quality_pct: 94, operator: 'Ravi Iyer', notes: '[DEMO] Clean uplink. Transferred 4.2 GB science data. Voice quality excellent.' },
  { id: 'log-002', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'DATA_SYNC', status: 'COMPLETED', scheduled_utc: new Date(_now - 23 * 3600000).toISOString(), actual_utc: new Date(_now - 23 * 3600000 + 90000).toISOString(), duration_min: 28, signal_quality_pct: 91, operator: 'Ravi Iyer', notes: '[DEMO] Automated telemetry and sensor data batch uplink to NCPOR servers.' },
  { id: 'log-003', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'VOICE', status: 'COMPLETED', scheduled_utc: new Date(_now - 48 * 3600000).toISOString(), actual_utc: new Date(_now - 48 * 3600000 + 60000).toISOString(), duration_min: 21, signal_quality_pct: 88, operator: 'Ravi Iyer', notes: '[DEMO] Personnel welfare call. All 28 crew members participated. Morale GOOD.' },
  { id: 'log-004', station_id: 'stn-bharati', station_code: 'BHARATI', type: 'EMAIL', status: 'COMPLETED', scheduled_utc: new Date(_now - 6 * 3600000).toISOString(), actual_utc: new Date(_now - 6 * 3600000 + 30000).toISOString(), duration_min: 5, signal_quality_pct: 96, operator: 'Automated', notes: '[DEMO] Batch email relay — 47 messages sent, 32 received from HQ.' },
  { id: 'log-005', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'PRIMARY_VSAT', status: 'DEGRADED', scheduled_utc: new Date(_now - 24 * 3600000).toISOString(), actual_utc: new Date(_now - 24 * 3600000 + 180000).toISOString(), duration_min: 31, signal_quality_pct: 42, operator: 'Rohan Gupta', notes: '[DEMO] DEGRADED — antenna vibration from 52-kt storm winds. Partial data transfer only (1.1 GB / 3.8 GB).' },
  { id: 'log-006', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'HF_RADIO', status: 'COMPLETED', scheduled_utc: new Date(_now - 20 * 3600000).toISOString(), actual_utc: new Date(_now - 20 * 3600000 + 300000).toISOString(), duration_min: 12, signal_quality_pct: 67, operator: 'Rohan Gupta', notes: '[DEMO] HF backup check-in 14.3 MHz USB. Signal fair. All crew confirmed safe.' },
  { id: 'log-007', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'PRIMARY_VSAT', status: 'MISSED', scheduled_utc: new Date(_now - 12 * 3600000).toISOString(), actual_utc: null, duration_min: null, signal_quality_pct: null, operator: null, notes: '[DEMO] MISSED — Antenna tracking controller fault during storm. HF backup used instead.' },
  { id: 'log-008', station_id: 'stn-maitri', station_code: 'MAITRI', type: 'EMERGENCY', status: 'COMPLETED', scheduled_utc: new Date(_now - 8 * 3600000).toISOString(), actual_utc: new Date(_now - 8 * 3600000 + 120000).toISOString(), duration_min: 9, signal_quality_pct: 78, operator: 'Lt. Cdr. Priya Sundaram', notes: '[DEMO] Emergency INMARSAT check after antenna fault. All personnel confirmed safe.' },
  { id: 'log-009', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI', type: 'PRIMARY_VSAT', status: 'MISSED', scheduled_utc: new Date(_now - 24 * 3600000).toISOString(), actual_utc: null, duration_min: null, signal_quality_pct: null, operator: null, notes: '[DEMO] MISSED — Extreme blizzard (61-kt gusts). VSAT antenna offline. Emergency beacon active.' },
  { id: 'log-010', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI', type: 'HF_RADIO', status: 'DEGRADED', scheduled_utc: new Date(_now - 20 * 3600000).toISOString(), actual_utc: new Date(_now - 20 * 3600000 + 600000).toISOString(), duration_min: 7, signal_quality_pct: 31, operator: 'Cdr. Ashok Singh', notes: '[DEMO] DEGRADED — Severe ionospheric interference. 3 of 4 personnel confirmed safe. Dr. Banerjee unreachable (field deployment).' },
  { id: 'log-011', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI', type: 'EMERGENCY', status: 'COMPLETED', scheduled_utc: new Date(_now - 18 * 3600000).toISOString(), actual_utc: new Date(_now - 18 * 3600000 + 300000).toISOString(), duration_min: 4, signal_quality_pct: 55, operator: 'Cdr. Ashok Singh', notes: '[DEMO] IRIDIUM satellite phone. 3 personnel safe and sheltered. Dr. Banerjee ELT confirmed at field camp.' },
  { id: 'log-012', station_id: 'stn-dakshin-gangotri', station_code: 'DAKSHIN_GANGOTRI', type: 'PRIMARY_VSAT', status: 'MISSED', scheduled_utc: new Date(_now - 12 * 3600000).toISOString(), actual_utc: null, duration_min: null, signal_quality_pct: null, operator: null, notes: '[DEMO] MISSED — Continuing blizzard conditions. VSAT still offline. Station in lockdown.' }
];
