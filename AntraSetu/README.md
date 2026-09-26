# AntarSetu (अन्तरसेतु)
### Digital Operations Platform for Indian Antarctic Research Stations

AntarSetu is a scientific mission-control and remote operations platform built for the **National Centre for Polar and Ocean Research (NCPOR)** and the **Ministry of Earth Sciences, Government of India**. It enables central monitoring, life-support telemetry tracking, consumable burn-rate calculations, incident management, and automated safety alarms across India's Antarctic bases:
- **Bharati Station** (69°24′S, 76°11′E, Larsemann Hills)
- **Maitri Station** (70°46′S, 11°44′E, Schirmacher Oasis)
- **Dakshin Gangotri** (70°05′S, 12°00′E, Unmanned Logistics & Met Depot)

---

## ❄ Key Features & Modules

1. **Mission Operations Dashboard**:
   - High-density polar operational cockpit displaying fleet-level readiness index.
   - Aggregate critical telemetry metrics (average ambient temperature, generator load %, communication health).
   - Real-time active alerts triage widget with immediate 1-click Acknowledgment.
   - Consumables runway analysis highlighting resources with lowest days remaining.
   - Live activity audit log tracing operator actions and automated alert engine triggers.
   - Rapid emergency action shortcuts (log incident, adjust stock, schedule tasks).

2. **Antarctic Station Monitoring**:
   - Real-time telemetry monitoring for Bharati, Maitri, and Dakshin Gangotri.
   - Comprehensive sensor readouts: outdoor vs. indoor habitat climate, katabatic wind velocity, generator load kW, fuel level %, battery reserve %, and satellite ping latency.
   - Subsystem operational readiness matrix: HVAC & Atmosphere, Cogeneration Power, Water Desalination, and Polar Airlock heating seals.
   - Interactive time-series historical charts (Recharts) tracking environmental variations and generator fuel burn-down curves.

3. **Rule-Based Alert Intelligence**:
   - Polar safety threshold evaluation engine:
     - Ambient deep-freeze alarm ($< -40^\circ\text{C}$).
     - Low diesel generator fuel warning ($< 25\%$ warning, $< 15\%$ critical).
     - Katabatic gale storm alerts ($> 55\text{ knots}$).
     - Satellite link latency spike & degradation alarms.
     - Consumable inventory low-stock warnings.
     - Overdue preventative maintenance task warnings.
   - Severity classification: `Critical`, `High`, `Medium`, `Low`.
   - Full acknowledgment and resolution workflows with timestamped operator audit trails.
   - Emergency drill simulation modal to inject test hazards.

4. **Resource & Logistics Runway Management**:
   - Inventory table for mission-critical consumables: Polar ATF Diesel, Food Rations, Medical Oxygen, Generator Spares, and RO Desalination Membranes.
   - Dynamic burn-rate formula:
     $$\text{Days Remaining} = \frac{\text{Current Stock Quantity}}{\text{Daily Consumption Rate}}$$
   - Automated status labeling (`CRITICAL`, `LOW`, `OPTIMAL`) based on runway and minimum safety buffers.
   - "Update Stock" modal supporting consumption logging and convoy replenishment deliveries.
   - Complete historical transaction audit trail for every SKU.

5. **Maintenance & Incident Management**:
   - Dual-tab workflow: Operational Incidents and Preventative Maintenance Tasks.
   - Priority-tiered incident ticketing (`P1_CRITICAL`, `P2_HIGH`, `P3_MEDIUM`, `P4_LOW`).
   - Incident lifecycle progression: `REPORTED` $\rightarrow$ `INVESTIGATING` $\rightarrow$ `MITIGATED` $\rightarrow$ `RESOLVED`.
   - Scheduled maintenance checklists with automated calculation of `OVERDUE` tasks.

6. **Antarctic Polar Stereographic Map**:
   - Custom SVG interactive polar projection map with concentric latitude rings (60°S to 90°S South Pole), Princess Astrid Coast, and Larsemann Hills.
   - Glowing LED status indicators reflecting live station operational states.
   - Interactive floating HUD popup displaying live telemetry and direct console jump.
   - Polar geodesic transit distance matrix.

7. **Reports & Operational Briefing Dossier**:
   - Generates official NCPOR daily briefing dossiers aggregating fleet telemetry, active hazards, low-stock runways, open incidents, and overdue tasks.
   - One-click CSV export streams for Inventory, Incidents, and Station telemetry.
   - Print-ready and PDF-styled layout with official government mastheads.

8. **Authentication & Role-Based Access**:
   - JWT-based authentication with pre-configured demo account switcher.
   - Pre-seeded personnel:
     - **Station Commander** (Dr. Rajesh Nair)
     - **Operations Engineer** (Lt. Cdr. Priya Sundaram)
     - **Logistics Director** (Anand Verma)
     - **Science Observer** (Dr. Sunita Deshmukh)

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express, JSONWebToken, Bcryptjs, Morgan, CORS, Dotenv.
- **Database**:
  - Primary: PostgreSQL driver (`pg` connection pool) supported via `DATABASE_URL`.
  - Resilience: Automatic zero-configuration fallback to local persistent datastore (`server/data/antarsetu_store.json`), allowing immediate local development without configuring PostgreSQL.
- **Simulation**: Background interval engine simulating realistic Antarctic weather drifts, generator fuel consumption, and automated safety rule evaluation.

---

## 🚀 Quick Start Guide

### 1. Start Both Backend & Frontend
Both servers are currently configured and running:

```powershell
# In terminal 1 (Backend API on port 5000):
cd server
npm start

# In terminal 2 (Frontend Client on port 5173):
cd client
npm run dev
```

Or run both concurrently from the root directory:
```powershell
npm run dev
```

### 2. Access the Application
Open your browser to:
**`http://localhost:5173`**

### 3. Demo Login Credentials
You can click any demo button on the login screen, or log in manually:

| Name | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Dr. Rajesh Nair** | Station Commander | `commander.bharati@antarsetu.gov.in` | `antarsetu123` |
| **Lt. Cdr. Priya Sundaram** | Operations Engineer | `engineer.maitri@antarsetu.gov.in` | `antarsetu123` |
| **Anand Verma** | Logistics Director | `logistics.hq@antarsetu.gov.in` | `antarsetu123` |
| **Dr. Sunita Deshmukh** | Science Observer | `scientist.glaciology@antarsetu.gov.in` | `antarsetu123` |

---

## 🌐 API Endpoints Reference

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & UTC polar clock |
| `/api/auth/login` | `POST` | Authenticate operator & issue JWT |
| `/api/auth/me` | `GET` | Fetch authenticated session |
| `/api/stations` | `GET` | List all stations with latest telemetry |
| `/api/stations/:id` | `GET` | Station details, subsystems & history |
| `/api/alerts` | `GET` | Filtered active & historical alerts |
| `/api/alerts/:id/acknowledge` | `POST` | Acknowledge alert |
| `/api/alerts/:id/resolve` | `POST` | Resolve alert with notes |
| `/api/inventory` | `GET` | Consumables list with days remaining |
| `/api/inventory/:id/stock` | `PATCH` | Update stock quantity & log transaction |
| `/api/incidents` | `GET`, `POST` | Incident triage & reporting |
| `/api/incidents/:id` | `PATCH` | Update incident status |
| `/api/maintenance` | `GET`, `POST` | Preventative tasks with overdue flags |
| `/api/reports/summary` | `GET` | Fleet operational briefing dossier |
| `/api/reports/export/csv` | `GET` | Stream CSV dataset |
