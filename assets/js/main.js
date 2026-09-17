/**
 * Websirg AutoHub - Master Interactive JavaScript (2026 Edition)
 * Enterprise-grade client-side application logic for the Websirg AutoHub platform.
 * Supports catalog filtering, vehicle details rendering, comparison matrix,
 * interactive EMI calculator, exchange estimator, modals, and responsive UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileFilters();
  initModals();
  initToasts();
  initBackToTop();
  initAccordion();

  // Page-specific initializers
  if (document.getElementById('vehiclesCatalogGrid')) {
    initCatalog();
  }
  if (document.getElementById('bikesCatalogGrid')) {
    initBikesCatalog();
  }
  if (document.getElementById('vehicleDetailsContainer')) {
    initVehicleDetails();
  }
  if (document.getElementById('compareContainer')) {
    initCompare();
  }
  if (document.getElementById('emiCalculatorSection')) {
    initEMICalculator();
  }
  if (document.getElementById('quotationRequestForm')) {
    initQuotationForm();
  }
  if (document.getElementById('exchangeEstimatorForm')) {
    initExchangeEstimator();
  }
  if (document.getElementById('featuredCarsGrid') || document.getElementById('featuredBikesGrid')) {
    initHomeShowcases();
  }
  if (document.getElementById('homeHeroSearch')) {
    initHeroSearch();
  }
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-nav-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  function openMenu() {
    navMenu?.classList.add('active');
    toggle?.classList.add('active');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu?.classList.remove('active');
    toggle?.classList.remove('active');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function initMobileFilters() {
  const filterBtn = document.getElementById('mobileFilterToggle');
  const sidebar = document.getElementById('catalogSidebar');
  if (filterBtn && sidebar) {
    filterBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      filterBtn.classList.toggle('active');
      const isExpanded = sidebar.classList.contains('mobile-open');
      filterBtn.setAttribute('aria-expanded', isExpanded);
      const icon = filterBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = isExpanded ? '▲' : '▼';
    });
  }
}

/* ==========================================================================
   2. MODALS & INQUIRIES
   ========================================================================== */
function initModals() {
  const testDriveModal = document.getElementById('testDriveModal');
  const callAdvisorModal = document.getElementById('callAdvisorModal');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const vehicleInput = document.getElementById('modalVehicleSelect');

  function openTargetModal(type = 'test-drive', vehicleName = '') {
    let targetModal = null;
    if (type === 'test-drive') targetModal = testDriveModal;
    else if (type === 'call-advisor') targetModal = callAdvisorModal;
    else targetModal = document.getElementById(type);

    if (!targetModal) return;
    if (vehicleInput && vehicleName) {
      vehicleInput.value = vehicleName;
    }
    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-modal]');
    if (trigger) {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-open-modal');
      const vehName = trigger.getAttribute('data-vehicle-name') || '';
      openTargetModal(modalType, vehName);
    }
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));

  document.querySelectorAll('.modal-backdrop').forEach(modalEl => {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  const forms = document.querySelectorAll('form[data-lead-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn ? btn.innerHTML : 'Submit';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Processing...';
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origText;
        }
        form.reset();
        closeModal();
        showToast('Thank you! Your request has been received. An AutoHub Advisor will call you within 30 minutes.', 'success');
      }, 700);
    });
  });
}

/* ==========================================================================
   3. TOAST NOTIFICATIONS
   ========================================================================== */
function initToasts() {
  if (!document.getElementById('toastContainer')) {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    initToasts();
    container = document.getElementById('toastContainer');
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-content" style="flex-grow: 1;">
      <div style="font-weight: 700; font-size: 0.9rem;">Websirg AutoHub Advisory</div>
      <div style="font-size: 0.82rem; color: #E2E8F0;">${message}</div>
    </div>
    <button style="color: #94A3B8; font-size: 1.2rem; cursor: pointer;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   4. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. ACCORDION (FAQ)
   ========================================================================== */
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      }
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. HIGH-END PROFESSIONAL VEHICLE CARD GENERATOR
   ========================================================================== */
function createVehicleCard(v) {
  const badgeClass = v.badgeType ? `badge-${v.badgeType}` : 'badge-new';
  const isBike = v.type === 'bike';
  const isScooter = v.bodyType === 'scooter';
  const categoryTag = isScooter ? '🛵 SCOOTER / EV' : (isBike ? '🏍️ MOTORCYCLE' : '🚗 CAR / SUV');
  const waMessage = encodeURIComponent(`Hello Websirg AutoHub! I am interested in the ${v.name} (${v.priceDisplay}). Please share more details and test drive schedule.`);

  return `
    <article class="vehicle-card" data-vehicle-id="${v.id}" data-type="${v.type}" data-fuel="${v.fuel}" data-condition="${v.condition}" data-year="${v.year}" data-body="${v.bodyType}">
      <div class="vehicle-card-img-wrap">
        <img src="${v.image}" alt="${v.name}" class="vehicle-card-img" loading="lazy" onerror="this.src='assets/images/hero-automotive.jpg'">
        <div class="vehicle-card-badges">
          <span class="badge ${badgeClass}">${v.badge}</span>
        </div>
        <span class="vehicle-card-fuel-tag">${v.fuel.toUpperCase()}</span>
      </div>

      <div class="vehicle-card-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="vehicle-card-category">${categoryTag} • ${v.condition.toUpperCase()}</span>
          <span style="font-size: 0.72rem; font-weight: 700; color: #10B981; background: #ECFDF5; padding: 2px 8px; border-radius: 9999px;">✓ 120-Pt Inspected</span>
        </div>

        <h3 class="vehicle-card-title">${v.name}</h3>
        <p class="vehicle-card-tagline">${v.tagline || 'Engineered for exceptional driveability, comfort and safety.'}</p>

        <div class="vehicle-card-specs">
          <div class="spec-item" title="Efficiency / Range">
            <span class="spec-label">${v.fuel === 'electric' ? 'Range' : 'Mileage'}</span>
            <span class="spec-val">${v.fuel === 'electric' ? v.range : v.mileage}</span>
          </div>
          <div class="spec-item" title="Engine / Motor">
            <span class="spec-label">${isBike ? 'Displacement' : 'Engine'}</span>
            <span class="spec-val">${v.engine.split(' ')[0]} ${isBike && !v.engine.includes('kWh') ? 'cc' : ''}</span>
          </div>
          <div class="spec-item" title="Power Output">
            <span class="spec-label">Power</span>
            <span class="spec-val">${v.power.split('@')[0]}</span>
          </div>
          <div class="spec-item" title="Model Year & Transmission">
            <span class="spec-label">Year • Gear</span>
            <span class="spec-val">${v.year} • ${v.transmission.toUpperCase()}</span>
          </div>
        </div>

        <div class="vehicle-card-footer">
          <div class="vehicle-card-price">
            <span class="price-prefix">Price</span>
            <span class="price-val">${v.priceDisplay}</span>
            <span style="font-size: 0.72rem; color: #0284C7; font-weight: 700; margin-top: 2px;">EMI ${v.emiDisplay || 'Available'}</span>
          </div>
          <div class="vehicle-card-actions">
            <a href="vehicle-details.html?id=${v.id}" class="btn btn-outline btn-sm">Specs</a>
            <button type="button" class="btn btn-primary btn-sm" data-open-modal="test-drive" data-vehicle-name="${v.name}">Test Drive</button>
            <a href="https://wa.me/919876543210?text=${waMessage}" target="_blank" class="btn btn-sm" style="background: #E8F5E9; color: #2E7D32; font-weight: 700; padding: 6px 10px;" title="WhatsApp Advisor">💬</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   7. HOMEPAGE SHOWCASES (CARS, BIKES & SCOOTERS)
   ========================================================================== */
function initHomeShowcases() {
  if (typeof VEHICLES_DATA === 'undefined') return;

  const carsGrid = document.getElementById('featuredCarsGrid');
  if (carsGrid) {
    const cars = VEHICLES_DATA.filter(v => v.type === 'car');
    carsGrid.innerHTML = cars.map(createVehicleCard).join('');
  }

  const bikesGrid = document.getElementById('featuredBikesGrid');
  if (bikesGrid) {
    // Show motorcycles (excluding pure scooters)
    const bikes = VEHICLES_DATA.filter(v => v.type === 'bike' && v.bodyType !== 'scooter');
    bikesGrid.innerHTML = bikes.map(createVehicleCard).join('');
  }

  const scootersGrid = document.getElementById('featuredScootersGrid');
  if (scootersGrid) {
    // Show famous scooties: Activa, Ola, Jupiter, Ather
    const scooters = VEHICLES_DATA.filter(v => v.bodyType === 'scooter');
    scootersGrid.innerHTML = scooters.map(createVehicleCard).join('');
  }
}

/* ==========================================================================
   8. HERO SEARCH
   ========================================================================== */
function initHeroSearch() {
  const form = document.getElementById('homeHeroSearch');
  const tabs = document.querySelectorAll('.hero-tab-pill');
  const typeSelect = document.getElementById('heroTypeSelect');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetType = tab.getAttribute('data-type');
      if (typeSelect && targetType !== 'all') {
        typeSelect.value = targetType;
      }
    });
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('heroTypeSelect')?.value || 'car';
    const fuel = document.getElementById('heroFuelSelect')?.value || 'all';
    const budget = document.getElementById('heroBudgetSelect')?.value || 'all';

    const params = new URLSearchParams();
    if (fuel !== 'all') params.set('fuel', fuel);
    if (budget !== 'all') params.set('budget', budget);

    const targetUrl = type === 'bike' ? `bikes.html?${params.toString()}` : `cars.html?${params.toString()}`;
    window.location.href = targetUrl;
  });
}

/* ==========================================================================
   9. CARS CATALOG FILTER ENGINE
   ========================================================================== */
function initCatalog() {
  const grid = document.getElementById('vehiclesCatalogGrid');
  const countBadge = document.getElementById('vehicleCountBadge');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const searchInput = document.getElementById('catalogSearchInput');
  const conditionSelect = document.getElementById('filterCondition');
  const fuelSelect = document.getElementById('filterFuel');
  const bodySelect = document.getElementById('filterBody');
  const yearSelect = document.getElementById('filterYear');
  const budgetSelect = document.getElementById('filterBudget');
  const sortSelect = document.getElementById('catalogSortSelect');

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('fuel') && fuelSelect) fuelSelect.value = urlParams.get('fuel');
  if (urlParams.get('budget') && budgetSelect) budgetSelect.value = urlParams.get('budget');

  function applyFilters() {
    if (typeof VEHICLES_DATA === 'undefined') return;

    let list = VEHICLES_DATA.filter(v => v.type === 'car');

    const q = searchInput?.value.trim().toLowerCase() || '';
    const cond = conditionSelect?.value || 'all';
    const fuel = fuelSelect?.value || 'all';
    const body = bodySelect?.value || 'all';
    const year = yearSelect?.value || 'all';
    const budget = budgetSelect?.value || 'all';
    const sort = sortSelect?.value || 'featured';

    if (q) {
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.features.some(f => f.toLowerCase().includes(q)));
    }
    if (cond !== 'all') {
      list = list.filter(v => v.condition === cond);
    }
    if (fuel !== 'all') {
      list = list.filter(v => v.fuel === fuel);
    }
    if (body !== 'all') {
      list = list.filter(v => v.bodyType === body);
    }
    if (year !== 'all') {
      list = list.filter(v => v.year.toString() === year);
    }
    if (budget !== 'all') {
      if (budget === 'under-10l') list = list.filter(v => v.price < 1000000);
      else if (budget === '10l-20l') list = list.filter(v => v.price >= 1000000 && v.price <= 2000000);
      else if (budget === 'above-20l') list = list.filter(v => v.price > 2000000);
    }

    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'year-new') list.sort((a, b) => b.year - a.year);

    if (countBadge) countBadge.textContent = `${list.length} Verified Cars Available (2026 Fleet)`;

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFF; border-radius: 12px; border: 1px solid #E2E8F0;">
        <h3 style="margin-bottom: 8px;">No matching cars found</h3>
        <p style="color: #64748B;">Try resetting filters to explore our complete inventory.</p>
        <button class="btn btn-outline btn-sm mt-3" onclick="document.getElementById('resetFiltersBtn').click()">Reset Filters</button>
      </div>`;
    } else {
      grid.innerHTML = list.map(createVehicleCard).join('');
    }
  }

  [searchInput, conditionSelect, fuelSelect, bodySelect, yearSelect, budgetSelect, sortSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (conditionSelect) conditionSelect.value = 'all';
      if (fuelSelect) fuelSelect.value = 'all';
      if (bodySelect) bodySelect.value = 'all';
      if (yearSelect) yearSelect.value = 'all';
      if (budgetSelect) budgetSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'featured';
      applyFilters();
    });
  }

  applyFilters();
}

/* ==========================================================================
   10. BIKES & TWO-WHEELERS CATALOG FILTER ENGINE
   ========================================================================== */
function initBikesCatalog() {
  const grid = document.getElementById('bikesCatalogGrid');
  const countBadge = document.getElementById('bikeCountBadge');
  const resetBtn = document.getElementById('resetBikeFiltersBtn');
  const searchInput = document.getElementById('bikeSearchInput');
  const styleSelect = document.getElementById('bikeFilterStyle');
  const fuelSelect = document.getElementById('bikeFilterFuel');
  const conditionSelect = document.getElementById('bikeFilterCondition');
  const yearSelect = document.getElementById('bikeFilterYear');
  const budgetSelect = document.getElementById('bikeFilterBudget');
  const sortSelect = document.getElementById('bikeSortSelect');

  function applyBikeFilters() {
    if (typeof VEHICLES_DATA === 'undefined') return;

    let list = VEHICLES_DATA.filter(v => v.type === 'bike');

    const q = searchInput?.value.trim().toLowerCase() || '';
    const style = styleSelect?.value || 'all';
    const fuel = fuelSelect?.value || 'all';
    const cond = conditionSelect?.value || 'all';
    const year = yearSelect?.value || 'all';
    const budget = budgetSelect?.value || 'all';
    const sort = sortSelect?.value || 'featured';

    if (q) {
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.features.some(f => f.toLowerCase().includes(q)));
    }
    if (style !== 'all') {
      list = list.filter(v => v.bodyType === style);
    }
    if (fuel !== 'all') {
      list = list.filter(v => v.fuel === fuel);
    }
    if (cond !== 'all') {
      list = list.filter(v => v.condition === cond);
    }
    if (year !== 'all') {
      list = list.filter(v => v.year.toString() === year);
    }
    if (budget !== 'all') {
      if (budget === 'under-1.5l') list = list.filter(v => v.price < 150000);
      else if (budget === '1.5l-3l') list = list.filter(v => v.price >= 150000 && v.price <= 300000);
      else if (budget === 'above-3l') list = list.filter(v => v.price > 300000);
    }

    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'year-new') list.sort((a, b) => b.year - a.year);

    if (countBadge) countBadge.textContent = `${list.length} Verified Two-Wheelers Available (2026 Fleet)`;

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #FFF; border-radius: 12px; border: 1px solid #E2E8F0;">
        <h3 style="margin-bottom: 8px;">No matching motorcycles or scooters found</h3>
        <p style="color: #64748B;">Try resetting your filters to explore our full two-wheeler inventory.</p>
        <button class="btn btn-outline btn-sm mt-3" onclick="document.getElementById('resetBikeFiltersBtn').click()">Reset Filters</button>
      </div>`;
    } else {
      grid.innerHTML = list.map(createVehicleCard).join('');
    }
  }

  [searchInput, styleSelect, fuelSelect, conditionSelect, yearSelect, budgetSelect, sortSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', applyBikeFilters);
      el.addEventListener('change', applyBikeFilters);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (styleSelect) styleSelect.value = 'all';
      if (fuelSelect) fuelSelect.value = 'all';
      if (conditionSelect) conditionSelect.value = 'all';
      if (yearSelect) yearSelect.value = 'all';
      if (budgetSelect) budgetSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'featured';
      applyBikeFilters();
    });
  }

  applyBikeFilters();
}

/* ==========================================================================
   11. VEHICLE DETAILS PAGE LOADER
   ========================================================================== */
function initVehicleDetails() {
  if (typeof VEHICLES_DATA === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = urlParams.get('id') || 'car-1';
  const v = VEHICLES_DATA.find(item => item.id === vehicleId) || VEHICLES_DATA[0];

  if (!v) return;

  document.title = `${v.name} | Websirg AutoHub`;
  const isBike = v.type === 'bike';

  const nameEls = document.querySelectorAll('.detail-vehicle-name');
  nameEls.forEach(el => el.textContent = v.name);

  const priceEls = document.querySelectorAll('.detail-vehicle-price');
  priceEls.forEach(el => el.textContent = v.priceDisplay);

  const taglineEl = document.getElementById('detailTagline');
  if (taglineEl) taglineEl.textContent = v.tagline;

  const badgeEl = document.getElementById('detailBadge');
  if (badgeEl) {
    badgeEl.textContent = `${isBike ? 'Two-Wheeler' : 'Four-Wheeler'} • Year ${v.year} • ${v.badge}`;
    badgeEl.className = `badge badge-${v.badgeType || 'featured'}`;
  }

  const mainImg = document.getElementById('detailMainImg');
  if (mainImg) {
    mainImg.src = v.image;
    mainImg.alt = v.name;
  }

  const thumbsContainer = document.getElementById('detailGalleryThumbs');
  if (thumbsContainer && v.gallery && v.gallery.length > 0) {
    thumbsContainer.innerHTML = v.gallery.map((imgSrc, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="swapDetailImage('${imgSrc}', this)">
        <img src="${imgSrc}" alt="${v.name} angle ${idx + 1}">
      </div>
    `).join('');
  }

  // Spec Table
  const specsTable = document.getElementById('detailSpecsTable');
  if (specsTable) {
    specsTable.innerHTML = `
      <tr><th>Category</th><td><strong>${isBike ? 'Motorcycle / Scooter' : 'Passenger Car'}</strong></td></tr>
      <tr><th>Model Year</th><td><strong>${v.year}</strong></td></tr>
      <tr><th>Condition</th><td>${v.condition.toUpperCase()}</td></tr>
      <tr><th>Fuel / Powertrain</th><td>${v.fuel.toUpperCase()}</td></tr>
      <tr><th>Engine / Battery</th><td>${v.engine}</td></tr>
      <tr><th>Max Power Output</th><td>${v.power}</td></tr>
      <tr><th>Efficiency / Range</th><td>${v.fuel === 'electric' ? v.range : v.mileage}</td></tr>
      <tr><th>Transmission</th><td>${v.transmissionDisplay || v.transmission.toUpperCase()}</td></tr>
      <tr><th>Estimated EMI</th><td><strong style="color: #0284C7;">${v.emiDisplay || 'Available'}</strong></td></tr>
      <tr><th>Seating Capacity</th><td>${v.seats} Seats</td></tr>
      <tr><th>Odometer / Run</th><td>${v.kmDriven}</td></tr>
      <tr><th>Ownership Status</th><td>${v.ownership}</td></tr>
      <tr><th>Location Hub</th><td>${v.location}</td></tr>
      <tr><th>Inspection Status</th><td><span style="color: #10B981; font-weight: 700;">✓ 120-Point Certification Passed</span></td></tr>
    `;
  }

  // Key Features
  const featuresList = document.getElementById('detailFeaturesList');
  if (featuresList && v.features) {
    featuresList.innerHTML = v.features.map(f => `
      <li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.95rem;">
        <span style="color: #0284C7; font-size: 1.1rem;">✓</span> ${f}
      </li>
    `).join('');
  }

  const bookBtn = document.getElementById('detailBookTestDriveBtn');
  if (bookBtn) bookBtn.setAttribute('data-vehicle-name', v.name);

  // WhatsApp Button
  const waBtn = document.getElementById('detailWhatsAppBtn');
  if (waBtn) {
    const msg = encodeURIComponent(`Hi Websirg AutoHub, I want to book a test drive and get on-road quote for ${v.name} (${v.priceDisplay}).`);
    waBtn.href = `https://wa.me/919876543210?text=${msg}`;
  }

  // Similar vehicles
  const similarContainer = document.getElementById('similarVehiclesGrid');
  if (similarContainer) {
    const similar = VEHICLES_DATA.filter(item => item.id !== v.id && item.type === v.type).slice(0, 3);
    similarContainer.innerHTML = similar.map(createVehicleCard).join('');
  }
}

window.swapDetailImage = function(src, thumbElement) {
  const mainImg = document.getElementById('detailMainImg');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
  if (thumbElement) thumbElement.classList.add('active');
};

/* ==========================================================================
   12. INTERACTIVE EMI CALCULATOR WITH PRESET BUTTONS
   ========================================================================== */
function initEMICalculator() {
  const loanSlider = document.getElementById('emiLoanAmount');
  const rateSlider = document.getElementById('emiInterestRate');
  const tenureSlider = document.getElementById('emiTenureYears');

  const loanValDisp = document.getElementById('emiLoanVal');
  const rateValDisp = document.getElementById('emiRateVal');
  const tenureValDisp = document.getElementById('emiTenureVal');

  const monthlyDisp = document.getElementById('emiMonthlyVal');
  const interestDisp = document.getElementById('emiTotalInterestVal');
  const totalDisp = document.getElementById('emiTotalPayableVal');

  if (!loanSlider || !rateSlider || !tenureSlider) return;

  function calculate() {
    const P = parseFloat(loanSlider.value) || 0;
    const annualRate = parseFloat(rateSlider.value) || 8.5;
    const years = parseFloat(tenureSlider.value) || 5;

    if (rateValDisp) rateValDisp.textContent = `${annualRate.toFixed(1)}%`;
    if (tenureValDisp) tenureValDisp.textContent = `${years} ${years == 1 ? 'Year' : 'Years'}`;

    // DEFAULT 0 STATE: Only calculate when user interacts and selects P > 0
    if (P <= 0) {
      if (loanValDisp) loanValDisp.textContent = '₹0 (Select Amount)';
      if (monthlyDisp) monthlyDisp.innerHTML = '₹0 <span style="font-size: 0.8rem; font-weight: 600; color: #64748B; display: block; margin-top: 4px;">Drag slider or choose a preset below</span>';
      if (interestDisp) interestDisp.textContent = '₹0';
      if (totalDisp) totalDisp.textContent = '₹0';
      return;
    }

    if (loanValDisp) loanValDisp.textContent = `₹${P.toLocaleString('en-IN')}`;

    const r = (annualRate / 12) / 100;
    const n = years * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    if (monthlyDisp) monthlyDisp.innerHTML = `₹${Math.round(emi).toLocaleString('en-IN')} <span style="font-size: 0.8rem; font-weight: 600; color: #64748B;">/ month</span>`;
    if (interestDisp) interestDisp.textContent = `₹${Math.round(totalInterest).toLocaleString('en-IN')}`;
    if (totalDisp) totalDisp.textContent = `₹${Math.round(totalAmount).toLocaleString('en-IN')}`;
  }

  // Quick Preset buttons
  document.querySelectorAll('.emi-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.emi-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loanSlider.value = btn.getAttribute('data-val');
      calculate();
    });
  });

  [loanSlider, rateSlider, tenureSlider].forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
  });

  // Explicitly set default to 0 on initial page load
  loanSlider.value = "0";
  calculate();
}

/* ==========================================================================
   13. EXCHANGE VALUATION ESTIMATOR
   ========================================================================== */
function initExchangeEstimator() {
  const form = document.getElementById('exchangeEstimatorForm');
  const resultCard = document.getElementById('exchangeResultCard');
  const priceRangeDisp = document.getElementById('exchangeValuationRange');

  if (!form || !resultCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('exchType')?.value || 'car';
    const year = parseInt(document.getElementById('exchYear')?.value || '2022', 10);
    const kms = parseInt(document.getElementById('exchKms')?.value || '35000', 10);

    const baseVal = type === 'car' ? 880000 : 135000;
    const age = 2026 - year;
    let factor = Math.max(0.38, 1 - (age * 0.08) - (kms / 150000) * 0.12);

    const estimatedValue = Math.round((baseVal * factor) / 5000) * 5000;
    const lowVal = Math.round(estimatedValue * 0.94);
    const highVal = Math.round(estimatedValue * 1.06);

    if (priceRangeDisp) {
      priceRangeDisp.textContent = `₹${lowVal.toLocaleString('en-IN')} - ₹${highVal.toLocaleString('en-IN')}`;
    }

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Fair market valuation estimated successfully for 2026 market rates!', 'success');
  });
}

/* ==========================================================================
   14. INTERACTIVE VEHICLE COMPARISON STUDIO
   ========================================================================== */
function initCompare() {
  const selectA = document.getElementById('compareVehicleA');
  const selectB = document.getElementById('compareVehicleB');
  const matrixContainer = document.getElementById('compareMatrixContent');

  if (!selectA || !selectB || !matrixContainer || typeof VEHICLES_DATA === 'undefined') return;

  // Populate options
  const optionsHtml = VEHICLES_DATA.map(v => `<option value="${v.id}">${v.name} (${v.priceDisplay})</option>`).join('');
  selectA.innerHTML = optionsHtml;
  selectB.innerHTML = optionsHtml;

  // Set defaults: Creta vs Venue
  selectA.value = 'car-creta';
  selectB.value = 'car-venue';

  function renderMatrix() {
    const vA = getVehicleById(selectA.value) || VEHICLES_DATA[0];
    const vB = getVehicleById(selectB.value) || VEHICLES_DATA[1];

    matrixContainer.innerHTML = `
      <div class="form-row-2col" style="gap: 16px; margin-bottom: 20px;">
        <!-- Card A -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 16px; text-align: center;">
          <img src="${vA.image}" alt="${vA.name}" style="width: 100%; height: 170px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #0284C7; text-transform: uppercase;">MODEL A</span>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 4px 0;">${vA.name}</h4>
          <div style="font-size: 1.45rem; font-weight: 900; color: #0284C7; margin-top: 4px;">${vA.priceDisplay}</div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #64748B;">EMI from ${vA.emiDisplay}</div>
          <button type="button" class="btn btn-primary btn-sm mt-3 w-100" data-open-modal="test-drive" data-vehicle-name="${vA.name}">Book Test Drive A</button>
        </div>

        <!-- Card B -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 16px; text-align: center;">
          <img src="${vB.image}" alt="${vB.name}" style="width: 100%; height: 170px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #10B981; text-transform: uppercase;">MODEL B</span>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 4px 0;">${vB.name}</h4>
          <div style="font-size: 1.45rem; font-weight: 900; color: #0284C7; margin-top: 4px;">${vB.priceDisplay}</div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #64748B;">EMI from ${vB.emiDisplay}</div>
          <button type="button" class="btn btn-primary btn-sm mt-3 w-100" data-open-modal="test-drive" data-vehicle-name="${vB.name}">Book Test Drive B</button>
        </div>
      </div>

      <!-- Specs Matrix Table -->
      <table class="compare-matrix-table">
        <tbody>
          <tr>
            <td class="matrix-label">Body Style & Type</td>
            <td><strong>${vA.bodyType.toUpperCase()}</strong> (${vA.type.toUpperCase()})</td>
            <td><strong>${vB.bodyType.toUpperCase()}</strong> (${vB.type.toUpperCase()})</td>
          </tr>
          <tr>
            <td class="matrix-label">Powertrain / Fuel</td>
            <td><span class="badge badge-new">${vA.fuel.toUpperCase()}</span></td>
            <td><span class="badge badge-new">${vB.fuel.toUpperCase()}</span></td>
          </tr>
          <tr>
            <td class="matrix-label">Mileage / Range</td>
            <td style="color: #10B981; font-weight: 800; font-size: 1.05rem;">${vA.fuel === 'electric' ? vA.range : vA.mileage}</td>
            <td style="color: #10B981; font-weight: 800; font-size: 1.05rem;">${vB.fuel === 'electric' ? vB.range : vB.mileage}</td>
          </tr>
          <tr>
            <td class="matrix-label">Engine / Power</td>
            <td>${vA.engine} <br><small style="color:#64748B;">(${vA.power})</small></td>
            <td>${vB.engine} <br><small style="color:#64748B;">(${vB.power})</small></td>
          </tr>
          <tr>
            <td class="matrix-label">Transmission</td>
            <td>${vA.transmissionDisplay || vA.transmission}</td>
            <td>${vB.transmissionDisplay || vB.transmission}</td>
          </tr>
          <tr>
            <td class="matrix-label">Top Features</td>
            <td>${vA.features.slice(0, 3).join(' • ')}</td>
            <td>${vB.features.slice(0, 3).join(' • ')}</td>
          </tr>
          <tr>
            <td class="matrix-label">Buyer Advantage</td>
            <td style="font-size: 0.88rem; color: #475569;">${vA.tagline}</td>
            <td style="font-size: 0.88rem; color: #475569;">${vB.tagline}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  selectA.addEventListener('change', renderMatrix);
  selectB.addEventListener('change', renderMatrix);

  // Preset quick chips
  document.querySelectorAll('.compare-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.compare-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectA.value = btn.getAttribute('data-a');
      selectB.value = btn.getAttribute('data-b');
      renderMatrix();
    });
  });

  renderMatrix();
}

/* ==========================================================================
   15. INSTANT VEHICLE ON-ROAD QUOTATION ENGINE
   ========================================================================== */
function initQuotationForm() {
  const form = document.getElementById('quotationRequestForm');
  const catSelect = document.getElementById('quoteCategory');
  const vehSelect = document.getElementById('quoteVehicleSelect');
  const resultBox = document.getElementById('quotationResultBox');
  const summaryText = document.getElementById('quotationSummaryText');
  const waShareBtn = document.getElementById('quotationWhatsAppShare');

  if (!form || !vehSelect || typeof VEHICLES_DATA === 'undefined') return;

  function populateVehicles() {
    const cat = catSelect ? catSelect.value : 'car';
    const filtered = VEHICLES_DATA.filter(v => v.type === cat);
    vehSelect.innerHTML = filtered.map(v => `<option value="${v.id}">${v.name} (${v.priceDisplay})</option>`).join('');
  }

  if (catSelect) {
    catSelect.addEventListener('change', populateVehicles);
  }
  populateVehicles();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const vehId = vehSelect.value;
    const v = typeof getVehicleById === 'function' ? getVehicleById(vehId) : VEHICLES_DATA.find(x => x.id === vehId);
    const name = document.getElementById('quoteName')?.value || 'Valued Customer';
    const phone = document.getElementById('quotePhone')?.value || '';
    const city = document.getElementById('quoteCity')?.value || 'Delhi NCR';

    if (!v) {
      showToast('Please select a valid vehicle model.', 'error');
      return;
    }

    const exShowroom = v.price;
    const isCar = v.type === 'car';
    const rtoTax = isCar ? Math.round(exShowroom * 0.09) : Math.round(exShowroom * 0.08);
    const insurance = isCar ? Math.round(exShowroom * 0.04) : Math.round(exShowroom * 0.05);
    const agencyDiscount = isCar ? 20000 : 3500;
    const netOnRoad = exShowroom + rtoTax + insurance - agencyDiscount;

    if (summaryText) {
      summaryText.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>Selected Model:</strong> ${v.name} (${v.fuel.toUpperCase()})</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.82rem; margin-bottom: 10px; background: #FFFFFF; padding: 10px; border-radius: 8px; border: 1px solid #E2E8F0;">
          <div>Ex-Showroom Price:</div><div style="font-weight: 700; text-align: right;">₹${exShowroom.toLocaleString('en-IN')}</div>
          <div>Estimated RTO & Road Tax:</div><div style="font-weight: 700; text-align: right;">+ ₹${rtoTax.toLocaleString('en-IN')}</div>
          <div>Comprehensive Insurance:</div><div style="font-weight: 700; text-align: right;">+ ₹${insurance.toLocaleString('en-IN')}</div>
          <div style="color: #16A34A; font-weight: 700;">AutoHub Special Discount:</div><div style="color: #16A34A; font-weight: 700; text-align: right;">- ₹${agencyDiscount.toLocaleString('en-IN')}</div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 900; color: #0284C7; border-top: 1.5px dashed #CBD5E1; padding-top: 8px;">
          <span>Estimated On-Road Price:</span>
          <span>₹${netOnRoad.toLocaleString('en-IN')}*</span>
        </div>
        <div style="font-size: 0.78rem; color: #64748B; margin-top: 6px;">
          *Includes 1-Yr Comprehensive + 3-Yr Third Party Insurance, RTO Smart Card, FASTag & Dealership Discount.
        </div>
      `;
    }

    if (waShareBtn) {
      const waMsg = encodeURIComponent(`Hi Websirg AutoHub, my name is ${name} (${phone}) from ${city}. I generated an On-Road Quotation for ${v.name}. Estimated On-Road Price: ₹${netOnRoad.toLocaleString('en-IN')}. Please share formal quote and test drive schedule.`);
      waShareBtn.href = `https://wa.me/919876543210?text=${waMsg}`;
    }

    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showToast('On-road quotation generated successfully for ' + v.name + '!', 'success');
  });
}
