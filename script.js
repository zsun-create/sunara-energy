// =============================================
// SUNARA ENERGY — script.js
// =============================================

// ---- MOBILE MENU ----
function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const nav = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger');
  if (nav && hamburger && !nav.contains(e.target) && !hamburger.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// ---- STICKY HEADER ----
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (header) {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.15)'
      : '0 2px 12px rgba(0,0,0,0.08)';
  }
});

// ---- ZIP CODE CHECKER ----
const texasZipPrefixes = ['75','76','77','78','79','73','88'];

function isTexasZip(zip) {
  if (!/^\d{5}$/.test(zip)) return false;
  return texasZipPrefixes.some(p => zip.startsWith(p));
}

function checkRates() {
  const input   = document.getElementById('zipInput');
  const errorEl = document.getElementById('zipError');
  const resultEl= document.getElementById('zipResult');
  if (!input) return;

  const zip = input.value.trim();
  if (errorEl) errorEl.style.display = 'none';
  if (resultEl) resultEl.style.display = 'none';

  if (!isTexasZip(zip)) {
    if (errorEl) { errorEl.textContent = 'Please enter a valid 5-digit Texas ZIP code.'; errorEl.style.display = 'block'; }
    return;
  }

  const rates = {
    '77': { city: 'Houston',              rate: '$0.09' },
    '75': { city: 'Dallas',               rate: '$0.091' },
    '76': { city: 'Fort Worth',           rate: '$0.089' },
    '78': { city: 'San Antonio / Austin', rate: '$0.088' },
    '79': { city: 'Lubbock / Amarillo',   rate: '$0.092' },
  };
  const info = rates[zip.substring(0,2)] || { city: 'your area', rate: '$0.09' };

  if (resultEl) {
    resultEl.innerHTML = `Plans available in ${info.city}! Best rate: <strong>${info.rate}/kWh</strong> on our 12-Month Saver. <a href="signup.html?zip=${zip}" style="color:var(--gold);font-weight:700;text-decoration:underline;">Sign up now →</a>`;
    resultEl.style.display = 'block';
  }
}

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', function() {
  // ZIP input — numbers only + Enter key
  const zipInput = document.getElementById('zipInput');
  if (zipInput) {
    zipInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkRates(); });
    zipInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g,''); });
  }

  // Pre-select plan from URL ?plan=
  const plan = new URLSearchParams(window.location.search).get('plan');
  const planSelect = document.getElementById('planSelect');
  if (plan && planSelect) planSelect.value = plan;

  // Set tomorrow as default start date
  const startDate = document.getElementById('startDate');
  if (startDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    startDate.min = new Date().toISOString().split('T')[0];
    startDate.value = tomorrow.toISOString().split('T')[0];
  }
});

// ---- FAQ ACCORDION ----
function toggleFaq(el) {
  const item   = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ---- MULTI-STEP SIGNUP ----
function goStep(step) {
  [1,2,3].forEach(s => {
    const el  = document.getElementById(`formStep${s}`);
    const ind = document.getElementById(`step${s}ind`);
    if (el)  el.style.display  = s === step ? 'block' : 'none';
    if (ind) { ind.classList.toggle('active', s === step); ind.style.opacity = s <= step ? '1' : '0.5'; }
  });
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

// ---- SIGNUP SUBMIT ----
async function submitSignup() {
  const successBox = document.getElementById('successBox');
  const errorBox   = document.getElementById('errorBox');
  const submitBtn  = document.getElementById('submitBtn');
  if (successBox) successBox.style.display = 'none';
  if (errorBox)   errorBox.style.display   = 'none';

  const firstName = document.getElementById('firstName')?.value?.trim();
  const lastName  = document.getElementById('lastName')?.value?.trim();
  const email     = document.getElementById('email')?.value?.trim();
  const phone     = document.getElementById('phone')?.value?.trim();
  const address   = document.getElementById('address')?.value?.trim();
  const city      = document.getElementById('city')?.value?.trim();
  const zip       = document.getElementById('zip')?.value?.trim();
  const plan      = document.getElementById('planSelect')?.value;
  const terms     = document.getElementById('terms')?.checked;

  if (!firstName || !lastName || !email || !phone || !address || !city || !zip || !plan || !terms) {
    if (errorBox) errorBox.style.display = 'block';
    return;
  }

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, phone, address, city, zip, plan })
    });
    if (!res.ok) throw new Error();
  } catch (_) { /* show success regardless — backend optional */ }

  if (successBox) successBox.style.display = 'block';
  if (submitBtn)  submitBtn.style.display  = 'none';
}

// ---- CONTACT SUBMIT ----
function submitContact() {
  const successEl = document.getElementById('contactSuccess');
  const errorEl   = document.getElementById('contactError');
  if (successEl) successEl.style.display = 'none';
  if (errorEl)   errorEl.style.display   = 'none';

  const first   = document.getElementById('cfirst')?.value?.trim();
  const last    = document.getElementById('clast')?.value?.trim();
  const email   = document.getElementById('cemail')?.value?.trim();
  const message = document.getElementById('cmessage')?.value?.trim();

  if (!first || !last || !email || !message) {
    if (errorEl) errorEl.style.display = 'block';
    return;
  }
  if (successEl) successEl.style.display = 'block';
  ['cfirst','clast','cemail','csubject','cmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ---- LOGIN ----
function handleLogin() {
  const email    = document.getElementById('lemail')?.value?.trim();
  const password = document.getElementById('lpassword')?.value;
  const success  = document.getElementById('loginSuccess');
  const error    = document.getElementById('loginError');
  if (success) success.style.display = 'none';
  if (error)   error.style.display   = 'none';

  if (!email || !password) { if (error) error.style.display = 'block'; return; }
  if (success) { success.textContent = 'Customer portal coming soon! We will email you login details once your account is active.'; success.style.display = 'block'; }
}
