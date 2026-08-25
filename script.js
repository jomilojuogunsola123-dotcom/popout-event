let step = 0;
const TOTAL_STEPS = 7;

let data = {
  flyer: "",
  name: "",
  description: "",
  category: "",
  start: "",
  end: "",
  link: "",
  location: "",
  socials: {
    website: "",
    instagram: "",
    twitter: "",
    tiktok: ""
  },
  tickets: {
    early: { price: "", qty: "" },
    regular: { price: "", qty: "" },
    vip: { price: "", qty: "" },
    feeBearer: ""
  }
};

render();

/* ================= NAV ================= */
function next() {
  saveData();
  const error = validate();
  if (error) return alert(error);

  step++;
  render();
}

function prev() {
  step--;
  render();
}

/* ================= PROGRESS ================= */
function updateProgress() {
  const percent = ((step + 1) / TOTAL_STEPS) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("question").innerText = `Step ${step + 1} of ${TOTAL_STEPS}`;
}

/* ================= VALIDATION ================= */
function validate() {
  if (step === 0 && !data.flyer) return "Upload flyer";

  if (step === 1) {
    if (!data.name.trim()) return "Enter event name";
    if (!data.description.trim()) return "Enter description";
    if (!data.category) return "Select category";
  }

  if (step === 2) {
    if (!data.start) return "Select start date";
    if (!data.end) return "Select end date";
    if (!data.link.trim()) return "Enter link";

    if (new Date(data.end) <= new Date(data.start)) {
      return "End date must be after start date";
    }
  }

  if (step === 3 && !data.location.trim()) {
    return "Enter location";
  }

  if (step === 5) {
    const t = data.tickets;
    if (!t.early.price && !t.regular.price && !t.vip.price) {
      return "Add at least one ticket";
    }
    if (!t.feeBearer) return "Select who pays service charge";
  }

  return null;
}

/* ================= SAVE ================= */
function saveData() {
  const app = document.getElementById("app");
  const get = id => app.querySelector(`#${id}`)?.value || "";
  if (step === 1) {
    data.name = get("name");
    data.description = get("description");
    data.category = get("category");
  }

  if (step === 2) {
    data.start = get("start");
    data.end = get("end");

    // 🔗 CLEAN LINK
    data.link = get("link")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  }

  if (step === 3) {
    data.location = get("location");
  }

  if (step === 4) {
    data.socials.website = get("website");
    data.socials.instagram = get("instagram");
    data.socials.twitter = get("twitter");
    data.socials.tiktok = get("tiktok");
  }

  if (step === 5) {
    data.tickets.early.price = get("early_price");
    data.tickets.early.qty = get("early_qty");

    data.tickets.regular.price = get("regular_price");
    data.tickets.regular.qty = get("regular_qty");

    data.tickets.vip.price = get("vip_price");
    data.tickets.vip.qty = get("vip_qty");

    data.tickets.feeBearer =
      document.querySelector('input[name="fee"]:checked')?.value || "";
  }
}

/* ================= DATE UX ================= */
function handleStartChange() {
  const start = document.getElementById("start").value;
  const endInput = document.getElementById("end");

  if (start) {
    endInput.min = start;

    if (endInput.value && new Date(endInput.value) <= new Date(start)) {
      endInput.value = "";
    }
  }

  updateDatePreview();
}

function handleEndChange() {
  updateDatePreview();
}

function updateDatePreview() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  const preview = document.getElementById("datePreview");

  if (start && end) {
    preview.innerText =
      formatDate(start) + " → " + formatDate(end);
  } else {
    preview.innerText = "";
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ================= RENDER ================= */
function render() {
  const app = document.getElementById("app");
  updateProgress();

  /* STEP 0 */
  if (step === 0) {
    app.innerHTML = `
      <h2>Upload Flyer</h2>
      <label style="display:inline-block;padding:10px 15px;background:#000;color:#fff;border-radius:8px;cursor:pointer;">Upload Flyer<input type="file" onchange="uploadFlyer(this)" style="display:none;"></label>
      <p style="margin-top:10px;color:#555;"></p>

${data.flyer ? `
  <p style="color:green;">✅ Flyer uploaded</p>
` : ""}
      ${data.flyer ? `<img src="${data.flyer}" style="width:100%;margin-top:15px;border-radius:10px;">` : ""}
      <button onclick="next()">Next</button>
    `;
  }

  /* STEP 1 */
  else if (step === 1) {
    app.innerHTML = `
      <input id="name" placeholder="Event Name" value="${data.name}">
      <textarea id="description" placeholder="Description">${data.description}</textarea>

      <select id="category">
        <option value="">Select Category</option>
        ${["Music","Tech","Comedy","Business","Education","Party"].map(c =>
          `<option ${data.category===c?"selected":""}>${c}</option>`
        ).join("")}
      </select>

      <button onclick="prev()">Back</button>
      <button onclick="next()">Next</button>
    `;
  }

  /* STEP 2 (SMART DATE + LINK) */
  else if (step === 2) {
    app.innerHTML = `
      <h2>Date & Link</h2>

      <label>Start</label>
      <input type="datetime-local" id="start" value="${data.start}" onchange="handleStartChange()">

      <label>End</label>
      <input type="datetime-local" id="end" value="${data.end}" onchange="handleEndChange()">

      <p id="datePreview" style="color:#666;margin-top:10px;"></p>

      <label>Event Link</label>
      <div style="display:flex;align-items:center;">
        <span style="white-space:nowrap;color:#888;">
          https://popouttickets.com/
        </span>
        <input id="link" value="${data.link}" style="flex:1;">
      </div>

      <button onclick="prev()">Back</button>
      <button onclick="next()">Next</button>
    `;

    setTimeout(updateDatePreview, 50);
  }
  /* STEP 3 (LOCATION + MAP) */
else if (step === 3) {
  app.innerHTML = `
    <h2>Event Location</h2>

    <label>Location</label>

    <input
      id="location"
      value="${data.location}"
      placeholder="Enter event location"
    >

    <div id="mapPreview" style="
      margin-top:15px;
      width:100%;
      height:300px;
      border-radius:12px;
      overflow:hidden;
      background:#1a0d33;
    "></div>

    <button onclick="prev()">Back</button>
    <button onclick="next()">Next</button>
  `;

  const locationInput = document.getElementById("location");

  locationInput.addEventListener("input", function () {
    data.location = this.value;
    updateMapPreview();
  });

  updateMapPreview();
}


  /* STEP 4 (SOCIALS) */
  else if (step === 4) {
    app.innerHTML = `
      <input id="website" placeholder="Website(Optional)" value="${data.socials.website}">
      <input id="instagram" placeholder="Instagram(Optional)" value="${data.socials.instagram}">
      <input id="twitter" placeholder="Twitter(Optional)" value="${data.socials.twitter}">
      <input id="tiktok" placeholder="TikTok(Optional)" value="${data.socials.tiktok}">

      <button onclick="prev()">Back</button>
      <button onclick="next()">Next</button>
    `;
  }

  /* STEP 5 (TICKETS + REVENUE) */
  else if (step === 5) {
    app.innerHTML = `
      <h3>Tickets</h3>

      ${ticketBlock("early")}
      ${ticketBlock("regular")}
      ${ticketBlock("vip")}

      <h3>Total: <span id="overall_total">₦0</span></h3>

      <p style="color:#aaa;font-size:13px;">
        Service charge: ₦600 per ticket
      </p>

      <label><input type="radio" name="fee" value="buyer" onclick="setFee('buyer')"> Buyer pays</label>

      <label><input type="radio" name="fee" value="organizer" onclick="setFee('organizer')"> Organizer pays</label>
      <button onclick="prev()">Back</button>
      <button onclick="next()">Next</button>
    `;

    setTimeout(calculateRevenue, 100);
  }

  /* STEP 6 (REVIEW) */
  else if (step === 6) {
  app.innerHTML = `
    <h2>Preview</h2>

    ${data.flyer ? `<img src="${data.flyer}" style="width:100%;border-radius:10px;margin-bottom:15px;">` : ""}

    <h3>${data.name}</h3>
    <p>${data.description}</p>
    <p><strong>Category:</strong> ${data.category}</p>

    <p><strong>Date:</strong><br>
      ${formatDate(data.start)} → ${formatDate(data.end)}
    </p>

    <p><strong>Location:</strong> ${data.location}</p>

    ${data.location ? `
      <iframe
        width="100%"
        height="200"
        style="margin-top:10px;border-radius:10px;"
        src="https://maps.google.com/maps?q=${encodeURIComponent(data.location)}&output=embed">
      </iframe>
    ` : ""}

    <p style="margin-top:10px;">
      <strong>Event Link:</strong><br>
      https://popouttickets.com/${data.link}
    </p>

    <!-- ✅ THIS IS WHERE IT GOES -->
    <h3>Tickets</h3>
    ${renderTicketSummary()}

    <h3 style="margin-top:15px;">
  Grand Total: ${formatMoney(calculateFinalTotal())}
  </h3>

    <h3>Socials</h3>
    <p>🌐 ${data.socials.website || "-"}</p>
    <p>📸 ${data.socials.instagram || "-"}</p>
    <p>🐦 ${data.socials.twitter || "-"}</p>
    <p>🎵 ${data.socials.tiktok || "-"}</p>

    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">

  <button onclick="editTickets()">Edit Tickets</button>

  <button onclick="prev()">Back</button>

  <button type="button" onclick="submit()">Submit</button>

  </div>
  `;
  }
}


function updateMapPreview() {
  const locationInput = document.getElementById("location");
  const mapPreview = document.getElementById("mapPreview");

  if (!locationInput || !mapPreview) return;

  const location = locationInput.value.trim();

  if (!location) {
    mapPreview.innerHTML = `
      <div style="
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#888;
      ">
        Enter a location to see the map
      </div>
    `;

    return;
  }

  const encodedLocation = encodeURIComponent(location);

  mapPreview.innerHTML = `
    <iframe
      src="https://www.google.com/maps?q=${encodedLocation}&output=embed"
      width="100%"
      height="100%"
      style="border:0;"
      loading="lazy"
      allowfullscreen>
    </iframe>
  `;
}
/* ================= REVENUE ================= */
function formatMoney(amount) {
  return "₦" + Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function calculateRevenue() {
  const SERVICE_FEE = 600;

  const app = document.getElementById("app");

  const get = id => {
    const val = app.querySelector(`#${id}`)?.value || "0";
    return Number(val.replace(/,/g, "")) || 0;
  };

  const types = ["early", "regular", "vip"];

  let subtotal = 0;
  let totalQty = 0;

  // ✅ INDIVIDUAL TICKETS (NO FEES)
  types.forEach(t => {
    const price = get(`${t}_price`);
    const qty = get(`${t}_qty`);

    const total = price * qty;

    const el = document.getElementById(`${t}_total`);
    if (el) el.innerText = formatMoney(total);

    subtotal += total;
    totalQty += qty;
  });

  // ✅ APPLY SERVICE FEE ONLY TO GRAND TOTAL
  const feeBearer = document.querySelector('input[name="fee"]:checked')?.value;
  const totalFee = SERVICE_FEE * totalQty;

  let finalTotal = subtotal;

  if (feeBearer === "buyer") {
    finalTotal += totalFee;
  } else if (feeBearer === "organizer") {
    finalTotal -= totalFee;
  }

  // prevent negative
  finalTotal = Math.max(0, finalTotal);

  const overallEl = document.getElementById("overall_total");
  if (overallEl) overallEl.innerText = formatMoney(finalTotal);
}

function uploadFlyer(input) {
  const file = input.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    data.flyer = e.target.result;

    // 🔥 force UI update AFTER image loads
    render();
  };

  reader.readAsDataURL(file);
}

/* ================= TICKET BLOCK ================= */
function ticketBlock(type) {
  return `
    <div style="margin-bottom:20px;padding:15px;border:1px solid #eee;border-radius:10px;">
      
      <h4>${type.toUpperCase()} Ticket</h4>

      <input 
        id="${type}_price" 
        placeholder="Price (₦)" 
        value="${data.tickets[type].price || ""}"
        oninput="handleMoneyInput(this)"
      >

      <input 
        id="${type}_qty" 
        placeholder="Quantity" 
        value="${data.tickets[type].qty || ""}"
        oninput="handleQtyInput(this)"
      >

      <p style="margin-top:10px;">
        Total: <strong id="${type}_total">₦0.00</strong>
      </p>

    </div>
  `;
}
function renderTicketSummary() {
  const types = ["early", "regular", "vip"];

  let html = "";

  types.forEach(t => {
    const price = Number((data.tickets[t].price || 0).toString().replace(/,/g, ""));
    const qty = Number(data.tickets[t].qty || 0);

    if (price > 0 && qty > 0) {
      const total = price * qty;

      html += `
        <p>
          <strong>${t.toUpperCase()}</strong>: 
          ${qty} × ${formatMoney(price)} = 
          <strong>${formatMoney(total)}</strong>
        </p>
      `;
    }
  });

  return html || "<p>No tickets added</p>";
}

function calculateFinalTotal() {
  const SERVICE_FEE = 600;
  const types = ["early", "regular", "vip"];

  let subtotal = 0;
  let totalQty = 0;

  types.forEach(t => {
    const price = Number(
      (data.tickets[t].price || "0").toString().replace(/,/g, "")
    );

    const qty = Number(data.tickets[t].qty || 0);

    subtotal += price * qty;
    totalQty += qty;
  });

  const feeBearer = data.tickets.feeBearer; // ✅ FIXED
  const totalFee = SERVICE_FEE * totalQty;

  let finalTotal = subtotal;

  if (feeBearer === "buyer") {
    finalTotal += totalFee;
  } else if (feeBearer === "organizer") {
    finalTotal -= totalFee;
  }

  return Math.max(0, finalTotal);
}

function editTickets() {
  step = 5; // go back to ticket step
  render();
}

function handleMoneyInput(input) {
  let raw = input.value.replace(/,/g, "").replace(/\D/g, "");

  input.value = raw ? Number(raw).toLocaleString("en-NG") : "";

  // SAVE TO DATA 👇
  const key = input.id.split("_")[0]; // early_price → early
  data.tickets[key].price = raw;

  calculateRevenue();
}
function formatMoney(amount) {
  return "₦" + Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function handleQtyInput(input) {
  const key = input.id.split("_")[0];
  data.tickets[key].qty = input.value;

  calculateRevenue();
}

function setFee(value) {
  data.tickets.feeBearer = value; // ✅ FIXED
  calculateRevenue();
}

function submit() {

    const formData = new FormData();

    // Event Details
    formData.append("flyer", data.flyer);

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);

    // Date
    formData.append("start_date", data.start);
    formData.append("end_date", data.end);

    // Link
    formData.append("link", data.link);

    // Location
    formData.append("location", data.location);

    // Socials
    formData.append("website", data.socials.website);
    formData.append("instagram", data.socials.instagram);
    formData.append("twitter", data.socials.twitter);
    formData.append("tiktok", data.socials.tiktok);

    // Tickets
    formData.append("early_price", data.tickets.early.price);
    formData.append("early_qty", data.tickets.early.qty);

    formData.append("regular_price", data.tickets.regular.price);
    formData.append("regular_qty", data.tickets.regular.qty);

    formData.append("vip_price", data.tickets.vip.price);
    formData.append("vip_qty", data.tickets.vip.qty);

    formData.append("fee_bearer", data.tickets.feeBearer);

    fetch("save_event.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(result => {
        console.log(result);
        alert(result);
    })
    .catch(err => {
        console.error(err);
        alert("Something went wrong.");
    });

}

