// WireFree Charge - B2B Fleet Economics & ROI Calculator
document.addEventListener('DOMContentLoaded', () => {
  const fleetInput = document.getElementById('calcFleetSize');
  const fleetVal = document.getElementById('calcFleetVal');
  const kmInput = document.getElementById('calcDailyKm');
  const kmVal = document.getElementById('calcKmVal');
  const vehicleType = document.getElementById('calcVehicleType');

  const outHoursSaved = document.getElementById('calcOutHoursSaved');
  const outAnnualRev = document.getElementById('calcOutAnnualRev');
  const outBatterySaved = document.getElementById('calcOutBatterySaved');
  const outPaybackMonths = document.getElementById('calcOutPaybackMonths');

  function calculateROI() {
    if (!fleetInput || !kmInput) return;
    const fleetSize = parseInt(fleetInput.value) || 25;
    const dailyKm = parseInt(kmInput.value) || 200;
    const vType = vehicleType ? vehicleType.value : 'cab'; // 'cab', 'van', 'bus'

    // Parameters based on Indian commercial EV fleets
    let revenuePerHour = 450; // INR per active operating hour
    let hoursWiredPerDay = 3.5; // Average plug-in charging downtime
    let batterySavingsPerUnit = 1.2; // Lakhs saved from downsizing battery

    if (vType === 'van') {
      revenuePerHour = 600;
      hoursWiredPerDay = 4.0;
      batterySavingsPerUnit = 1.6;
    } else if (vType === 'bus') {
      revenuePerHour = 1800;
      hoursWiredPerDay = 5.0;
      batterySavingsPerUnit = 4.5;
    }

    // Calculations
    const dailyHoursSavedTotal = (fleetSize * (hoursWiredPerDay * 0.75)).toFixed(0);
    
    // Revenue increase = Active hours gained * revenue per hour * 330 operational days
    const annualRevIncreaseInLakhs = ((dailyHoursSavedTotal * revenuePerHour * 330) / 100000).toFixed(1);
    const totalBatterySavedInLakhs = (fleetSize * batterySavingsPerUnit).toFixed(1);

    // Payback period
    // Assumed receiver kit retrofit + depot infrastructure share: approx 65k INR per vehicle
    const totalInvestmentInLakhs = (fleetSize * 0.65);
    const annualGains = parseFloat(annualRevIncreaseInLakhs);
    const paybackMonths = Math.max(3.2, Math.min(24, (totalInvestmentInLakhs / annualGains) * 12)).toFixed(1);

    if (outHoursSaved) outHoursSaved.textContent = `${dailyHoursSavedTotal} hrs/day`;
    if (outAnnualRev) outAnnualRev.textContent = `₹${annualRevIncreaseInLakhs} L`;
    if (outBatterySaved) outBatterySaved.textContent = `₹${totalBatterySavedInLakhs} L`;
    if (outPaybackMonths) outPaybackMonths.textContent = `${paybackMonths} Mo.`;
  }

  if (fleetInput) {
    fleetInput.addEventListener('input', (e) => {
      if (fleetVal) fleetVal.textContent = `${e.target.value} EVs`;
      calculateROI();
    });
  }

  if (kmInput) {
    kmInput.addEventListener('input', (e) => {
      if (kmVal) kmVal.textContent = `${e.target.value} km/day`;
      calculateROI();
    });
  }

  if (vehicleType) {
    vehicleType.addEventListener('change', calculateROI);
  }

  calculateROI();
});
