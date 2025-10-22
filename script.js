// Navigasi halaman
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Event listeners
document.getElementById('login-btn').addEventListener('click', () => showPage('login'));
document.getElementById('siswa-btn').addEventListener('click', () => showPage('siswa-identitas'));
document.getElementById('guru-btn').addEventListener('click', () => showPage('guru-login'));
document.getElementById('kembali-btn').addEventListener('click', () => showPage('home'));

// Validasi form siswa
const namaInput = document.getElementById('nama');
const kelasInput = document.getElementById('kelas');
const nomorInput = document.getElementById('nomor-absen');
const selanjutnyaBtn = document.getElementById('selanjutnya-btn');

function validateForm() {
    const nama = namaInput.value;
    const kelas = kelasInput.value;
    const nomor = nomorInput.value;

    // Nama: Huruf depan kapital
    const namaValid = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(nama);
    // Kelas: Capslock
    const kelasValid = /^[A-Z\s\d]+$/.test(kelas) && kelas === kelas.toUpperCase();
    // Nomor: 1-40
    const nomorValid = nomor >= 1 && nomor <= 40;

    selanjutnyaBtn.disabled = !(namaValid && kelasValid && nomorValid);
}

namaInput.addEventListener('input', validateForm);
kelasInput.addEventListener('input', validateForm);
nomorInput.addEventListener('change', validateForm);

selanjutnyaBtn.addEventListener('click', () => {
    localStorage.setItem('siswaData', JSON.stringify({
        nama: namaInput.value,
        kelas: kelasInput.value,
        nomor: nomorInput.value
    }));
    showPage('siswa-kehadiran');
});

// Kehadiran siswa
document.querySelectorAll('.kehadiran-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const status = e.target.dataset.status;
        const siswaData = JSON.parse(localStorage.getItem('siswaData'));

        // Simpan ke localStorage (per kelas)
        const key = `absensi_${siswaData.kelas}`;
        let absensi = JSON.parse(localStorage.getItem(key)) || [];
        absensi.push({ ...siswaData, status });
        localStorage.setItem(key, JSON.stringify(absensi));

        // Notifikasi
        const notifText = document.getElementById('notif-text');
        if (status === 'Hadir' || status === 'Izin') {
            notifText.textContent = 'Terimakasih! Anda sudah mengisi absensi';
        } else if (status === 'Sakit') {
            notifText.textContent = 'Terimakasih! Anda sudah mengisi absensi, Semoga lekas sembuh!';
        } else if (status === 'Dispensasi') {
            notifText.textContent = 'Terimakasih! Anda sudah mengisi absensi, Tetap Semangatt!';
        }
        document.getElementById('notification').style.display = 'block';
        setTimeout(() => {
            document.getElementById('notification').style.display = 'none';
            showPage('home');
        }, 3000);
    });
});

// Login guru
document.getElementById('login-guru-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulasi validasi (dalam dunia nyata, cocokkan dengan database)
    if (username && password) {
        const key = `absensi_${password}`;
        const absensi = JSON.parse(localStorage.getItem(key)) || [];
        document.getElementById('kelas-tabel').textContent = password;
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        absensi.forEach(item => {
            const row = `<tr><td>${item.nama}</td><td>${item.kelas}</td><td>${item.nomor}</td><td>${item.status}</td></tr>`;
            tableBody.innerHTML += row;
        });
        showPage('guru-tabel');
    } else {
        alert('Username atau password salah!');
    }
});

