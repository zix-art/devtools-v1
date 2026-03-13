(function() {
    // Mencegah script dipanggil dua kali
    if (window.ArewwpDevActive) {
        alert("🚀 Arewwp DevTools sudah berjalan!");
        return;
    }
    window.ArewwpDevActive = true;

    // 1. Load Eruda secara otomatis
    var erudaScript = document.createElement('script');
    erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
    document.head.appendChild(erudaScript);
    erudaScript.onload = function () { 
        eruda.init(); 
    };

    // 2. Membuat Floating Panel UI yang Modern
    var panel = document.createElement('div');
    panel.style = "position:fixed; bottom:20px; left:20px; z-index:999999; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); padding:15px; border-radius:12px; color:#fff; font-family:sans-serif; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid #333; width: 200px;";
    
    panel.innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0070f3; text-align: center;">⚙️ Arewwp Tools</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="btn-edit" style="background:#222; color:#fff; border:1px solid #444; padding:8px; border-radius:6px; cursor:pointer;">📝 Toggle Edit Mode</button>
            <button id="btn-img" style="background:#222; color:#fff; border:1px solid #444; padding:8px; border-radius:6px; cursor:pointer;">🖼️ Get All Images</button>
            <button id="btn-api" style="background:#0070f3; color:#fff; border:none; padding:8px; border-radius:6px; cursor:pointer;">🔗 Spy API/Links</button>
            <button id="btn-close" style="background:#ff4d4d; color:#fff; border:none; padding:8px; border-radius:6px; cursor:pointer;">❌ Close Panel</button>
        </div>
    `;
    document.body.appendChild(panel);

    // 3. Logika Tombol-Tombol
    document.getElementById('btn-edit').onclick = () => {
        document.designMode = document.designMode === 'on' ? 'off' : 'on';
        alert('Design Mode: ' + document.designMode.toUpperCase());
    };

    document.getElementById('btn-img').onclick = () => {
        let imgs = Array.from(document.images).map(i => i.src).filter(Boolean);
        console.log("📸 Daftar Gambar:", imgs);
        alert(`Ditemukan ${imgs.length} gambar! Cek console Eruda.`);
    };

    document.getElementById('btn-api').onclick = () => {
        let links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(Boolean);
        console.log("🔗 Daftar Link/Endpoint:", links);
        alert(`Berhasil mengekstrak ${links.length} link. Buka console Eruda untuk melihatnya.`);
    };

    document.getElementById('btn-close').onclick = () => {
        panel.remove();
        window.ArewwpDevActive = false;
        if(window.eruda) eruda.destroy();
    };
})();
 
