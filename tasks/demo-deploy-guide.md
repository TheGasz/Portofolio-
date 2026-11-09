# Panduan Step-by-Step Deploy Live Demo Model (Rp0 / Zero-Cost)

> Panduan praktis untuk Bagas (@TheGasz) guna mengaktifkan live demo interaktif pada 11 project machine learning & data engineering tanpa sewa VPS dan tanpa kartu kredit.

---

## Ringkasan Eksekutif Strategi Demo

| # | Project | Strategi Deployment | Platform / Engine | Biaya | Status di UI |
|---|---|---|---|---|---|
| 1 | **Enterprise AI Support Copilot (RAG)** | Iframe Web Embed | Streamlit Community Cloud | Rp0 | Ready for URL |
| 2 | **KlaimKilat — Reimbursement Agent** | Interactive State-Machine | Client-side React / JSON | Rp0 | Local Component |
| 3 | **TransitSentinel — Anomaly Detection** | In-Browser Inference | ONNX Runtime Web (`.onnx`) | Rp0 | Local WASM |
| 4 | **The 15-Minute City Profiler** | Interactive Map View | Leaflet.js / GeoJSON statis | Rp0 | Local Component |
| 5 | **Bengawan Solo Water-Level Forecast** | Time-Series Trajectory | Recharts / Plotly.js | Rp0 | Local Component |
| 6 | **Jakarta Flood Risk Pipeline** | Spatio-Temporal Explorer | Leaflet + PCA Biplot | Rp0 | Local Component |
| 7 | **AI PilahYuk (Hierarchical Waste)** | Embedding Feature Inspector | Pre-computed SigLIP vectors | Rp0 | Local Component |
| 8 | **Satria Data Waste Classification** | Attention & Pooling Inspector | Pre-computed Dual-backbone | Rp0 | Local Component |
| 9 | **Face Anti-Spoofing Detection** | Grad-CAM Attack Inspector | Pre-computed Activation maps | Rp0 | Local Component |
| 10 | **Crop Yield Prediction** | Client-Side Model Inference | TensorFlow.js (`model.json`) | Rp0 | Local Web ML |
| 11 | **Agent-Based Exposure Simulation** | Iframe Web Embed | Streamlit Community Cloud | Rp0 | Ready for URL |

---

## 1. Panduan Deploy Streamlit Community Cloud (Gratis & Bebas Kartu Kredit)

Cocok untuk:
- `customerServiceTicketRAG`
- `ABM_ExposureSim`

### Mengapa Streamlit Community Cloud?
- **100% Gratis** tanpa butuh kartu kredit.
- Langsung terhubung dengan akun GitHub `TheGasz`.
- Alokasi RAM hingga **1 GB per app** (cukup untuk Streamlit UI + model CPU terkuantisasi atau lightweight RAG index).
- Cold-start ditangani otomatis: bila tidak ada pengunjung, app akan tidur dan bangun kembali dalam ~30 detik.

### Langkah-langkah Deployment:
1. Masuk ke [share.streamlit.io](https://share.streamlit.io/) dan login menggunakan akun GitHub **`TheGasz`**.
2. Klik tombol **"Create app"** / **"New app"**.
3. Pilih repository GitHub:
   - Misal: `TheGasz/customerServiceTicketRAG`
   - Branch: `main`
   - Main file path: `app.py` atau `streamlit_app.py`
4. Di bagian **Advanced Settings**:
   - Tentukan versi Python (disarankan `3.10` atau `3.11`).
   - Masukkan Environment Secrets jika ada (misal `OPENAI_API_KEY` atau HuggingFace token jika diperlukan).
5. Klik **"Deploy!"**.
6. Tunggu proses build (biasanya 2-3 menit). Setelah aplikasi aktif, salin URL publiknya (misal `https://thegasz-tickets-copilot.streamlit.app`).
7. Buka file `src/assets/projectDetails.js` di portofolio, cari slug `enterprise-ai-support-copilot`:
   ```javascript
   demo: {
     type: "iframe",
     status: "live", // ubah dari "coming-soon" ke "live"
     url: "https://thegasz-tickets-copilot.streamlit.app",
     coldStartNote: "Hosted on Streamlit Community Cloud. Spins up in ~30s on demand."
   }
   ```
8. Selesai! Pengunjung portofoliomu bisa langsung mencoba live demo di dalam layar monitor atau membukanya di tab baru.

---

## 2. Panduan Ekspor Model ke In-Browser Web ML (ONNX Runtime Web & TensorFlow.js)

Cocok untuk:
- `crop-yield-prediction` (TensorFlow/Keras -> TF.js)
- `transit-cashless-anomaly-detection` (LightGBM/PyTorch -> ONNX)

### Kasus A: Crop Yield Prediction (Keras -> TensorFlow.js)
1. Di environment Python lokal tempat kamu melatih model:
   ```bash
   pip install tensorflowjs
   ```
2. Ekspor model Keras `.h5` atau `SavedModel` ke format web:
   ```bash
   tensorflowjs_converter --input_format=keras model.h5 public/models/crop_yield/
   ```
   Ini akan menghasilkan `model.json` dan file binary weights `.bin` (biasanya hanya beberapa puluh kilobyte).
3. Di frontend React:
   - File model ditaruh di folder `public/models/crop_yield/`.
   - Menggunakan `@tensorflow/tfjs` untuk load:
     ```javascript
     import * as tf from "@tensorflow/tfjs";
     const model = await tf.loadLayersModel("/models/crop_yield/model.json");
     const prediction = model.predict(tf.tensor2d([[n, p, k, rain, temp]]));
     ```
4. Keuntungan: 0 latency, tidak ada server backend, aman dari downtime!

### Kasus B: TransitSentinel (LightGBM / PyTorch -> ONNX)
1. Ekspor model LightGBM ke format ONNX:
   ```python
   import onnxmltools
   from onnxmltools.convert.common.data_types import FloatTensorType

   initial_types = [('float_input', FloatTensorType([None, 8]))]
   onnx_model = onnxmltools.convert_lightgbm(model, initial_types=initial_types)
   with open("public/models/transit_sentinel.onnx", "wb") as f:
       f.write(onnx_model.SerializeToString())
   ```
2. Di frontend, gunakan library ringan `onnxruntime-web` untuk menjalankan prediksi transaksi secara real-time saat slider digeser.

---

## 3. Panduan Pre-Computed Interactive Playground (Solusi Model Besar: SigLIP & ConvNeXt)

Untuk model vision besar seperti **SigLIP (so400m)** pada `AI PilahYuk` dan `Satria Data`, mendownload model 1 GB ke browser pengunjung akan sangat lambat. 
Solusi standar industri adalah **Pre-Computed Feature Inspector**:

1. Buat script Python sederhana `extract_demo_samples.py`:
   ```python
   import json
   import torch
   # Pilih 6-9 sampel gambar uji (organik, kertas, B3/baterai)
   # Jalankan forward pass sekali saja untuk mengekstrak:
   # - Kelas prediksi & probabilitas
   # - Jarak embedding ke prototipe kelas
   # - Grad-CAM attention mask (disimpan sebagai heatmap PNG kecil)

   samples = [
       {
           "id": "sample_b3_battery",
           "image": "/demo/waste/battery.jpg",
           "ground_truth": "B3 Hazardous",
           "prediction": "B3 Hazardous",
           "confidence": 0.9984,
           "focal_loss_weight": 4.5,
           "features": {"metallic": 0.88, "chemical_hazard": 0.94}
       },
       # ... sampel lainnya
   ]

   with open("src/assets/demo/pilahyuk_samples.json", "w") as f:
       json.dump(samples, f, indent=2)
   ```
2. Pengunjung di web portfolio bisa:
   - Mengklik sampel limbah atau memilih gambar.
   - Melihat visualisasi probabilitas, penalti focal loss, dan threshold deteksi bahaya secara instan tanpa loading.
   - Recruiter langsung terkesan karena melihat data saintifik dan reasoning di balik model tanpa resiko error koneksi.

---

## 4. Checklist Pengaktifan Demo Mandiri

- [ ] Deploy `customerServiceTicketRAG` ke Streamlit Cloud dan perbarui `url` di `projectDetails.js`.
- [ ] Deploy `ABM_ExposureSim` ke Streamlit Cloud dan perbarui `url` di `projectDetails.js`.
- [ ] Konversi model `crop-yield-prediction` ke TF.js format.
- [ ] Jalankan script ekstraksi sampel JSON untuk `AI PilahYuk` dan `Face Anti-Spoofing`.
- [ ] Ubah field `status: "coming-soon"` menjadi `status: "live"` pada project yang siap.

