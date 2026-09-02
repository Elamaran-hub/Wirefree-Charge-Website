// WireFree Charge - Main UI Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  if (btnMobileMenu && mobileMenu) {
    btnMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (mobileMenu) mobileMenu.classList.add('hidden');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Architecture Tabs
  const archTabs = document.querySelectorAll('.arch-tab-btn');
  const archPanels = document.querySelectorAll('.arch-panel');
  archTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      archTabs.forEach(b => {
        b.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-400');
        b.classList.add('border-white/10', 'text-slate-400');
      });
      btn.classList.add('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-400');
      btn.classList.remove('border-white/10', 'text-slate-400');

      const targetId = btn.getAttribute('data-arch');
      archPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');
        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // Lucide Icons initialization
  if (window.lucide) {
    lucide.createIcons();
  }
});
