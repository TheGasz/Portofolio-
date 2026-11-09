/**
 * Detailed Case Study Content for all 11 Machine Learning & Data Engineering projects.
 * Follows the standard storytelling framework: Problem -> Data -> Architecture -> Trade-offs -> Metrics -> Artifacts.
 *
 * @typedef {Object} ArchitectureNode
 * @property {string} id
 * @property {string} label
 * @property {"input"|"process"|"model"|"guard"|"output"} kind
 * @property {string} [detail]
 *
 * @typedef {Object} ArchitectureEdge
 * @property {string} from
 * @property {string} to
 * @property {string} [label]
 *
 * @typedef {Object} DemoConfig
 * @property {"iframe"|"playground"|"in-browser"|"none"} type
 * @property {"live"|"coming-soon"} status
 * @property {string} [url]
 * @property {string} [component]
 * @property {string} [coldStartNote]
 *
 * @typedef {Object} ProjectDetail
 * @property {string} slug
 * @property {string} title
 * @property {string} tagline
 * @property {string} category
 * @property {{ role?: string, timeline?: string, context?: string }} meta
 * @property {{ statement: string, whoIsAffected: string, whyML: string, constraints: string[] }} problem
 * @property {{ sources: { name: string, detail: string }[], challenges: { issue: string, fix: string }[] }} data
 * @property {{ nodes: ArchitectureNode[], edges: ArchitectureEdge[] }} architecture
 * @property {{ decision: string, chosen: string, alternative: string, why: string }[]} tradeoffs
 * @property {{ name: string, value: string, baseline?: string, note?: string }[]} metrics
 * @property {string[]} impact
 * @property {string[]} limitations
 * @property {DemoConfig} demo
 * @property {{ label: string, url: string }[]} artifacts
 */

/** @type {Record<string, ProjectDetail>} */
export const projectDetails = {
  "enterprise-ai-support-copilot": {
    slug: "enterprise-ai-support-copilot",
    title: "Enterprise AI Support Copilot (RAG)",
    tagline: "Fine-tuned IndoBERT classifier + hybrid RAG (BM25 + FAISS) with strict confidence-based escalation for messy Indonesian tickets.",
    category: "GenAI & Agents",
    meta: {
      role: "Solo ML & Backend Engineer",
      timeline: "2024",
      context: "Production-grade support system prototype for multi-channel Indonesian customer service.",
    },
    problem: {
      statement: "Customer support agents in Indonesia drown in unstructured, slang-ridden, typo-heavy support tickets with mixed error codes. Generic LLM chatbots either hallucinate invalid fixes or erroneously approve voided warranties.",
      whoIsAffected: "Tier-1 Customer Support Teams & Operations Managers who waste hours triaging complaints and dealing with erroneous AI approvals.",
      whyML: "Rule-based regex fails against informal Indonesian dialects ('bgt', 'bisa bgt', 'gmn nh'), while fine-tuned SLMs handle classification with low latency and RAG grounds replies strictly in official company SOPs.",
      constraints: [
        "Inference latency under 150 ms for initial ticket categorization",
        "Zero hallucinated warranty approvals on edge-case void policies",
        "Graceful escalation to human support when confidence is below 85%",
      ],
    },
    data: {
      sources: [
        { name: "Indonesian Support Ticket Corpus", detail: "Real & synthetic customer queries spanning hardware, billing, and connectivity issues." },
        { name: "Enterprise Warranty SOPs", detail: "Chunked markdown policies with metadata filters (device type, contract tier, incident date)." },
      ],
      challenges: [
        { issue: "Informal Indonesian Slang & Typos", fix: "Fine-tuned IndoBERT-base with LoRA on colloquial ticket text, achieving 0.98 macro-F1." },
        { issue: "Exact Error Code Mismatch in Dense Vector Search", fix: "Implemented Hybrid Retrieval (BM25 keyword search + FAISS dense embeddings) with cross-encoder reranking." },
        { issue: "Adversarial Hallucination Traps", fix: "Trained a confidence calibration router that catches 30/30 adversarial test traps and abstains." },
      ],
    },
    architecture: {
      nodes: [
        { id: "input", label: "Inbound Ticket (ID Slang)", kind: "input", detail: "Raw text from chat/email" },
        { id: "triage", label: "IndoBERT LoRA Triage", kind: "model", detail: "Predicts category & urgency" },
        { id: "retriever", label: "Hybrid RAG (BM25 + FAISS)", kind: "process", detail: "Extracts top-k SOP chunks" },
        { id: "rerank", label: "Cross-Encoder Reranker", kind: "process", detail: "Scores chunk relevance" },
        { id: "router", label: "Confidence Router", kind: "guard", detail: "Check threshold & traps" },
        { id: "output", label: "Grounded Answer + Citations", kind: "output", detail: "FastAPI stream to UI" },
        { id: "escalate", label: "Human Escalation Queue", kind: "output", detail: "Transfers to Tier-2 agent" },
      ],
      edges: [
        { from: "input", to: "triage" },
        { from: "triage", to: "retriever" },
        { from: "retriever", to: "rerank" },
        { from: "rerank", to: "router" },
        { from: "router", to: "output", label: "High Confidence" },
        { from: "router", to: "escalate", label: "Low Confidence / Trap" },
      ],
    },
    tradeoffs: [
      {
        decision: "Fine-tuned IndoBERT vs Direct LLM Zero-Shot Triage",
        chosen: "IndoBERT with LoRA / PEFT",
        alternative: "GPT-4 / Claude prompt-based triage",
        why: "IndoBERT runs in ~35 ms locally on CPU/small instance at $0 marginal token cost, eliminating prompt injection risks in triage.",
      },
      {
        decision: "Hybrid Retrieval vs Vector-Only Search",
        chosen: "BM25 + FAISS with Reciprocal Rank Fusion",
        alternative: "FAISS cosine similarity only",
        why: "Pure vector search frequently missed exact product serial numbers and alphanumeric error codes (e.g. 'ERR-404-X').",
      },
    ],
    metrics: [
      { name: "Ticket Triage Macro F1", value: "0.98", baseline: "0.81 (TF-IDF + SVM)", note: "Evaluated on held-out test split with heavy colloquial slang." },
      { name: "Adversarial Trap Catch Rate", value: "30 / 30 (100%)", baseline: "12 / 30 caught (Vanilla RAG)", note: "Traps engineered with invalid warranty claims and void clauses." },
      { name: "p95 Routing Latency", value: "48 ms", baseline: "1,450 ms (Cloud LLM API)", note: "FastAPI endpoint benchmarked under concurrent load." },
    ],
    impact: [
      "Eliminates 100% of unauthorized warranty approvals by enforcing hard refusal guardrails.",
      "Cuts average customer waiting time from hours to under 3 seconds for standard inquiries.",
      "Reduces Tier-1 human agent ticket workload by an estimated 65%.",
    ],
    limitations: [
      "FAISS index runs in-memory; scaling to >100k SOP documents requires migrating to Qdrant or pgvector.",
      "Audio voice notes currently require an upstream Whisper transcription step.",
    ],
    demo: {
      type: "iframe",
      status: "coming-soon",
      url: "https://share.streamlit.io/thegasz/customerserviceticketrag",
      coldStartNote: "Hosted on Streamlit Community Cloud. May take ~30-45s on first wake-up.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/customerServiceTicketRAG" },
      { label: "IndoBERT LoRA Weights", url: "https://github.com/TheGasz/customerServiceTicketRAG" },
    ],
  },

  "klaimkilat-reimbursement-agent": {
    slug: "klaimkilat-reimbursement-agent",
    title: "KlaimKilat — AI Reimbursement Agent",
    tagline: "Omnichannel expense reimbursement agent built with LangGraph, DeepSeek, and pgvector with strict human-in-the-loop escalation.",
    category: "GenAI & Agents",
    meta: {
      role: "AI Workflow Architect & Backend Developer",
      timeline: "2024",
      context: "Corporate automation for automated expense auditing and policy verification.",
    },
    problem: {
      statement: "Finance departments spend hundreds of hours manually checking receipts against dense corporate expense policies, tracking monthly budgets, and chasing missing invoice details.",
      whoIsAffected: "Corporate employees needing fast reimbursement and Finance Controllers reviewing thousands of receipts monthly.",
      whyML: "Vision OCR extracts unstructured thermal receipt data, while a stateful LangGraph agent reasons through multi-clause company policies and calls internal quota APIs.",
      constraints: [
        "0% false auto-approval rate for claims exceeding policy ceilings",
        "Deterministic audit trail for every automated decision",
        "Support multi-turn employee clarification via messaging apps",
      ],
    },
    data: {
      sources: [
        { name: "Expense Receipts (Images & PDFs)", detail: "Indonesian merchant receipts, fuel chits, restaurant bills, and hotel folios." },
        { name: "Company Finance SOP Documents", detail: "Per-diem rules, department travel policies, and tax invoice guidelines." },
      ],
      challenges: [
        { issue: "Wrinkled & Faded Thermal Receipts", fix: "Image pre-processing pipeline (contrast stretch + adaptive binarization) before LLM OCR parsing." },
        { issue: "Multi-item Split Receipts", fix: "Structured JSON schema validation enforcing itemized breakdown matching total amount." },
        { issue: "Employee Quota Overdraw", fix: "Real-time tool-calling node verifying database balances before triggering payment." },
      ],
    },
    architecture: {
      nodes: [
        { id: "receipt", label: "Receipt Ingestion (OCR)", kind: "input", detail: "Snap receipt via Web/Bot" },
        { id: "extractor", label: "DeepSeek JSON Extractor", kind: "model", detail: "Parses vendor, date, total, items" },
        { id: "hybrid_rag", label: "Policy RAG (pgvector + RRF)", kind: "process", detail: "Retrieves matching SOP rules" },
        { id: "tool_quota", label: "Quota Checker Tool", kind: "process", detail: "Checks monthly allowance balance" },
        { id: "decision", label: "Policy Guardrail Node", kind: "guard", detail: "Validates all constraints" },
        { id: "approve", label: "Auto-Approve & Payout API", kind: "output", detail: "Triggers banking batch" },
        { id: "hitl", label: "Human-in-the-Loop Review", kind: "output", detail: "Manager Telegram approval" },
      ],
      edges: [
        { from: "receipt", to: "extractor" },
        { from: "extractor", to: "hybrid_rag" },
        { from: "hybrid_rag", to: "tool_quota" },
        { from: "tool_quota", to: "decision" },
        { from: "decision", to: "approve", label: "Compliant" },
        { from: "decision", to: "hitl", label: "Discrepancy / Over Quota" },
      ],
    },
    tradeoffs: [
      {
        decision: "LangGraph State Machine vs Linear ReAct Agent",
        chosen: "LangGraph cyclical state machine",
        alternative: "Linear chain / standard LangChain ReAct",
        why: "LangGraph supports state persistence and pausing execution for Human-in-the-Loop manager approval without losing session state.",
      },
      {
        decision: "DeepSeek OCR Extraction vs Generic Tesseract",
        chosen: "DeepSeek Vision reasoning",
        alternative: "Tesseract OCR + regex rules",
        why: "Tesseract collapsed on skewed, wrinkled Indonesian restaurant bills, while DeepSeek consistently parsed total, tax, and date accurately.",
      },
    ],
    metrics: [
      { name: "False Auto-Approve Rate", value: "0.0%", baseline: "14.2% (Standard prompt template)", note: "Hard programmatic assertion guard ensures 0 policy breach." },
      { name: "End-to-End Processing Time", value: "3.2 s", baseline: "3-5 business days (Manual review)", note: "From image upload to approved transfer payload." },
      { name: "OCR Parsing Accuracy", value: "96.4%", baseline: "78.1% (Tesseract OCR)", note: "Field-level extraction accuracy across 200 real-world receipts." },
    ],
    impact: [
      "Eliminates 90% of routine expense claim review time for finance teams.",
      "Empowers employees with instant reimbursement confirmation within minutes.",
      "Completely prevents expense quota leakage with automated ledger verification.",
    ],
    limitations: [
      "Severely damaged or partially torn receipts still mandate manual photo retake.",
      "International foreign currency receipts currently require live exchange rate API sync.",
    ],
    demo: {
      type: "playground",
      status: "coming-soon",
      component: "KlaimKilatPlayground",
      coldStartNote: "Interactive LangGraph step-by-step state machine player.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/automation-reimburse-workflow" },
    ],
  },

  "transit-cashless-anomaly-detection": {
    slug: "transit-cashless-anomaly-detection",
    title: "TransitSentinel — Cashless Transit Anomaly Detection",
    tagline: "Ultra-low-latency (<25 ms) hybrid fraud engine combining PyTorch Variational Autoencoders with LightGBM and SHAP.",
    category: "Tabular & ML",
    meta: {
      role: "Machine Learning Engineer",
      timeline: "2024",
      context: "Real-time anomaly detection for mass transit contactless card tapping systems.",
    },
    problem: {
      statement: "High-throughput transit tap gates suffer from fare evasion, duplicated taps (<1s double charge), card cloning across distant stations, and corrupted payment settlement batches.",
      whoIsAffected: "Transit passengers double-charged unexpectedly and Transit Operators losing revenue to fraudulent cloning rings.",
      whyML: "Deterministic rules cannot catch subtle behavioral anomalies (e.g. coordinated card-sharing rings), while pure deep learning is too slow for sub-50ms gate opening requirements.",
      constraints: [
        "Inference latency strictly under 25 ms at p95 to avoid turnstile bottleneck",
        "High PR-AUC due to extreme class imbalance (<0.8% anomaly rate)",
        "Interpretable SHAP attribution for dispute resolutions",
      ],
    },
    data: {
      sources: [
        { name: "Simulated Mass Transit Tap Stream", detail: "120,000 synthetic transit transactions with realistic station topologies and timestamps." },
      ],
      challenges: [
        { issue: "Severe Class Imbalance", fix: "Trained a PyTorch VAE on normal tap patterns to capture the latent manifold without synthetic artifact bias." },
        { issue: "Impossible Travel Time Anomaly", fix: "Engineered geographic graph distance features: delta_time / shortest_transit_route_time." },
      ],
    },
    architecture: {
      nodes: [
        { id: "tap", label: "Gate Tap Event", kind: "input", detail: "Card ID, Station ID, Timestamp" },
        { id: "rules", label: "Deterministic Guardrails", kind: "guard", detail: "Instant bounce for <1s double taps" },
        { id: "features", label: "Feature Pipeline", kind: "process", detail: "Lagged tap delta, frequency, route speed" },
        { id: "vae", label: "PyTorch VAE Error", kind: "model", detail: "Reconstruction error for novel patterns" },
        { id: "gbm", label: "LightGBM + Isolation Forest", kind: "model", detail: "Fast gradient boosted tree scoring" },
        { id: "router", label: "Cost-Sensitive Router", kind: "output", detail: "Pass / Auto-Refund / Freeze Card" },
      ],
      edges: [
        { from: "tap", to: "rules" },
        { from: "rules", to: "features" },
        { from: "features", to: "vae" },
        { from: "features", to: "gbm" },
        { from: "vae", to: "router" },
        { from: "gbm", to: "router" },
      ],
    },
    tradeoffs: [
      {
        decision: "Hybrid VAE + LightGBM vs Deep Sequence Model (LSTM/Transformer)",
        chosen: "LightGBM with VAE latent reconstruction features",
        alternative: "End-to-end PyTorch Transformer",
        why: "LightGBM achieves p95 latency of <18 ms on CPU, whereas deep sequence models averaged >85 ms, violating gate barrier limits.",
      },
    ],
    metrics: [
      { name: "PR-AUC", value: "0.987", baseline: "0.742 (Isolation Forest baseline)", note: "Precision-Recall AUC under 0.8% rare positive prevalence." },
      { name: "p95 Inference Latency", value: "18.4 ms", baseline: "85.0 ms (Deep Transformer)", note: "Benchmarked using ONNX Runtime CPU engine." },
      { name: "Fraud Loss Recovery", value: "~98%", baseline: "62% (Static rules)", note: "Percentage of fraudulent financial exposure successfully blocked." },
    ],
    impact: [
      "Protects transit riders by instantly triggering auto-refunds on verified double-tap errors.",
      "Prevents coordinated card cloning without introducing turnstile passage lag.",
      "Provides customer service with immediate SHAP feature breakdowns to resolve dispute tickets.",
    ],
    limitations: [
      "Offline station gates with severed network sync must rely strictly on local deterministic rules until reconnection.",
    ],
    demo: {
      type: "in-browser",
      status: "coming-soon",
      component: "TransitSentinelTester",
      coldStartNote: "Runs client-side in browser via lightweight decision trees.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/transit-cashless-anomaly-detection" },
    ],
  },

  "15-minute-city-profiler": {
    slug: "15-minute-city-profiler",
    title: "The 15-Minute City Profiler",
    tagline: "Evaluating Jakarta urban accessibility using OSMnx, Shannon Diversity Index, and a scratch NumPy K-Means++ implementation across a 25x25 spatial grid.",
    category: "Time-Series & Geo",
    meta: {
      role: "Geospatial Data Scientist",
      timeline: "2024",
      context: "Urban data science research assessing walkability and essential amenity distribution in DKI Jakarta.",
    },
    problem: {
      statement: "The '15-Minute City' urban planning ideal promises that every resident can reach essential needs (health, grocery, education) within a 15-minute walk, but developing megacities lack granular metrics to quantify amenity inequality.",
      whoIsAffected: "Urban planners, city administrators, and marginalized residents living in amenity deserts.",
      whyML: "Unsupervised spatial clustering with neighbor smoothing identifies true socio-spatial clusters rather than artificial administrative boundary artifacts.",
      constraints: [
        "Network-based pedestrian walking distance rather than naive Euclidean distance",
        "Granular 25x25 spatial grid resolution across Jakarta's 267 kelurahan",
      ],
    },
    data: {
      sources: [
        { name: "OpenStreetMap (OSM) POI Layers", detail: "Healthcare, education, grocery, recreation, and public transit nodes." },
        { name: "OSM Walkable Road Network", detail: "Pedestrian walkways, alleys, and sidewalks extracted via OSMnx." },
      ],
      challenges: [
        { issue: "Uneven POI Density & Extreme Sparsity", fix: "Calculated normalized Shannon Diversity Equitability Index per grid cell." },
        { issue: "Boundary Discontinuities", fix: "Implemented spatial Gaussian neighbor smoothing over the distance matrix." },
      ],
    },
    architecture: {
      nodes: [
        { id: "osm", label: "OpenStreetMap Ingestion", kind: "input", detail: "OSMnx road graph & POIs" },
        { id: "grid", label: "25x25 Spatial Grid Index", kind: "process", detail: "Subdistrict spatial binning" },
        { id: "walking", label: "Network Distance Buffers", kind: "process", detail: "15-minute pedestrian isochrones" },
        { id: "shannon", label: "Shannon Diversity Index", kind: "process", detail: "Amenity balance measurement" },
        { id: "kmeans", label: "NumPy K-Means++ Clustering", kind: "model", detail: "Built from scratch in vector NumPy" },
        { id: "folium", label: "Interactive Folium Map", kind: "output", detail: "Amenity accessibility heatmap" },
      ],
      edges: [
        { from: "osm", to: "grid" },
        { from: "grid", to: "walking" },
        { from: "walking", to: "shannon" },
        { from: "shannon", to: "kmeans" },
        { from: "kmeans", to: "folium" },
      ],
    },
    tradeoffs: [
      {
        decision: "Custom NumPy K-Means++ vs scikit-learn",
        chosen: "From-scratch vectorized NumPy implementation",
        alternative: "Standard sklearn.cluster.KMeans",
        why: "Allowed custom spatial distance penalization and deeper inspection of centroid trajectories during algorithm convergence.",
      },
    ],
    metrics: [
      { name: "Spatial Grid Resolution", value: "25 × 25 cells", baseline: "Administrative kelurahan only", note: "Reveals intra-neighborhood inequality masked by broad census tracts." },
      { name: "Amenity Profiling Accuracy", value: "100% Jakarta Coverage", baseline: "Central Jakarta only", note: "Spans all 5 administrative cities in DKI Jakarta." },
    ],
    impact: [
      "Pinpoints exact amenity deserts lacking healthcare and fresh grocery access within 15 minutes walk.",
      "Demonstrates high walking accessibility in commercial corridors vs extreme deficits in peripheral residential zones.",
    ],
    limitations: [
      "Pedestrian walk network does not account for temporary road construction or sidewalk quality variations.",
    ],
    demo: {
      type: "none",
      status: "coming-soon",
      coldStartNote: "Interactive GeoJSON map visualizer in preparation.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/15-Minutes-City" },
    ],
  },

  "river-water-level-bengawan-solo": {
    slug: "river-water-level-bengawan-solo",
    title: "River Water-Level Forecasting (Bengawan Solo)",
    tagline: "Forecasting river water levels across 30 telemetry stations with 242-day lead time using leak-free hydrological feature engineering and a 7-member GBDT ensemble.",
    category: "Time-Series & Geo",
    meta: {
      role: "Lead Machine Learning Researcher",
      timeline: "2024",
      context: "Long-horizon flood risk forecasting for the Bengawan Solo river basin, Java, Indonesia.",
    },
    problem: {
      statement: "Downstream communities along Bengawan Solo face recurring catastrophic flooding. Traditional hydrological modeling requires real-time upstream observations, leaving zero predictive lead time for long-range planning.",
      whoIsAffected: "Regional disaster management authorities (BPBD) and agricultural communities along the Bengawan Solo basin.",
      whyML: "Tree ensembles handle nonlinear upstream-downstream flow delays, soil saturation thresholds, and precipitation lag features without fragile differential equation calibrations.",
      constraints: [
        "242-day forward forecasting horizon without future sensor observations",
        "Strict prevention of temporal data leakage across time-series folds",
      ],
    },
    data: {
      sources: [
        { name: "30 Telemetry Water-Level Stations", detail: "Daily water-level readings across the entire Bengawan Solo basin." },
        { name: "HydroRIVERS Basin Topography", detail: "Upstream catchment area, river length, and elevation profiles." },
      ],
      challenges: [
        { issue: "Temporal Data Leakage", fix: "Implemented a 4-fold Rolling-Origin Cross-Validation framework." },
        { issue: "Missing Sensor Telemetry Days", fix: "Iterative upstream-downstream spatial imputation preserving river topology." },
        { issue: "Extreme Seasonal Kurtosis", fix: "Engineered ~187 hydrological lag, rolling-window variance, and upstream cumulative routing features." },
      ],
    },
    architecture: {
      nodes: [
        { id: "telemetry", label: "River Telemetry & Rain Data", kind: "input", detail: "30 monitoring pos stations" },
        { id: "hydro", label: "Hydrological Feature Store", kind: "process", detail: "187 leak-free lag & routing features" },
        { id: "cv", label: "Rolling-Origin Splitter", kind: "process", detail: "4-fold temporal validation" },
        { id: "lgb", label: "LightGBM Regressors", kind: "model", detail: "Tuned on short-lag dynamics" },
        { id: "xgb", label: "XGBoost Regressors", kind: "model", detail: "Captures peak flood spikes" },
        { id: "cat", label: "CatBoost Regressors", kind: "model", detail: "Handles station categorical splits" },
        { id: "ensemble", label: "Weighted 7-Member Ensemble", kind: "output", detail: "Mean RMSE 1.39 over 242 days" },
      ],
      edges: [
        { from: "telemetry", to: "hydro" },
        { from: "hydro", to: "cv" },
        { from: "cv", to: "lgb" },
        { from: "cv", to: "xgb" },
        { from: "cv", to: "cat" },
        { from: "lgb", to: "ensemble" },
        { from: "xgb", to: "ensemble" },
        { from: "cat", to: "ensemble" },
      ],
    },
    tradeoffs: [
      {
        decision: "GBDT Ensemble (LGBM + XGB + CatBoost) vs LSTM/GRU",
        chosen: "7-member tree ensemble",
        alternative: "Deep recurrent neural network (LSTM)",
        why: "Tree ensembles were significantly more robust to sudden sensor dropout and missing telemetry days, converging with lower validation RMSE.",
      },
    ],
    metrics: [
      { name: "Validation Mean RMSE", value: "1.39 m", baseline: "3.12 m (ARIMA / Historical mean)", note: "Evaluated across all 30 stations over 242-day lead horizon." },
      { name: "Rolling Folds Evaluated", value: "4 Folds", baseline: "Single random split (invalid leakage)", note: "Guarantees zero forward-looking leakage." },
    ],
    impact: [
      "Provides regional disaster response agencies with months of advance warning for flood readiness.",
      "Reduces uncertainty in seasonal reservoir dam release schedules.",
    ],
    limitations: [
      "Extreme global weather anomalies (such as intense unseasonal El Niño events) widen outer prediction intervals past day 180.",
    ],
    demo: {
      type: "none",
      status: "coming-soon",
      coldStartNote: "Interactive forecast trajectory dashboard in development.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/Prediksi_TinggiMukaAir_BengawanSolo" },
    ],
  },

  "jakarta-flood-data-pipeline": {
    slug: "jakarta-flood-data-pipeline",
    title: "Jakarta Flood Risk Data Pipeline",
    tagline: "End-to-end spatial-temporal pipeline fusing 7 open datasets into a 97k-row feature store across 267 urban villages, exposing a 41x flood risk jump along Ciliwung.",
    category: "Time-Series & Geo",
    meta: {
      role: "Data Engineer & Geospatial Analyst",
      timeline: "2024",
      context: "Forensic urban data engineering to clean and unify fragmented government disaster telemetry.",
    },
    problem: {
      statement: "Jakarta flood management datasets were scattered across agencies, stored in corrupt Excel formats with mangled date strings, unprojected coordinates, and frozen water sensors.",
      whoIsAffected: "City data engineers, flood mitigation teams, and municipal emergency dispatchers.",
      whyML: "PCA dimensionality reduction and spatial autocorrelation reveal structural vulnerability factors obscured by raw tabular tables.",
      constraints: [
        "100% data integrity with zero missing values across a daily spatio-temporal feature store",
        "Rigorous coordinate reprojection to UTM 48S for sub-meter distance accuracy",
      ],
    },
    data: {
      sources: [
        { name: "BPBD Disaster Incident Reports", detail: "Historical flood records, duration, and water depths per kelurahan." },
        { name: "10-Minute Telemetry Water Sensors", detail: "Automated river gate sensors across Ciliwung, Pesanggrahan, and Angke." },
        { name: "Demographics, Weather & Land Cover", detail: "Population density, daily rainfall, and impervious surface fractions." },
      ],
      challenges: [
        { issue: "Corrupted Excel Date Epochs", fix: "Engineered a forensic parser identifying and repairing Microsoft Excel 1900/1904 date serial flips." },
        { issue: "Frozen Telemetry Sensors", fix: "Implemented run-length encoding sensor anomaly detection to mask flatlined sensor readings." },
        { issue: "Distorted Lat/Long Euclidean Metrics", fix: "Reprojected all geometries into EPSG:32748 (WGS 84 / UTM Zone 48S)." },
      ],
    },
    architecture: {
      nodes: [
        { id: "raw", label: "7 Fragmented Open Datasets", kind: "input", detail: "BPBD, sensor logs, weather, GIS" },
        { id: "audit", label: "Forensic Data Cleansing", kind: "process", detail: "Repairs date flips & frozen sensors" },
        { id: "utm", label: "GIS UTM Reprojection", kind: "process", detail: "Standardized to EPSG:32748" },
        { id: "store", label: "Spatio-Temporal Feature Store", kind: "process", detail: "97,000 daily rows across 267 kelurahan" },
        { id: "pca", label: "PCA Risk Factor Extraction", kind: "model", detail: "Separates rainfall vs structural topography" },
        { id: "insight", label: "41x Ciliwung Risk Multiplier", kind: "output", detail: "Exposes critical flood vulnerability corridor" },
      ],
      edges: [
        { from: "raw", to: "audit" },
        { from: "audit", to: "utm" },
        { from: "utm", to: "store" },
        { from: "store", to: "pca" },
        { from: "pca", to: "insight" },
      ],
    },
    tradeoffs: [
      {
        decision: "Metric UTM Coordinate Projection vs Raw WGS84 Lat/Long",
        chosen: "EPSG:32748 (UTM Zone 48S)",
        alternative: "Standard EPSG:4326 degrees",
        why: "Degrees produce severe distortion when calculating distance to riverbanks, whereas UTM gives true metric buffer distances.",
      },
    ],
    metrics: [
      { name: "Feature Store Clean Rows", value: "97,000 Rows", baseline: "Unusable fragmented files", note: "Daily spatio-temporal observations with 0 missing values." },
      { name: "Identified Corridor Risk Jump", value: "41x Multiplier", baseline: "Undifferentiated citywide stats", note: "Relative flood risk increase along Ciliwung corridor." },
    ],
    impact: [
      "Provides city planners with a clean, unified feature store for predictive machine learning models.",
      "Pinpoints exact administrative areas needing urgent drainage infrastructure reinforcement.",
    ],
    limitations: [
      "Current Digital Elevation Model (DEM) relies on 30m resolution satellite data; sub-meter LiDAR would enhance micro-topography modeling.",
    ],
    demo: {
      type: "none",
      status: "coming-soon",
      coldStartNote: "Interactive spatial pipeline visualizer in progress.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/Data-Engineer-Jakarta-Flood-Spatial-Temporal-" },
    ],
  },

  "ai-pilahyuk-waste-classification": {
    slug: "ai-pilahyuk-waste-classification",
    title: "Hierarchical Waste Classification (AI PilahYuk)",
    tagline: "High-precision waste sorting (Recyclable, Organic, B3 Hazardous) using frozen SigLIP embeddings and class-weighted focal loss MLP heads.",
    category: "Computer Vision",
    meta: {
      role: "Computer Vision Specialist",
      timeline: "2024",
      context: "Waste sorting automation ensuring near-zero false negatives for hazardous B3 waste.",
    },
    problem: {
      statement: "Municipal waste sorting requires distinguishing between Recyclable, Organic, and B3 (hazardous/toxic) waste. A false negative on hazardous items (e.g. a leaking battery misclassified as organic compost) causes severe environmental and occupational harm.",
      whoIsAffected: "Sanitation workers, recycling plant operators, and municipal compost processing facilities.",
      whyML: "Fine-grained visual texture and container shape classification via foundation vision-language models allows robust zero-shot feature representation without requiring massive custom training datasets.",
      constraints: [
        "Near-perfect recall on hazardous B3 materials (>0.99 recall)",
        "Fast inference suitable for low-power edge sorting conveyors",
      ],
    },
    data: {
      sources: [
        { name: "PilahYuk Waste Dataset", detail: "Real-world Indonesian household and commercial waste photos." },
      ],
      challenges: [
        { issue: "Dangerous B3 Class Imbalance", fix: "Applied Class-Weighted Focal Loss and Mixup augmentation to heavily penalize B3 misclassifications." },
        { issue: "Soiled & Deformed Packaging", fix: "Leveraged frozen SigLIP so400m pre-trained representation, caching 1152-dim embeddings for training stability." },
      ],
    },
    architecture: {
      nodes: [
        { id: "img", label: "Waste Item Photo", kind: "input", detail: "Captured on conveyor / phone camera" },
        { id: "siglip", label: "Frozen SigLIP so400m", kind: "model", detail: "Extracts rich 1152-dim embedding" },
        { id: "mixup", label: "Mixup Augmentation & Focal Loss", kind: "process", detail: "B3 recall-prioritizing loss" },
        { id: "mlp", label: "Lightweight MLP Head", kind: "model", detail: "Optuna-tuned classification head" },
        { id: "threshold", label: "B3 Safety Threshold Router", kind: "guard", detail: "Conservative hazard boundary" },
        { id: "bin", label: "Sorting Bin Actuator", kind: "output", detail: "Recyclable / Organic / B3" },
      ],
      edges: [
        { from: "img", to: "siglip" },
        { from: "siglip", to: "mixup" },
        { from: "mixup", to: "mlp" },
        { from: "mlp", to: "threshold" },
        { from: "threshold", to: "bin" },
      ],
    },
    tradeoffs: [
      {
        decision: "Frozen SigLIP Backbone + MLP Head vs Full End-to-End Fine-Tuning",
        chosen: "Frozen SigLIP embeddings with cached vectors",
        alternative: "Full ResNet/ViT end-to-end backpropagation",
        why: "Reduced training time from 8 hours to under 4 minutes while retaining foundation model generalizability and avoiding catastrophic forgetting.",
      },
    ],
    metrics: [
      { name: "Macro F1 Score", value: "~0.99", baseline: "0.88 (ResNet-50 baseline)", note: "Evaluated across balanced held-out validation set." },
      { name: "B3 Hazardous Recall", value: "0.995", baseline: "0.820 (Standard cross-entropy)", note: "Crucial metric ensuring toxic waste is virtually never missed." },
    ],
    impact: [
      "Guarantees that dangerous medical/chemical batteries do not enter standard recycling or composting streams.",
      "Reduces manual sorting costs while increasing downstream recycled plastic purity.",
    ],
    limitations: [
      "Opaque sealed bottles with unknown chemical liquids require supplementary sensors.",
    ],
    demo: {
      type: "playground",
      status: "coming-soon",
      component: "PilahYukPlayground",
      coldStartNote: "Interactive gallery with pre-computed SigLIP embedding representations.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/AI_PilahYuk" },
    ],
  },

  "satria-data-waste-classification": {
    slug: "satria-data-waste-classification",
    title: "Waste Image Classification (Satria Data 2026)",
    tagline: "Competition-winning dual-backbone SigLIP feature fusion and patch-max pooling strategy scoring 0.9962 F1 in national data science competition.",
    category: "Computer Vision",
    meta: {
      role: "Lead Competitive Data Scientist",
      timeline: "2024",
      context: "National Data Science Competition (Satria Data) waste identification challenge.",
    },
    problem: {
      statement: "National competition demanding extreme classification accuracy on ambiguous, occluded waste images where sub-classes share nearly identical visual features.",
      whoIsAffected: "Competitive ML benchmark teams and municipal automated sorting research.",
      whyML: "Fusing complementary multi-scale embeddings (SigLIP v1 global context + v2 fine-grained texture) breaks single-model accuracy ceilings.",
      constraints: [
        "Strict out-of-fold generalization without test set label snooping",
        "Rigorous GroupKFold validation to prevent duplicate sample leakage",
      ],
    },
    data: {
      sources: [
        { name: "Satria Data Competition Image Callset", detail: "Thousands of annotated multi-class waste photographs under diverse lighting." },
      ],
      challenges: [
        { issue: "Small Recyclable Region Detection", fix: "Invented a patch-max pooling trick across visual tokens to amplify small local recyclable textures." },
        { issue: "Overfitting on Competition Leaderboard", fix: "Implemented GroupKFold cross-validation paired with Test-Time Augmentation (TTA) ensembling." },
      ],
    },
    architecture: {
      nodes: [
        { id: "img", label: "Input Competition Image", kind: "input", detail: "Multi-angle photo" },
        { id: "sig1", label: "SigLIP v1 Backbone", kind: "model", detail: "Global semantic feature map" },
        { id: "sig2", label: "SigLIP v2 Backbone", kind: "model", detail: "High-resolution texture map" },
        { id: "pool", label: "Patch-Max Token Pooling", kind: "process", detail: "Extracts salient local textures" },
        { id: "concat", label: "3456-dim Feature Fusion", kind: "process", detail: "Concatenated representation" },
        { id: "head", label: "Optuna 2-Stage MLP", kind: "model", detail: "GroupKFold ensemble" },
        { id: "f1", label: "0.9962 Test F1 Score", kind: "output", detail: "Top tier competition submission" },
      ],
      edges: [
        { from: "img", to: "sig1" },
        { from: "img", to: "sig2" },
        { from: "sig1", to: "pool" },
        { from: "sig2", to: "pool" },
        { from: "pool", to: "concat" },
        { from: "concat", to: "head" },
        { from: "head", to: "f1" },
      ],
    },
    tradeoffs: [
      {
        decision: "Dual-Backbone Feature Concatenation vs Single Heavy Model",
        chosen: "Concatenated SigLIP v1 + v2 (3456-dim)",
        alternative: "Single large ViT-Huge backbone",
        why: "Dual feature fusion provided an empirical +0.008 F1 gain on hard ambiguous edge cases that decided the competition ranking.",
      },
    ],
    metrics: [
      { name: "Test Set F1 Score", value: "0.9962", baseline: "0.9780 (Single baseline model)", note: "Evaluated on competition test set." },
      { name: "Validation Consistency", value: "std < 0.0012", baseline: "std ~ 0.0064", note: "Stable cross-validation variance across all folds." },
    ],
    impact: [
      "Demonstrates high-impact feature engineering and foundation model distillation in competitive computer vision.",
      "Proved that patch-max pooling effectively captures small recyclable marks on crumpled plastic items.",
    ],
    limitations: [
      "Inference requires running two forward passes, increasing computation time by ~1.5x compared to single model deployment.",
    ],
    demo: {
      type: "none",
      status: "coming-soon",
      coldStartNote: "Interactive competition attention map demo in preparation.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/Satria-Data_IdentifikasiJenisSampah" },
    ],
  },

  "face-anti-spoofing-detection": {
    slug: "face-anti-spoofing-detection",
    title: "Face Anti-Spoofing Detection",
    tagline: "6-class biometric defense using ConvNeXt-Tiny, corrected focal loss, and SigLIP-based pre-training duplicate leakage elimination.",
    category: "Computer Vision",
    meta: {
      role: "Biometric Security Researcher",
      timeline: "2024",
      context: "Security audit and machine learning defense against face presentation attacks.",
    },
    problem: {
      statement: "Facial recognition systems are vulnerable to spoofing attacks: high-resolution printed photos, digital screen replays, 3D silicone masks, and mannequin substitutions.",
      whoIsAffected: "Mobile banking users, enterprise biometric attendance systems, and high-security access gates.",
      whyML: "Modern convolutional architectures (ConvNeXt) excel at detecting subtle high-frequency moiré patterns, screen glare, and unnatural skin depth disparities.",
      constraints: [
        "Zero duplicate image leakage between train and test splits",
        "6-class granular categorization (Real, Printed, Screen, Mask, Mannequin, Unknown)",
      ],
    },
    data: {
      sources: [
        { name: "Multi-Attack Facial Presentation Dataset", detail: "Diverse facial captures under varying lighting, skin tones, and presentation attack mediums." },
      ],
      challenges: [
        { issue: "Subtle Cross-Class Dataset Leakage", fix: "Audited dataset with SigLIP embeddings and leave-one-out trimmed centroids to purge duplicate near-identical images." },
        { issue: "Complex Moiré & Edge Distortions", fix: "Employed ConvNeXt-Tiny with 7x7 depthwise convolutions to capture both micro-texture and global face context." },
      ],
    },
    architecture: {
      nodes: [
        { id: "face", label: "Live Face Video Frame", kind: "input", detail: "RGB camera stream" },
        { id: "audit", label: "SigLIP Leakage Audit", kind: "guard", detail: "Ensured 0% duplicate train-test leakage" },
        { id: "convnext", label: "ConvNeXt-Tiny Backbone", kind: "model", detail: "Deep inverted bottleneck structure" },
        { id: "focal", label: "Corrected Focal Loss", kind: "process", detail: "Balances hard spoof attack categories" },
        { id: "gradcam", label: "Grad-CAM Explainability", kind: "process", detail: "Verifies attention on skin pores vs screen bezel" },
        { id: "verdict", label: "6-Class Spoof Decision", kind: "output", detail: "Real / Print / Screen / Mask / Mannequin" },
      ],
      edges: [
        { from: "face", to: "audit" },
        { from: "audit", to: "convnext" },
        { from: "convnext", to: "focal" },
        { from: "focal", to: "gradcam" },
        { from: "gradcam", to: "verdict" },
      ],
    },
    tradeoffs: [
      {
        decision: "ConvNeXt-Tiny vs Vision Transformer (ViT)",
        chosen: "ConvNeXt-Tiny",
        alternative: "ViT-Base / Swin Transformer",
        why: "ConvNeXt inductive bias preserves fine spatial frequencies (moiré screen lines) better on lower compute edge devices with 4x faster FPS.",
      },
    ],
    metrics: [
      { name: "6-Class Classification Accuracy", value: "98.4%", baseline: "86.1% (Standard ResNet-18)", note: "Evaluated across clean zero-leakage test split." },
      { name: "Train-Test Leakage", value: "0 Duplicates", baseline: "8.3% leakage in raw dataset", note: "Purged via trimmed embedding centroid distance." },
    ],
    impact: [
      "Prevents fraudulent mobile banking logins using printed photos and screen replays.",
      "Provides transparent Grad-CAM heatmaps proving the AI inspects surface reflection rather than racial phenotypes.",
    ],
    limitations: [
      "Ultra-realistic medical-grade silicone prosthetics under infrared lighting require multi-spectral hardware cameras.",
    ],
    demo: {
      type: "none",
      status: "coming-soon",
      coldStartNote: "Interactive Grad-CAM spoof inspector in development.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/faceSpoofingDetection" },
    ],
  },

  "crop-yield-prediction": {
    slug: "crop-yield-prediction",
    title: "Crop Yield Prediction",
    tagline: "Full-stack agricultural yield prediction using Deep Neural Networks in TensorFlow/Keras served via Flask REST API with interactive React sliders.",
    category: "Tabular & ML",
    meta: {
      role: "Full-Stack Machine Learning Engineer",
      timeline: "2024",
      context: "Agricultural data science application estimating crop harvest yields from soil and climatic indicators.",
    },
    problem: {
      statement: "Farmers and agricultural supply chain managers struggle to anticipate seasonal harvest volumes, leading to storage shortages or market gluts.",
      whoIsAffected: "Smallholder farmers, agricultural co-operatives, and regional food security planners.",
      whyML: "Deep neural networks capture complex nonlinear interactions between soil chemical nutrients (N, P, K) and fluctuating weather parameters.",
      constraints: [
        "Accessible web UI with intuitive input sliders for non-technical users",
        "Fast sub-second response times for scenario simulation",
      ],
    },
    data: {
      sources: [
        { name: "Agricultural & Climate Tabular Records", detail: "Multi-year records of soil composition, average temperature, rainfall, and crop yield in tons/hectare." },
      ],
      challenges: [
        { issue: "Feature Scale Disparities", fix: "Applied robust MinMax & StandardScaler normalization pipelines." },
        { issue: "Neural Network Overfitting on Small Tabular Splits", fix: "Incorporated Dropout layers (0.2) and EarlyStopping on validation loss." },
      ],
    },
    architecture: {
      nodes: [
        { id: "inputs", label: "Soil & Weather Parameters", kind: "input", detail: "Nitrogen, Phosphorus, Rain, Temp" },
        { id: "norm", label: "Feature Scaling Pipeline", kind: "process", detail: "Standardizes tabular distributions" },
        { id: "dnn", label: "Keras Deep Neural Network", kind: "model", detail: "Dense layers with Dropout & ReLU" },
        { id: "flask", label: "Flask REST API", kind: "process", detail: "Lightweight inference endpoint" },
        { id: "react", label: "Interactive React Sliders", kind: "output", detail: "Real-time crop yield projection" },
      ],
      edges: [
        { from: "inputs", to: "norm" },
        { from: "norm", to: "dnn" },
        { from: "dnn", to: "flask" },
        { from: "flask", to: "react" },
      ],
    },
    tradeoffs: [
      {
        decision: "Deep Neural Network with Dropout vs Linear Regression",
        chosen: "Keras Multilayer Perceptron",
        alternative: "Multiple Linear Regression",
        why: "Nutrient saturation exhibits diminishing returns and non-linear thresholds that linear regression models fundamentally miss.",
      },
    ],
    metrics: [
      { name: "Coefficient of Determination (R²)", value: "0.94", baseline: "0.72 (Ordinary Least Squares)", note: "Strong predictive fit on held-out test data." },
      { name: "Mean Absolute Error", value: "0.24 tons/ha", baseline: "0.78 tons/ha", note: "Low prediction error relative to average crop yields." },
    ],
    impact: [
      "Enables farmers to simulate 'what-if' fertilizer scenarios before purchasing inputs.",
      "Assists logistics planners in estimating regional grain elevator and transport capacities.",
    ],
    limitations: [
      "Pest outbreaks and unexpected localized hail storms cannot be predicted from seasonal averages alone.",
    ],
    demo: {
      type: "in-browser",
      status: "coming-soon",
      component: "CropYieldSliderDemo",
      coldStartNote: "Interactive slider prediction widget.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/Crop-Yield-Prediction" },
    ],
  },

  "agent-based-exposure-simulation": {
    slug: "agent-based-exposure-simulation",
    title: "Agent-Based Exposure Simulation",
    tagline: "Stochastic waiting room exposure simulation using Poisson arrival agents, ray-casting Field of View, and real-time interactive Plotly heatmaps.",
    category: "Tabular & ML",
    meta: {
      role: "Simulation Scientist & Python Developer",
      timeline: "2024",
      context: "Agent-based modeling (ABM) analyzing human visual exposure and spatial layout optimization.",
    },
    problem: {
      statement: "Designing physical layouts for waiting rooms, public halls, and transit lobbies requires understanding which structural obstacles or information kiosks receive the highest visual gaze from circulating occupants.",
      whoIsAffected: "Commercial interior architects, hospital facility planners, and public information display designers.",
      whyML: "Agent-based simulation captures emergent collective behavior (queuing, walking around obstacles, line-of-sight occlusions) that static spatial calculations overlook.",
      constraints: [
        "Real-time 60 FPS agent movement without frame lag",
        "Realistic visual gaze cone ray-casting with obstacle occlusion",
      ],
    },
    data: {
      sources: [
        { name: "Stochastic Spatial Floorplan Coordinates", detail: "2D polygon bounds representing walls, chairs, desks, and billboards." },
      ],
      challenges: [
        { issue: "Line-of-Sight Occlusion Geometry", fix: "Implemented vectorized 2D ray-casting intersecting agent gaze rays with polygon line segments." },
        { issue: "Stochastic Arrival Timing", fix: "Modeled visitor entry dynamics with a tunable Poisson arrival process." },
      ],
    },
    architecture: {
      nodes: [
        { id: "room", label: "2D Layout & Obstacles", kind: "input", detail: "Parametric floorplan geometry" },
        { id: "poisson", label: "Poisson Arrival Engine", kind: "process", detail: "Spawns autonomous agents" },
        { id: "agents", label: "Agent Movement Dynamics", kind: "process", detail: "Velocity vectors & collision avoidance" },
        { id: "ray", label: "Ray-Casting FOV (120°)", kind: "model", detail: "Computes gaze intersection per tick" },
        { id: "heatmap", label: "Plotly Exposure Heatmap", kind: "output", detail: "Interactive spatial gaze accumulation" },
      ],
      edges: [
        { from: "room", to: "poisson" },
        { from: "poisson", to: "agents" },
        { from: "agents", to: "ray" },
        { from: "ray", to: "heatmap" },
      ],
    },
    tradeoffs: [
      {
        decision: "Vectorized 2D NumPy Ray-Casting vs Heavy 3D Game Engine (Unity)",
        chosen: "Pure Python + NumPy vectorization",
        alternative: "Unity / Unreal 3D WebGL",
        why: "Runs instantly in any browser via Streamlit/Plotly without requiring heavy 100MB WebGL downloads.",
      },
    ],
    metrics: [
      { name: "Simulation Framerate", value: "60 FPS", baseline: "12 FPS (Non-vectorized loops)", note: "Smooth execution with >50 concurrent active agents." },
      { name: "Field of View Resolution", value: "120° Arc (32 Rays)", baseline: "Single central line", note: "Accurately models human peripheral vision." },
    ],
    impact: [
      "Identifies optimal locations for safety signage, emergency exits, and informative monitors in public waiting facilities.",
      "Prevents dead zones in commercial spatial layouts.",
    ],
    limitations: [
      "Agents currently utilize heuristic proximity steering rather than deep reinforcement learning social navigation.",
    ],
    demo: {
      type: "iframe",
      status: "coming-soon",
      url: "https://share.streamlit.io/thegasz/abm_exposuresim",
      coldStartNote: "Hosted on Streamlit Community Cloud. May take ~30-45s on first wake-up.",
    },
    artifacts: [
      { label: "GitHub Repository", url: "https://github.com/TheGasz/ABM_ExposureSim" },
    ],
  },
};

/**
 * Helper to fetch a project detail by slug.
 * @param {string} slug
 * @returns {ProjectDetail|undefined}
 */
export const getProjectDetail = (slug) => {
  return projectDetails[slug];
};

