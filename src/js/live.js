(function liveModule() {
  "use strict";

  function renderLiveUpdates(container, updates) {
    try {
      if (!container) {
        return;
      }

      if (!Array.isArray(updates) || updates.length === 0) {
        container.innerHTML = "<p class=\"status-note\">Live desk is quiet right now. Next burst incoming soon.</p>";
        return;
      }

      container.innerHTML = updates
        .map(function mapItem(item, index) {
          return [
            "<article class=\"live-item fade-up\" data-delay=\"" + (index % 3) + "\">",
            "<p class=\"live-time\">" + item.time + "</p>",
            "<div>",
            "<p class=\"kicker\"><span class=\"badge\">" + item.category + "</span>Live update</p>",
            "<p class=\"status-note\">" + item.title + "</p>",
            "</div>",
            "</article>"
          ].join("");
        })
        .join("");
    } catch (error) {
      console.error("Live updates render failed.", error);
    }
  }

  window.MediababaLive = {
    renderLiveUpdates: renderLiveUpdates
  };
})();
