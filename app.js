let mapping = {};
let scanner = null;

const statusEl = document.getElementById("status");

// Ladda mapping
fetch("mapping.json")
  .then(response => response.json())
  .then(data => {
    mapping = data;
    console.log("Mapping laddad:", Object.keys(mapping).length, "kort");
  })
  .catch(err => {
    statusEl.innerText = "Kunde inte ladda mapping.json";
    console.error(err);
  });

function extractCardNumber(text) {
  console.log("Scannad text:", text);

  // Hitta alla siffersekvenser i texten
  const matches = text.match(/\d+/g);

  if (!matches) return null;

  // Ta sista siffersekvensen (brukar vara kortnumret)
  const lastNumber = matches[matches.length - 1];

  // Ta bort eventuella inledande nollor
  return parseInt(lastNumber, 10).toString();
}

function startScanner() {
  if (scanner) {
    scanner.stop().catch(() => {});
    scanner = null;
  }

  statusEl.innerText = "Startar kamera...";

  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    {
      fps: 15,
      qrbox: { width: 280, height: 280 }
    },
    (decodedText) => {
      statusEl.innerText = "QR hittad!";
      console.log("Decoded:", decodedText);

      scanner.stop().catch(() => {});
      scanner = null;

      const cardNumber = extractCardNumber(decodedText);

      if (!cardNumber) {
        statusEl.innerText = "Kunde inte tolka kortnummer.";
        return;
      }

      statusEl.innerText = "Kortnummer: " + cardNumber;

      if (mapping[cardNumber]) {
        console.log("Redirectar till:", mapping[cardNumber]);
        window.location.href = mapping[cardNumber];
      } else {
        statusEl.innerText = "Kort saknas i mapping.json";
        console.warn("Saknas:", cardNumber);
      }
    },
    (errorMessage) => {
      // Detta triggas hela tiden när den letar — ignorera
    }
  ).catch(err => {
    statusEl.innerText = "Kunde inte starta kameran.";
    console.error(err);
  });
}

function manualLookup() {
  const input = document.getElementById("manualInput").value.trim();

  if (!input) {
    alert("Skriv ett kortnummer.");
    return;
  }

  const cardNumber = parseInt(input, 10).toString();

  if (mapping[cardNumber]) {
    window.location.href = mapping[cardNumber];
  } else {
    alert("Kortet finns inte i mapping.json");
  }
}
