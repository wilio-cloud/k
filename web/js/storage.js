// Kindle Calm Hub - Persistent State Manager (ES5/ES6 safe for all Kindles)
(function () {
  var PREFIX = "kindle_calm_v1_";
  var memoryFallback = {};

  function get(key, fallback) {
    var fullKey = PREFIX + key;
    try {
      var raw = window.localStorage.getItem(fullKey);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return memoryFallback.hasOwnProperty(fullKey) ? memoryFallback[fullKey] : fallback;
    }
  }

  function set(key, value) {
    var fullKey = PREFIX + key;
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      memoryFallback[fullKey] = value;
    }
  }

  function remove(key) {
    var fullKey = PREFIX + key;
    try {
      window.localStorage.removeItem(fullKey);
    } catch (e) {
      delete memoryFallback[fullKey];
    }
  }

  window.CalmStorage = {
    get: get,
    set: set,
    remove: remove
  };
})();
