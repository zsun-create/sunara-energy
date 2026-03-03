// =============================================
// SUNARA ENERGY — script.js
// =============================================

// ---- CUSTOMER TYPE ----
let customerType = 'residential';

const residentialPlans = [
  { value: 'flex',    label: 'Flex Plan – $0.11/kWh (Month-to-Month)' },
  { value: '12month', label: '12-Month Saver – $0.09/kWh (Most Popular)' },
  { value: '24month', label: '24-Month Ultra – $0.085/kWh (Best Value)' },
];
const businessPlans = [
  { value: 'biz-starter', label: 'Business Starter – $0.10/kWh (Month-to-Month)' },
  { value: 'biz-pro',     label: 'Business Pro – $0.083/kWh (12-Month, Most Popular)' },
  { value: 'biz-elite',   label: 'Business Elite – Custom Rate (24-Month)' },
];

function setCustomerType(type) {
  customerType = type;
  const isRes = type === 'residential';
  document.getElementById('typeResBtn')?.classList.toggle('active', isRes);
  document.getElementById('typeBizBtn')?.classList.toggle('active', !isRes);
  const bizGroup = document.getElementById('bizNameGroup');
  if (bizGroup) bizGroup.style.display = isRes ? 'none' : 'block';
  const dobGroup = document.getElementById('dobGroup');
  if (dobGroup) dobGroup.style.display = isRes ? 'block' : 'none';
  populatePlans(type);
  const heroTitle = document.getElementById('signupHeroTitle');
  if (heroTitle) heroTitle.textContent = isRes ? 'Start Your Residential Service' : 'Start Your Business Service';
}

function populatePlans(type) {
  const select = document.getElementById('planSelect');
  if (!select) return;
  const plans = type === 'business' ? businessPlans : residentialPlans;
  select.innerHTML = '<option value="">-- Choose a plan --</option>';
  plans.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.value;
    opt.textContent = p.label;
    select.appendChild(opt);
  });
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
  document.getElementById('zip-tab-business').style.display    = type === 'business'    ? 'grid' : 'none';
}

// ---- MOBILE MENU ----
let menuJustOpened = false;

function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  const isOpen = nav.classList.contains('open');
  if (!isOpen) {
    nav.classList.add('open');
    menuJustOpened = true;
    setTimeout(() => { menuJustOpened = false; }, 50);
  } else {
    nav.classList.remove('open');
  }
}

document.addEventListener('click', function(e) {
  if (menuJustOpened) return;
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

// ---- ZIP RATES BY AREA ----
const zipRates = {
  '77': { city: 'Houston',              res: { flex: '$0.110', saver: '$0.090', ultra: '$0.085' }, biz: { starter: '$0.100', pro: '$0.083' } },
  '75': { city: 'Dallas',               res: { flex: '$0.112', saver: '$0.092', ultra: '$0.087' }, biz: { starter: '$0.102', pro: '$0.085' } },
  '76': { city: 'Fort Worth',           res: { flex: '$0.109', saver: '$0.089', ultra: '$0.084' }, biz: { starter: '$0.099', pro: '$0.082' } },
  '78': { city: 'San Antonio / Austin', res: { flex: '$0.108', saver: '$0.088', ultra: '$0.083' }, biz: { starter: '$0.098', pro: '$0.081' } },
  '79': { city: 'Lubbock / Amarillo',   res: { flex: '$0.113', saver: '$0.093', ultra: '$0.088' }, biz: { starter: '$0.103', pro: '$0.086' } },
  '73': { city: 'North Texas',          res: { flex: '$0.111', saver: '$0.091', ultra: '$0.086' }, biz: { starter: '$0.101', pro: '$0.084' } },
  '88': { city: 'West Texas',           res: { flex: '$0.114', saver: '$0.094', ultra: '$0.089' }, biz: { starter: '$0.104', pro: '$0.087' } },
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

  const prefix = zip.substring(0, 2);
  const info   = zipRates[prefix] || zipRates['77'];

  // Update badge
  const badge = document.getElementById('zipResultsBadge');
  if (badge) badge.textContent = '📍 ZIP Code: ' + zip + '  ·  ' + info.city + ' Area';

  // Update residential rates & links
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
  setEl('flexRate',    info.res.flex + '<span>/kWh</span>');
  setEl('saver12Rate', info.res.saver + '<span>/kWh</span>');
  setEl('ultra24Rate', info.res.ultra + '<span>/kWh</span>');

  // Update business rates
  setEl('bizStarterRate', info.biz.starter + '<span>/kWh</span>');
  setEl('bizProRate',     info.biz.pro + '<span>/kWh</span>');

  // Update signup links with ZIP
  const setHref = (id, href) => { const el = document.getElementById(id); if (el) el.href = href; };
  setHref('flexLink',      'signup.html?type=residential&plan=flex&zip=' + zip);
  setHref('saver12Link',   'signup.html?type=residential&plan=12month&zip=' + zip);
  setHref('ultra24Link',   'signup.html?type=residential&plan=24month&zip=' + zip);
  setHref('bizStarterLink','signup.html?type=business&plan=biz-starter&zip=' + zip);
  setHref('bizProLink',    'signup.html?type=business&plan=biz-pro&zip=' + zip);

  // Show results section and scroll to it
  const section = document.getElementById('zipResultsSection');
  section.style.display = 'block';
  setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

  // Reset to residential tab
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

  setCustomerType(type);
  if (plan) {
    const planSelect = document.getElementById('planSelect');
    if (planSelect) planSelect.value = plan;
  }

  const startDate = document.getElementById('startDate');
  if (startDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    startDate.min   = new Date().toISOString().split('T')[0];
    startDate.value = tomorrow.toISOString().split('T')[0];
  }

  if (window.location.hash === '#business') {
    const bizBtn = document.querySelector('.plan-tab:nth-child(2)');
    if (bizBtn) switchTab('business', bizBtn);
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
    const el  = document.getElementById('formStep' + s);
    const ind = document.getElementById('step' + s + 'ind');
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
      body: JSON.stringify({ firstName, lastName, email, phone, address, city, zip, plan, type: customerType })
    });
    if (!res.ok) throw new Error();
  } catch (_) {}

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
  if (!email || !password) { if (
