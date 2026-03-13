(function() {
    // 1. Mencegah script dipanggil dua kali
    if (window.ArewwpDevActive) {
        showToast("⚠️ Arewwp DevTools sudah berjalan!", "warning");
        return;
    }
    window.ArewwpDevActive = true;

    // 2. Inject CSS untuk UI & Custom Alert (Toast)
    const style = document.createElement('style');
    style.id = "arewwp-dev-style";
    style.innerHTML = `
        #arewwp-dev-panel {
            position: fixed; bottom: 20px; left: 20px; z-index: 999999;
            background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(12px);
            padding: 15px; border-radius: 16px; color: #fff; font-family: 'Segoe UI', system-ui, sans-serif;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
            width: 220px; transition: all 0.3s ease;
        }
        #arewwp-dev-panel h3 { margin: 0 0 12px 0; font-size: 15px; color: #0070f3; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
        .arewwp-btn {
            background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1);
            padding: 10px; border-radius: 8px; cursor: pointer; text-align: left; font-size: 13px;
            transition: all 0.2s; display: flex; align-items: center; gap: 8px; width: 100%; box-sizing: border-box;
        }
        .arewwp-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-1px); }
        .arewwp-btn.danger:hover { background: #ff4d4d; color: white; border-color: #ff4d4d; }
        .arewwp-btn.primary { background: #0070f3; border-color: #0070f3; justify-content: center; font-weight: bold; }
        .arewwp-btn.primary:hover { background: #005bb5; }
        
        #arewwp-toast-container {
            position: fixed; top: 20px; right: 20px; z-index: 9999999;
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .arewwp-toast {
            background: rgba(0,0,0,0.9); color: white; padding: 12px 20px; border-radius: 8px;
            font-family: sans-serif; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border-left: 4px solid #0070f3; animation: slideIn 0.3s ease forwards;
        }
        .arewwp-toast.warning { border-left-color: #f5a623; }
        .arewwp-toast.success { border-left-color: #17c964; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }
    `;
    document.head.appendChild(style);

    // 3. Sistem Custom Alert (Toast Notification)
    const toastContainer = document.createElement('div');
    toastContainer.id = "arewwp-toast-container";
    document.body.appendChild(toastContainer);

    function showToast(message, type = "success") {
        const toast = document.createElement('div');
        toast.className = `arewwp-toast ${type}`;
        toast.innerText = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = "fadeOut 0.4s ease forwards";
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // 4. Load Eruda diam-diam di background
    var erudaScript = document.createElement('script');
    erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
    document.head.appendChild(erudaScript);
    erudaScript.onload = () => { eruda.init(); showToast("Eruda Console Ready!", "success"); };

    // 5. Membuat Panel UI Utama
    var panel = document.createElement('div');
    panel.id = "arewwp-dev-panel";
    panel.innerHTML = `
        <h3>⚙️ Arewwp Tools</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="btn-info" class="arewwp-btn">🌐 Get Web Info</button>
            <button id="btn-edit" class="arewwp-btn">📝 Toggle Edit Mode</button>
            <button id="btn-outline" class="arewwp-btn">🔲 Outline Elements</button>
            <button id="btn-img" class="arewwp-btn">🖼️ Extract Images</button>
            <button id="btn-api" class="arewwp-btn">🔗 Extract Links</button>
            <button id="btn-clean" class="arewwp-btn">🧹 Clean Ads/Iframes</button>
            <button id="btn-close" class="arewwp-btn danger" style="justify-content: center; margin-top: 5px;">❌ Close DevTools</button>
        </div>
    `;
    document.body.appendChild(panel);

    // 6. LOGIKA FITUR-FITUR CANGGIH
    
    // Fitur 1: Dapatkan Semua Informasi Website
    document.getElementById('btn-info').onclick = () => {
        let metaDesc = document.querySelector('meta[name="description"]')?.content || "Tidak ada deskripsi";
        let metaTheme = document.querySelector('meta[name="theme-color"]')?.content || "Tidak ada tema warna";
        let isNextJs = document.querySelector('#__next') || window.__NEXT_DATA__ ? "Ya (Next.js detected)" : "Tidak";
        let isWordPress = document.querySelector('meta[name="generator"][content*="WordPress"]') ? "Ya" : "Tidak";
        
        let infoText = `Judul: ${document.title}\nURL: ${window.location.href}\nDesc: ${metaDesc}\nNext.js: ${isNextJs}\nWordPress: ${isWordPress}`;
        
        console.log("%c[Web Info Data]", "color:#0070f3; font-weight:bold; font-size:14px;", infoText);
        showToast("Info web ditarik! Cek console Eruda.", "success");
        setTimeout(() => alert(infoText), 500); // Tampilkan popup detail untuk info ini
    };

    // Fitur 2: Mode Edit
    document.getElementById('btn-edit').onclick = () => {
        let active = document.designMode === 'on';
        document.designMode = active ? 'off' : 'on';
        showToast(`Design Mode: ${active ? 'OFF' : 'ON'}`, active ? "warning" : "success");
    };

    // Fitur 3: Outline Element (Melihat kotak pembatas semua elemen CSS)
    document.getElementById('btn-outline').onclick = () => {
        if (window.arewwpOutlineOn) {
            document.querySelectorAll('*').forEach(el => el.style.outline = '');
            window.arewwpOutlineOn = false;
            showToast("Outline dimatikan.", "warning");
        } else {
            document.querySelectorAll('*').forEach(el => el.style.outline = `1px solid #${Math.floor(Math.random()*16777215).toString(16)}`);
            window.arewwpOutlineOn = true;
            showToast("Outline diaktifkan! Cek layout.", "success");
        }
    };

    // Fitur 4: Ekstraksi Gambar
    document.getElementById('btn-img').onclick = () => {
        let imgs = Array.from(document.images).map(i => i.src).filter(Boolean);
        console.log("📸 Daftar Gambar:", imgs);
        showToast(`Berhasil mengambil ${imgs.length} gambar!`, "success");
    };

    // Fitur 5: Ekstraksi Link/API
    document.getElementById('btn-api').onclick = () => {
        let links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(Boolean);
        console.log("🔗 Daftar Link/Endpoint:", links);
        showToast(`Berhasil menarik ${links.length} link!`, "success");
    };

    // Fitur 6: Pembersih Iklan & Sampah Visual
    document.getElementById('btn-clean').onclick = () => {
        let removed = 0;
        document.querySelectorAll('iframe, .ads, [id*="google_ads"], [class*="ad-"], [class*="banner"]').forEach(el => {
            el.remove();
            removed++;
        });
        showToast(`Berhasil menghapus ${removed} elemen pengganggu!`, "success");
    };

    // 7. Tombol Tutup & Bersihkan Semua Cache Tool
    document.getElementById('btn-close').onclick = () => {
        panel.remove();
        toastContainer.remove();
        document.getElementById('arewwp-dev-style').remove();
        if(window.arewwpOutlineOn) document.querySelectorAll('*').forEach(el => el.style.outline = '');
        window.ArewwpDevActive = false;
        if(window.eruda) eruda.destroy();
        // Pakai alert biasa saat ditutup karena sistem toast sudah dihapus
        alert("Arewwp DevTools berhasil ditutup."); 
    };
})();
