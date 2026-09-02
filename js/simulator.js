// WireFree Charge - Dynamic Wireless Charging Canvas Simulator
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('chargingSimulatorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let speedKmH = 80;
  let airGapCm = 15;
  let alignmentCm = 0;
  let isRunning = true;
  let mode = 'dynamic';
  let carX = 80;
  let batterySoC = 42.0;

  const speedSlider = document.getElementById('simSpeed');
  const speedVal = document.getElementById('simSpeedVal');
  const gapSlider = document.getElementById('simGap');
  const gapVal = document.getElementById('simGapVal');
  const alignSlider = document.getElementById('simAlign');
  const alignVal = document.getElementById('simAlignVal');
  
  const pwrDisplay = document.getElementById('simPowerDisplay');
  const effDisplay = document.getElementById('simEffDisplay');
  const socDisplay = document.getElementById('simSocDisplay');
  const activeCoilDisplay = document.getElementById('simActiveCoil');
  const btnToggleSim = document.getElementById('btnToggleSim');
  const btnResetSim = document.getElementById('btnResetSim');
  const btnModeDynamic = document.getElementById('btnModeDynamic');
  const btnModeStatic = document.getElementById('btnModeStatic');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 360;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const coilSpacing = 220;
  const coilWidth = 140;
  const coilHeight = 16;
  const roadY = 240;

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      speedKmH = parseFloat(e.target.value);
      if (speedVal) speedVal.textContent = `${speedKmH} km/h`;
    });
  }
  if (gapSlider) {
    gapSlider.addEventListener('input', (e) => {
      airGapCm = parseFloat(e.target.value);
      if (gapVal) gapVal.textContent = `${airGapCm} cm`;
    });
  }
  if (alignSlider) {
    alignSlider.addEventListener('input', (e) => {
      alignmentCm = parseFloat(e.target.value);
      if (alignVal) alignVal.textContent = `${alignmentCm > 0 ? '+' : ''}${alignmentCm} cm`;
    });
  }
  if (btnToggleSim) {
    btnToggleSim.addEventListener('click', () => {
      isRunning = !isRunning;
      btnToggleSim.textContent = isRunning ? 'Pause Simulation' : 'Resume Simulation';
    });
  }
  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      carX = 60;
      batterySoC = 42.0;
    });
  }
  if (btnModeDynamic && btnModeStatic) {
    btnModeDynamic.addEventListener('click', () => {
      mode = 'dynamic';
      btnModeDynamic.className = 'px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all';
      btnModeStatic.className = 'px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all';
    });
    btnModeStatic.addEventListener('click', () => {
      mode = 'static';
      carX = canvas.width / 2 - 80;
      btnModeStatic.className = 'px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all';
      btnModeDynamic.className = 'px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all';
    });
  }

  let fluxPulse = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Highway Asphalt (Clean Graphite)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, roadY, canvas.width, canvas.height - roadY);

    // Surface line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    ctx.lineTo(canvas.width, roadY);
    ctx.stroke();

    // Road dashed lane markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([24, 20]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, roadY + 70);
    ctx.lineTo(canvas.width, roadY + 70);
    ctx.stroke();
    ctx.setLineDash([]);

    const carWidth = 160;
    const carHeight = 65;
    const receiverWidth = 100;
    const receiverHeight = 10;
    
    const airGapPx = (airGapCm / 15) * 35;
    const carY = roadY - airGapPx - carHeight;
    const receiverY = roadY - airGapPx + (carHeight - 12);
    const receiverX = carX + (carWidth - receiverWidth) / 2 + (alignmentCm * 2);

    if (isRunning && mode === 'dynamic') {
      const pxSpeed = (speedKmH / 100) * 3.5;
      carX += pxSpeed;
      if (carX > canvas.width + 60) {
        carX = -carWidth;
      }
    }

    let isCharging = false;
    let currentPowerKW = 0;
    let currentEff = 91.5;
    let activeCoilId = 'Standby (Searching)';

    fluxPulse += 0.08;

    const numCoils = Math.ceil(canvas.width / coilSpacing) + 2;
    for (let i = 0; i < numCoils; i++) {
      const coilX = i * coilSpacing + 40;
      const coilY = roadY + 8;
      const coilCenterX = coilX + coilWidth / 2;

      const dist = Math.abs((receiverX + receiverWidth / 2) - coilCenterX);
      const inRange = dist < (coilWidth / 2 + 10);

      if (inRange) {
        isCharging = true;
        activeCoilId = `Coil #0${(i % 8) + 1} (Active 85 kHz)`;
        
        const gapPenalty = Math.max(0, (airGapCm - 10) * 1.8);
        const alignPenalty = Math.abs(alignmentCm) * 0.9;
        currentEff = Math.max(78, (94.2 - gapPenalty - alignPenalty)).toFixed(1);
        currentPowerKW = ((currentEff / 100) * 55).toFixed(1);

        batterySoC = Math.min(100, batterySoC + 0.0035 * (currentPowerKW / 50));

        // Active ground coil (Electric Mint)
        ctx.fillStyle = '#065F46';
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 16;
        ctx.fillRect(coilX, coilY, coilWidth, coilHeight);
        ctx.strokeRect(coilX, coilY, coilWidth, coilHeight);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#6EE7B7';
        ctx.lineWidth = 1.5;
        for (let l = 1; l <= 3; l++) {
          ctx.strokeRect(coilX + l * 12, coilY + 2, coilWidth - l * 24, coilHeight - 4);
        }

        // Magnetic Flux Lines
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.5 + Math.sin(fluxPulse) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);

        for (let f = 0; f < 5; f++) {
          const fx = coilX + 18 + f * 24;
          const targetFx = receiverX + 12 + f * 18;
          ctx.beginPath();
          ctx.moveTo(fx, coilY);
          ctx.bezierCurveTo(fx, coilY - airGapPx * 0.5, targetFx, receiverY + airGapPx * 0.5, targetFx, receiverY + receiverHeight);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Upward Beam
        const gradient = ctx.createLinearGradient(0, coilY, 0, receiverY);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(coilX + 15, receiverY + receiverHeight, coilWidth - 30, (coilY - receiverY - receiverHeight));

      } else {
        // Inactive coil
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.fillRect(coilX, coilY, coilWidth, coilHeight);
        ctx.strokeRect(coilX, coilY, coilWidth, coilHeight);

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(coilX + 15, coilY + 3, coilWidth - 30, coilHeight - 6);
      }

      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px monospace';
      ctx.fillText(`TX-COIL ${(i%8)+1}`, coilX + 38, coilY + coilHeight + 14);
    }

    // Wheels
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(carX + 32, roadY - 4, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(carX + carWidth - 32, roadY - 4, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isCharging ? '#10B981' : '#CBD5E1';
    ctx.beginPath();
    ctx.arc(carX + 32, roadY - 4, 6, 0, Math.PI * 2);
    ctx.arc(carX + carWidth - 32, roadY - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Modern Vehicle Body (Cobalt & Pearl Silver)
    const bodyGrad = ctx.createLinearGradient(carX, carY, carX + carWidth, carY + carHeight);
    bodyGrad.addColorStop(0, '#2563EB');
    bodyGrad.addColorStop(0.5, '#1E40AF');
    bodyGrad.addColorStop(1, '#0F172A');

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = isCharging ? '#10B981' : '#60A5FA';
    ctx.lineWidth = 2;
    if (isCharging) {
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.moveTo(carX + 10, carY + carHeight - 6);
    ctx.lineTo(carX + carWidth - 10, carY + carHeight - 6);
    ctx.quadraticCurveTo(carX + carWidth, carY + carHeight - 6, carX + carWidth - 6, carY + 36);
    ctx.lineTo(carX + carWidth - 36, carY + 18);
    ctx.lineTo(carX + 90, carY + 6);
    ctx.lineTo(carX + 40, carY + 12);
    ctx.lineTo(carX + 14, carY + 32);
    ctx.quadraticCurveTo(carX, carY + carHeight - 6, carX + 10, carY + carHeight - 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Windows
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.moveTo(carX + 46, carY + 16);
    ctx.lineTo(carX + 88, carY + 10);
    ctx.lineTo(carX + carWidth - 44, carY + 20);
    ctx.lineTo(carX + carWidth - 48, carY + 32);
    ctx.lineTo(carX + 38, carY + 32);
    ctx.closePath();
    ctx.fill();

    // Receiver Coil
    ctx.fillStyle = '#065F46';
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2;
    ctx.fillRect(receiverX, receiverY, receiverWidth, receiverHeight);
    ctx.strokeRect(receiverX, receiverY, receiverWidth, receiverHeight);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = '8px monospace';
    ctx.fillText('ACTIVE RECEIVER (85kHz)', receiverX + 3, receiverY + 8);

    // Battery Pack
    const battX = carX + 40;
    const battY = carY + carHeight - 26;
    const battW = carWidth - 80;
    const battH = 14;

    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 1.5;
    ctx.fillRect(battX, battY, battW, battH);
    ctx.strokeRect(battX, battY, battW, battH);

    const fillW = (battW - 4) * (batterySoC / 100);
    ctx.fillStyle = isCharging ? '#10B981' : '#3B82F6';
    ctx.fillRect(battX + 2, battY + 2, fillW, battH - 4);

    if (isCharging) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px sans-serif';
      ctx.fillText('⚡', battX + battW / 2 - 4, battY + 11);
    }

    if (pwrDisplay) pwrDisplay.textContent = isCharging ? `${currentPowerKW} kW` : '0.0 kW';
    if (effDisplay) effDisplay.textContent = isCharging ? `${currentEff}%` : '-- %';
    if (socDisplay) socDisplay.textContent = `${batterySoC.toFixed(1)}%`;
    if (activeCoilDisplay) {
      activeCoilDisplay.textContent = activeCoilId;
      activeCoilDisplay.className = isCharging ? 'text-emerald-600 font-semibold' : 'text-slate-500 font-normal';
    }
  }

  animate();
});
