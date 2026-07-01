const currentFlight = {
  date: "2026-09-28T00:00:00.000Z",
  departTime: "20:10",
  arrivalTime: "00:10",
  arrivedAt: "Dubai International Airport Al (DXB)"
};
const nextFlight = {
  date: "2026-09-29T00:00:00.000Z",
  departTime: "03:20",
  departedFrom: "Dubai International Airport Al (DXB)"
};

const extractCode = (str) => {
  const match = str.match(/\(([^)]+)\)/);
  return match ? match[1].toUpperCase() : str.toUpperCase();
};

const codeA = extractCode(currentFlight.arrivedAt);
const codeB = extractCode(nextFlight.departedFrom);

if (codeA && codeB && codeA === codeB) {
  let arrDateStr = currentFlight.date;
  const arrDate = new Date(arrDateStr);
  const depDate = new Date(nextFlight.date);

  const [arrH, arrM] = (currentFlight.arrivalTime || "00:00").split(":").map(Number);
  const [depH_arrSeg, depM_arrSeg] = (currentFlight.departTime || "00:00").split(":").map(Number);
  const [depH, depM] = (nextFlight.departTime || "00:00").split(":").map(Number);

  const arrTime = new Date(
    arrDate.getFullYear(),
    arrDate.getMonth(),
    arrDate.getDate(),
    arrH,
    arrM,
  );
  
  if (arrH < depH_arrSeg || (arrH === depH_arrSeg && arrM < depM_arrSeg)) {
    arrTime.setDate(arrTime.getDate() + 1);
  }

  const depTime = new Date(
    depDate.getFullYear(),
    depDate.getMonth(),
    depDate.getDate(),
    depH,
    depM,
  );

  const diffMs = depTime.getTime() - arrTime.getTime();
  console.log("diffMs:", diffMs, "hours:", diffMs / 1000 / 3600);
  console.log("isConnecting:", diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000);
}
