const arrivalSeg = {
  date: "2026-09-28T00:00:00.000Z",
  departTime: "20:10",
  arrivalTime: "00:10"
};
const departSeg = {
  date: "2026-09-29T00:00:00.000Z",
  departTime: "03:20",
  arrivalTime: "07:30"
};

function test() {
  let arrDateStr = arrivalSeg.date;
  const arrDate = new Date(arrDateStr);
  const depDate = new Date(departSeg.date);

  const [arrH, arrM] = (arrivalSeg.arrivalTime || "00:00").split(":").map(Number);
  const [depH_arrSeg, depM_arrSeg] = (arrivalSeg.departTime || "00:00").split(":").map(Number);
  const [depH, depM] = (departSeg.departTime || "00:00").split(":").map(Number);

  const arrTime = new Date(
    arrDate.getFullYear(),
    arrDate.getMonth(),
    arrDate.getDate(),
    arrH,
    arrM,
    0,
    0,
  );
  
  if (arrH < depH_arrSeg || (arrH === depH_arrSeg && arrM < depM_arrSeg)) {
    console.log("Adding 1 day to arrTime");
    arrTime.setDate(arrTime.getDate() + 1);
  }

  const depTime = new Date(
    depDate.getFullYear(),
    depDate.getMonth(),
    depDate.getDate(),
    depH,
    depM,
    0,
    0,
  );

  const diffMs = depTime.getTime() - arrTime.getTime();
  console.log("arrDateStr:", arrDateStr);
  console.log("arrDate:", arrDate);
  console.log("arrTime:", arrTime);
  console.log("depDate:", depDate);
  console.log("depTime:", depTime);
  console.log("diffMs:", diffMs);
  
  if (diffMs <= 0) {
    console.log("diffMs <= 0, returning empty string");
    return "";
  }
  
  const totalMins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  console.log("Returns:", `${hrs} hr ${mins} min`);
}

test();
