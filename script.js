// =============================================
// SUNARA ENERGY — script.js
// =============================================

// ---- EMAILJS CONFIG ----
const EMAILJS_SERVICE_ID  = 'service_as5x5ok';
const EMAILJS_TEMPLATE_ID = 'template_zm481zr';
const EMAILJS_PUBLIC_KEY  = 'EhKjmL0KVGWvwc0MY';

// ---- TOAST NOTIFICATION SYSTEM ----
let _toastTimer;
function showToast(type, title, msg) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastIcon').textContent  = icons[type] || 'ℹ️';
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent   = msg;
  toast.className = 'toast ' + type;
  void toast.offsetWidth; // force reflow for animation restart
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(hideToast, 5000);
}
function hideToast() {
  const toast = document.getElementById('toast');
  if (toast) toast.classList.remove('show');
}

// ---- SIGNUP TYPE TOGGLE ----
function setSignupType(type) {
  const isRes = type === 'residential';
  document.getElementById('typeResBtn')?.classList.toggle('active', isRes);
  document.getElementById('typeBizBtn')?.classList.toggle('active', !isRes);
  document.getElementById('residentialForm').style.display = isRes ? 'block' : 'none';
  document.getElementById('businessForm').style.display    = isRes ? 'none'  : 'block';
  const title = document.getElementById('signupHeroTitle');
  const sub   = document.getElementById('signupHeroSub');
  if (title) title.textContent = isRes ? 'Start Your Residential Service' : 'Request a Commercial Quote';
  if (sub)   sub.textContent   = isRes ? 'Create your account and get power turned on fast.' : 'Fill out the form and a specialist will contact you within 1 business day.';
}

// ---- PLAN DETAIL CARD ----
const allPlans = [
  { value: '6month',  name: '6-Month Plan',   rate: '$0.10/kWh',  desc: 'Short-term fixed rate. Great for flexibility with savings.' },
  { value: '12month', name: '12-Month Saver', rate: '$0.09/kWh',  desc: 'Fixed rate for 12 months. Save up to 10% vs. 6-month plan.' },
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
  if (icon) icon.textContent = input.type === 'password' ? 'Show' : 'Hide';
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
  const labels = ['', 'Weak 🔴', 'Fair 🟡', 'Good 🟢', 'Strong 💪'];
  el.textContent = pw ? 'Password strength: ' + (labels[s] || '') : '';
}

// ---- STEP VALIDATION ----
function validateStep1() {
  const first  = document.getElementById('firstName')?.value?.trim();
  const last   = document.getElementById('lastName')?.value?.trim();
  const email  = document.getElementById('email')?.value?.trim();
  const phone  = document.getElementById('phone')?.value?.trim();
  const pw     = document.getElementById('password')?.value;
  const pwConf = document.getElementById('confirmPassword')?.value;

  if (!first || !last || !email || !phone || !pw || !pwConf) {
    showToast('error', 'Missing Fields', 'Please fill in all required fields.');
    return;
  }
  if (pw.length < 8) {
    showToast('error', 'Weak Password', 'Password must be at least 8 characters.');
    return;
  }
  if (pw !== pwConf) {
    showToast('error', 'Passwords Don\'t Match', 'Please make sure both passwords are identical.');
    return;
  }
  goStep(2);
}

function validateStep2() {
  const address = document.getElementById('address')?.value?.trim();
  const city    = document.getElementById('city')?.value?.trim();
  const zip     = document.getElementById('zip')?.value?.trim();

  if (!address || !city || !zip) {
    showToast('error', 'Missing Address', 'Please fill in all address fields.');
    return;
  }
  goStep(3);
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
  '77': { city: 'Houston Area',       res: { flex: '$0.110', saver: '$0.090', ultra: '$0.085' } },
  '75': { city: 'Dallas Area',        res: { flex: '$0.112', saver: '$0.092', ultra: '$0.087' } },
  '76': { city: 'Fort Worth Area',    res: { flex: '$0.109', saver: '$0.089', ultra: '$0.084' } },
  '78': { city: 'Central South Area', res: { flex: '$0.108', saver: '$0.088', ultra: '$0.083' } },
  '79': { city: 'West Central Area',  res: { flex: '$0.113', saver: '$0.093', ultra: '$0.088' } },
  '73': { city: 'North Central Area', res: { flex: '$0.111', saver: '$0.091', ultra: '$0.086' } },
  '88': { city: 'Southwest Area',     res: { flex: '$0.114', saver: '$0.094', ultra: '$0.089' } },
  '30': { city: 'Southeast Area',     res: { flex: '$0.112', saver: '$0.092', ultra: '$0.087' } },
  '60': { city: 'Midwest Area',       res: { flex: '$0.110', saver: '$0.090', ultra: '$0.085' } },
  '10': { city: 'Northeast Area',     res: { flex: '$0.115', saver: '$0.095', ultra: '$0.090' } },
  '90': { city: 'West Coast Area',    res: { flex: '$0.116', saver: '$0.096', ultra: '$0.091' } },
  '85': { city: 'Southwest Area',     res: { flex: '$0.111', saver: '$0.091', ultra: '$0.086' } },
  '33': { city: 'Southeast Area',     res: { flex: '$0.113', saver: '$0.093', ultra: '$0.088' } },
  '98': { city: 'Pacific Northwest',  res: { flex: '$0.114', saver: '$0.094', ultra: '$0.089' } },
};

function getZipInfo(zip) {
  return zipRates[zip.substring(0,2)] || zipRates[zip.substring(0,1)] || { city: 'Your Area', res: { flex: '$0.111', saver: '$0.091', ultra: '$0.086' } };
}

function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

// ---- CHECK RATES (residential.html) ----
function checkRates() {
  const input   = document.getElementById('zipInput');
  const errorEl = document.getElementById('zipError');
  if (!input) return;
  const zip = input.value.trim();
  if (errorEl) errorEl.style.display = 'none';
  if (!isValidZip(zip)) {
    if (errorEl) { errorEl.textContent = 'Please enter a valid 5-digit ZIP code.'; errorEl.style.display = 'block'; }
    return;
  }
  const info  = getZipInfo(zip);
  const badge = document.getElementById('zipResultsBadge');
  if (badge) badge.textContent = 'ZIP Code: ' + zip + '  —  ' + info.city;
  const setEl   = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
  const setHref = (id, h)   => { const el = document.getElementById(id); if (el) el.href = h; };
  setEl('flexRate',    info.res.flex  + '<span>/kWh</span>');
  setEl('saver12Rate', info.res.saver + '<span>/kWh</span>');
  setEl('ultra24Rate', info.res.ultra + '<span>/kWh</span>');
  setHref('flexLink',    'signup.html?plan=flex&zip='    + zip);
  setHref('saver12Link', 'signup.html?plan=12month&zip=' + zip);
  setHref('ultra24Link', 'signup.html?plan=24month&zip=' + zip);
  const setTableEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTableEl('tableFlexRate',  info.res.flex);
  setTableEl('tableSaverRate', info.res.saver);
  setTableEl('tableUltraRate', info.res.ultra);
  const overview     = document.getElementById('planOverview');
  const results      = document.getElementById('zipResultsSection');
  const tableDefault = document.getElementById('tableDefault');
  const tableZip     = document.getElementById('tableZip');
  if (overview)     overview.style.display     = 'none';
  if (results)      results.style.display      = 'block';
  if (tableDefault) tableDefault.style.display = 'none';
  if (tableZip)     tableZip.style.display     = 'block';
  setTimeout(() => results.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

// ---- RESET ZIP ----
function resetZip() {
  const overview     = document.getElementById('planOverview');
  const results      = document.getElementById('zipResultsSection');
  const tableDefault = document.getElementById('tableDefault');
  const tableZip     = document.getElementById('tableZip');
  if (results)      results.style.display      = 'none';
  if (overview)     overview.style.display      = 'block';
  if (tableDefault) tableDefault.style.display  = 'block';
  if (tableZip)     tableZip.style.display      = 'none';
  const input = document.getElementById('zipInput');
  if (input) input.value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- CHECK RATES HOME ----
function checkRatesHome() {
  const input   = document.getElementById('zipInput');
  const errorEl = document.getElementById('zipError');
  if (!input) return;
  const zip = input.value.trim();
  if (errorEl) errorEl.style.display = 'none';
  if (!isValidZip(zip)) {
    if (errorEl) { errorEl.textContent = 'Please enter a valid 5-digit ZIP code.'; errorEl.style.display = 'block'; }
    return;
  }
  window.location.href = 'residential.html?zip=' + zip;
}

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', function() {
  const params   = new URLSearchParams(window.location.search);
  const zipParam = params.get('zip');
  const zipInput = document.getElementById('zipInput');

  if (zipParam && zipInput) {
    zipInput.value = zipParam;
    checkRates();
  }

  if (zipInput) {
    zipInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (window.location.pathname.includes('residential')) checkRates();
        else checkRatesHome();
      }
    });
    zipInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g, ''); });
  }

  const type = params.get('type') || 'residential';
  const plan = params.get('plan');
  if (document.getElementById('residentialForm')) setSignupType(type);
  const planSelect = document.getElementById('planSelect');
  if (planSelect && plan) { planSelect.value = plan; onPlanChange(); }
  if (planSelect) planSelect.addEventListener('change', onPlanChange);
  const pwInput = document.getElementById('password');
  if (pwInput) pwInput.addEventListener('input', function() { checkPasswordStrength(this.value); });
  const startDate = document.getElementById('startDate');
  if (startDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    startDate.min   = new Date().toISOString().split('T')[0];
    startDate.value = tomorrow.toISOString().split('T')[0];
  }

  // ---- PERSISTENT LOGIN: Update header nav if logged in ----
  const token = localStorage.getItem('sunara_token');
  const user  = localStorage.getItem('sunara_user');
  if (token && user) {
    try {
      const u = JSON.parse(user);
      // Update "Log In" links to "My Dashboard"
      document.querySelectorAll('a[href="login.html"]').forEach(el => {
        if (el.textContent.trim() === 'Log In' || el.classList.contains('btn-outline')) {
          el.href = 'dashboard.html';
          el.textContent = 'My Dashboard';
        }
      });
      // Update top bar
      const topBarLogin = document.querySelector('.top-bar-login');
      if (topBarLogin) {
        topBarLogin.href = 'dashboard.html';
        topBarLogin.textContent = 'My Dashboard →';
      }
    } catch (_) {}
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

  if (!plan) {
    showToast('error', 'No Plan Selected', 'Please choose a plan before continuing.');
    return;
  }
  if (!terms) {
    showToast('warning', 'Terms Required', 'Please accept the Terms of Service to continue.');
    return;
  }

  const btn = document.getElementById('submitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating Account...'; }

  const email       = document.getElementById('email')?.value?.trim();
  const password    = document.getElementById('password')?.value;
  const firstName   = document.getElementById('firstName')?.value?.trim();
  const lastName    = document.getElementById('lastName')?.value?.trim();
  const phone       = document.getElementById('phone')?.value?.trim();
  const address     = document.getElementById('address')?.value?.trim();
  const city        = document.getElementById('city')?.value?.trim();
  const zip         = document.getElementById('zip')?.value?.trim();
  const startDate   = document.getElementById('startDate')?.value;
  const serviceType = document.getElementById('serviceType')?.value;

  try {
    const res  = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, phone, dateOfBirth: '', address, city, zip, serviceType, startDate, plan })
    });
    const data = await res.json();

    // Save token if returned from signup API
if (data.accessToken) {
  localStorage.setItem('sunara_token', data.accessToken);
  localStorage.setItem('sunara_user', JSON.stringify({ email: data.email || email, userId: data.userId }));
}

    if (!res.ok) {
      showToast('error', 'Signup Failed', data.error || 'Something went wrong. Please try again.');
      if (btn) { btn.disabled = false; btn.textContent = 'Create Account & Submit'; }
      return;
    }

    // Send welcome email
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        firstName, lastName, company: 'N/A', phone, email,
        bill: plan, comments: 'Residential signup — ' + address + ', ' + city + ' ' + zip,
        time: new Date().toLocaleString()
      }, EMAILJS_PUBLIC_KEY);
    } catch (_) {}

    // Hide all steps + step indicators
    [1,2,3].forEach(s => {
      const el  = document.getElementById('formStep' + s);
      const ind = document.getElementById('step' + s + 'ind');
      if (el)  el.style.display = 'none';
      if (ind) ind.style.display = 'none';
    });

    // Show success screen
    const successEl = document.getElementById('signupSuccess');
    const confirmEl = document.getElementById('confirmEmail');
    if (confirmEl) confirmEl.textContent = email;
    if (successEl) successEl.style.display = 'block';

    // Scroll to success
    setTimeout(() => {
      if (successEl) successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    showToast('success', 'Account Created!', 'Welcome to Sunara Energy, ' + firstName + '!');

  } catch (e) {
    showToast('error', 'Connection Error', 'Something went wrong. Please try again.');
    if (btn) { btn.disabled = false; btn.textContent = 'Create Account & Submit'; }
  }
}

// ---- SHARED QUOTE SUBMIT ----
async function sendQuote(fields, bodyId, successId) {
  const { first, last, company, phone, email, bill, comments, ack } = fields;
  if (!first || !last || !company || !phone || !email || !bill || !ack) {
    showToast('error', 'Missing Fields', 'Please fill in all required fields and check the acknowledgment box.');
    return;
  }
  const btn = document.querySelector('#' + bodyId + ' .btn-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      firstName: first, lastName: last,
      company, phone, email, bill,
      comments: comments || 'None',
      time: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }) + ' CT'
    }, EMAILJS_PUBLIC_KEY);
  } catch (e) { console.error('EmailJS error:', e); }
  try {
    await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: first, lastName: last, company, phone, email, bill, comments: comments || '' })
    });
  } catch (_) {}
  document.getElementById(bodyId).style.display    = 'none';
  document.getElementById(successId).style.display = 'block';
  showToast('success', 'Request Submitted!', 'A specialist will contact you within 1 business day.');
}

// ---- COMMERCIAL PAGE QUOTE ----
function submitCommQuote() {
  sendQuote({
    first:    document.getElementById('cqFirst')?.value?.trim(),
    last:     document.getElementById('cqLast')?.value?.trim(),
    company:  document.getElementById('cqCompany')?.value?.trim(),
    phone:    document.getElementById('cqPhone')?.value?.trim(),
    email:    document.getElementById('cqEmail')?.value?.trim(),
    bill:     document.getElementById('cqBill')?.value,
    comments: document.getElementById('cqComments')?.value?.trim(),
    ack:      document.getElementById('cqAck')?.checked,
  }, 'commQuoteBody', 'commQuoteSuccess');
}

// ---- SIGNUP PAGE BUSINESS QUOTE ----
function submitBizQuote() {
  sendQuote({
    first:    document.getElementById('bqFirst')?.value?.trim(),
    last:     document.getElementById('bqLast')?.value?.trim(),
    company:  document.getElementById('bqCompany')?.value?.trim(),
    phone:    document.getElementById('bqPhone')?.value?.trim(),
    email:    document.getElementById('bqEmail')?.value?.trim(),
    bill:     document.getElementById('bqBill')?.value,
    comments: document.getElementById('bqComments')?.value?.trim(),
    ack:      document.getElementById('bqAck')?.checked,
  }, 'bizQuoteBody', 'bizQuoteSuccess');
}

// ---- CONTACT SUBMIT ----
function submitContact() {
  const first   = document.getElementById('cfirst')?.value?.trim();
  const last    = document.getElementById('clast')?.value?.trim();
  const email   = document.getElementById('cemail')?.value?.trim();
  const message = document.getElementById('cmessage')?.value?.trim();
  if (!first || !last || !email || !message) {
    showToast('error', 'Missing Fields', 'Please fill in all required fields.');
    return;
  }
  showToast('success', 'Message Sent!', 'We\'ll get back to you within 1 business day.');
  ['cfirst','clast','cemail','csubject','cmessage'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

// ---- LOGIN (used on login.html — overridden inline there, kept here as fallback) ----
async function handleLogin() {
  const email    = document.getElementById('lemail')?.value?.trim();
  const password = document.getElementById('lpassword')?.value;
  const btn      = document.getElementById('loginBtn');

  if (!email || !password) {
    showToast('error', 'Missing Fields', 'Please enter your email and password.');
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = 'Logging in...'; }
  try {
    const res  = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast('error', 'Login Failed', data.error || 'Invalid email or password.');
      if (btn) { btn.disabled = false; btn.textContent = 'Log In'; }
      return;
    }
    localStorage.setItem('sunara_token', data.accessToken);
    localStorage.setItem('sunara_user', JSON.stringify({ email: data.email, userId: data.userId }));
    showToast('success', 'Welcome Back!', 'Redirecting to your dashboard...');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  } catch (e) {
    showToast('error', 'Connection Error', 'Something went wrong. Please try again.');
    if (btn) { btn.disabled = false; btn.textContent = 'Log In'; }
  }
}

// ---- FAQ ----
function toggleFaq(el) {
  const item   = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
