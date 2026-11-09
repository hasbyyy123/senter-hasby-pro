
const onButton = document.getElementById("onButton");
const offButton = document.getElementById("offButton");

const flashlightCircle = document.getElementById("flashlightCircle");
const flashlightStatus = document.getElementById("flashlightStatus");

const billingOverlay = document.getElementById("billingOverlay");
const prankButton = document.getElementById("prankButton");
const closeInvoice = document.getElementById("closeInvoice");

let flashlightActive = false;

// FUNGSI MENYALAKAN SENTER
onButton.addEventListener("click", async function () {

    flashlightActive = true;

    flashlightCircle.classList.add("active");
    flashlightStatus.textContent = "FLASHLIGHT ON";

    onButton.innerHTML = `
        <span>⚡</span>
        ON
        <small>ACTIVE</small>
    `;

    // Mengunci tombol OFF setelah ON ditekan
    offButton.disabled = false;
    offButton.classList.add("locked");

    offButton.innerHTML = `
        <span>🔒</span>
        OFF
        <small>LOCKED</small>
    `;

    // Coba nyalakan flash HP jika didukung browser
    try {
        if ("mediaDevices" in navigator &&
            navigator.mediaDevices.getUserMedia) {

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                }
            });

            const track = stream.getVideoTracks()[0];

            if (track.getCapabilities &&
                track.getCapabilities().torch) {
                await track.applyConstraints({
                    advanced: [{ torch: true }]
                });
                window.flashStream = stream;
            } else {
                stream.getTracks().forEach(t => t.stop());
            }
        }
    } catch (error) {
        console.log("Flash tidak didukung atau izin kamera ditolak.");
    }

});

// MEMBUKA TAGIHAN KETIKA OFF DITEKAN
offButton.addEventListener("click", function () {

    if (!flashlightActive) {
        // Sebelum ON, tombol OFF masih bebas digunakan.
        flashlightStatus.textContent = "FLASHLIGHT OFF";
        return;
    }

    billingOverlay.hidden = false;

});

// TOMBOL PRANK

prankButton.addEventListener("click", function () {

    prankButton.disabled = true;
    prankButton.textContent = "⏳ PROCESSING PAYMENT...";

    prankButton.style.opacity = "0.6";

    setTimeout(function () {

        prankButton.disabled = false;
        prankButton.textContent = "👑 UNLOCK PREMIUM NOW";
        prankButton.style.opacity = "1";

        alert(
            "😂 GOTCHA!\n\n" +
            "YOU HAVE BEEN PRANKED!\n\n" +
            "Your $599 payment was NEVER REAL.\n\n" +
            "WELCOME TO FLASHLIGHT PRO!"
        );

        billingOverlay.hidden = true;

    }, 2500);

});


// MENUTUP TAGIHAN
closeInvoice.addEventListener("click", function () {
    billingOverlay.hidden = true;
});

// KLIK AREA LUAR POPUP
billingOverlay.addEventListener("click", function (event) {

    if (event.target === billingOverlay) {
        billingOverlay.hidden = true;
    }

});
