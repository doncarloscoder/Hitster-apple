let mapping = {};

fetch("mapping.json")
  .then(response => response.json())
  .then(data => {
    mapping = data;
  });

function extractCardNumber(url) {
  // Exempel:
  // https://www.hitstergame.com/se/aaaa0034/00043
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  return parseInt(lastPart, 10).toString();
}

function onScanSuccess(decodedText) {
  const status = document.getElementById("status");

  const cardNumber = extractCardNumber(decodedText);

  status.innerText = `Kort: ${cardNumber}`;

  if (mapping[cardNumber]) {
    window.location.href = mapping[cardNumber];
  } else {
    status.innerText = "Kortet finns inte i mapping.json";
  }
}

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(devices => {
  if (devices && devices.length) {
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      onScanSuccess
    );
  }
});
