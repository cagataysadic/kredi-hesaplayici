export function krediHesaplama(anaPara, taksitSayisi, krediTuru) {

    const krediTurleri = {
        ihtiyac: { kkdf: 15, bsmv: 15, oran: 5 },
        tasit: { kkdf: 15, bsmv: 15, oran: 4 },
        konut: { kkdf: 0, bsmv: 0, oran: 3 }
    }
    
    const faizOrani = krediTurleri[krediTuru].oran / 100;
    const kkdfOrani = krediTurleri[krediTuru].kkdf / 100;
    const bsmvOrani = krediTurleri[krediTuru].bsmv / 100;
    const brutOran = faizOrani * (1 + kkdfOrani + bsmvOrani);
    const carpan = (1 + brutOran) ** taksitSayisi;
    const taksitTutari = (anaPara * brutOran * carpan) / (carpan - 1);
    const toplamTutar = taksitTutari * taksitSayisi;
    let kalan = anaPara;
    let toplamFaiz = 0;
    const bilanco = [];
    for (let ay = 1; ay <= taksitSayisi; ay++) {
        const faiz = kalan * faizOrani;
        const kkdf = faiz * kkdfOrani;
        const bsmv = faiz * bsmvOrani;
        const anaparaPayi = taksitTutari - faiz - kkdf - bsmv;
        kalan -= anaparaPayi;
        toplamFaiz += faiz;
        bilanco.push({
            ay: ay,
            taksitTutari: taksitTutari,
            faiz: faiz,
            anaparaPayi: anaparaPayi,
            kalan: kalan
        });
    }
    return {
        taksitTutari: taksitTutari,
        toplamFaiz: toplamFaiz,
        toplamTutar: toplamTutar,
        taksitOrani: faizOrani * 100,
        aylikFaizOrani: faizOrani,
        satirlar: bilanco
    };
}

export function krediHatasi(anaPara) {
  if (anaPara === "") {
    return "Kredi miktarını yazın.";
  }
  const anapara = Number(anaPara);
  if (!Number.isFinite(anapara)) {
    return "Sadece rakam kullanın, örneğin 250 ya da 99.90.";
  }
  if (anapara <= 0) {
    return "Kredi miktarı 0'dan büyük olmalı.";
  }
  if (anapara > 1000000) {
    return "Kredi miktarı en fazla 1.000.000 olabilir.";
  }
  return "";
}