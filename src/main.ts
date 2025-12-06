import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header>
    <h1>TIME SINCE</h1>
  </header>
  <div class="durations-container">
    <h2>On average, you log every </h2>
    <div class="card" id="average-duration">
      ${formatDuration(0)}
    </div>
    <h2>Since your last log it's been </h2>
      <div class="card" id="running-duration">
        ${formatDuration(0)}
      </div>
    <button id="log-button" type="button">
      LOG
    </button>
  </div>
  <footer>
    <button id="reset-button" type="button">Reset logs.</button>
  </footer>
`
let interval:number;
const tick = () => {
  const average = getAverageDuration();
  const running = getRunningDuration();
  const runningElem = document.getElementById("running-duration");
  document.getElementById("average-duration")!.innerHTML = formatDuration(average);
  runningElem!.innerHTML = formatDuration(running, average);
  // runningElem!.classList = `card ${running >= average ? "good" : "bad"}`;
  document.getElementById("log-button")?.addEventListener("click", log);
  document.getElementById("reset-button")?.addEventListener("click", resetRecords);
  if (!interval) interval = setInterval(tick, 500);
};
tick();

type Timestamp = number;
type Entry = Timestamp;
type Records = Entry[];
type WrittenRecords = string;
function getRecords():Records{
  if (!storageAvailable("localStorage")) return [];
  const recordsStr:WrittenRecords = window.localStorage.getItem("logs") ?? "";
  return toList(recordsStr);
}
function writeRecords(r:Records):void {
  if (!storageAvailable("localStorage")) return;
  const recordsStr:WrittenRecords = toString(r);
  window.localStorage.setItem("logs", recordsStr);
}
function resetRecords():void {
  if (!storageAvailable("localStorage")) return;
  window.localStorage.setItem("logs", "");
}
function toList(s:WrittenRecords):Records {
  if (!s || !s.length) return [];
  return s.split(",").map(t => Number(t) as DOMHighResTimeStamp);
}
function toString(l: Records):WrittenRecords {
  if (!l || !l.length) return "";
  return l.map(t => String(t)).join(",");
}
function log():void {
  const old = getRecords();
  const now = Date.now();
  // nold is my new word for new, ie not-old
  const nold :Records = [now, ...old];
  writeRecords(nold);
}
function formatDuration(duration:number, average?:number|undefined){
  const validDuration = !isNaN(duration) && duration >= 0;
  const div = document.createElement("span");
  if (!validDuration) {
    div.innerText = `-- sec`
    return div.outerHTML;
  }
  div.innerText = msToStringDuration(duration);
  if (average) {
    div.classList.add(duration > average ? "good" : "bad")
  }
  return div.outerHTML;
}
function msToStringDuration(ms:number):string {
  let msRemaining = ms;
  const inSec = 1000;
  const inMin = inSec*60;
  const inHour = inMin*60;
  const inDay = inHour*24;
  let daysStr, hoursStr, minutesStr;
  if ( msRemaining >= inDay ) {
    const days = Math.floor(msRemaining / inDay);
    msRemaining = ms % inDay;
    daysStr = days ? (days > 1 ? `${days} days`: `${days} day`) : "";
  }
  if (msRemaining >= inHour) {
    const hours = Math.floor(msRemaining / inHour);
    msRemaining = msRemaining % inHour;
    hoursStr = hours ? (hours > 1 ? `${hours} hours`: `${hours} hour`): "";
  }
  if (msRemaining >= inMin) {
    const minutes = Math.floor(msRemaining / inMin);
    msRemaining = msRemaining % inMin;
    minutesStr = minutes ? (minutes > 1 ? `${minutes} minutes` : `${minutes} minute`) : ""
  }
  const seconds = Math.round(msRemaining/ inSec);
  const secondsStr = seconds ? `${seconds} seconds` : "0 seconds";
  return enumerate([daysStr, hoursStr, minutesStr, secondsStr]);
}
function enumerate(items:string[]): string {
  if (!items.length || items.every(s => !s)) return "";
  let values = items.filter(s => s);
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`

  const last = (i:number) => i === values.length-1;
  return values.map((s,i) => last(i) ? `and ${s}` : `${s},`).join(" ");
}
function getRunningDuration() {
  const now = Date.now();
  const then = getRecords()[0];
  return now - then;
}
function getAverageDuration() {
  const rs = getRecords();
  const starts = rs.slice(0, -1);
  const ends = rs.slice(1);
  const durations = starts.map((s,i) => s - ends[i]);
  const average_duration = durations.reduce((acc, val) => acc+val, 0)/durations.length;
  return average_duration;
}


type StorageType = "localStorage" |  "sessionStorage";
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type:StorageType):boolean {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

