// WireFree Charge - Deploy With Us Portal & Direct Mail Dispatch
document.addEventListener('DOMContentLoaded', () => {
  const trackButtons = document.querySelectorAll('.deploy-track-btn');
  const trackTitle = document.getElementById('deployTrackTitle');
  const trackDesc = document.getElementById('deployTrackDesc');
  const dynamicFieldLabel = document.getElementById('deployDynamicLabel');
  const dynamicFieldInput = document.getElementById('deployDynamicInput');
  const partnerForm = document.getElementById('deployInquiryForm');
  const modalSuccess = document.getElementById('deployModal');
  const btnCloseModal = document.getElementById('btnCloseDeployModal');
  const summaryBox = document.getElementById('deploySummaryContent');

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
      title: 'Investor & Strategic Capital Inquiry',
      desc: 'Request commercial deck, MATLAB/ANSYS simulation test logs, and early-stage equity partnership discussions.',
      label: 'Investment Firm / Fund / Angel Syndicate',
      placeholder: 'e.g. CleanTech Capital / Automotive Ventures Fund'
    }
  };

  trackButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackButtons.forEach(b => {
        b.className = 'deploy-track-btn px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-mono font-semibold hover:border-blue-500 hover:text-blue-600 transition-all';
      });
      btn.className = 'deploy-track-btn active px-3.5 py-2.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-600 text-xs font-mono font-semibold shadow-sm transition-all';

      currentTrack = btn.getAttribute('data-track');
      const cfg = trackConfig[currentTrack];
      if (trackTitle) trackTitle.textContent = cfg.title;
      if (trackDesc) trackDesc.textContent = cfg.desc;
      if (dynamicFieldLabel) dynamicFieldLabel.textContent = cfg.label;
      if (dynamicFieldInput) dynamicFieldInput.placeholder = cfg.placeholder;
    });
  });

  if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
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

      // Submit to Formspree for elamaranyuvaraj@gmail.com
      const submitBtn = partnerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Routing to Engineering Team...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/elamaranyuvaraj@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
          },
          body: JSON.stringify({
            _subject: `New WireFree Charge Pilot: ${name} (${org})`,
            _template: 'table',
            track: trackConfig[currentTrack].title,
            fullName: name,
            workEmail: email,
            organization: org,
            projectScope: dynamicVal || 'Standard Pilot',
            timeline: timeline,
            message: message || 'N/A'
          })
        });
        const resData = await response.json();
        console.log('FormSubmit delivery result:', resData);
      } catch (err) {
        console.log('Form submission logged locally:', err);
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const summaryHtml = `
        <div class="p-5 rounded-2xl bg-slate-50 border border-blue-100 font-mono text-xs space-y-2.5 text-slate-700">
          <div class="flex justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500">Track:</span>
            <span class="text-blue-600 font-bold">${trackConfig[currentTrack].title}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Lead / Contact:</span>
            <span class="text-slate-900 font-semibold">${name} (${org})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Work Email:</span>
            <span class="text-blue-600">${email}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Project Scope:</span>
            <span class="text-slate-900">${dynamicVal || 'Standard Pilot'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Timeline:</span>
            <span class="text-emerald-600 font-semibold">${timeline}</span>
          </div>
          <div class="border-t border-slate-200 pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Sent directly to:</span>
            <strong class="text-blue-600">elamaranyuvaraj@gmail.com</strong>
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
