let mapping = {};
let scanner;

fetch("mapping.json")
  .then(response => response.json())
  .then(data => {
    mapping = data;
  });

function extractCardNumber(url) {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  return parseInt(lastPart, 10).toString();
}

function startScanner() {
  const status = document.getElementById("status");
  status.innerText = "Startar kamera...";

  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    {
      fps: 15,
      qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
      status.innerText = "QR upptäckt!";
      scanner.stop();

      const cardNumber = extractCardNumber(decodedText);

      status.innerText = "Kort: " + cardNumber;

      if (mapping[cardNumber]) {
        window.location.href = mapping[cardNumber];
      } else {
        status.innerText = "Kort saknas i mapping.";
      }
    },
    (errorMessage) => {
      // Tyst fel (normalt när den söker)
    }
  ).catch(err => {
    status.innerText = "Kunde inte starta kameran.";
  });
}

function manualLookup() {
  const cardNumber = document.getElementById("manualInput").value;

  if (mapping[cardNumber]) {
    window.location.href = mapping[cardNumber];
  } else {
    alert("Kortet finns inte.");
  }
}
