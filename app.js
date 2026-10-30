import { krediHesaplama, krediHatasi } from "./hesap.js";

const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", signDisplay: "negative" });
const yuzde = new Intl.NumberFormat("tr-TR", { style: "percent", maximumFractionDigits: 2 });

const form = document.querySelector("#kredi-formu");
const anaParaAlani = document.querySelector("#anaPara");
const anaParaHata = document.querySelector("#anaPara-hata");
const sonuclar = document.querySelector("#sonuclar");
const tabloGovdesi = document.querySelector("#odeme-plani");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const metin = anaParaAlani.value;
  const hataMesaji = krediHatasi(metin);
  if (hataMesaji) {
    anaParaHata.textContent = hataMesaji;
    anaParaAlani.setAttribute("aria-invalid", "true");
    sonuclar.hidden = true;
    anaParaAlani.focus();
    return;
  }
  anaParaHata.textContent = "";
  anaParaAlani.removeAttribute("aria-invalid");

  const anaPara = Number(metin);
  const krediTuru = document.querySelector("#krediTuru").value;
  const taksitSayisi = Number(document.querySelector("#taksitSayisi").value);
  const krediSonuc = krediHesaplama(anaPara, taksitSayisi, krediTuru);

  document.querySelector("#ozet-taksit").textContent = tl.format(krediSonuc.taksitTutari);
  document.querySelector("#ozet-faiz").textContent = tl.format(krediSonuc.toplamFaiz);
  document.querySelector("#ozet-toplam").textContent = tl.format(krediSonuc.toplamTutar);
  document.querySelector("#ozet-oran").textContent = yuzde.format(krediSonuc.aylikFaizOrani);

  tabloGovdesi.innerHTML = krediSonuc.satirlar.map((ay) => `
    <tr>
      <td>${ay.ay}</td>
      <td>${tl.format(ay.taksitTutari)}</td>
      <td>${tl.format(ay.faiz)}</td>
      <td>${tl.format(ay.anaparaPayi)}</td>
      <td>${tl.format(ay.kalan)}</td>
    </tr>
  `).join("");

  sonuclar.hidden = false;
});