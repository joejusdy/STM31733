/**
 * NetAdmin 360 — Event Bus (Publish/Subscribe)
 * Lightweight cross-module communication without tight coupling.
 *
 * Usage:
 *   EventBus.on('score:updated', handler)
 *   EventBus.emit('score:updated', { domain: 'domain1', score: 72 })
 *   EventBus.off('score:updated', handler)
 */

const EventBus = (() => {
  const listeners = {};

  function on(event, handler) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(handler);
  }

  function off(event, handler) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(h => h !== handler);
  }

  function emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach(h => {
      try { h(data); } catch (e) { console.error(`[EventBus] Error in handler for "${event}":`, e); }
    });
  }

  function once(event, handler) {
    const wrapper = (data) => { handler(data); off(event, wrapper); };
    on(event, wrapper);
  }

  return { on, off, emit, once };
})();

export default EventBus;
