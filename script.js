// =============================================
// SUNARA ENERGY — script.js
// =============================================

// ---- SIGNUP TYPE TOGGLE (Residential vs Business) ----
function setSignupType(type) {
  const isRes = type === 'residential';
  document.getElementById('typeResBtn')?.classList.toggle('active', isRes);
  document.getElementById('typeBizBtn')?.classList.toggle('active', !isRes);
  document.getElementById('residentialForm').style.display = isRes ? 'block' : 'none';
  document.getElementById('businessForm').style.display    = isRes ? 'none'  : 'block';
  const title = document.getElementById('signupHeroTitle');
  const sub   = document.getElementById('signupHeroSub');
  if (title) title.textContent = isRes ? 'Start Your Residential Service' : 'Request a Business Quote';
  if (sub)   sub.textContent   = isRes ? 'Create your account and get power turned on fast. No hidden fees ever.' : 'Fill out the form below and a commercial specialist will contact you within 1 business day.';
}

// ---- PLAN DETAIL CARD ----
const allPlans = [
  { value: 'flex',    name: 'Flex Plan',        rate: '$0.11/kWh', desc: 'No contract, cancel anytime. Best for flexibility.' },
  { value: '12month', name: '12-Month Saver',    rate: '$0.09/kWh', desc: 'Fixed rate for 12 months. Save up to 18% vs. month-to-month.' },
  { value: '24month', name: '24-Month Ultra',    rate: '$0.085/kWh', desc: 'Lowest rate guaranteed for 2 full years. Best long-term value.' },
];

function onPlanChange() {
  const select = document.getElementById('planSelect');
  const detail = document.getElementById('planDetail');
  if (!select || !detail) return;
  const chosen = allPlans.find(p => p.value === select.value);
  if (chosen) {
    document.getElementById('planDetailName').textContent = chosen.name;
    document.getElementById('planDetailRate').textContent = chosen.rate;
    document.getElementById('planDetailDesc').textContent = chosen.desc;
    detail.style.display = 'block';
  } else {
    detail.style.display = 'none';
  }
}

// ---- PASSWORD TOGGLE ----
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  if (icon) icon.textContent = input.type === 'password' ? '👁' : '🙈';
}

// ---- PASSWORD STRENGTH ----
function checkPasswordStrength(pw) {
  const el = document.getElementById('passwordStrength');
  if (!el) return;
  if (!pw) { el.textContent = ''; return; }
  let s = 0;
  if (pw.length >= 8)            s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  el.textContent = 'Password strength: ' + (['','🔴 Weak','🟡 Fair','🟠 Good','🟢 Strong'][s] || '');
}

// ---- STEP VALIDATION ----
function validateStep1() {
  const first  = document.getElementById('firstName')?.value?.trim();
  const last   = document.getElementById('lastName')?.value?.trim();
  const email  = document.getElementById('email')?.value?.trim();
  const phone  = document.getElementById('phone')?.value?.trim();
  const pw     = document.getElementById('password')?.value;
  const pwConf = document.getElementById('confirmPassword')?.value;
  const err    = document.getElementById('step1Error');
  if (!first || !last || !email || !phone || !pw || !pwConf) { err.textContent = '⚠️ Please fill in all fields.'; err.style.display = 'block'; return; }
  if (pw.length < 8) { err.textContent = '⚠️ Password must be at least 8 characters.'; err.style.display = 'block'; return; }
  if (pw !== pwConf) { err.textContent = '⚠️ Passwords do not match.'; err.style.display = 'block'; return; }
  err.style.display = 'none';
  goStep(2);
}

function validateStep2() {
  const address = document.getElementById('address')?.value?.trim();
  const city    = document.getElementById('city')?.value?.trim();
  const zip     = document.getElementById('zip')?.value?.trim();
  const err     = document.getElementById('step2Error');
  if (!address || !city || !zip) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  goStep(3);
}

// ---- PLAN TABS ----
function switchTab(type, btn) {
  if (btn) {
    btn.closest('.plan-tabs').querySelectorAll('.plan-tab').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
  }
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  const tab = document.getElementById('tab-' + type);
  if (tab) tab.style.display = 'block';
}

// ---- ZIP RESULTS TAB SWITCH ----
function switchZipTab(type, btn) {
  if (btn) {
    btn.closest('.plan-tabs').querySelectorAll('.plan-tab').forEach(el => {
      el.classList.remove('active');
      el.style.color = 'rgba(255,255,255,0.6)';
    });
    btn.classList.add('active');
    btn.style.color = 'white';
  }
  document.getElementById('zip-tab-residential').style.display = type === 'residential' ? 'grid' : 'none';
  document.getElementById('zip-tab-business').style.display    = type === 'business'    ? 'block' : 'none';
}

// ---- MOBILE MENU ----
let menuJustOpened = false;
function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  if (!nav.classList.contains('open')) {
    nav.classList.add('open');
    menuJustOpened = true;
    setTimeout(() => { menuJustOpened = false; }, 50);
  } else {
    nav.classList.remove('open');
  }
}
document.addEventListener('click', function(e) {
  if (menuJustOpened) return;
  const nav       = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger');
  if (nav && hamburger && !nav.contains(e.target) && !hamburger.contains(e.target)) nav.classList.remove('open');
});

// ---- STICKY HEADER ----
window.addEventListener('scroll', function() {
  const header = document.getElementById('header');
  if (header) header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.08)';
});

// ---- ZIP RATES ----
const zipRates = {
  '77': { city: 'Houston',              res: { flex: '$0.110', saver: '$0.090', ultra: '$0.085' } },
  '75': { city: 'Dallas',               res: { flex: '$0.112', saver: '$0.092', ultra: '$0.087' } },
  '76': { city: 'Fort Worth',           res: { flex: '$0.109', saver: '$0.089', ultra: '$0.084' } },
  '78': { city: 'San Antonio / Austin', res: { flex: '$0.108', saver: '$0.088', ultra: '$0.083' } },
  '79': { city: 'Lubbock / Amarillo',   res: { flex: '$0.113', saver: '$0.093', ultra: '$0.088' } },
  '73': { city: 'North Texas',          res: { flex: '$0.111', saver: '$0.091', ultra: '$0.086' } },
  '88': { city: 'West Texas',           res: { flex: '$0.114', saver: '$0.094', ultra: '$0.089' } },
};
const texasZipPrefixes = ['75','76','77','78','79','73','88'];

function isTexasZip(zip) {
  if (!/^\d{5}$/.test(zip)) return false;
  return texasZipPrefixes.some(p => zip.startsWith(p));
}

function checkRates() {
  const input   = document.getElementById('zipInput');
  const errorEl = document.getElementById('zipError');
  if (!input) return;
  const zip = input.value.trim();
  if (errorEl) errorEl.style.display = 'none';
  if (!isTexasZip(zip)) {
    if (errorEl) { errorEl.textContent = 'Please enter a valid 5-digit Texas ZIP code.'; errorEl.style.display = 'block'; }
    return;
  }
  const info = zipRates[zip.substring(0,2)] || zipRates['77'];
  const badge = document.getElementById('zipResultsBadge');
  if (badge) badge.textContent = '📍 ZIP Code: ' + zip + '  ·  ' + info.city + ' Area';
  const setEl   = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
  const setHref = (id, h)   => { const el = document.getElementById(id); if (el) el.href = h; };
  setEl('flexRate',    info.res.flex  + '<span>/kWh</span>');
  setEl('saver12Rate', info.res.saver + '<span>/kWh</span>');
  setEl('ultra24Rate', info.res.ultra + '<span>/kWh</span>');
  setHref('flexLink',    'signup.html?type=residential&plan=flex&zip='    + zip);
  setHref('saver12Link', 'signup.html?type=residential&plan=12month&zip=' + zip);
  setHref('ultra24Link', 'signup.html?type=residential&plan=24month&zip=' + zip);
  const section = document.getElementById('zipResultsSection');
  if (section) { section.style.display = 'block'; setTimeout(() => section.scrollIntoView({ behavior:'smooth', block:'start' }), 50); }
  switchZipTab('residential', document.getElementById('zipResTab'));
}

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', function() {
  const zipInput = document.getElementById('zipInput');
  if (zipInput) {
    zipInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkRates(); });
    zipInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g,''); });
  }
  const params = new URLSearchParams(window.location.search);
  const type   = params.get('type') || 'residential';
  const plan   = params.get('plan');
  // Init signup page type
  if (document.getElementById('residentialForm')) setSignupType(type);
  // Pre-select plan
  const planSelect = document.getElementById('planSelect');
  if (planSelect && plan) { planSelect.value = plan; onPlanChange(); }
  // Password strength
  const pwInput = document.getElementById('password');
  if (pwInput) pwInput.addEventListener('input', function() { checkPasswordStrength(this.value); });
  // Plan change listener
  if (planSelect) planSelect.addEventListener('change', onPlanChange);
  // Start date
  const startDate = document.getElementById('startDate');
  if (startDate) {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    startDate.min   = new Date().toISOString().split('T')[0];
    startDate.value = tomorrow.toISOString().split('T')[0];
  }
  // Hash-based tab open on plans page
  if (window.location.hash === '#business') {
    const bizBtn = document.querySelector('.plan-tab:nth-child(2)');
    if (bizBtn) switchTab('business', bizBtn);
  }
});

// ---- MULTI-STEP ----
function goStep(step) {
  [1,2,3].forEach(s => {
    const el  = document.getElementById('formStep' + s);
    const ind = document.getElementById('step' + s + 'ind');
    if (el)  el.style.display = s === step ? 'block' : 'none';
    if (ind) { ind.classList.toggle('active', s === step); ind.style.opacity = s <= step ? '1' : '0.5'; }
  });
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

// ---- RESIDENTIAL SIGNUP SUBMIT ----
async function submitSignup() {
  const plan  = document.getElementById('planSelect')?.value;
  const terms = document.getElementById('terms')?.checked;
  const err   = document.getElementById('step3Error');
  if (!plan || !terms) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  const btn = document.getElementById('submitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating Account...'; }
  const email = document.getElementById('email')?.value?.trim();
  try {
    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: document.getElementById('firstName')?.value?.trim(),
        lastName:  document.getElementById('lastName')?.value?.trim(),
        email, phone: document.getElementById('phone')?.value?.trim(),
        address: document.getElementById('address')?.value?.trim(),
        city:    document.getElementById('city')?.value?.trim(),
        zip:     document.getElementById('zip')?.value?.trim(),
        plan, type: 'residential'
      })
    });
  } catch (_) {}
  const confirmEmail = document.getElementById('confirmEmail');
  if (confirmEmail) confirmEmail.textContent = email;
  document.getElementById('successBox').style.display = 'block';
  if (btn) btn.style.display = 'none';
}

// ---- BUSINESS QUOTE SUBMIT (signup page) ----
function submitBizQuote() {
  const first = document.getElementById('bqFirst')?.value?.trim();
  const last  = document.getElementById('bqLast')?.value?.trim();
  const co    = document.getElementById('bqCompany')?.value?.trim();
  const phone = document.getElementById('bqPhone')?.value?.trim();
  const email = document.getElementById('bqEmail')?.value?.trim();
  const bill  = document.getElementById('bqBill')?.value;
  const ack   = document.getElementById('bqAck')?.checked;
  const err   = document.getElementById('bizQuoteError');
  if (!first || !last || !co || !phone || !email || !bill || !ack) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  document.getElementById('bizQuoteBody').style.display    = 'none';
  document.getElementById('bizQuoteSuccess').style.display = 'block';
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
  if (!first || !last || !email || !message) { if (errorEl) errorEl.style.display = 'block'; return; }
  if (successEl) successEl.style.display = 'block';
  ['cfirst','clast','cemail','csubject','cmessage'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
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

// ---- FAQ ----
function toggleFaq(el) {
  const item   = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
