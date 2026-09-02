// WireFree Charge - FormSpace Pilot & Partner Portal
document.addEventListener('DOMContentLoaded', () => {
  const trackButtons = document.querySelectorAll('.formspace-track-btn');
  const trackTitle = document.getElementById('formspaceTrackTitle');
  const trackDesc = document.getElementById('formspaceTrackDesc');
  const dynamicFieldLabel = document.getElementById('formspaceDynamicLabel');
  const dynamicFieldInput = document.getElementById('formspaceDynamicInput');
  const partnerForm = document.getElementById('partnerInquiryForm');
  const modalSuccess = document.getElementById('formspaceModal');
  const btnCloseModal = document.getElementById('btnCloseFormspaceModal');
  const summaryBox = document.getElementById('formspaceSummaryContent');

  let currentTrack = 'fleet';

  const trackConfig = {
    fleet: {
      title: 'B2B Commercial Fleet Operator Pilot',
      desc: 'Deploy static wireless charging pads at your depot or pilot opportunity charging on fixed city corridors to eliminate vehicle downtime.',
      label: 'Estimated Fleet Size (No. of Electric Cabs/Vans)',
      placeholder: 'e.g. 50 Electric Sedans / 20 Delivery Vans'
    },
    highway: {
      title: 'Highway Infrastructure & NHAI Repaving Corridor',
      desc: 'Partner for integration of passive dynamic WPT coils during scheduled 5-7 year highway repaving or 4-to-6 lane expansion projects.',
      label: 'Target Highway Stretch / Corridor Length (km)',
      placeholder: 'e.g. NH-48 / 15 km scheduled repaving overlay'
    },
    oem: {
      title: 'EV OEM Adaptive Receiver Licensing',
      desc: 'License our patent-pending active suspension actuator and vehicle-side resonance tuning circuits for factory-installed integration.',
      label: 'Vehicle Segment / Target Platform',
      placeholder: 'e.g. Passenger EV Platform / Electric Light Commercial Vehicle'
    },
    investor: {
      title: 'Investor, TBI & Grant Evaluation Access',
      desc: 'Request full SSV grant documentation, MATLAB/ANSYS simulation test logs, and early-stage pre-incubation equity discussions.',
      label: 'Investment Firm / Fund / Institutional Affiliation',
      placeholder: 'e.g. CleanTech Angel Syndicate / Government Seed Fund'
    }
  };

  trackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackButtons.forEach(b => {
        b.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-400');
        b.classList.add('border-white/10', 'text-slate-400');
      });
      btn.classList.add('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-400');
      btn.classList.remove('border-white/10', 'text-slate-400');

      currentTrack = btn.getAttribute('data-track');
      const cfg = trackConfig[currentTrack];
      if (trackTitle) trackTitle.textContent = cfg.title;
      if (trackDesc) trackDesc.textContent = cfg.desc;
      if (dynamicFieldLabel) dynamicFieldLabel.textContent = cfg.label;
      if (dynamicFieldInput) dynamicFieldInput.placeholder = cfg.placeholder;
    });
  });

  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fpName').value.trim();
      const email = document.getElementById('fpEmail').value.trim();
      const org = document.getElementById('fpOrg').value.trim();
      const dynamicVal = dynamicFieldInput.value.trim();
      const timeline = document.getElementById('fpTimeline').value;
      const message = document.getElementById('fpMessage').value.trim();

      if (!name || !email || !org) {
        alert('Please fill in your Name, Email, and Organization to proceed.');
        return;
      }

      const summaryHtml = `
        <div class="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 font-mono text-sm space-y-2">
          <div class="flex justify-between border-b border-white/10 pb-2">
            <span class="text-slate-400">Track:</span>
            <span class="text-emerald-400 font-semibold">${trackConfig[currentTrack].title}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Partner / Lead:</span>
            <span class="text-white">${name} (${org})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Contact:</span>
            <span class="text-cyan-400">${email}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Scope:</span>
            <span class="text-slate-200">${dynamicVal || 'Standard Pilot'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Timeline:</span>
            <span class="text-emerald-300">${timeline}</span>
          </div>
          <div class="border-t border-white/10 pt-2 text-xs text-slate-400">
            Routing directly to Silicon Syndicate Founders & Dr. Prakash R (VIT Mentor).
          </div>
        </div>
      `;

      if (summaryBox) summaryBox.innerHTML = summaryHtml;
      if (modalSuccess) modalSuccess.classList.remove('hidden');
    });
  }

  if (btnCloseModal && modalSuccess) {
    btnCloseModal.addEventListener('click', () => {
      modalSuccess.classList.add('hidden');
      if (partnerForm) partnerForm.reset();
    });
  }
});
