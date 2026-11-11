import React, {useEffect, useId, useRef, useState} from 'react';
import {useAnimate} from 'framer-motion/mini';

const ease = [0.22, 1, 0.36, 1];
const curve = 'M8 119C35 122 42 100 68 103S110 83 136 86S173 62 205 70S248 42 275 43S322 14 365 17';

export function HeroVisual({Icon}) {
  const [scope, animate] = useAnimate();
  const gradient = useId();
  const [paused, setPaused] = useState(false);
  const entered = useRef(false);

  useEffect(() => {
    const root = scope.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine)');
    const layers = ['.traffic-card', '.phone-card', '.lead-notification'].map(s => root.querySelector(s));
    const incoming = root.querySelector('.incoming');
    const reply = root.querySelector('.outgoing');
    const read = root.querySelector('.read-indicators');
    const line = root.querySelector('.journey-line');
    const fill = root.querySelector('.journey-fill');
    const dot = root.querySelector('.journey-dot');
    const active = new Set();
    const parallax = new Map();
    let disposed = false, started = false, finished = false, visible = false, frame = 0, sequence = 0, bounds;

    function play(target, keyframes, options = {}) {
      const control = animate(target, keyframes, {duration: 0.7, ease, ...options});
      active.add(control);
      control.then(() => active.delete(control));
      return control;
    }
    function staticVisual() {
      cancelAnimationFrame(frame);
      active.forEach(control => control.stop());
      active.clear();
      parallax.forEach(control => control.stop());
      parallax.clear();
      [...layers, incoming, reply, read, fill, dot].forEach(el => {
        el.style.opacity = '1';
        el.style.transform = layers.includes(el) ? 'rotate(var(--journey-rotation))' : 'none';
        el.style.translate = '0px 0px';
      });
      line.style.strokeDashoffset = '0';
    }
    function float() {
      if (!desktop.matches || reduce.matches || paused || !finished) return;
      layers.forEach((el, i) => play(el, {
        transform: ['translateY(0px) rotate(var(--journey-rotation))', `translateY(-${[2, 3, 2.5][i]}px) rotate(var(--journey-rotation))`, 'translateY(0px) rotate(var(--journey-rotation))']
      }, {duration: [12, 14, 11][i], ease: 'easeInOut', repeat: Infinity}));
      activity();
    }
    function activity() {
      const running = visible && !document.hidden && !reduce.matches && !paused;
      active.forEach(control => running ? control.play() : control.pause());
      if (!running) resetPointer();
    }
    async function entrance() {
      started = true;
      entered.current = true;
      const run = ++sequence;
      const step = async (target, frames, options) => {
        await play(target, frames, options);
        return !disposed && !reduce.matches && run === sequence;
      };
      if (!await step(layers[0], {opacity: [0, 1], transform: ['translateY(16px) rotate(var(--journey-rotation))', 'translateY(0px) rotate(var(--journey-rotation))']})) return;
      play(fill, {opacity: [0, 1]}, {duration: 1.2});
      if (!await step(line, {strokeDashoffset: [1, 0]}, {duration: 1.15, ease: 'easeInOut'})) return;
      play(dot, {opacity: [0, 1]}, {duration: 0.3});
      if (!await step(layers[1], {opacity: [0, 1], transform: ['translateY(18px) rotate(calc(var(--journey-rotation) + 2deg))', 'translateY(0px) rotate(var(--journey-rotation))']}, {duration: 0.85})) return;
      if (!await step(incoming, {opacity: [0, 1], transform: ['translateY(5px)', 'translateY(0px)']}, {duration: 0.55})) return;
      if (!await step(reply, {opacity: [0, 1], transform: ['translateY(5px)', 'translateY(0px)']}, {duration: 0.65, delay: 0.18})) return;
      if (!await step(read, {opacity: [0, 1]}, {duration: 0.35, delay: 0.12})) return;
      if (!await step(layers[2], {opacity: [0, 1], transform: ['translateY(8px) rotate(var(--journey-rotation)) scale(0.985)', 'translateY(0px) rotate(var(--journey-rotation)) scale(1)']}, {duration: 0.7, delay: 0.18})) return;
      finished = true;
      root.dataset.journey = 'complete';
      float();
    }
    function pointer(event) {
      if (!finished || !visible || document.hidden || reduce.matches || paused || !desktop.matches || event.pointerType !== 'mouse') return;
      bounds ||= root.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        layers.forEach((el, i) => {
          parallax.get(el)?.stop();
          const depth = [3, 5, 7][i];
          parallax.set(el, animate(el, {translate: `${x * depth}px ${y * depth}px`}, {duration: 0.8, ease}));
        });
      });
    }
    function resetPointer() {
      cancelAnimationFrame(frame);
      bounds = undefined;
      parallax.forEach(control => control.stop());
      parallax.clear();
      layers.forEach(el => {el.style.translate = '0px 0px';});
    }
    function leave() {
      if (reduce.matches || paused || !desktop.matches || !finished || !visible || document.hidden) {resetPointer();return;}
      cancelAnimationFrame(frame);
      bounds = undefined;
      layers.forEach(el => {
        parallax.get(el)?.stop();
        parallax.set(el, animate(el, {translate: '0px 0px'}, {duration: 1, ease}));
      });
    }
    function preference() {
      sequence++;
      staticVisual();
      finished = true;
      root.dataset.journey = 'complete';
      if (!reduce.matches) float();
    }
    function device() {
      if (!finished) return;
      staticVisual();
      float();
    }

    // Prerendered content stays visible without JavaScript or with reduced motion.
    if (!reduce.matches && !paused && !entered.current) {
      [...layers, incoming, reply, read, fill, dot].forEach(el => {el.style.opacity = '0';});
      line.style.strokeDashoffset = '1';
      root.dataset.journey = 'waiting';
    } else {
      finished = true;
      root.dataset.journey = 'complete';
      float();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !started && !reduce.matches && !paused && !finished) entrance();
      activity();
    }, {threshold: 0.15});
    observer.observe(root);
    root.addEventListener('pointermove', pointer, {passive: true});
    root.addEventListener('pointerleave', leave);
    reduce.addEventListener('change', preference);
    desktop.addEventListener('change', device);
    document.addEventListener('visibilitychange', activity);
    window.addEventListener('resize', resetPointer, {passive: true});
    return () => {
      disposed = true;
      observer.disconnect();
      staticVisual();
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', pointer);
      root.removeEventListener('pointerleave', leave);
      reduce.removeEventListener('change', preference);
      desktop.removeEventListener('change', device);
      document.removeEventListener('visibilitychange', activity);
      window.removeEventListener('resize', resetPointer);
    };
  }, [animate, scope, paused]);

  return <div ref={scope} className="hero-visual journey-visual">
    <div role="img" aria-label="Illustrative customer journey from Google visibility to a WhatsApp enquiry and a new lead">
    <div className="hero-orbit"/>
    <div className="traffic-card">
      <div className="mini-card-head"><span className="google-g">G</span><div><strong>Google Search</strong><span>Make your business easier to find</span></div><span className="trend-icon"><Icon name="diagonal"/></span></div>
      <svg className="trend-graph" viewBox="0 0 380 150" role="img" aria-label="Illustrative upward trend; not actual performance data">
        <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#3b82f6" stopOpacity=".2"/><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></linearGradient></defs>
        <path d="M0 40H380M0 85H380M0 130H380" stroke="#e8edf6" strokeWidth="1"/>
        <path className="journey-fill" d={`${curve}V150H8Z`} fill={`url(#${gradient})`}/>
        <path className="journey-line" d={curve} pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/>
        <circle className="journey-dot" cx="365" cy="17" r="6" fill="#2563eb" stroke="white" strokeWidth="3"/>
      </svg>
      <div className="graph-caption"><span>Visibility → interest</span><span>Illustrative trend</span></div>
    </div>
    <div className="phone-card">
      <div className="phone-top"><span className="phone-camera"/><span className="phone-speaker"/></div>
      <div className="phone-chat-header"><span className="wa-avatar"><Icon name="whatsapp"/></span><div><strong>Your Business</strong><span>WhatsApp enquiries</span></div></div>
      <div className="phone-messages"><span className="example-day">Example conversation</span><p className="chat-message incoming">Hi, I found you on Google. Can you help with my business?</p><p className="chat-message outgoing">Absolutely. Tell us what you’d like to improve.<span className="read-indicators">✓✓</span></p></div>
      <div className="phone-input"><span>Start a conversation</span><Icon name="arrow"/></div>
    </div>
    <div className="lead-notification"><span className="notification-icon"><Icon name="whatsapp"/></span><div><div className="notification-title"><strong>New Lead</strong><span className="notification-dot"/></div><p>Customer Enquiry<br/>via WhatsApp</p></div></div>
    </div>
    <button className="motion-control" type="button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'Resume animation':'Pause animation'}</button>
  </div>;
}
