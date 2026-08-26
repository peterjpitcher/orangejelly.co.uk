/* @ds-bundle: {"format":4,"namespace":"OrangeJellyDesignSystem_a79785","components":[{"name":"Breadcrumb","sourcePath":"components/chrome/Breadcrumb.jsx"},{"name":"Footer","sourcePath":"components/chrome/Footer.jsx"},{"name":"Header","sourcePath":"components/chrome/Header.jsx"},{"name":"StickyCTA","sourcePath":"components/chrome/StickyCTA.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"MethodStep","sourcePath":"components/content/MethodStep.jsx"},{"name":"PressureCard","sourcePath":"components/content/PressureCard.jsx"},{"name":"ProofCard","sourcePath":"components/content/ProofCard.jsx"},{"name":"Quote","sourcePath":"components/content/Quote.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Mark","sourcePath":"components/core/Mark.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ArticleCard","sourcePath":"components/editorial/ArticleCard.jsx"},{"name":"FAQ","sourcePath":"components/editorial/FAQ.jsx"},{"name":"Toc","sourcePath":"components/editorial/Toc.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"CompareTable","sourcePath":"components/marketing/CompareTable.jsx"},{"name":"LogoStrip","sourcePath":"components/marketing/LogoStrip.jsx"},{"name":"NewsletterBand","sourcePath":"components/marketing/NewsletterBand.jsx"},{"name":"OfferCard","sourcePath":"components/marketing/OfferCard.jsx"}],"sourceHashes":{"components/chrome/Breadcrumb.jsx":"21a9b4774fe9","components/chrome/Footer.jsx":"131deee22c9d","components/chrome/Header.jsx":"3908fafafa91","components/chrome/StickyCTA.jsx":"25b880c60bc5","components/content/Card.jsx":"d044375c4c56","components/content/MethodStep.jsx":"f1f360fc0ed4","components/content/PressureCard.jsx":"8b56c28bf608","components/content/ProofCard.jsx":"9252d870eaad","components/content/Quote.jsx":"b24a92f8ac3a","components/core/Button.jsx":"8571367991ad","components/core/Mark.jsx":"fd984a4ecb66","components/core/Stat.jsx":"246d388f8aa8","components/core/Tag.jsx":"b8c13d05d20d","components/editorial/ArticleCard.jsx":"92edaeeb69bc","components/editorial/FAQ.jsx":"29523b079607","components/editorial/Toc.jsx":"290c0db1ca07","components/feedback/Alert.jsx":"d3b6aa4b4f9e","components/feedback/Modal.jsx":"36fdefc0b424","components/forms/Checkbox.jsx":"de7c77f7d192","components/forms/Field.jsx":"7ace7e699285","components/forms/Input.jsx":"e380f09ce453","components/forms/Radio.jsx":"806397483535","components/forms/Select.jsx":"fcfa63230483","components/forms/Slider.jsx":"a563377a0550","components/forms/Textarea.jsx":"09def5b578b2","components/marketing/CompareTable.jsx":"041a9f2626a8","components/marketing/LogoStrip.jsx":"54f7ea53989b","components/marketing/NewsletterBand.jsx":"cba6156b2d5c","components/marketing/OfferCard.jsx":"740f9bf2b167","ui_kits/website/Home.jsx":"12bcdeee56eb","ui_kits/website/HowWeWork.jsx":"b3cb16dbe9f0","ui_kits/website/Results.jsx":"80cf10751ef9","ui_kits/website/Shared.jsx":"390d36306483","ui_kits/website/StartHere.jsx":"6d39c8dffcbc"},"inlinedExternals":[],"unexposedExports":[{"name":"ensureCardCss","sourcePath":"components/content/Card.jsx"},{"name":"ensureCoreCss","sourcePath":"components/core/Button.jsx"},{"name":"ensureFormCss","sourcePath":"components/forms/Field.jsx"}]} */

(() => {

const __ds_ns = (window.OrangeJellyDesignSystem_a79785 = window.OrangeJellyDesignSystem_a79785 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/MethodStep.jsx
try { (() => {
function MethodStep({
  index,
  word,
  text,
  tone = 'dark',
  active = false
}) {
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '18px 20px',
      borderLeft: `3px solid ${active ? 'var(--oj-orange)' : dark ? 'rgba(247,245,241,.25)' : 'rgba(35,37,46,.2)'}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 12,
      color: dark ? 'var(--oj-peach)' : 'var(--oj-orange-deep)'
    }
  }, String(index).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 28,
      lineHeight: 1,
      color: active ? 'var(--oj-orange)' : dark ? 'var(--oj-cream)' : 'var(--oj-ink)'
    }
  }, word), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: dark ? 'rgba(247,245,241,.75)' : 'var(--text-secondary)'
    }
  }, text));
}
Object.assign(__ds_scope, { MethodStep });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/MethodStep.jsx", error: String((e && e.message) || e) }); }

// components/content/Quote.jsx
try { (() => {
function Quote({
  children,
  name,
  role,
  tone = 'light'
}) {
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      borderLeft: '3px solid var(--oj-orange)',
      padding: '6px 0 6px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontWeight: 700,
      fontSize: 21,
      lineHeight: 1.35,
      letterSpacing: '-.01em',
      color: dark ? 'var(--oj-cream)' : 'var(--oj-ink)'
    }
  }, children), (name || role) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontWeight: 600,
      fontSize: 12.5,
      color: dark ? 'rgba(247,245,241,.7)' : 'var(--text-muted)'
    }
  }, name, role && /*#__PURE__*/React.createElement("span", null, " \xB7 ", role)));
}
Object.assign(__ds_scope, { Quote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Quote.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-body);font-weight:700;border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);cursor:pointer;text-decoration:none;transition:transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap);white-space:nowrap}
.oj-btn:hover{transform:translate(-2px,-2px);box-shadow:var(--shadow-press)}
.oj-btn:active{transform:none;box-shadow:none}
.oj-btn:focus-visible{outline:none;box-shadow:var(--ring)}
.oj-btn[disabled]{opacity:.4;pointer-events:none}
.oj-btn-primary{background:var(--oj-orange);color:var(--oj-ink)}
.oj-btn-ink{background:var(--oj-ink);color:var(--oj-cream)}
.oj-btn-ink:hover{box-shadow:var(--shadow-press-orange)}
.oj-btn-ghost{background:transparent;color:var(--oj-ink)}
.oj-btn-md{font-size:15px;padding:11px 20px}
.oj-btn-lg{font-size:17px;padding:15px 28px}
.oj-btn-sm{font-size:13.5px;padding:7px 14px}
.oj-btn .arr{font-weight:400;transition:transform var(--dur-fast) var(--ease-snap)}
.oj-btn:hover .arr{transform:translateX(3px)}`;
function ensureCoreCss(id, text) {
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = text;
    document.head.appendChild(s);
  }
}
function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  href,
  children,
  ...rest
}) {
  ensureCoreCss('oj-css-button', css);
  const cls = `oj-btn oj-btn-${variant} oj-btn-${size}`;
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, children, arrow && /*#__PURE__*/React.createElement("span", {
    className: "arr",
    "aria-hidden": "true"
  }, "\u2192"));
  return href ? /*#__PURE__*/React.createElement("a", _extends({
    className: cls,
    href: href
  }, rest), inner) : /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), inner);
}
Object.assign(__ds_scope, { ensureCoreCss, Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-crumb ol{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;align-items:center;font-size:13.5px;font-weight:600}
.oj-crumb li{display:flex;gap:8px;align-items:center}
.oj-crumb a{color:var(--text-muted);text-decoration:none}
.oj-crumb a:hover{color:var(--text-accent)}
.oj-crumb .sep{color:var(--oj-orange);font-weight:400}
.oj-crumb [aria-current]{color:var(--oj-ink)}`;
function Breadcrumb({
  items = [],
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-crumb', css);
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: "oj-crumb",
    "aria-label": "Breadcrumb"
  }, rest), /*#__PURE__*/React.createElement("ol", null, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: i
    }, it.href && !last ? /*#__PURE__*/React.createElement("a", {
      href: it.href
    }, it.label) : /*#__PURE__*/React.createElement("span", {
      "aria-current": last ? 'page' : undefined
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      className: "sep",
      "aria-hidden": "true"
    }, "\u2192"));
  })));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Footer.jsx
try { (() => {
const css = `.oj-footer{background:var(--oj-ink);color:var(--oj-cream);padding:64px 0 30px}
.oj-footer-in{max-width:var(--container);margin:0 auto;padding:0 32px}
.oj-footer .cols{display:flex;gap:64px;flex-wrap:wrap;align-items:flex-start;justify-content:space-between}
.oj-footer .brand{display:flex;flex-direction:column;gap:14px;max-width:300px}
.oj-footer .linkcols{display:flex;gap:56px;flex-wrap:wrap}
.oj-footer .col{display:flex;flex-direction:column;gap:10px;min-width:120px}
.oj-footer .colt{font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--oj-peach);margin-bottom:2px}
.oj-footer .col a{color:rgba(247,245,241,.75);text-decoration:none;font-size:14.5px;font-weight:500}
.oj-footer .col a:hover{color:var(--oj-orange)}
.oj-footer .base{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:1px solid rgba(247,245,241,.2);margin-top:52px;padding-top:20px;font-size:13px;color:rgba(247,245,241,.55)}`;
function Footer({
  logo,
  tagline = 'You bring the growth problem. We build the solution.',
  columns = [],
  legal,
  note = 'AI is part of the toolkit, not the product.',
  children
}) {
  __ds_scope.ensureCoreCss('oj-css-footer', css);
  const brand = logo || /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 22,
      letterSpacing: '-.02em'
    }
  }, "orange ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--oj-orange)'
    }
  }, "jelly"));
  return /*#__PURE__*/React.createElement("footer", {
    className: "oj-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-footer-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, brand, tagline && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15.5,
      lineHeight: 1.5,
      fontWeight: 700,
      color: 'rgba(247,245,241,.85)'
    }
  }, tagline), children), /*#__PURE__*/React.createElement("div", {
    className: "linkcols"
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "col",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "colt"
  }, c.title), (c.links || []).map((l, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    href: l.href
  }, l.label)))))), /*#__PURE__*/React.createElement("div", {
    className: "base"
  }, /*#__PURE__*/React.createElement("span", null, legal || '© ' + new Date().getFullYear() + ' Orange Jelly Ltd'), /*#__PURE__*/React.createElement("span", null, note))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Footer.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Header.jsx
try { (() => {
const css = `.oj-header{position:sticky;top:0;z-index:60;background:var(--surface-page);border-bottom:var(--bw-1) solid var(--oj-ink)}
.oj-header-in{max-width:var(--container);margin:0 auto;padding:0 32px;display:flex;align-items:center;gap:24px;height:64px}
.oj-header nav.desk{display:flex;gap:2px;margin-left:auto}
.oj-header nav.desk a{font-weight:600;font-size:15px;color:var(--oj-ink);text-decoration:none;padding:7px 11px;border-radius:var(--r-1)}
.oj-header nav.desk a:hover{color:var(--text-accent)}
.oj-header nav.desk a[aria-current]{box-shadow:inset 0 -3px 0 var(--oj-orange)}
.oj-header .mbtn{display:none;margin-left:auto;font-family:inherit;font-weight:700;font-size:14.5px;background:none;border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);padding:6px 13px;cursor:pointer;color:var(--oj-ink)}
.oj-header .cta{flex:none}
@media(max-width:880px){.oj-header nav.desk,.oj-header .cta{display:none}.oj-header .mbtn{display:block}}
.oj-mnav{position:fixed;top:64px;left:0;right:0;bottom:0;z-index:59;background:var(--oj-ink);padding:36px 32px;display:flex;flex-direction:column;overflow:auto}
.oj-mnav a{font-family:var(--font-display);font-weight:900;font-size:33px;letter-spacing:-.02em;color:var(--oj-cream);text-decoration:none;padding:12px 0;border-bottom:1px solid rgba(247,245,241,.15)}
.oj-mnav a[aria-current]{color:var(--oj-orange)}`;
function Header({
  items = [],
  cta,
  logo,
  home = '/',
  sticky = true
}) {
  __ds_scope.ensureCoreCss('oj-css-header', css);
  const [open, setOpen] = React.useState(false);
  const brand = logo || /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 21,
      letterSpacing: '-.02em'
    }
  }, "orange ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--oj-orange)'
    }
  }, "jelly"));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "oj-header",
    style: sticky ? undefined : {
      position: 'static'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-header-in"
  }, /*#__PURE__*/React.createElement("a", {
    href: home,
    "aria-label": "Home",
    style: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      alignItems: 'center'
    }
  }, brand), /*#__PURE__*/React.createElement("nav", {
    className: "desk",
    "aria-label": "Primary"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: it.href,
    "aria-current": it.current ? 'page' : undefined
  }, it.label))), cta && /*#__PURE__*/React.createElement("span", {
    className: "cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    href: cta.href,
    onClick: cta.onClick
  }, cta.label)), /*#__PURE__*/React.createElement("button", {
    className: "mbtn",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open
  }, open ? 'Close ×' : 'Menu'))), open && /*#__PURE__*/React.createElement("nav", {
    className: "oj-mnav",
    "aria-label": "Primary mobile"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: it.href,
    "aria-current": it.current ? 'page' : undefined,
    onClick: () => setOpen(false)
  }, it.label)), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "lg",
    arrow: true,
    href: cta.href,
    onClick: cta.onClick
  }, cta.label))));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Header.jsx", error: String((e && e.message) || e) }); }

// components/chrome/StickyCTA.jsx
try { (() => {
const css = `.oj-sticky{position:fixed;left:0;right:0;bottom:0;z-index:70;background:var(--oj-ink);border-top:var(--bw-2) solid var(--oj-orange);padding:12px 0}
.oj-sticky-in{max-width:var(--container);margin:0 auto;padding:0 32px;display:flex;align-items:center;gap:18px}
.oj-sticky .note{margin:0;color:var(--oj-cream);font-weight:700;font-size:15.5px;letter-spacing:-.01em;flex:1;min-width:0}
.oj-sticky .x{background:none;border:none;color:rgba(247,245,241,.6);font-size:22px;line-height:1;cursor:pointer;padding:2px 4px;font-family:inherit}
.oj-sticky .x:hover{color:var(--oj-cream)}
@media(max-width:640px){.oj-sticky .note{font-size:13px}}`;
function StickyCTA({
  note = 'Growth stuck? Tell us what is happening.',
  label = 'Book a growth diagnostic',
  href,
  onClick,
  showAfter = 480,
  dismissible = true
}) {
  __ds_scope.ensureCoreCss('oj-css-sticky', css);
  const [past, setPast] = React.useState(showAfter <= 0);
  const [gone, setGone] = React.useState(false);
  React.useEffect(() => {
    if (showAfter <= 0) {
      setPast(true);
      return;
    }
    const f = () => setPast(window.scrollY > showAfter);
    f();
    window.addEventListener('scroll', f, {
      passive: true
    });
    return () => window.removeEventListener('scroll', f);
  }, [showAfter]);
  if (!past || gone) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "oj-sticky",
    role: "complementary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-sticky-in"
  }, /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, note), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    href: href,
    onClick: onClick
  }, label), dismissible && /*#__PURE__*/React.createElement("button", {
    className: "x",
    "aria-label": "Dismiss",
    onClick: () => setGone(true)
  }, "\xD7")));
}
Object.assign(__ds_scope, { StickyCTA });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/StickyCTA.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-card{background:var(--surface-card);border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);padding:var(--sp-5);box-sizing:border-box}
.oj-card-ink{background:var(--oj-ink);color:var(--oj-cream)}
.oj-card-orange{background:var(--oj-orange)}
.oj-card-press{transition:transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap);cursor:pointer}
.oj-card-press:hover{transform:translate(-2px,-2px);box-shadow:var(--shadow-press)}
.oj-card-press:active{transform:none;box-shadow:none}`;
function ensureCardCss() {
  __ds_scope.ensureCoreCss('oj-css-card', css);
}
function Card({
  tone = 'paper',
  pressure = false,
  style,
  children,
  ...rest
}) {
  ensureCardCss();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `oj-card${tone !== 'paper' ? ' oj-card-' + tone : ''}${pressure ? ' oj-card-press' : ''}`,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { ensureCardCss, Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/PressureCard.jsx
try { (() => {
function PressureCard({
  title,
  desc,
  href = '#'
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    pressure: true,
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    },
    onClick: () => {}
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 900,
      fontSize: 19,
      letterSpacing: '-.01em'
    }
  }, title), /*#__PURE__*/React.createElement("a", {
    href: href,
    "aria-label": typeof title === 'string' ? title : 'open',
    style: {
      color: 'var(--oj-orange-deep)',
      textDecoration: 'none',
      fontSize: 20,
      fontWeight: 400
    }
  }, "\u2192")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.5,
      color: 'var(--text-secondary)'
    }
  }, desc));
}
Object.assign(__ds_scope, { PressureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PressureCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Mark.jsx
try { (() => {
function Mark({
  tone = 'peach',
  children
}) {
  if (tone === 'peach') return /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--oj-peach)',
      padding: '0 .1em',
      color: 'var(--oj-ink)'
    }
  }, children);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'linear-gradient(transparent 55%, var(--oj-orange) 55%, var(--oj-orange) 96%, transparent 96%)',
      padding: '0 .08em'
    }
  }, children);
}
Object.assign(__ds_scope, { Mark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Mark.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function Stat({
  value,
  label,
  sub,
  tone = 'light',
  size = 'md',
  accent = true
}) {
  const dark = tone === 'dark';
  const vs = {
    md: 44,
    lg: 64,
    sm: 32
  }[size];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      lineHeight: 1,
      letterSpacing: '-.02em',
      fontSize: vs,
      color: accent ? 'var(--oj-orange)' : dark ? 'var(--oj-cream)' : 'var(--oj-ink)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: dark ? 'var(--oj-cream)' : 'var(--oj-ink)'
    }
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: dark ? 'rgba(247,245,241,.7)' : 'var(--text-secondary)',
      lineHeight: 1.4
    }
  }, sub));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-tag{display:inline-flex;align-items:center;gap:8px;border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);font-weight:700;font-size:14px;padding:7px 13px;background:var(--oj-paper);color:var(--oj-ink)}
.oj-tag-ink{background:var(--oj-ink);color:var(--oj-cream)}
.oj-tag-orange{background:var(--oj-orange)}
.oj-tag-sm{font-size:12.5px;padding:4px 9px}
.oj-tag .dot{width:8px;height:8px;border-radius:50%;background:var(--oj-orange);border:1px solid var(--oj-ink);flex:none}
.oj-tag-ink .dot{border-color:var(--oj-cream)}
.oj-tag .dot.ok{background:var(--oj-ok)}
.oj-tag-orange .dot{background:var(--oj-cream)}`;
function Tag({
  variant = 'outline',
  size = 'md',
  dot = true,
  children,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-tag', css);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `oj-tag${variant !== 'outline' ? ' oj-tag-' + variant : ''}${size === 'sm' ? ' oj-tag-sm' : ''}`
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: dot === 'ok' ? 'dot ok' : 'dot'
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/content/ProofCard.jsx
try { (() => {
function ProofCard({
  value,
  label,
  context,
  area,
  tone = 'paper'
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    tone: tone,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Stat, {
    value: value,
    label: label,
    tone: tone === 'ink' ? 'dark' : 'light'
  }), context && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: tone === 'ink' ? 'rgba(247,245,241,.75)' : 'var(--text-secondary)'
    }
  }, context), area && /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    size: "sm",
    variant: tone === 'ink' ? 'orange' : 'outline'
  }, area));
}
Object.assign(__ds_scope, { ProofCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ProofCard.jsx", error: String((e && e.message) || e) }); }

// components/editorial/ArticleCard.jsx
try { (() => {
const css = `.oj-artcard{display:block;text-decoration:none;color:inherit;height:100%;box-sizing:border-box}
.oj-artcard .in{display:flex;flex-direction:column;gap:12px;height:100%;box-sizing:border-box}
.oj-artcard h3{font-family:var(--font-display);font-weight:900;font-size:20px;line-height:1.14;letter-spacing:-.015em;margin:0}
.oj-artcard:hover h3{color:var(--text-accent)}
.oj-artcard .ex{margin:0;font-size:14.5px;line-height:1.55;color:var(--text-secondary);flex:1}
.oj-artcard .meta{font-weight:600;font-size:12.5px;color:var(--text-muted);display:flex;gap:8px;flex-wrap:wrap}`;
function ArticleCard({
  category,
  title,
  excerpt,
  date,
  readTime,
  href = '#',
  tone = 'paper'
}) {
  __ds_scope.ensureCoreCss('oj-css-artcard', css);
  __ds_scope.ensureCardCss();
  return /*#__PURE__*/React.createElement("a", {
    className: `oj-artcard oj-card oj-card-press${tone !== 'paper' ? ' oj-card-' + tone : ''}`,
    href: href
  }, /*#__PURE__*/React.createElement("span", {
    className: "in"
  }, category && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    size: "sm",
    dot: false,
    variant: tone === 'ink' ? 'orange' : 'outline'
  }, category)), /*#__PURE__*/React.createElement("h3", null, title), excerpt && /*#__PURE__*/React.createElement("p", {
    className: "ex",
    style: tone === 'ink' ? {
      color: 'rgba(247,245,241,.75)'
    } : undefined
  }, excerpt), (date || readTime) && /*#__PURE__*/React.createElement("span", {
    className: "meta",
    style: tone === 'ink' ? {
      color: 'rgba(247,245,241,.6)'
    } : undefined
  }, date, date && readTime && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\xB7"), readTime)));
}
Object.assign(__ds_scope, { ArticleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/ArticleCard.jsx", error: String((e && e.message) || e) }); }

// components/editorial/FAQ.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-faq{display:flex;flex-direction:column}
.oj-faq .row{border-top:var(--bw-1) solid var(--oj-ink)}
.oj-faq .row:last-child{border-bottom:var(--bw-1) solid var(--oj-ink)}
.oj-faq .q{width:100%;display:flex;justify-content:space-between;align-items:center;gap:18px;background:none;border:none;font-family:inherit;font-weight:800;font-size:17px;letter-spacing:-.01em;color:var(--oj-ink);text-align:left;padding:17px 2px;cursor:pointer}
.oj-faq .q:hover .ind{color:var(--oj-orange)}
.oj-faq .ind{font-weight:400;font-size:24px;line-height:1;color:var(--text-accent);flex:none;transition:transform var(--dur-fast) var(--ease-snap)}
.oj-faq .a{font-size:15.5px;line-height:1.6;color:var(--text-secondary);padding:0 44px 20px 2px;max-width:640px}
.oj-faq .a p{margin:0 0 10px}.oj-faq .a p:last-child{margin:0}`;
function FAQ({
  items = [],
  openFirst = false,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-faq', css);
  const [open, setOpen] = React.useState(() => new Set(openFirst ? [0] : []));
  const toggle = i => setOpen(s => {
    const n = new Set(s);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "oj-faq"
  }, rest), items.map((it, i) => {
    const on = open.has(i);
    return /*#__PURE__*/React.createElement("div", {
      className: "row",
      key: i
    }, /*#__PURE__*/React.createElement("button", {
      className: "q",
      "aria-expanded": on,
      onClick: () => toggle(i)
    }, it.q, /*#__PURE__*/React.createElement("span", {
      className: "ind",
      "aria-hidden": "true"
    }, on ? '×' : '+')), on && /*#__PURE__*/React.createElement("div", {
      className: "a"
    }, typeof it.a === 'string' ? /*#__PURE__*/React.createElement("p", null, it.a) : it.a));
  }));
}
Object.assign(__ds_scope, { FAQ });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/FAQ.jsx", error: String((e && e.message) || e) }); }

// components/editorial/Toc.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-toc{border-left:var(--bw-1) solid var(--oj-ink);padding-left:18px;display:flex;flex-direction:column;gap:9px;max-width:260px}
.oj-toc .t{font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:2px}
.oj-toc a{font-weight:600;font-size:14px;line-height:1.35;color:var(--text-secondary);text-decoration:none}
.oj-toc a:hover{color:var(--text-accent)}
.oj-toc a.sub{padding-left:14px;font-weight:500}
.oj-toc a.on{color:var(--oj-ink);box-shadow:inset 3px 0 0 var(--oj-orange);margin-left:-18px;padding-left:15px}`;
function Toc({
  title = 'On this page',
  items = [],
  current,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-toc', css);
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: "oj-toc",
    "aria-label": "Table of contents"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, title), items.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: it.href,
    className: (it.level >= 3 ? 'sub' : '') + (current === it.href ? ' on' : '')
  }, it.label)));
}
Object.assign(__ds_scope, { Toc });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editorial/Toc.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-alert{display:flex;gap:12px;align-items:flex-start;background:var(--surface-card);border:var(--bw-1) solid var(--oj-ink);border-left-width:6px;border-radius:var(--r-1);padding:13px 16px}
.oj-alert .body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.oj-alert .t{font-weight:800;font-size:15px;letter-spacing:-.01em}
.oj-alert .d{font-size:14.5px;line-height:1.5;color:var(--text-secondary)}
.oj-alert .d p{margin:0}
.oj-alert .x{background:none;border:none;color:var(--text-muted);font-size:20px;line-height:1;cursor:pointer;padding:0 2px;font-family:inherit}
.oj-alert .x:hover{color:var(--oj-ink)}`;
const tones = {
  info: 'var(--oj-orange)',
  ok: 'var(--oj-ok)',
  danger: 'var(--oj-danger)'
};
function Alert({
  tone = 'info',
  title,
  onClose,
  children,
  style,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-alert', css);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "oj-alert",
    role: tone === 'danger' ? 'alert' : 'status',
    style: {
      borderLeftColor: tones[tone] || tones.info,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "t",
    style: tone !== 'info' ? {
      color: tones[tone]
    } : undefined
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "d"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "x",
    "aria-label": "Dismiss",
    onClick: onClose
  }, "\xD7"));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
const css = `.oj-modal-ov{position:fixed;inset:0;z-index:100;background:rgba(35,37,46,.62);display:flex;align-items:center;justify-content:center;padding:24px}
.oj-modal{position:relative;background:var(--oj-paper);border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-2);box-shadow:var(--shadow-press);padding:30px 32px;width:100%;max-height:88vh;overflow:auto;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}
.oj-modal .x{position:absolute;top:12px;right:14px;background:none;border:none;color:var(--text-muted);font-size:24px;line-height:1;cursor:pointer;padding:2px;font-family:inherit}
.oj-modal .x:hover{color:var(--oj-ink)}
.oj-modal h2{font-family:var(--font-display);font-weight:900;font-size:27px;line-height:1.08;letter-spacing:-.02em;margin:0}
.oj-modal .bd{font-size:15.5px;line-height:1.55;color:var(--text-secondary)}
.oj-modal .bd p{margin:0 0 10px}.oj-modal .bd p:last-child{margin:0}
.oj-modal .acts{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}`;
function Modal({
  open,
  onClose,
  eyebrow,
  title,
  actions,
  width = 520,
  children
}) {
  __ds_scope.ensureCoreCss('oj-css-modal', css);
  React.useEffect(() => {
    if (!open) return;
    const f = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', f);
    return () => document.removeEventListener('keydown', f);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "oj-modal-ov",
    onMouseDown: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-modal",
    role: "dialog",
    "aria-modal": "true",
    style: {
      maxWidth: width
    }
  }, onClose && /*#__PURE__*/React.createElement("button", {
    className: "x",
    "aria-label": "Close",
    onClick: onClose
  }, "\xD7"), eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "oj-eyebrow",
    style: {
      color: 'var(--text-accent)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", null, title), children && /*#__PURE__*/React.createElement("div", {
    className: "bd"
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "acts"
  }, actions)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-check{display:flex;gap:11px;align-items:flex-start;cursor:pointer;font-size:15px;line-height:1.45}
.oj-check input{appearance:none;margin:1px 0 0;width:20px;height:20px;flex:none;background:var(--oj-paper);border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);cursor:pointer;display:grid;place-content:center;transition:background var(--dur-fast) var(--ease-snap)}
.oj-check input:checked{background:var(--oj-orange)}
.oj-check input:checked::after{content:'';width:10px;height:6px;border:2.5px solid var(--oj-ink);border-top:none;border-right:none;transform:rotate(-45deg) translate(1px,-1px)}
.oj-check input:focus-visible{outline:none;box-shadow:var(--ring)}`;
function Checkbox({
  label,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-check', css);
  return /*#__PURE__*/React.createElement("label", {
    className: "oj-check"
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
const css = `.oj-field{display:flex;flex-direction:column;gap:7px}
.oj-label{font-weight:700;font-size:14.5px;color:var(--oj-ink)}
.oj-label .req{color:var(--oj-orange-deep)}
.oj-hint{font-size:13px;color:var(--text-muted)}
.oj-error{font-weight:600;font-size:12px;color:var(--oj-danger)}
.oj-input{font-family:var(--font-body);font-size:15.5px;color:var(--oj-ink);background:var(--oj-paper);border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);padding:11px 13px;width:100%;box-sizing:border-box;transition:box-shadow var(--dur-fast) var(--ease-snap)}
.oj-input::placeholder{color:var(--text-muted)}
.oj-input:focus{outline:none;box-shadow:var(--ring)}
.oj-input[aria-invalid="true"]{border-color:var(--oj-danger);box-shadow:2px 2px 0 0 var(--oj-danger)}
.oj-input:disabled{background:var(--surface-sunken);opacity:.6}
select.oj-input{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--oj-ink) 50%),linear-gradient(135deg,var(--oj-ink) 50%,transparent 50%);background-position:calc(100% - 19px) 55%,calc(100% - 13px) 55%;background-size:6px 6px;background-repeat:no-repeat;padding-right:36px}
textarea.oj-input{resize:vertical;min-height:96px;line-height:1.5}`;
function ensureFormCss() {
  __ds_scope.ensureCoreCss('oj-css-forms', css);
}
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children
}) {
  ensureFormCss();
  return /*#__PURE__*/React.createElement("div", {
    className: "oj-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "oj-label",
    htmlFor: htmlFor
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, " *")), children, error ? /*#__PURE__*/React.createElement("span", {
    className: "oj-error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "oj-hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { ensureFormCss, Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input(props) {
  __ds_scope.ensureFormCss();
  return /*#__PURE__*/React.createElement("input", _extends({
    className: "oj-input"
  }, props));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-radio{display:flex;gap:11px;align-items:flex-start;cursor:pointer;font-size:15px;line-height:1.45}
.oj-radio input{appearance:none;margin:1px 0 0;width:20px;height:20px;flex:none;background:var(--oj-paper);border:var(--bw-1) solid var(--oj-ink);border-radius:50%;cursor:pointer;display:grid;place-content:center;transition:background var(--dur-fast) var(--ease-snap)}
.oj-radio input:checked{background:var(--oj-orange)}
.oj-radio input:checked::after{content:'';width:8px;height:8px;border-radius:50%;background:var(--oj-ink)}
.oj-radio input:focus-visible{outline:none;box-shadow:var(--ring)}`;
function Radio({
  label,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-radio', css);
  return /*#__PURE__*/React.createElement("label", {
    className: "oj-radio"
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio"
  }, rest)), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  children,
  ...rest
}) {
  __ds_scope.ensureFormCss();
  return /*#__PURE__*/React.createElement("select", _extends({
    className: "oj-input"
  }, rest), children);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-slider{-webkit-appearance:none;appearance:none;width:100%;height:24px;background:transparent;cursor:pointer;margin:0}
.oj-slider::-webkit-slider-runnable-track{height:8px;border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);background:linear-gradient(to right,var(--oj-orange) var(--fill,50%),var(--oj-cream-2) var(--fill,50%))}
.oj-slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:-8.5px;background:var(--oj-paper);border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);box-shadow:2px 2px 0 0 var(--oj-ink)}
.oj-slider::-moz-range-track{height:8px;border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);background:var(--oj-cream-2)}
.oj-slider::-moz-range-progress{height:8px;background:var(--oj-orange);border-radius:var(--r-1)}
.oj-slider::-moz-range-thumb{width:22px;height:22px;box-sizing:border-box;background:var(--oj-paper);border:var(--bw-1) solid var(--oj-ink);border-radius:var(--r-1);box-shadow:2px 2px 0 0 var(--oj-ink)}
.oj-slider:focus-visible{outline:none}
.oj-slider:focus-visible::-webkit-slider-thumb{box-shadow:var(--ring)}`;
function Slider({
  min = 0,
  max = 100,
  value,
  defaultValue,
  onChange,
  style,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-slider', css);
  const [v, setV] = React.useState(value !== undefined ? Number(value) : defaultValue !== undefined ? Number(defaultValue) : (Number(min) + Number(max)) / 2);
  const cur = value !== undefined ? Number(value) : v;
  const pct = (cur - Number(min)) / (Number(max) - Number(min)) * 100;
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "range",
    className: "oj-slider",
    min: min,
    max: max,
    value: cur,
    onChange: e => {
      setV(Number(e.target.value));
      onChange && onChange(e);
    },
    style: {
      ...style,
      ['--fill']: pct + '%'
    }
  }, rest));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea(props) {
  __ds_scope.ensureFormCss();
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: "oj-input"
  }, props));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/marketing/CompareTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-cmp{border-collapse:collapse;width:100%;background:var(--surface-card);border:var(--bw-1) solid var(--oj-ink);font-size:14.5px}
.oj-cmp caption{caption-side:top;text-align:left;font-weight:800;font-size:17px;letter-spacing:-.01em;padding:0 0 14px}
.oj-cmp th,.oj-cmp td{padding:12px 16px;text-align:left;vertical-align:top}
.oj-cmp thead th{background:var(--oj-ink);color:var(--oj-cream);font-weight:700;font-size:14px}
.oj-cmp thead th.hl{background:var(--oj-orange);color:var(--oj-ink)}
.oj-cmp tbody th{font-weight:600;color:var(--oj-ink);width:34%}
.oj-cmp tbody tr+tr th,.oj-cmp tbody tr+tr td{border-top:1px solid var(--border-soft)}
.oj-cmp td.hl{background:var(--oj-orange-soft)}
.oj-cmp .yes{color:var(--text-accent);font-weight:800}
.oj-cmp .no{color:var(--text-muted)}`;
function cell(v) {
  if (v === true) return /*#__PURE__*/React.createElement("span", {
    className: "yes"
  }, "\u2713");
  if (v === false || v === null || v === undefined || v === '') return /*#__PURE__*/React.createElement("span", {
    className: "no"
  }, "\u2014");
  return v;
}
function CompareTable({
  caption,
  columns = [],
  rows = [],
  highlight,
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-cmp', css);
  return /*#__PURE__*/React.createElement("table", _extends({
    className: "oj-cmp"
  }, rest), caption && /*#__PURE__*/React.createElement("caption", null, caption), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null), columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    className: i === highlight ? 'hl' : undefined,
    scope: "col"
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("th", {
    scope: "row"
  }, r.label), (r.values || []).map((v, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    className: j === highlight ? 'hl' : undefined
  }, cell(v)))))));
}
Object.assign(__ds_scope, { CompareTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/CompareTable.jsx", error: String((e && e.message) || e) }); }

// components/marketing/LogoStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const css = `.oj-logos{display:flex;align-items:center;gap:18px 44px;flex-wrap:wrap}
.oj-logos .lbl{font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);flex:none}
.oj-logos img{display:block;filter:grayscale(1);opacity:.72;transition:opacity var(--dur-fast) var(--ease-snap),filter var(--dur-fast) var(--ease-snap)}
.oj-logos img:hover{filter:none;opacity:1}
.oj-logos .txt{font-weight:800;font-size:17px;letter-spacing:-.01em;color:var(--text-muted)}
.oj-logos-dark .lbl{color:rgba(247,245,241,.6)}
.oj-logos-dark .txt{color:rgba(247,245,241,.7)}
.oj-logos-dark img{filter:grayscale(1) brightness(10)}`;
function LogoStrip({
  label = 'In partnership with',
  items = [],
  height = 30,
  tone = 'light',
  ...rest
}) {
  __ds_scope.ensureCoreCss('oj-css-logos', css);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'oj-logos' + (tone === 'dark' ? ' oj-logos-dark' : '')
  }, rest), label && /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, label), items.map((it, i) => typeof it === 'string' ? /*#__PURE__*/React.createElement("span", {
    className: "txt",
    key: i
  }, it) : /*#__PURE__*/React.createElement("img", {
    key: i,
    src: it.src,
    alt: it.alt || '',
    style: {
      height: it.height || height
    }
  })));
}
Object.assign(__ds_scope, { LogoStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/LogoStrip.jsx", error: String((e && e.message) || e) }); }

// components/marketing/NewsletterBand.jsx
try { (() => {
const css = `.oj-nlb{background:var(--oj-ink);color:var(--oj-cream);padding:44px 0}
.oj-nlb-in{max-width:var(--container);margin:0 auto;padding:0 32px;display:flex;gap:32px 56px;align-items:center;flex-wrap:wrap;justify-content:space-between}
.oj-nlb h2{font-family:var(--font-display);font-weight:900;font-size:28px;line-height:1.05;letter-spacing:-.02em;margin:0}
.oj-nlb .blurb{margin:8px 0 0;font-size:15px;line-height:1.5;color:rgba(247,245,241,.75);max-width:420px}
.oj-nlb form{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-start}
.oj-nlb .oj-input{width:280px}
.oj-nlb .note{margin:8px 0 0;font-size:12.5px;color:rgba(247,245,241,.55)}`;
function NewsletterBand({
  title = 'Straight thinking, monthly.',
  blurb = 'One growth problem pulled apart, with the numbers. No fluff.',
  placeholder = 'you@company.co.uk',
  buttonLabel = 'Sign up',
  note = 'Unsubscribe any time. No selling your data.',
  onSubmit
}) {
  __ds_scope.ensureCoreCss('oj-css-nlb', css);
  __ds_scope.ensureFormCss();
  const [email, setEmail] = React.useState('');
  return /*#__PURE__*/React.createElement("section", {
    className: "oj-nlb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-nlb-in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, title), blurb && /*#__PURE__*/React.createElement("p", {
    className: "blurb"
  }, blurb)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(email);
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "oj-input",
    type: "email",
    required: true,
    "aria-label": "Email address",
    placeholder: placeholder,
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit"
  }, buttonLabel)), note && /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, note))));
}
Object.assign(__ds_scope, { NewsletterBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/NewsletterBand.jsx", error: String((e && e.message) || e) }); }

// components/marketing/OfferCard.jsx
try { (() => {
function OfferCard({
  eyebrow,
  name,
  blurb,
  includes = [],
  footnote,
  cta,
  featured = false
}) {
  const dark = featured;
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    tone: dark ? 'ink' : 'paper',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      height: '100%'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "oj-eyebrow",
    style: {
      color: dark ? 'var(--oj-peach)' : 'var(--text-accent)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 25,
      lineHeight: 1.05,
      letterSpacing: '-.02em'
    }
  }, name), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14.5,
      lineHeight: 1.55,
      color: dark ? 'rgba(247,245,241,.78)' : 'var(--text-secondary)'
    }
  }, blurb), includes.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, includes.map((x, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      fontSize: 14.5,
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--oj-orange)',
      fontWeight: 700
    }
  }, "\u2192"), /*#__PURE__*/React.createElement("span", null, x)))), cta && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: dark ? 'primary' : 'ink',
    arrow: true,
    href: cta.href,
    onClick: cta.onClick
  }, cta.label)), footnote && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: dark ? 'rgba(247,245,241,.55)' : 'var(--text-muted)'
    }
  }, footnote));
}
Object.assign(__ds_scope, { OfferCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/OfferCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const DSh = window.OrangeJellyDesignSystem_a79785;
function Home({
  onNav
}) {
  const {
    Button,
    Tag,
    Stat,
    Mark,
    PressureCard,
    MethodStep,
    ProofCard,
    Quote,
    Card
  } = DSh;
  const pressures = [["Create demand", "Not enough of the right people know you exist or care."], ["Convert more", "Leads, enquiries or bookings are not turning into revenue."], ["Protect margin", "Sales look fine. The profit is quietly leaking away."], ["Remove operational drag", "Manual work is slowing the team and stealing capacity."], ["Improve experience", "The customer journey is leaking value at avoidable points."], ["Build for scale", "The systems that got you here cannot support the next stage."]];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "oj-sec",
    style: {
      padding: '96px 0 88px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Growth partner for ambitious small and mid-sized businesses"), /*#__PURE__*/React.createElement("h1", {
    className: "oj-display",
    style: {
      fontSize: 84,
      margin: '18px 0 24px',
      maxWidth: 900
    }
  }, "Growth stuck?", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Mark, {
    tone: "orange"
  }, "Bring us the problem.")), /*#__PURE__*/React.createElement("p", {
    className: "oj-lede",
    style: {
      margin: '0 0 36px'
    }
  }, "Orange Jelly gets under the skin of your business, exposes what is holding you back and builds practical solutions using creativity, technology and AI that earns its place."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    arrow: true,
    onClick: () => onNav('start')
  }, "Book a growth diagnostic"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    onClick: () => onNav('method')
  }, "See how we work")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--oj-paper)',
      borderTop: 'var(--bw-1) solid var(--oj-ink)',
      borderBottom: 'var(--bw-1) solid var(--oj-ink)'
    },
    className: "oj-sec-tight"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2"
  }, "You do not need more activity. You need to know ", /*#__PURE__*/React.createElement(Mark, {
    tone: "orange"
  }, "what will move the numbers.")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, ["Growth has stalled.", "Leads are not converting.", "Margin is disappearing.", "Manual work is slowing the team down.", "The business has outgrown its systems.", "Everyone has a different view of the problem."].map(s => /*#__PURE__*/React.createElement("li", {
    key: s,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'baseline',
      fontSize: 16.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--oj-orange)',
      border: '1px solid var(--oj-ink)',
      flex: 'none',
      transform: 'translateY(-1px)'
    }
  }), s))))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "The promise"), /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 52,
      margin: '14px 0 18px'
    }
  }, "You bring the growth problem.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--oj-orange)'
    }
  }, "We build the solution.")), /*#__PURE__*/React.createElement("p", {
    className: "oj-lede"
  }, "Sometimes the fix is marketing. Sometimes it is pricing, process, technology, automation or AI. We do not arrive with a pre-selected answer. The problem decides the tool."))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec-tight",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 32
    }
  }, "Six growth pressure points"), /*#__PURE__*/React.createElement("a", {
    href: "#problems",
    onClick: e => {
      e.preventDefault();
      onNav('problems');
    },
    style: {
      fontWeight: 600,
      fontSize: 15
    }
  }, "All growth problems \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, pressures.map(([t, d]) => /*#__PURE__*/React.createElement(PressureCard, {
    key: t,
    title: t,
    desc: d
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--oj-ink)'
    },
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "How we work"), /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      color: 'var(--oj-cream)',
      margin: '12px 0 36px'
    }
  }, "HEAR. EXPOSE. BUILD. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--oj-orange)'
    }
  }, "PROVE.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(MethodStep, {
    index: 1,
    word: "HEAR.",
    text: "Understand what is really happening, not only what the brief says."
  }), /*#__PURE__*/React.createElement(MethodStep, {
    index: 2,
    word: "EXPOSE.",
    text: "Find the pressure points, root causes and opportunities that matter."
  }), /*#__PURE__*/React.createElement(MethodStep, {
    index: 3,
    word: "BUILD.",
    text: "Design and implement the right practical solution."
  }), /*#__PURE__*/React.createElement(MethodStep, {
    index: 4,
    word: "PROVE.",
    text: "Measure the difference, improve the solution and embed what works."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ink",
    style: {
      borderColor: 'var(--oj-cream)'
    },
    arrow: true,
    onClick: () => onNav('method')
  }, "The full method")))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Proof"), /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      margin: '12px 0 16px'
    }
  }, "Tested in a real trading business first"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      margin: '0 0 20px'
    }
  }, "The Anchor is a real pub with staff, suppliers, stock, margin pressure and cash-flow consequences. It is our live growth laboratory: ideas only survive if they change the numbers."), /*#__PURE__*/React.createElement(Quote, {
    name: "The Anchor",
    role: "live business laboratory"
  }, "Clever thinking only matters if it changes the numbers or improves how the business runs."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    arrow: true,
    onClick: () => onNav('results')
  }, "See the results"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(ProofCard, {
    value: "403%",
    label: "table bookings",
    context: "Year on year, verified baseline.",
    area: "Create demand"
  }), /*#__PURE__*/React.createElement(ProofCard, {
    value: "89%",
    label: "fewer no-shows",
    context: "After booking-journey rebuild.",
    area: "Improve experience",
    tone: "ink"
  }), /*#__PURE__*/React.createElement(ProofCard, {
    value: "98%",
    label: "food revenue",
    context: "Menu, pricing and mix redesign.",
    area: "Protect margin",
    tone: "ink"
  }), /*#__PURE__*/React.createElement(ProofCard, {
    value: "828%",
    label: "search visibility",
    context: "Google visibility, 12 months.",
    area: "Create demand"
  })))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec-tight",
    style: {
      background: 'var(--oj-orange)',
      borderTop: 'var(--bw-1) solid var(--oj-ink)',
      borderBottom: 'var(--bw-1) solid var(--oj-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 44
    }
  }, "Big enough to have real growth problems. Small enough to move fast."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: 15.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", null, "For leaders ready to be challenged, with authority to act."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400
    }
  }, "Not for cheap task execution, routine posting, or AI for its own sake.")))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 32,
      marginBottom: 24
    }
  }, "Four ways in"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, [["Growth Diagnostic", "Find what is really blocking growth. Agree the highest-value next move.", "2 to 3 weeks"], ["Growth Sprint", "Solve one defined problem and put the solution into use.", "4 to 8 weeks"], ["Growth Partnership", "An embedded partner across a rolling set of priorities.", "3 to 12 months"], ["Transformation Programme", "Several connected interventions at a major inflection point.", "3 to 9 months"]].map(([t, d, dur], i) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    pressure: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 20
    },
    onClick: () => onNav('start')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 12,
      color: 'var(--text-accent)'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 18,
      letterSpacing: '-.01em'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--text-secondary)'
    }
  }, d), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      fontWeight: 600,
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, dur)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--oj-ink)'
    },
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-display",
    style: {
      fontSize: 64,
      color: 'var(--oj-cream)',
      margin: 0
    }
  }, "Stop circling ", /*#__PURE__*/React.createElement(Mark, null, "the problem.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 17,
      color: 'rgba(247,245,241,.8)',
      maxWidth: 480
    }
  }, "Tell us what is happening, what you have tried and what needs to change."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    arrow: true,
    onClick: () => onNav('start')
  }, "Bring us the problem"))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HowWeWork.jsx
try { (() => {
const DSm = window.OrangeJellyDesignSystem_a79785;
function HowWeWork({
  onNav
}) {
  const {
    Button,
    Card,
    MethodStep,
    Tag
  } = DSm;
  const steps = [["HEAR.", "Understand what is really happening, not only what the brief says.", "Leadership and stakeholder interviews. Performance data. Customer, journey, process and systems review."], ["EXPOSE.", "Find the pressure points, root causes and opportunities that matter.", "Growth Pressure Map. Root-cause analysis. Prioritised opportunities with commercial stakes attached."], ["BUILD.", "Design and implement the right practical solution.", "Build brief. Implemented solution or working prototype. Adoption plan, not just a deck."], ["PROVE.", "Measure the difference, improve the solution and embed what works.", "Agreed success measures. Baseline and impact review. Honest reporting when evidence is incomplete."]];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "oj-sec",
    style: {
      background: 'var(--oj-ink)',
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "dark"
  }, "How we work"), /*#__PURE__*/React.createElement("h1", {
    className: "oj-display",
    style: {
      fontSize: 68,
      color: 'var(--oj-cream)',
      margin: '14px 0 18px'
    }
  }, "HEAR. EXPOSE. BUILD. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--oj-orange)'
    }
  }, "PROVE.")), /*#__PURE__*/React.createElement("p", {
    className: "oj-lede",
    style: {
      color: 'rgba(247,245,241,.8)'
    }
  }, "Four stages. No pre-selected answer. The problem decides the tool."))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, steps.map(([w, t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: w,
    style: {
      display: 'grid',
      gridTemplateColumns: '100px 260px 1fr',
      gap: 32,
      alignItems: 'start',
      padding: '30px 0',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-accent)'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    className: "oj-display",
    style: {
      fontSize: 36,
      color: i === 2 ? 'var(--oj-orange)' : 'var(--oj-ink)'
    }
  }, w), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 17
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      color: 'var(--text-secondary)'
    }
  }, d)))))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec-tight",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 26
    }
  }, "What a Growth Diagnostic includes"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: '0 0 0 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 15,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("li", null, "Agreed problem statement and success measures"), /*#__PURE__*/React.createElement("li", null, "Growth Pressure Map across the whole business"), /*#__PURE__*/React.createElement("li", null, "Prioritised opportunities and recommended intervention"), /*#__PURE__*/React.createElement("li", null, "90-day roadmap with indicative investment options")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    size: "sm"
  }, "2 to 3 weeks"), /*#__PURE__*/React.createElement(Tag, {
    size: "sm"
  }, "Fixed fee"), /*#__PURE__*/React.createElement(Tag, {
    size: "sm"
  }, "Senior access required"))), /*#__PURE__*/React.createElement(Card, {
    tone: "ink",
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 26,
      color: 'var(--oj-cream)'
    }
  }, "What we need from you"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: '0 0 0 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 15,
      lineHeight: 1.5,
      color: 'rgba(247,245,241,.85)'
    }
  }, /*#__PURE__*/React.createElement("li", null, "Direct access to a leader who can act"), /*#__PURE__*/React.createElement("li", null, "Willingness to be challenged"), /*#__PURE__*/React.createElement("li", null, "The data you already have. Imperfect is fine"), /*#__PURE__*/React.createElement("li", null, "Agreement on what success looks like")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 12.5,
      color: 'var(--oj-peach)'
    }
  }, "We charge for diagnosis. Understanding the real problem is valuable work.")))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec-tight",
    style: {
      background: 'var(--oj-orange)',
      borderTop: 'var(--bw-1) solid var(--oj-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 34
    }
  }, "Know the problem already? Start a sprint."), /*#__PURE__*/React.createElement(Button, {
    variant: "ink",
    size: "lg",
    arrow: true,
    onClick: () => onNav('start')
  }, "Bring us the problem"))));
}
window.HowWeWork = HowWeWork;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HowWeWork.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Results.jsx
try { (() => {
const DSr = window.OrangeJellyDesignSystem_a79785;
function Results({
  onNav
}) {
  const {
    Button,
    Tag,
    ProofCard,
    Quote,
    Card,
    Stat
  } = DSr;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "oj-sec",
    style: {
      padding: '80px 0 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Results"), /*#__PURE__*/React.createElement("h1", {
    className: "oj-display",
    style: {
      fontSize: 64,
      margin: '14px 0 18px',
      maxWidth: 860
    }
  }, "Proof beats promises."), /*#__PURE__*/React.createElement("p", {
    className: "oj-lede"
  }, "Every claim below carries its baseline and period. Where evidence is incomplete, we say so."))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec-tight",
    style: {
      background: 'var(--oj-ink)',
      borderTop: 'var(--bw-1) solid var(--oj-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "orange"
  }, "The Anchor \xB7 live business laboratory"), /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      color: 'var(--oj-cream)'
    }
  }, "A real pub. Real staff, stock, margin and cash flow."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15.5,
      lineHeight: 1.6,
      color: 'rgba(247,245,241,.8)'
    }
  }, "The Anchor gives Orange Jelly somewhere to test ideas in the real world, where clever thinking only matters if it changes the numbers. The lessons transfer: demand, conversion, pricing, rotas, suppliers, inventory, booking systems and AI."), /*#__PURE__*/React.createElement(Quote, {
    tone: "dark",
    name: "Billy",
    role: "General manager, The Anchor"
  }, "They told us what we didn't want to hear. Then they built the fix with us.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 28,
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "403%",
    label: "table bookings",
    sub: "Year on year",
    tone: "dark",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "567%",
    label: "private hire bookings",
    sub: "Year on year",
    tone: "dark",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "98%",
    label: "food revenue",
    sub: "Menu and pricing redesign",
    tone: "dark",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "89%",
    label: "fewer no-shows",
    sub: "Booking journey rebuild",
    tone: "dark",
    size: "lg"
  })))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "Proof by pressure point"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px',
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, "Short cards, verified metrics, honest qualifiers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(ProofCard, {
    value: "828%",
    label: "search visibility",
    context: "Google visibility over 12 months after content and journey rebuild.",
    area: "Create demand"
  }), /*#__PURE__*/React.createElement(ProofCard, {
    value: "25h",
    label: "manual work removed weekly",
    context: "Reporting and rota automation. Verified against timesheets.",
    area: "Remove operational drag"
  }), /*#__PURE__*/React.createElement(ProofCard, {
    value: "\xA313k",
    label: "annual supplier saving",
    context: "Utilities and supplier renegotiation, like-for-like volumes.",
    area: "Protect margin"
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginTop: 28,
      padding: '18px 22px',
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 12,
      color: 'var(--text-accent)',
      flex: 'none'
    }
  }, "NOTE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-secondary)'
    }
  }, "Figures are proof candidates from The Anchor programme. Baselines, periods and data sources are shared in full during a diagnostic. We publish nothing we cannot explain.")))), /*#__PURE__*/React.createElement("section", {
    className: "oj-sec-tight",
    style: {
      background: 'var(--oj-orange)',
      borderTop: 'var(--bw-1) solid var(--oj-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      fontSize: 34
    }
  }, "Want numbers like these with your name on them?"), /*#__PURE__*/React.createElement(Button, {
    variant: "ink",
    size: "lg",
    arrow: true,
    onClick: () => onNav('start')
  }, "Book a growth diagnostic"))));
}
window.Results = Results;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Results.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Shared.jsx
try { (() => {
const DS = window.OrangeJellyDesignSystem_a79785;
const {
  Button,
  Tag
} = DS;
const sharedCss = `
.oj-container{max-width:1160px;margin:0 auto;padding:0 32px}
.oj-nav a.nv{font-weight:600;font-size:15px;color:var(--oj-ink);text-decoration:none;padding:6px 2px;border-bottom:2.5px solid transparent}
.oj-nav a.nv:hover{border-bottom-color:var(--oj-orange)}
.oj-nav a.nv.on{border-bottom-color:var(--oj-ink)}
.oj-sec{padding:88px 0}
.oj-sec-tight{padding:64px 0}
.oj-h2{font-family:var(--font-display);font-weight:900;font-size:40px;line-height:1.05;letter-spacing:-.02em;margin:0}
.oj-lede{font-size:18.5px;line-height:1.55;color:var(--text-secondary);max-width:560px}
`;
if (!document.getElementById('oj-site-css')) {
  const s = document.createElement('style');
  s.id = 'oj-site-css';
  s.textContent = sharedCss;
  document.head.appendChild(s);
}
function Wordmark({
  tone = 'ink',
  size = 22
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      window.ojNav && window.ojNav('home');
    },
    style: {
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: size * 0.45,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: '../../assets/' + (tone === 'ink' ? 'logo-icon.png' : 'logo-icon-white.png'),
    alt: "",
    style: {
      height: size * 1.55,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: size,
      letterSpacing: '-.02em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--oj-orange)'
    }
  }, "Orange "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: tone === 'ink' ? 'var(--oj-ink)' : 'var(--oj-cream)'
    }
  }, "Jelly")));
}
function SiteHeader({
  route,
  onNav
}) {
  const items = [['problems', 'Growth problems'], ['method', 'How we work'], ['results', 'Results'], ['insights', 'Insights'], ['about', 'About']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--oj-cream)',
      borderBottom: 'var(--bw-1) solid var(--oj-ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container oj-nav",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      height: 68
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 22,
      marginLeft: 'auto'
    },
    "aria-label": "Main"
  }, items.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: '#' + k,
    className: 'nv' + (route === k ? ' on' : ''),
    onClick: e => {
      e.preventDefault();
      onNav(k);
    }
  }, l))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNav('start')
  }, "Bring us the problem")));
}
function SiteFooter({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--oj-ink)',
      color: 'var(--oj-cream)',
      padding: '56px 0 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'flex',
      gap: 48,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 320px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    tone: "cream",
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'rgba(247,245,241,.75)',
      maxWidth: 340
    }
  }, "Growth partner for ambitious small and mid-sized businesses."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      color: 'rgba(247,245,241,.5)'
    }
  }, "AI is part of the toolkit, not the product.")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 44,
      flexWrap: 'wrap'
    },
    "aria-label": "Footer"
  }, [['Company', [['method', 'How we work'], ['results', 'Results'], ['about', 'About']]], ['Do something', [['start', 'Book a growth diagnostic'], ['problems', 'Growth problems'], ['insights', 'Insights']]]].map(([h, ls]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--oj-orange)'
    }
  }, h), ls.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: '#' + k,
    onClick: e => {
      e.preventDefault();
      onNav(k);
    },
    style: {
      color: 'var(--oj-cream)',
      textDecoration: 'none',
      fontSize: 14.5
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      marginTop: 44,
      paddingTop: 20,
      borderTop: '1px solid rgba(247,245,241,.2)',
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 500,
      fontSize: 13,
      color: 'rgba(247,245,241,.55)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Orange Jelly Ltd"), /*#__PURE__*/React.createElement("span", null, "Stanwell Moor, Surrey")));
}
function Eyebrow({
  children,
  tone = 'light'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "oj-eyebrow",
    style: {
      color: tone === 'dark' ? 'var(--oj-peach)' : 'var(--text-accent)'
    }
  }, children);
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  Wordmark,
  Eyebrow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/StartHere.jsx
try { (() => {
const DSs = window.OrangeJellyDesignSystem_a79785;
function StartHere() {
  const {
    Button,
    Field,
    Input,
    Select,
    Textarea,
    Checkbox,
    Card,
    Tag
  } = DSs;
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "oj-sec",
    style: {
      padding: '80px 0 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oj-container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 100
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Start here"), /*#__PURE__*/React.createElement("h1", {
    className: "oj-display",
    style: {
      fontSize: 56,
      margin: '14px 0 18px'
    }
  }, "Bring us the problem."), /*#__PURE__*/React.createElement("p", {
    className: "oj-lede",
    style: {
      margin: '0 0 26px'
    }
  }, "Tell us what is happening, what you have tried and what needs to change. A senior person reads every enquiry and replies within two working days."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      fontSize: 15
    }
  }, [["What happens next", "A short call to test fit, then a scoped Growth Diagnostic if it makes sense."], ["What it costs", "Diagnostics are fixed fee. We share investment guidance before you commit."], ["Who you deal with", "The people doing the work. No handoffs to a junior team."]].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      paddingLeft: 16,
      borderLeft: '3px solid var(--oj-orange)'
    }
  }, /*#__PURE__*/React.createElement("b", null, t), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 14.5
    }
  }, d))))), sent ? /*#__PURE__*/React.createElement(Card, {
    tone: "ink",
    style: {
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "orange"
  }, "Received"), /*#__PURE__*/React.createElement("h2", {
    className: "oj-h2",
    style: {
      color: 'var(--oj-cream)',
      fontSize: 34
    }
  }, "Good. That took guts."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15.5,
      lineHeight: 1.6,
      color: 'rgba(247,245,241,.85)'
    }
  }, "We will read what you sent properly, not skim it. Expect a reply from a senior person within two working days with an honest view on fit."), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setSent(false)
  }, "Send another problem")) : /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("form", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    },
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name",
    required: true,
    htmlFor: "f-name"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-name",
    autoComplete: "name"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Work email",
    required: true,
    htmlFor: "f-em"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-em",
    type: "email",
    autoComplete: "email"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Company",
    required: true,
    htmlFor: "f-co"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-co"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Your role",
    htmlFor: "f-role"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "f-role",
    placeholder: "Owner, MD, director\u2026"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Approximate team size",
    htmlFor: "f-size"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "f-size",
    defaultValue: ""
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "Choose a band"), /*#__PURE__*/React.createElement("option", null, "Under 10"), /*#__PURE__*/React.createElement("option", null, "10 to 50"), /*#__PURE__*/React.createElement("option", null, "50 to 200"), /*#__PURE__*/React.createElement("option", null, "200 to 500"))), /*#__PURE__*/React.createElement(Field, {
    label: "Indicative investment range",
    htmlFor: "f-inv"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "f-inv",
    defaultValue: ""
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "Honest guess is fine"), /*#__PURE__*/React.createElement("option", null, "Under \xA310k"), /*#__PURE__*/React.createElement("option", null, "\xA310k to \xA330k"), /*#__PURE__*/React.createElement("option", null, "\xA330k to \xA3100k"), /*#__PURE__*/React.createElement("option", null, "\xA3100k plus"))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "What is happening in the business?",
    required: true,
    htmlFor: "f-what",
    hint: "Symptoms, numbers, gut feel. Plain words beat polish."
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "f-what",
    rows: 3
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "What do you believe is blocking growth?",
    htmlFor: "f-block"
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "f-block",
    rows: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "What would success look like?",
    htmlFor: "f-succ"
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "f-succ",
    rows: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "A decision maker will be involved from the first call",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "We are ready to be challenged, not reassured"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    type: "submit",
    arrow: true
  }, "Send the problem"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "No newsletter. No drip sequence. One reply.")))))));
}
window.StartHere = StartHere;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/StartHere.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.StickyCTA = __ds_scope.StickyCTA;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MethodStep = __ds_scope.MethodStep;

__ds_ns.PressureCard = __ds_scope.PressureCard;

__ds_ns.ProofCard = __ds_scope.ProofCard;

__ds_ns.Quote = __ds_scope.Quote;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Mark = __ds_scope.Mark;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ArticleCard = __ds_scope.ArticleCard;

__ds_ns.FAQ = __ds_scope.FAQ;

__ds_ns.Toc = __ds_scope.Toc;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.CompareTable = __ds_scope.CompareTable;

__ds_ns.LogoStrip = __ds_scope.LogoStrip;

__ds_ns.NewsletterBand = __ds_scope.NewsletterBand;

__ds_ns.OfferCard = __ds_scope.OfferCard;

})();
