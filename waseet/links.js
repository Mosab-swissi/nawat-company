/* روابط وإعدادات صفحة الوسيط في مكان واحد.
   - عند شراء الدومين: اكتب اسمه في domain (مثال: 'alwaseet.ly') ورابط الويب يتبعه تلقائياً (app.الدومين).
   - عند نشر التطبيق في Google Play: ضع الرابط في play هنا، أو في إعدادات التطبيق نفسه (حقل رابط المتجر)
     فيتحول زر الأندرويد للمتجر تلقائياً بدون تعديل الموقع. */
window.Waseet = (function () {
  var C = {
    domain: '',
    web: 'https://al-waseet.mosabswissi123.workers.dev/',
    apk: 'https://al-waseet.mosabswissi123.workers.dev/Waseet.apk',
    play: '',
    api: 'https://waset-api.mosabswissi123.workers.dev/?action=public',
    wa: '218923497337',
    nawat: 'https://nawat.net.ly/'
  }
  if (C.domain) { C.web = 'https://app.' + C.domain + '/'; C.apk = C.web + 'Waseet.apk' }

  function https(u) { return typeof u === 'string' && /^https:\/\/[^\s<>"']+$/i.test(u) ? u : '' }
  function waDigits(v) {
    var d = String(v || '').replace(/\D/g, '')
    if (d.indexOf('00') === 0) d = d.slice(2)
    if (d.charAt(0) === '0') d = '218' + d.slice(1)
    return d.length >= 11 && d.length <= 15 ? d : ''
  }
  /* اللقطة العامة من خادم التطبيق: قراءة فقط، نفس ما يراه الزائر داخل التطبيق. */
  function fetchPublic(ms) {
    var ctl = 'AbortController' in window ? new AbortController() : null
    var t = setTimeout(function () { if (ctl) ctl.abort() }, ms || 6000)
    return fetch(C.api, { signal: ctl ? ctl.signal : undefined, credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json() })
      .then(function (p) {
        clearTimeout(t)
        var co = (p && p.co) || {}
        if (https(co.play)) C.play = co.play
        if (https(co.web) && !C.domain) C.web = co.web
        if (waDigits(co.wa)) C.wa = waDigits(co.wa)
        return p
      })
  }
  return {
    cfg: C, https: https, fetchPublic: fetchPublic,
    android: function () { return C.play || C.apk },
    wa: function (text) { return 'https://wa.me/' + C.wa + (text ? '?text=' + encodeURIComponent(text) : '') }
  }
})()
