# Content Sources: 11 Machine Learning Projects (@TheGasz)

Dokumentasi terstruktur 11 project untuk bahan penyusunan Case Study di `projectDetails.js`.
Setiap section merangkum Problem, Data/Pipeline, Architecture, Trade-offs, Metrics + Baseline, dan Limitations.

---

## 1. Enterprise AI Support Copilot (RAG)
- **Slug:** `enterprise-ai-support-copilot`
- **Repo:** https://github.com/TheGasz/customerServiceTicketRAG
- **Category:** GenAI & Agents
- **Tech:** Python, IndoBERT, LoRA / PEFT, FAISS, BM25, FastAPI, Streamlit
- **Headline Metric:** 0.98 macro-F1 · 30/30 traps caught
- **Problem Statement:** Tim support enterprise kewalahan menangani tiket customer berbahasa Indonesia tidak baku (bahasa gaul, typo, singkatan, kode error campur). Chatbot generik rentan berhalusinasi menyetujui klaim garansi yang sudah hangus.
- **Data & Challenges:** Tiket customer riil dalam bahasa Indonesia dengan variasi dialek dan noise. Tantangan: class imbalance pada tiket kategori kritis dan query ambigu dengan maksud menjebak (adversarial traps).
- **Architecture:**
  - Input ticket → IndoBERT LoRA classifier (urgency & category triage)
  - Query expansion → Hybrid Retriever (BM25 lexical + FAISS dense)
  - Cross-encoder reranker → Confidence scoring
  - Confidence Router: jika confidence > threshold → SOP Answer generator dengan kutipan pasal; jika confidence rendah / terdeteksi trap → Escalate ke human agent
- **Trade-offs:** 
  - Memilih IndoBERT + LoRA dibanding LLM zero-shot: Latency <40ms vs >1.5s, cost inference jauh lebih hemat, dan kontrol klasifikasi terhindar dari prompt injection.
  - Hybrid RAG (BM25 + FAISS) dibanding Dense only: BM25 menangkap kode seri produk eksak (mis. `ERR-404-X`), FAISS menangkap semantik keluhan pengguna.
- **Metrics & Baseline:**
  - Macro F1: 0.98 (Baseline TF-IDF + Logistic Regression: 0.81)
  - Adversarial Trap Detection: 30/30 caught (Baseline vanilla RAG: 12/30 halusinasi)
- **Limitations:** Index FAISS disimpan in-memory (perlu migrasi ke pgvector/Qdrant bila dokumen SOP melebihi 100k dokumen).

---

## 2. KlaimKilat — AI Reimbursement Agent
- **Slug:** `klaimkilat-reimbursement-agent`
- **Repo:** https://github.com/TheGasz/automation-reimburse-workflow
- **Category:** GenAI & Agents
- **Tech:** Python, LangGraph, DeepSeek, pgvector, FastAPI, Redis
- **Headline Metric:** 0% false auto-approve · RRF hybrid search
- **Problem Statement:** Proses reimbursement operasional lambat dan memakan waktu tim finance hingga berhari-hari. Kesalahan human-review sering meloloskan klaim melebihi plafon bulanan atau salah kategori akun.
- **Data & Challenges:** Dokumen struk foto/PDF dengan variasi pencahayaan dan resolusi rendah. Tantangan: mencegah klaim palsu lolos auto-approval.
- **Architecture:**
  - Omnichannel webhook (Web/Telegram/WhatsApp)
  - Vision OCR Parser → JSON extractor
  - LangGraph State Machine:
    1. Node 1: Receipt Extractor (Vendor, tanggal, nominal, item)
    2. Node 2: Hybrid RAG (pgvector + FTS with Reciprocal Rank Fusion) mencocokkan SOP finance
    3. Node 3: Quota Checker Tool (query histori plafon karyawan)
    4. Node 4: Policy Validator & Decision Router (Auto-Approve, Auto-Reject, atau Human Escalation via HITL)
- **Trade-offs:**
  - LangGraph stateful graph dibanding linier chain: Mendukung Human-in-the-Loop (HITL) pause-and-resume saat butuh verifikasi atasan.
  - Reciprocal Rank Fusion (RRF) menggabungkan dense pgvector + sparse keyword: Menjaga akurasi pencarian nomor pasal SOP yang spesifik.
- **Metrics & Baseline:**
  - False Auto-Approve Rate: 0.0% (Hard security boundary)
  - End-to-end Latency: ~3.2 detik untuk auto-approve
- **Limitations:** Kualitas ekstraksi struk bergantung pada kejernihan foto (struk thermal yang pudar memerlukan foto ulang).

---

## 3. TransitSentinel — Cashless Transit Anomaly Detection
- **Slug:** `transit-cashless-anomaly-detection`
- **Repo:** https://github.com/TheGasz/transit-cashless-anomaly-detection
- **Category:** Tabular & ML
- **Tech:** Python, PyTorch, LightGBM, Isolation Forest, SHAP, FastAPI
- **Headline Metric:** 0.987 PR-AUC · <25 ms p95 latency
- **Problem Statement:** Transaksi tap kartu transit non-tunai mengalami anomali kompleks: double tap <1 detik, kartu kloning di dua halte berbeda dalam interval mustahil, serta kegagalan batch settlement perbankan.
- **Data & Challenges:** 120.000 transaksi transit simulasi dengan class imbalance ekstrem (anomali < 0.8%).
- **Architecture:**
  - Rule-based guardrails (deteksi instan untuk double tap fisik)
  - PyTorch Variational Autoencoder (VAE) untuk mendeteksi *unseen anomalous pattern* via reconstruction error
  - Isolation Forest + LightGBM gradient boosted trees
  - Cost-sensitive decision router: trigger auto-refund atau freeze kartu
  - SHAP explainer untuk audit trail tiket fraud
- **Trade-offs:**
  - Ensemble VAE + LightGBM dibanding Deep Learning tunggal: LightGBM memberikan p95 latency <25ms yang krusial untuk gate tap barrier.
- **Metrics & Baseline:**
  - PR-AUC: 0.987 (Baseline Isolation Forest murni: 0.742)
  - Fraud loss recovery: ~98% potensi kerugian terselamatkan
- **Limitations:** Model dilatih pada dataset simulasi realistis; kalibrasi drift diperlukan jika diterapkan pada sensor hardware spesifik.

---

## 4. The 15-Minute City Profiler
- **Slug:** `15-minute-city-profiler`
- **Repo:** https://github.com/TheGasz/15-Minutes-City
- **Category:** Time-Series & Geo
- **Tech:** Python, NumPy, OSMnx, GeoPandas, Folium, Matplotlib
- **Headline Metric:** NumPy K-Means++ · 25x25 spatial grid
- **Problem Statement:** Konsep "Kota 15 Menit" sulit diukur secara objektif karena data persebaran fasilitas kesehatan, pangan, dan pendidikan sering terisolasi dan tidak memperhitungkan jarak jalan kaki aktual.
- **Data & Challenges:** OpenStreetMap POI dan jaringan jalan pejalan kaki di DKI Jakarta. Tantangan: distribusi spasial yang heterogen dan noise data POI OSM.
- **Architecture:**
  - OSMnx road network extraction & walking buffer calculation
  - 25x25 spatial grid indexing across subdistricts
  - Custom K-Means with K-Means++ initialization dibangun from scratch menggunakan NumPy
  - Shannon Diversity Index calculation untuk mengukur keseimbangan ragam fasilitas dalam 15 menit jalan kaki
  - Spatial neighbor smoothing & Folium interactive chloropleth
- **Trade-offs:**
  - Custom NumPy implementation dibanding `scikit-learn`: Memungkinkan modifikasi jarak berbasis topologi jalan dan penyesuaian penalti spatial weighting langsung di dalam matriks jarak.
- **Metrics & Baseline:**
  - 25x25 spatial grid coverage (100% kelurahan Jakarta terpetakan)
  - Shannon Equitability Index untuk identifikasi kesenjangan fasilitas esensial
- **Limitations:** Tidak memperhitungkan elevasi tanah atau hambatan konstruksi trotoar temporer.

---

## 5. River Water-Level Forecasting (Bengawan Solo)
- **Slug:** `river-water-level-bengawan-solo`
- **Repo:** https://github.com/TheGasz/Prediksi_TinggiMukaAir_BengawanSolo
- **Category:** Time-Series & Geo
- **Tech:** Python, LightGBM, XGBoost, CatBoost, Pandas, HydroRIVERS
- **Headline Metric:** Mean RMSE 1.39 · 242-day lead time
- **Problem Statement:** Peringatan dini banjir Sungai Bengawan Solo membutuhkan waktu ancang (lead time) panjang hingga 242 hari ke depan tanpa mengandalkan observasi masa depan di stasiun telemetri hilir.
- **Data & Challenges:** Data telemetri ketinggian air historis di 30 pos pantau. Tantangan: missing values sensor, keterlambatan pelaporan pos, dan autokorelasi debit air hulu-hilir.
- **Architecture:**
  - 187 leak-free hydrological features (curah hujan lagged, kelembaban tanah, upstream routing delay)
  - Rolling-origin cross-validation (4-fold) untuk mencegah data leakage waktu
  - 7-member ensemble (LightGBM + XGBoost + CatBoost) dengan weighted averaging
- **Trade-offs:**
  - GBDT ensemble dibanding LSTM: Training jauh lebih cepat dan lebih tahan terhadap data sensor yang hilang mendadak dibanding recurrent models.
- **Metrics & Baseline:**
  - Mean RMSE: 1.39 (Baseline ARIMA/Persistence: 3.12)
- **Limitations:** Prediksi di atas 180 hari memiliki interval ketidakpastian (confidence bounds) yang melebar saat anomali cuaca ekstrem (El Nino/La Nina).

---

## 6. Jakarta Flood Risk Data Pipeline
- **Slug:** `jakarta-flood-data-pipeline`
- **Repo:** https://github.com/TheGasz/Data-Engineer-Jakarta-Flood-Spatial-Temporal-
- **Category:** Time-Series & Geo
- **Tech:** Python, Pandas, GeoPandas, scikit-learn (PCA), NumPy, Matplotlib
- **Headline Metric:** 97k rows spatio-temporal feature store
- **Problem Statement:** Data risiko banjir Jakarta tersebar di berbagai instansi pemerintah dengan format tidak terstandarisasi, koordinat salah proyeksi, dan tanggal rusak akibat konversi software.
- **Data & Challenges:** Fusi 7 dataset terbuka (laporan BPBD, telemetri pos air 10 menit, demografi, cuaca, tutupan lahan) di 267 kelurahan Jakarta.
- **Architecture:**
  - Forensic data cleaning: perbaikan corrupt date format Excel, masking sensor beku/mati
  - Geometri reprojection ke EPSG:32748 (UTM Zone 48S) untuk kalkulasi jarak presisi
  - Feature Store spatio-temporal harian: 97.000 baris dengan 0 missing values
  - Analisis PCA & spatial correlation menemukan lonjakan risiko banjir relatif 41x lipat di koridor Ciliwung
- **Trade-offs:**
  - Geopandas + UTM projection dibanding lat/long mentah: Menjamin kalkulasi jarak radius sungai akurat dalam meter, bukan derajat koordinat.
- **Metrics & Baseline:**
  - Data Completeness: 100% (97.000 baris bersih dari 7 sumber data acak)
  - Identifikasi 41x multiplier risiko banjir di koridor bantaran sungai
- **Limitations:** Data elevasi Digital Elevation Model (DEM) masih beresolusi 30 meter.

---

## 7. Hierarchical Waste Classification (AI PilahYuk)
- **Slug:** `ai-pilahyuk-waste-classification`
- **Repo:** https://github.com/TheGasz/AI_PilahYuk
- **Category:** Computer Vision
- **Tech:** Python, PyTorch, SigLIP, Optuna, scikit-learn, NumPy
- **Headline Metric:** ~0.99 macro F1 · SigLIP 1152-dim embeddings
- **Problem Statement:** Pemilahan sampah ke kategori Daur Ulang, Organik, dan B3 (Bahan Berbahaya & Beracun). Kesalahan deteksi limbah B3 (false negative) berdampak fatal bagi petugas kebersihan dan lingkungan.
- **Data & Challenges:** Foto limbah nyata dengan latar belakang kotor dan objek tertumpuk.
- **Architecture:**
  - Frozen SigLIP so400m vision-language backbone
  - Ekstraksi dan caching embedding 1152-dim
  - Lightweight Multi-Layer Perceptron (MLP) classification head
  - Class-weighted Focal Loss + Mixup augmentation untuk memprioritaskan recall limbah berbahaya (B3)
  - Optuna hyperparameter tuning
- **Trade-offs:**
  - Frozen SigLIP backbone + MLP head dibanding fine-tuning end-to-end: Hemat memori GPU 90%, waktu komputasi turun drastis, dan bebas dari catastrophic forgetting.
- **Metrics & Baseline:**
  - Macro F1: ~0.99 (Baseline ResNet-50: 0.88)
  - B3 Hazardous Recall: 0.995 (mencegah limbah berbahaya lolos)
- **Limitations:** Klasifikasi didasarkan pada penampakan visual luar; botol tertutup dengan isi cairan tidak dikenal memerlukan sensor kimia fisik.

---

## 8. Waste Image Classification (Satria Data 2026)
- **Slug:** `satria-data-waste-classification`
- **Repo:** https://github.com/TheGasz/Satria-Data_IdentifikasiJenisSampah
- **Category:** Computer Vision
- **Tech:** Python, SigLIP 2, Optuna, Focal Loss, GroupKFold
- **Headline Metric:** 0.9962 F1 score · Satria Data competition
- **Problem Statement:** Kompetisi data science nasional untuk klasifikasi citra sampah dengan akurasi dan ketahanan tertinggi pada kondisi pencahayaan dan sudut pengambilan gambar variatif.
- **Data & Challenges:** Dataset kompetisi dengan kemiripan visual tinggi antar sub-kategori sampah plastik dan kertas.
- **Architecture:**
  - Dual-backbone feature fusion: penggabungan embedding SigLIP v1 + v2 (3456 dimensi)
  - Patch-max pooling untuk menangkap detail tekstur kecil limbah daur ulang
  - Two-stage MLP head dengan Optuna tuning
  - GroupKFold cross-validation & Test-Time Augmentation (TTA) ensembling
- **Trade-offs:**
  - Concatenation dual-version SigLIP embeddings dibanding single backbone: Peningkatan F1-score sebesar 0.008 yang menjadi kunci kemenangan kompetisi.
- **Metrics & Baseline:**
  - Test F1 Score: 0.9962 (Baseline single-model: 0.978)
- **Limitations:** Ekstraksi fitur dual-backbone membutuhkan inference time 1.5x lebih lama daripada single backbone.

---

## 9. Face Anti-Spoofing Detection
- **Slug:** `face-anti-spoofing-detection`
- **Repo:** https://github.com/TheGasz/faceSpoofingDetection
- **Category:** Computer Vision
- **Tech:** Python, PyTorch, ConvNeXt, Optuna, SigLIP, Grad-CAM
- **Headline Metric:** 6-class ConvNeXt · 0 duplicate leakage
- **Problem Statement:** Sistem presensi dan keamanan biometrik wajah rentan diserang metode spoofing (foto cetak, layar HP/tablet, topeng 3D, manekin).
- **Data & Challenges:** Dataset multi-attack. Tantangan: duplikasi gambar antar split dataset (data leakage) yang menyebabkan akurasi palsu.
- **Architecture:**
  - Pre-training data audit: ekstraksi embedding SigLIP dengan trimmed centroids untuk membersihkan duplikasi antar kelas (zero duplicate leakage)
  - ConvNeXt-Tiny deep convolutional backbone
  - 5-fold cross validation dengan corrected focal loss
  - Grad-CAM visualizer untuk memverifikasi fokus model pada tekstur kulit asli vs pantulan layar
- **Trade-offs:**
  - ConvNeXt-Tiny dibanding Vision Transformer: Efisiensi komputasi lebih tinggi untuk deployment pada perangkat edge/kamera absensi.
- **Metrics & Baseline:**
  - 6-Class Accuracy: 98.4%
  - Data leakage audit: 100% duplicate leakage dibersihkan sebelum fitting
- **Limitations:** Performa pada kondisi pencahayaan infrared (IR) memerlukan data sensor tambahan.

---

## 10. Crop Yield Prediction
- **Slug:** `crop-yield-prediction`
- **Repo:** https://github.com/TheGasz/Crop-Yield-Prediction
- **Category:** Tabular & ML
- **Tech:** Python, TensorFlow, Keras, Flask, React
- **Headline Metric:** TensorFlow & Keras full-stack deployment
- **Problem Statement:** Estimasi hasil panen tanaman pertanian penting bagi perencanaan logistik pangan, namun dipengaruhi oleh interaksi non-linear antara nutrisi tanah (N, P, K) dan variabel iklim (curah hujan, suhu).
- **Data & Challenges:** Data agrikultur tabular dengan multikolinearitas antar variabel tanah dan cuaca.
- **Architecture:**
  - Data normalization & feature scaling
  - Multilayer Deep Neural Network (DNN) berbasis TensorFlow/Keras dengan Dropout regularization
  - Export model & serving via Flask REST API
  - Antarmuka web React interaktif dengan input slider
- **Trade-offs:**
  - Neural Network dengan Dropout dibanding Linear Regression: Mampu memodelkan efek saturasi pupuk non-linear.
- **Metrics & Baseline:**
  - R² Score: 0.94 (Baseline Linear Regression: 0.72)
- **Limitations:** Model berlaku optimal pada zona agroklimat tropis yang selaras dengan data pelatihan.

---

## 11. Agent-Based Exposure Simulation
- **Slug:** `agent-based-exposure-simulation`
- **Repo:** https://github.com/TheGasz/ABM_ExposureSim
- **Category:** Tabular & ML
- **Tech:** Python, Streamlit, NumPy, Plotly, Matplotlib
- **Headline Metric:** Poisson arrival · Ray-casting FOV heatmap
- **Problem Statement:** Mendesain tata letak ruang tunggu atau galeri ritel memerlukan estimasi eksposur visual terhadap papan informasi/iklan berdasarkan pergerakan dinamis pengunjung.
- **Data & Challenges:** Dinamika kerumunan stokastik dengan waktu kedatangan acak dan rintangan fisik di dalam ruangan.
- **Architecture:**
  - Poisson arrival process untuk kedatangan agen pengunjung
  - Ray-casting Field of View (FOV) 120 derajat untuk mendeteksi rintangan yang dilihat agen
  - Kalkulasi kumulatif exposure time pada tiap obstacle
  - Visualisasi 2D ruang interaktif & heatmap eksposur via Plotly dan Streamlit
- **Trade-offs:**
  - Ray-casting 2D berbasis NumPy vektor dibanding simulasi 3D physics: Menghasilkan komputasi 60 FPS instan langsung di aplikasi web.
- **Metrics & Baseline:**
  - Real-time simulation speed: >50 agen serentak tanpa lag komputasi
- **Limitations:** Agen bergerak dengan model navigasi proksimal (bukan deep reinforcement learning).

