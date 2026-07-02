const formatTime = (t) => {
  const ampmMatch = t.match(/([0-9]{1,4})\s*([AP][M]?)/i);
  if (ampmMatch) {
    let nums = ampmMatch[1];
    const isPm = ampmMatch[2].toUpperCase().startsWith('P');
    nums = nums.padStart(4, '0');
    let hours = parseInt(nums.substring(0, 2), 10);
    const mins = nums.substring(2, 4);
    if (isPm && hours < 12) hours += 12;
    if (!isPm && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${mins}`;
  }
  const timeMatch = t.match(/[0-9]{2}:?[0-9]{2}/);
  if (!timeMatch) return t;
  const clean = timeMatch[0].replace(':', '');
  return `${clean.substring(0, 2)}:${clean.substring(2, 4)}`;
};

console.log("215P ->", formatTime("215P"));
console.log("1230A ->", formatTime("1230A"));
console.log("655A ->", formatTime("655A"));
console.log("1230 ->", formatTime("1230"));
