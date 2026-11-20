/**
 * OMNI FINCON - Luxury Investment Banking & Real Estate Capital Portal
 * Interactive Logic & Structuring Engines
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initActiveNavLink();
  initNavLinkInteractions();
  initIBCursor();
  initMobileNav();
  initCapitalCalculator();
  initDealFilters();
  initMandateWizard();
  initModals();
  initSmoothScroll();
  initFaqAccordion();
  initPracticeTabs();
  initCountUp();
  initScrollAnimations();
  initPageTransitions();
  initHydRealEstateWidget();
});

/* ==========================================================================
   Header & Active Navigation Setup (Semi-Transparent Background-Adaptive Header)
   ========================================================================== */
function initStickyHeader() {
  const wrapper = document.querySelector('.header-master-wrapper');
  if (!wrapper) return;

  let ticking = false;

  function updateHeaderOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = wrapper.offsetHeight || 90;

    // 1. Scrolled state elevation
    if (scrollY > 10) {
      wrapper.classList.add('scrolled');
    } else {
      wrapper.classList.remove('scrolled');
    }

    // 2. Dynamic background detection: Check if any dark section is under the header
    const darkSections = document.querySelectorAll(
      '.cta-banner-section, .site-footer, [data-header-theme="dark"]'
    );

    let isOverDark = false;
    for (let i = 0; i < darkSections.length; i++) {
      const rect = darkSections[i].getBoundingClientRect();
      if (rect.top <= headerHeight && rect.bottom >= 15) {
        isOverDark = true;
        break;
      }
    }

    if (isOverDark) {
      wrapper.classList.add('theme-dark');
      wrapper.classList.remove('theme-light');
    } else {
      wrapper.classList.add('theme-light');
      wrapper.classList.remove('theme-dark');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderOnScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderOnScroll);
      ticking = true;
    }
  }, { passive: true });

  updateHeaderOnScroll();
}

function initActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash;
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (!href) return;
    
    if (href === 'contact.html' && currentPath.includes('contact.html')) {
      link.classList.add('active');
    } else if (href === 'real-estate-finance.html' && currentPath.includes('real-estate-finance.html')) {
      link.classList.add('active');
    } else if (href === 'investment-banking.html' && currentPath.includes('investment-banking.html')) {
      link.classList.add('active');
    } else if (href === 'index.html' && (currentPath.includes('index.html') || currentPath === '' || currentPath.endsWith('/') || currentPath.endsWith('omini\\') || currentPath.endsWith('omini/')) && !currentHash) {
      link.classList.add('active');
    }
  });
}

function initNavLinkInteractions() {
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'nav-click-ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
}

/* ==========================================================================
   Mobile Navigation Drawer & Touch Interaction
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when clicking a nav item
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Reset menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }, { passive: true });
}

/* ==========================================================================
   Interactive Capital Structuring & Project Loan Calculator
   ========================================================================== */
function initCapitalCalculator() {
  const typeBtns = document.querySelectorAll('.calc-type-btn');
  const costSlider = document.getElementById('calc-cost-slider');
  const costDisplay = document.getElementById('calc-cost-val');
  const tenureSlider = document.getElementById('calc-tenure-slider');
  const tenureDisplay = document.getElementById('calc-tenure-val');
  const equitySlider = document.getElementById('calc-equity-slider');
  const equityDisplay = document.getElementById('calc-equity-val');

  // Outputs
  const outDebt = document.getElementById('out-debt-amount');
  const outEquity = document.getElementById('out-equity-amount');
  const outEmi = document.getElementById('out-monthly-service');
  const outRate = document.getElementById('out-interest-range');
  const outMoratorium = document.getElementById('out-moratorium');
  const outTurnaround = document.getElementById('out-turnaround');

  // Capital Stack Progress Bars
  const stackDebt = document.getElementById('stack-debt-bar');
  const stackEquity = document.getElementById('stack-equity-bar');
  const stackMezz = document.getElementById('stack-mezz-bar');
  const stackDebtPct = document.getElementById('stack-debt-pct');
  const stackEquityPct = document.getElementById('stack-equity-pct');

  let activeType = 're_construction'; // re_construction | lrd_commercial | corp_project

  const configs = {
    re_construction: {
      name: 'Real Estate Construction Finance',
      rateMin: 10.75,
      rateMax: 12.5,
      defaultEquity: 35,
      moratorium: '18 - 30 Months',
      turnaround: '30 - 45 Days',
      mezzAvailable: true
    },
    lrd_commercial: {
      name: 'Lease Rental Discounting (LRD)',
      rateMin: 8.75,
      rateMax: 9.85,
      defaultEquity: 20,
      moratorium: 'Immediate Servicing',
      turnaround: '25 - 35 Days',
      mezzAvailable: false
    },
    corp_project: {
      name: 'Corporate Infrastructure Loan',
      rateMin: 9.5,
      rateMax: 11.25,
      defaultEquity: 30,
      moratorium: '12 - 24 Months',
      turnaround: '35 - 50 Days',
      mezzAvailable: true
    }
  };

  // Facility Type Click Handlers
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.getAttribute('data-type');
      
      const conf = configs[activeType];
      if (conf) {
        equitySlider.value = conf.defaultEquity;
      }
      calculateOutputs();
    });
  });

  // Sliders input events
  if (costSlider) costSlider.addEventListener('input', calculateOutputs);
  if (tenureSlider) tenureSlider.addEventListener('input', calculateOutputs);
  if (equitySlider) equitySlider.addEventListener('input', calculateOutputs);

  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #1d4ed8 0%, #1d4ed8 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
  }

  function calculateOutputs() {
    const cost = parseFloat(costSlider.value); // in Crores
    const tenure = parseFloat(tenureSlider.value); // in Years
    const equityPct = parseFloat(equitySlider.value); // in %

    // Update dynamic track fills
    updateSliderFill(costSlider);
    updateSliderFill(tenureSlider);
    updateSliderFill(equitySlider);

    // Update display labels
    if (costDisplay) costDisplay.innerText = `₹${cost} Cr`;
    if (tenureDisplay) tenureDisplay.innerText = `${tenure} Years`;
    if (equityDisplay) equityDisplay.innerText = `${equityPct}%`;

    const conf = configs[activeType];
    const debtPct = 100 - equityPct;

    const debtAmount = (cost * (debtPct / 100)).toFixed(1);
    const equityAmount = (cost * (equityPct / 100)).toFixed(1);

    // Approximate Monthly Debt Service (EMI) during amortization
    // Using average rate:
    const avgRate = (conf.rateMin + conf.rateMax) / 2 / 100;
    const monthlyRate = avgRate / 12;
    const totalMonths = tenure * 12;
    
    // Principal in Rupees
    const principalRupees = parseFloat(debtAmount) * 10000000;
    let emiRupees = 0;
    if (monthlyRate > 0) {
      emiRupees = (principalRupees * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    const emiLakhs = (emiRupees / 100000).toFixed(1);

    // Update Output Numbers
    if (outDebt) outDebt.innerText = `₹${debtAmount} Cr`;
    if (outEquity) outEquity.innerText = `₹${equityAmount} Cr`;
    if (outEmi) outEmi.innerText = `~₹${emiLakhs} Lakhs/mo`;
    if (outRate) outRate.innerText = `${conf.rateMin}% - ${conf.rateMax}% p.a.`;
    if (outMoratorium) outMoratorium.innerText = conf.moratorium;
    if (outTurnaround) outTurnaround.innerText = conf.turnaround;

    // Update Capital Stack Progress Bar
    if (stackDebt) {
      stackDebt.style.width = `${debtPct}%`;
      stackDebt.innerText = `Debt: ${debtPct}%`;
    }
    if (stackEquity) {
      stackEquity.style.width = `${equityPct}%`;
      stackEquity.innerText = `Equity: ${equityPct}%`;
    }
    if (stackDebtPct) stackDebtPct.innerText = `${debtPct}% (₹${debtAmount} Cr)`;
    if (stackEquityPct) stackEquityPct.innerText = `${equityPct}% (₹${equityAmount} Cr)`;
  }

  // Initial calculation run
  if (costSlider) calculateOutputs();
}

/* ==========================================================================
   Featured Deal Showcase Filter
   ========================================================================== */
function initDealFilters() {
  const filterBtns = document.querySelectorAll('.deal-filter-btn');
  const dealCards = document.querySelectorAll('.tombstone-card');
  if (!filterBtns.length || !dealCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      dealCards.forEach((card, index) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, (index % 3) * 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Multi-Step Mandate Wizard Form
   ========================================================================== */
function initMandateWizard() {
  const panels = document.querySelectorAll('.wizard-panel');
  const indicators = document.querySelectorAll('.step-indicator');
  const nextBtns = document.querySelectorAll('.btn-wizard-next');
  const prevBtns = document.querySelectorAll('.btn-wizard-prev');
  const submitBtn = document.getElementById('wizard-submit-btn');

  let currentStep = 1;
  const totalSteps = panels.length;

  // Selectable cards
  document.querySelectorAll('.select-card').forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.closest('.form-selection-grid');
      parent.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  function goToStep(step) {
    currentStep = step;

    panels.forEach(p => p.classList.remove('active'));
    indicators.forEach((ind, index) => {
      ind.classList.remove('active');
      if (index + 1 < step) {
        ind.classList.add('completed');
      } else {
        ind.classList.remove('completed');
      }
      if (index + 1 === step) {
        ind.classList.add('active');
      }
    });

    const targetPanel = document.querySelector(`.wizard-panel[data-step="${step}"]`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }

  // Handle Form Submission
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const promoterEl = document.getElementById('mandate-promoter-name');
      const promoterName = (promoterEl && promoterEl.value) ? promoterEl.value.trim() : 'Client';
      
      const entityEl = document.getElementById('mandate-entity-name');
      const entityName = (entityEl && entityEl.value) ? entityEl.value.trim() : 'Enterprise';
      
      const phoneEl = document.getElementById('mandate-phone');
      const phone = (phoneEl && phoneEl.value) ? phoneEl.value.trim() : '';
      
      const emailEl = document.getElementById('mandate-email');
      const email = (emailEl && emailEl.value) ? emailEl.value.trim() : '';

      const cityEl = document.getElementById('mandate-city');
      const city = (cityEl && cityEl.value) ? cityEl.value.trim() : 'Hyderabad';

      const costEl = document.getElementById('mandate-project-cost');
      const cost = (costEl && costEl.value) ? costEl.value.trim() : '';

      const capitalEl = document.getElementById('mandate-capital-req');
      const capital = (capitalEl && capitalEl.value) ? capitalEl.value.trim() : '';

      const facilityEl = document.getElementById('mandate-facility-type');
      const facility = (facilityEl && facilityEl.options[facilityEl.selectedIndex]) ? facilityEl.options[facilityEl.selectedIndex].text : 'Construction Finance';

      const selectedAssetCard = document.querySelector('.form-selection-grid .select-card.selected .select-card-name');
      const assetClass = selectedAssetCard ? selectedAssetCard.innerText : 'Real Estate Project';

      if (!phone && !email) {
        alert('Please provide your phone number or email so our syndication desk can connect with you.');
        return;
      }

      const randomRef = 'OMNI-' + Math.floor(1000 + Math.random() * 9000);

      // Construct prefilled WhatsApp briefing message
      let waText = `Hello Omni Fincon Advisory Desk,%0A%0AI have submitted Project Mandate Reference: *${randomRef}*%0A%0A*Promoter:* ${encodeURIComponent(promoterName)}%0A*Entity:* ${encodeURIComponent(entityName)}%0A*Asset Class:* ${encodeURIComponent(assetClass)}%0A*Facility:* ${encodeURIComponent(facility)}`;
      if (cost) waText += `%0A*Project Cost:* ₹${encodeURIComponent(cost)} Cr`;
      if (capital) waText += `%0A*Desired Debt:* ₹${encodeURIComponent(capital)} Cr`;
      waText += `%0A*Location:* ${encodeURIComponent(city)}%0A*Phone:* ${encodeURIComponent(phone)}`;

      // Construct direct mailto fallback
      let mailBody = `Dear Omni Fincon Debt Syndication Desk,\n\nPlease find our preliminary financing mandate details below:\n\n` +
        `Mandate Docket: ${randomRef}\n` +
        `Promoter / Executive: ${promoterName}\n` +
        `Entity / Firm: ${entityName}\n` +
        `Asset Class: ${assetClass}\n` +
        `Financing Facility: ${facility}\n`;
      if (cost) mailBody += `Estimated Project Cost: ₹${cost} Cr\n`;
      if (capital) mailBody += `Desired Debt Requirement: ₹${capital} Cr\n`;
      mailBody += `Location / City: ${city}\n` +
        `Phone Number: ${phone}\n` +
        (email ? `Email: ${email}\n` : '') +
        `\nPlease confirm review under strict institutional non-disclosure standards.`;

      const mailSubject = encodeURIComponent(`Institutional Mandate Docket [${randomRef}] - ${entityName}`);
      const mailtoUrl = `mailto:contact@omnifincon.com?subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`;

      // Store in localStorage for persistence
      try {
        const storedMandates = JSON.parse(localStorage.getItem('omni_mandates') || '[]');
        storedMandates.push({
          ref: randomRef,
          promoter: promoterName,
          entity: entityName,
          phone: phone,
          email: email,
          city: city,
          assetClass: assetClass,
          facility: facility,
          projectCost: cost,
          capitalReq: capital,
          date: new Date().toISOString()
        });
        localStorage.setItem('omni_mandates', JSON.stringify(storedMandates));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Show confirmation pane (Clean executive light styling)
      const container = document.querySelector('.mandate-form-container');
      if (container) {
        container.innerHTML = `
          <div style="text-align: center; padding: 3rem 1.5rem; animation: fadeIn 0.4s ease;">
            <div style="width: 72px; height: 72px; background: rgba(5, 150, 105, 0.12); border: 2px solid #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #059669; font-size: 2rem;">
              <i class="fa-solid fa-shield-check"></i>
            </div>
            <h3 style="font-size: 1.8rem; font-weight: 800; color: var(--brand-navy); margin-bottom: 0.8rem;">Project Mandate Logged</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 580px; margin: 0 auto 1.5rem; line-height: 1.6;">
              Thank you, <strong style="color: var(--brand-navy);">${promoterName}</strong> (${entityName}). Your preliminary financing mandate has been securely logged under docket <span style="color: #1d4ed8; font-family: monospace; font-weight: 700;">${randomRef}</span>.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.4rem; max-width: 500px; margin: 0 auto 2rem; text-align: left;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted);">Assigned Desk:</span>
                <span style="color: var(--brand-navy); font-weight: 600;">Real Estate & Debt Syndication Desk (Hyderabad)</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted);">Asset / Facility:</span>
                <span style="color: #1d4ed8; font-weight: 600;">${assetClass} • ${facility}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted);">Confidentiality:</span>
                <span style="color: #059669; font-weight: 600;">Institutional NDA Protected</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Target Review:</span>
                <span style="color: var(--brand-navy); font-weight: 600;">Within 24 Business Hours</span>
              </div>
            </div>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <a href="https://wa.me/919849000000?text=${waText}" target="_blank" class="btn" style="background: #059669; color: #ffffff; border: 1px solid #059669; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
                <i class="fa-brands fa-whatsapp"></i> Transmit to WhatsApp Desk
              </a>
              <a href="${mailtoUrl}" class="btn" style="background: #1d4ed8; color: #ffffff; border: 1px solid #1d4ed8; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
                <i class="fa-solid fa-envelope"></i> Email Partner Desk
              </a>
              <button onclick="window.location.reload()" class="btn btn-outline-gold" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                Submit Another Project
              </button>
            </div>
          </div>
        `;
      }
    });
  }
}

/* ==========================================================================
   Modals & Scheduling Dialogs
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      overlays.forEach(overlay => overlay.classList.remove('active'));
      document.body.style.overflow = 'auto';
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Advisory Consultation Form Handler
  const consultForm = document.getElementById('advisoryConsultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('consult-name');
      const companyEl = document.getElementById('consult-company');
      const phoneEl = document.getElementById('consult-phone');
      const emailEl = document.getElementById('consult-email');
      const targetEl = document.getElementById('consult-target');
      const slotEl = document.getElementById('consult-slot');

      const name = nameEl ? nameEl.value.trim() : 'Client';
      const company = companyEl ? companyEl.value.trim() : 'Enterprise';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const target = targetEl ? targetEl.value : '₹50 Cr to ₹100 Cr';
      const slot = slotEl ? slotEl.value : 'Immediate';

      const docketRef = 'OMNI-ADV-' + Math.floor(1000 + Math.random() * 9000);

      // Store in localStorage
      try {
        const storedConsultations = JSON.parse(localStorage.getItem('omni_consultations') || '[]');
        storedConsultations.push({
          ref: docketRef,
          name: name,
          company: company,
          phone: phone,
          email: email,
          target: target,
          slot: slot,
          date: new Date().toISOString()
        });
        localStorage.setItem('omni_consultations', JSON.stringify(storedConsultations));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // WhatsApp URL
      const waText = encodeURIComponent(
        `Hello Omni Fincon Advisory Desk,\n\nI have requested a Confidential Advisory Consultation.\nDocket Reference: *${docketRef}*\n*Promoter / Executive:* ${name}\n*Organization:* ${company}\n*Phone:* ${phone}\n*Email:* ${email}\n*Target Requirement:* ${target}\n*Preferred Slot:* ${slot}`
      );
      const waUrl = `https://wa.me/919849000000?text=${waText}`;

      // Mailto URL
      const mailSubject = encodeURIComponent(`Confidential Advisory Consultation [${docketRef}] - ${company}`);
      const mailBody = encodeURIComponent(
        `Dear Omni Fincon Advisory Partners,\n\nPlease confirm availability for our requested consultation:\n\n` +
        `Docket Reference: ${docketRef}\n` +
        `Promoter / Executive: ${name}\n` +
        `Organization: ${company}\n` +
        `Direct Phone: ${phone}\n` +
        `Work Email: ${email}\n` +
        `Target Funding Requirement: ${target}\n` +
        `Preferred Slot: ${slot}\n\n` +
        `Submitted under strict mutual non-disclosure.`
      );
      const mailtoUrl = `mailto:contact@omnifincon.com?subject=${mailSubject}&body=${mailBody}`;

      // Replace Modal Box content with executive confirmation
      const modalBox = consultForm.closest('.modal-content-box');
      if (modalBox) {
        modalBox.innerHTML = `
          <button class="modal-close-btn" aria-label="Close modal">&times;</button>
          <div style="text-align: center; padding: 1.5rem 0.5rem; animation: fadeIn 0.3s ease;">
            <div style="width: 64px; height: 64px; background: rgba(5, 150, 105, 0.12); border: 2px solid #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; color: #059669; font-size: 1.8rem;">
              <i class="fa-solid fa-check"></i>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--brand-navy); margin-bottom: 0.5rem;">Advisory Session Logged</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem; max-width: 480px; margin: 0 auto 1.2rem; line-height: 1.5;">
              Thank you, <strong style="color: var(--brand-navy);">${name}</strong>. Your consultation request for <strong style="color: var(--brand-navy);">${company}</strong> has been assigned docket:
            </p>
            <div style="display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.5rem 1.2rem; border-radius: 8px; font-family: monospace; font-size: 1.1rem; font-weight: 700; color: #166534; margin-bottom: 1.5rem;">
              ${docketRef}
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.2rem; max-width: 460px; margin: 0 auto 1.5rem; text-align: left; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                <span style="color: var(--text-secondary);">Target Requirement:</span>
                <span style="color: var(--brand-navy); font-weight: 600;">${target}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                <span style="color: var(--text-secondary);">Preferred Slot:</span>
                <span style="color: var(--brand-navy); font-weight: 600;">${slot}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Confidentiality:</span>
                <span style="color: #059669; font-weight: 600;">Protected by NDA</span>
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.2rem;">
              Transmit your docket directly to our Senior Advisory Desk:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 420px; margin: 0 auto;">
              <a href="${waUrl}" target="_blank" class="btn" style="background: #059669; color: #ffffff; border: 1px solid #059669; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem;"></i> Transmit via WhatsApp
              </a>
              <a href="${mailtoUrl}" class="btn" style="background: #1d4ed8; color: #ffffff; border: 1px solid #1d4ed8; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">
                <i class="fa-solid fa-envelope" style="font-size: 1.0rem;"></i> Transmit via Email Client
              </a>
            </div>
          </div>
        `;

        // Re-attach close listener to new close button
        const newCloseBtn = modalBox.querySelector('.modal-close-btn');
        if (newCloseBtn) {
          newCloseBtn.addEventListener('click', () => {
            const overlay = modalBox.closest('.modal-overlay');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
          });
        }
      }
    });
  }
}

/* ==========================================================================
   Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === 'index.html#') return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const targetId = href.substring(hashIndex);

      const path = window.location.pathname.toLowerCase();
      const isCurrentPage = href.startsWith('#') || 
                            path.includes('index.html') || 
                            path === '/' || 
                            path.endsWith('/') ||
                            path.endsWith('omini\\') ||
                            path.endsWith('omini/');

      if (isCurrentPage && targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const wrapper = document.querySelector('.header-master-wrapper') || document.querySelector('.site-header');
          const headerOffset = wrapper ? wrapper.offsetHeight + 12 : 95;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      }
    });
  });
}


/* ==========================================================================
   FAQ Accordion Initialization
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}


/* ==========================================================================
   Practice Switcher Tab Controller
   ========================================================================== */
function initPracticeTabs() {
  const tabBtns = document.querySelectorAll('.practice-tab-btn');
  const panels = document.querySelectorAll('.practice-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-practice');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}


/* ==========================================================================
   Animated Statistics Count-Up
   ========================================================================== */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);
          el.innerText = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.innerText = `${prefix}${target.toLocaleString('en-IN')}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}


/* ==========================================================================
   Scroll-Driven Reveal & Stagger Animation Engine
   ========================================================================== */
function initScrollAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;

  // Auto-register key sections and elements
  const revealSelectors = [
    '.section-header',
    '.pillar-item',
    '.tombstone-card',
    '.practice-tabs-container',
    '.calc-card-container',
    '.lender-category-card',
    '.spec-card',
    '.corporate-table-wrap',
    '.about-credentials-grid',
    '.office-details-card',
    '.map-canvas-box',
    '.mandate-form-container',
    '.service-card',
    '.endorsement-card'
  ];

  const elementsToReveal = document.querySelectorAll(revealSelectors.join(', '));
  
  // Assign staggered delays to sibling elements within grids
  const gridContainers = document.querySelectorAll('.pillar-grid, .deals-grid, .lender-categories, .spec-grid-3, .service-cards-grid');
  gridContainers.forEach(container => {
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.transitionDelay = `${(i % 4) * 80}ms`;
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elementsToReveal.forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}


/* ==========================================================================
   Page-to-Page Navigation Transition ("One Site to Another")
   ========================================================================== */
function initPageTransitions() {
  // Inject or get top progress bar
  let bar = document.querySelector('.page-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'page-progress-bar';
    document.body.prepend(bar);
  }

  // Quick completion pulse on initial load
  bar.classList.add('loading');
  setTimeout(() => {
    bar.classList.add('finished');
    setTimeout(() => {
      bar.classList.remove('loading', 'finished');
      bar.style.width = '0%';
    }, 350);
  }, 120);

  // Intercept internal page navigation links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Ignore in-page hash links, tel, mailto, target="_blank", etc.
    if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:') || link.target === '_blank') {
      return;
    }

    link.addEventListener('click', (e) => {
      // If clicking same page hash, allow default anchor behavior
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      if (href.includes('#') && href.split('#')[0] === currentPath) {
        return;
      }

      e.preventDefault();
      bar.classList.add('loading');
      document.body.classList.add('page-leaving');

      setTimeout(() => {
        window.location.href = href;
      }, 160);
    });
  });
}

/* ==========================================================================
   Executive Investment Banking Precision Cursor & Reticle Follower
   ========================================================================== */
function initIBCursor() {
  // Gracefully skip on touch-only mobile devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const follower = document.createElement('div');
  follower.className = 'ib-cursor-follower';
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let isMoving = false;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      followerX = mouseX;
      followerY = mouseY;
      isMoving = true;
    }
    follower.style.opacity = '1';
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
  });

  window.addEventListener('mousedown', () => {
    follower.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', () => {
    follower.classList.remove('is-clicking');
  });

  function renderFollower() {
    if (isMoving) {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Delegate interactive hover state
  const interactiveTarget = 'a, button, input[type="button"], input[type="submit"], input[type="range"], select, .btn, .nav-link, .calc-type-btn, .deal-filter-btn, .card-link-btn, .faq-question, .tombstone-card, .service-card, .brand-logo, [role="button"]';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveTarget)) {
      follower.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveTarget)) {
      follower.classList.remove('is-hovering');
    }
  });
}

/* ==========================================================================
   Hyderabad Real Estate Live Market Intelligence Wire
   ========================================================================== */
function initHydRealEstateWidget() {
  const widgetContainer = document.getElementById('hyd-re-widget');
  if (!widgetContainer) return;

  const STORAGE_KEY = 'hyd_re_rich_history_v1';
  const BATCH_SIZE = 5;
  let currentTab = 'fresh';
  let currentFreshBatch = [];

  const RSS_SOURCES = [
    'https://realty.economictimes.indiatimes.com/rss/lateststories',
    'https://realty.economictimes.indiatimes.com/rss/residential',
    'https://realty.economictimes.indiatimes.com/rss/commercial'
  ];

  const HYD_KEYWORDS = [
    'hyderabad', 'telangana', 'hmda', 'ghmc', 'kokapet', 'gachibowli',
    'kondapur', 'tellapur', 'neopolis', 'secunderabad', 'kompally',
    'financial district', 'hitec city', 'shadnagar', 'ts rera', 'tgrera'
  ];

  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=60';

  const FALLBACK_ARTICLES = [
    {
      title: "Kokapet Neopolis High-Rise Sanctions Trigger Fresh Wave of Institutional Construction Debt",
      snippet: "Telangana state infrastructure outlays and ultra-luxury residential towers drive syndicated project loans across Kokapet's golden mile.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=70",
      source: "Telangana Property Wire",
      link: "real-estate-finance.html",
      date: "Nov 2026"
    },
    {
      title: "Hyderabad Commercial Office Leasing Hits 9.5M Sq Ft; LRD Facilities See Accelerated Closings",
      snippet: "Grade-A office towers in the Financial District and HITEC City achieve high pre-commitments from multinational GCCs and BFSI anchors.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=70",
      source: "ETRealty Focus",
      link: "real-estate-finance.html",
      date: "Nov 2026"
    },
    {
      title: "TG-RERA Enforces Milestone-Linked Escrow Compliance Across Tellapur & Gachibowli Townships",
      snippet: "Regulatory scrutiny reinforces lender confidence in structured construction finance drawdowns synchronized with RERA completion milestones.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=70",
      source: "Regulatory Desk",
      link: "real-estate-finance.html",
      date: "Nov 2026"
    },
    {
      title: "HMDA Infrastructure Master Plan Expands Logistics & Plotted Corridors Towards Shamshabad",
      snippet: "Radial arterial connectivity spurs industrial warehousing parks and organized plotted villa layouts along the Outer Ring Road corridor.",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=70",
      source: "Urban Infrastructure Wire",
      link: "real-estate-finance.html",
      date: "Nov 2026"
    }
  ];

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
      updateHistoryCount();
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  function updateHistoryCount() {
    const countEl = document.getElementById('history-count');
    if (countEl) countEl.textContent = getHistory().length;
  }

  function cleanSnippet(htmlStr) {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlStr || '';
    const text = (tmp.textContent || tmp.innerText || '').trim();
    return text.length > 145 ? text.slice(0, 142) + '...' : text;
  }

  function extractThumbnail(item) {
    if (item.thumbnail && item.thumbnail.startsWith('http')) return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    const imgMatch = (item.description || '').match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
    return FALLBACK_IMG;
  }

  function renderArticles(articles, emptyMessage) {
    const container = document.getElementById('hyd-real-estate-feed');
    if (!container) return;

    if (!articles || articles.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); padding: 1.5rem 0; text-align: center; font-size: 0.9rem;">${emptyMessage}</p>`;
      return;
    }

    container.innerHTML = articles.map(item => `
      <article class="wire-article-item">
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="wire-article-thumb-link">
          <img 
            src="${item.image}" 
            alt="${item.title}" 
            onerror="this.src='${FALLBACK_IMG}'"
            class="wire-article-img"
            loading="lazy"
          />
        </a>
        <div class="wire-article-body">
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="wire-article-title">
            ${item.title}
          </a>
          <p class="wire-article-snippet">
            ${item.snippet}
          </p>
          <div class="wire-article-meta">
            <i class="fa-regular fa-clock"></i>
            <span>${item.source} • ${item.date}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  window.switchHydTab = function(tab) {
    currentTab = tab;
    const btnFresh = document.getElementById('btn-fresh');
    const btnHistory = document.getElementById('btn-history');

    if (tab === 'fresh') {
      if (btnFresh) btnFresh.classList.add('active');
      if (btnHistory) btnHistory.classList.remove('active');
      renderArticles(
        currentFreshBatch.length > 0 ? currentFreshBatch : FALLBACK_ARTICLES,
        'You are caught up on the latest Hyderabad stories. Check the <b>History</b> tab for previous alerts.'
      );
    } else {
      if (btnHistory) btnHistory.classList.add('active');
      if (btnFresh) btnFresh.classList.remove('active');
      const hist = getHistory();
      renderArticles(
        hist.length > 0 ? hist : FALLBACK_ARTICLES.slice(0, 2),
        'No news history recorded yet. Fresh stories will be automatically archived here.'
      );
    }
  };

  function loadHyderabadRealEstate() {
    updateHistoryCount();
    var history = getHistory();
    var seenLinks = new Set(history.map(function(h) { return h.link; }));
    var uniqueNewArticles = new Map();

    Promise.all(
      RSS_SOURCES.map(function(rssUrl) {
        return fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl))
          .then(function(r) { return r.json(); })
          .catch(function() { return null; });
      })
    ).then(function(responses) {
      responses.forEach(function(data) {
        if (data && data.status === 'ok' && Array.isArray(data.items)) {
          data.items.forEach(function(item) {
            if (seenLinks.has(item.link) || uniqueNewArticles.has(item.link)) return;

            var searchableText = (item.title + ' ' + (item.description || '')).toLowerCase();
            var isHyderabadRelated = HYD_KEYWORDS.some(function(kw) { return searchableText.indexOf(kw) !== -1; });

            if (isHyderabadRelated) {
              uniqueNewArticles.set(item.link, {
                title: item.title.trim(),
                snippet: cleanSnippet(item.description),
                image: extractThumbnail(item),
                source: 'ETRealty Telangana',
                link: item.link,
                date: new Date(item.pubDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })
              });
            }
          });
        }
      });

      var unseenList = Array.from(uniqueNewArticles.values());
      currentFreshBatch = unseenList.slice(0, BATCH_SIZE);

      if (currentFreshBatch.length > 0) {
        saveHistory(currentFreshBatch.concat(history));
      } else {
        currentFreshBatch = FALLBACK_ARTICLES;
      }

      if (currentTab === 'fresh') {
        window.switchHydTab('fresh');
      }
    }).catch(function(error) {
      console.warn('Real Estate Wire load notice, applying curated briefing:', error);
      currentFreshBatch = FALLBACK_ARTICLES;
      window.switchHydTab('fresh');
    });
  }

  loadHyderabadRealEstate();
}
