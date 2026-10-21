/* İNCİ BOYA TADİLAT — Değiştirilebilir fiyat ve iletişim ayarları */
const CONFIG = {
  whatsappNumber: '905435475855',
  instagramUsername: 'inciboyatadilat', // Hesabı açarken bu kullanıcı adını almayı deneyin; farklıysa değiştirin.
  baseArea: 70,
  basePrice: 15000, // 70 m² / 2+1 / boş / yalnız duvar / iyi yüzey / benzer renk / malzeme dahil
  minimumPrice: 5500,
  furnishedExtra: 1500,
  ceilingPerSqm: 28,
  colorChangePerSqm: 15,
  smallRepairExtra: 750,
  mediumRepairExtra: 2000,
  // Ağır tamirat ve rutubet için otomatik kesin bedel YOK; keşif önerilir.
};

const $ = (selector) => document.querySelector(selector);
const money = (n) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n) + ' ₺';
const chosen = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value;
const waUrl = (text) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
let currentPage = 1;

function showPage(page) {
  currentPage = page;
  document.querySelectorAll('.form-page').forEach(el => el.classList.toggle('active', Number(el.dataset.page) === page));
  document.querySelectorAll('[data-step-indicator]').forEach(el => {
    const step = Number(el.dataset.stepIndicator);
    el.classList.toggle('active', step === page);
    el.classList.toggle('done', step < page);
  });
  $('#hesapla').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function getInputs() {
  return {
    homeType: $('#homeType').value,
    area: Number($('#area').value),
    furnished: chosen('furnished'),
    scope: chosen('scope'),
    partialArea: Number($('#partialArea').value),
    colorChange: chosen('colorChange'),
    ceiling: chosen('ceiling'),
    repair: $('#repair').value,
    damp: chosen('damp')
  };
}
function validate() {
  const x = getInputs();
  const areaValid = Number.isFinite(x.area) && x.area >= 15 && x.area <= 500;
  $('#areaError').textContent = areaValid ? '' : 'Lütfen 15 ile 500 arasında bir metrekare girin.';
  const partialValid = x.scope !== 'kismi' || (Number.isFinite(x.partialArea) && x.partialArea >= 10 && x.partialArea <= x.area);
  $('#partialError').textContent = partialValid ? '' : 'Boyanacak alan 10 m² ile evin net alanı arasında olmalı.';
  return areaValid && partialValid;
}
function estimate(x) {
  const effectiveArea = x.scope === 'kismi' ? x.partialArea : x.area;
  // Alan büyüdükçe birim fiyatı hafifçe düşüren katsayı. 70 m² tam 15.000 ₺.
  const base = CONFIG.basePrice * Math.pow(effectiveArea / CONFIG.baseArea, 0.88);
  const lines = [['Standart duvar boyası (malzeme + işçilik)', base]];
  if (x.furnished === 'esyali') lines.push(['Eşyalı ev koruma ve hazırlık', CONFIG.furnishedExtra]);
  if (x.ceiling === 'evet') lines.push(['Tavan boyama', effectiveArea * CONFIG.ceilingPerSqm]);
  if (x.colorChange === 'evet') lines.push(['Renk değişimi / ek kat payı', effectiveArea * CONFIG.colorChangePerSqm]);
  if (x.repair === 'kucuk') lines.push(['Küçük çatlak/delik tamiri', CONFIG.smallRepairExtra]);
  if (x.repair === 'orta') lines.push(['Orta düzey yüzey tamiri', CONFIG.mediumRepairExtra]);
  const raw = lines.reduce((sum, [, value]) => sum + value, 0);
  const final = Math.max(CONFIG.minimumPrice, Math.round(raw / 250) * 250);
  const notes = [];
  if (raw < CONFIG.minimumPrice) notes.push('Küçük işler için minimum servis bedeli uygulanmıştır.');
  if (x.repair === 'buyuk') notes.push('Yoğun tamirat bedeli hesaba katılmamıştır; fotoğraf veya yerinde keşifle ayrıca fiyatlandırılır.');
  if (x.damp === 'evet') notes.push('Rutubet/küf giderimi hesaba katılmamıştır; kaynağı incelenmeden kesin fiyat verilemez.');
  return { effectiveArea, lines, final, notes };
}
function renderResult() {
  const x = getInputs();
  const quote = estimate(x);
  $('#resultPrice').textContent = money(quote.final);
  const safeDiv = (className, text1, text2) => {
    const line = document.createElement('div'); line.className = className;
    const a = document.createElement('span'); a.textContent = text1;
    const b = document.createElement('span'); b.textContent = text2;
    line.append(a, b); return line;
  };
  const breakdown = $('#resultBreakdown'); breakdown.replaceChildren();
  breakdown.append(safeDiv('break-line', 'Boyanacak yaklaşık alan', `${quote.effectiveArea} m²`));
  quote.lines.forEach(([label, value]) => breakdown.append(safeDiv('break-line', label, money(Math.round(value / 250) * 250))));
  breakdown.append(safeDiv('break-line', 'Toplam tahmini fiyat', money(quote.final)));
  const notesEl = $('#resultNotes'); notesEl.replaceChildren();
  quote.notes.forEach(note => { const p = document.createElement('p'); p.textContent = '⚠ ' + note; notesEl.append(p); });
  const details = [
    'Merhaba, İnci Boya Tadilat web sitesinden tahmini fiyat hesapladım.',
    '',
    `Ev tipi: ${x.homeType}`,
    `Evin net alanı: ${x.area} m²`,
    `Boyama alanı: ${x.scope === 'tum' ? 'Tüm ev' : `Belirli odalar (${x.partialArea} m²)`}`,
    `Ev: ${x.furnished === 'bos' ? 'Boş' : 'Eşyalı'}`,
    `Renk değişimi: ${x.colorChange === 'evet' ? 'Evet' : 'Hayır'}`,
    `Tavan: ${x.ceiling === 'evet' ? 'Boyanacak' : 'Boyanmayacak'}`,
    `Duvar durumu: ${{yok:'İyi',kucuk:'Küçük tamirat',orta:'Orta tamirat',buyuk:'Yoğun tamirat'}[x.repair]}`,
    `Rutubet/küf: ${x.damp === 'evet' ? 'Var / emin değilim' : 'Yok'}`,
    `Sitedeki yaklaşık fiyat: ${money(quote.final)}`,
    ...(quote.notes.length ? ['Not: ' + quote.notes.join(' ')] : []),
    '',
    'Uygunluğunuzu ve kesin fiyatı görüşebilir miyiz?'
  ];
  $('#quoteWhatsapp').href = waUrl(details.join('\n'));
  showPage(3);
}
$('#nextBtn').addEventListener('click', () => { if (validate()) showPage(2); });
$('#backBtn').addEventListener('click', () => showPage(1));
$('#resultBtn').addEventListener('click', renderResult);
$('#restartBtn').addEventListener('click', () => { $('#quoteForm').reset(); $('#partialAreaRow').classList.add('hidden'); $('#areaError').textContent = ''; $('#partialError').textContent = ''; showPage(1); });
document.querySelectorAll('input[name="scope"]').forEach(input => input.addEventListener('change', () => $('#partialAreaRow').classList.toggle('hidden', chosen('scope') !== 'kismi')));
$('#quoteForm').addEventListener('submit', e => e.preventDefault());
$('#year').textContent = new Date().getFullYear();
$('#instagramLink').href = `https://www.instagram.com/${CONFIG.instagramUsername}/`;
