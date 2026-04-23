(function appModule() {
  "use strict";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getPathPrefix() {
    return document.body.getAttribute("data-path-prefix") || "";
  }

  function getQueryParam(name) {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get(name) || "";
    } catch (error) {
      console.error("Query parameter parse failed.", error);
      return "";
    }
  }

  function formatToday() {
    try {
      return new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (error) {
      console.error("Date format failed.", error);
      return "Today";
    }
  }

  async function loadContent(pathPrefix) {
    try {
      var response = await fetch(pathPrefix + "src/data/content.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load content.json");
      }

      return await response.json();
    } catch (error) {
      console.error("Content load failed.", error);
      return {
        site: { name: "Mediababa", tagline: "Bold editorial intelligence" },
        categories: [],
        liveUpdates: [],
        articles: []
      };
    }
  }

  function linkToCategory(pathPrefix, category) {
    return pathPrefix + "pages/category.html?category=" + encodeURIComponent(category);
  }

  function linkToArticle(pathPrefix, articleId) {
    return pathPrefix + "pages/article.html?id=" + encodeURIComponent(articleId);
  }

  function compactHeadline(article, pathPrefix) {
    return [
      "<article class=\"compact-item\">",
      "  <p class=\"kicker\"><span class=\"badge\">" + escapeHtml(article.category) + "</span>" + escapeHtml(article.date) + "</p>",
      "  <h3 class=\"compact-title\"><a href=\"" + linkToArticle(pathPrefix, article.id) + "\">" + escapeHtml(article.title) + "</a></h3>",
      "</article>"
    ].join("");
  }

  function articleMeta(article) {
    return [
      "<p class=\"kicker\"><span class=\"badge\">" + escapeHtml(article.category) + "</span> " + escapeHtml(article.date) + "</p>",
      "<p class=\"status-note\">By " + escapeHtml(article.author) + " | " + escapeHtml(article.readTime) + "</p>"
    ].join("");
  }

  function articleCard(article, pathPrefix) {
    return [
      "<article class=\"card fade-up\">",
      "  <div class=\"story-thumb\">" + escapeHtml(article.category) + " desk</div>",
      "  " + articleMeta(article),
      "  <h3 class=\"card-title\"><a href=\"" + linkToArticle(pathPrefix, article.id) + "\">" + escapeHtml(article.title) + "</a></h3>",
      "  <p class=\"status-note\">" + escapeHtml(article.excerpt) + "</p>",
      "</article>"
    ].join("");
  }

  function renderHeader(content, activeCategory, pathPrefix) {
    try {
      var header = document.getElementById("site-header");
      if (!header) {
        return;
      }

      var categoryLinks = (content.categories || [])
        .map(function mapCategory(category) {
          var activeClass = category.toLowerCase() === String(activeCategory || "").toLowerCase() ? " active" : "";
          return "<a class=\"pill-link" + activeClass + "\" href=\"" + linkToCategory(pathPrefix, category) + "\">" + escapeHtml(category) + "</a>";
        })
        .join("");

      var tickerText = (content.liveUpdates || [])
        .slice(0, 3)
        .map(function mapUpdate(update) {
          return escapeHtml(update.title);
        })
        .join(" | ");

      if (!tickerText) {
        tickerText = "Fresh updates are being curated by the Mediababa live desk.";
      }

      header.innerHTML = [
        "<header class=\"topbar\">",
        "  <div class=\"container topbar-inner\">",
        "    <a class=\"brand-mark\" href=\"" + pathPrefix + "index.html\" aria-label=\"Mediababa home\">",
        "      <span class=\"brand-dot\" aria-hidden=\"true\"></span>",
        "      <span>Mediababa</span>",
        "    </a>",
        "    <div class=\"topbar-tools\">",
        "      <p class=\"topbar-date\">Edition India | " + escapeHtml(formatToday()) + "</p>",
        "      <div class=\"meta-row tight\">",
        "        <div class=\"search-shell\">",
        "          <label class=\"visually-hidden\" for=\"global-search\">Search stories</label>",
        "          <input id=\"global-search\" name=\"global-search\" type=\"search\" placeholder=\"Search stories, tags, categories\" autocomplete=\"off\" />",
        "        </div>",
        "        <button class=\"icon-btn\" data-theme-toggle type=\"button\" aria-pressed=\"false\">Dark</button>",
        "      </div>",
        "    </div>",
        "  </div>",
        "  <nav class=\"container nav-scroll\" aria-label=\"Sections\">",
        "    <a class=\"pill-link" + (!activeCategory ? " active" : "") + "\" href=\"" + pathPrefix + "index.html\">Home</a>",
        "    " + categoryLinks,
        "  </nav>",
        "  <div class=\"container news-flash\">",
        "    <p class=\"news-flash-label\">Breaking</p>",
        "    <p class=\"news-flash-track\">" + tickerText + "</p>",
        "  </div>",
        "</header>"
      ].join("");
    } catch (error) {
      console.error("Header render failed.", error);
    }
  }

  function renderFooter(pathPrefix) {
    try {
      var footer = document.getElementById("site-footer");
      if (!footer) {
        return;
      }

      var year = new Date().getFullYear();
      footer.innerHTML = [
        "<footer class=\"footer\">",
        "  <div class=\"container footer-grid\">",
        "    <div class=\"stack-sm\">",
        "      <p class=\"brand-mark\"><span class=\"brand-dot\" aria-hidden=\"true\"></span><span>Mediababa</span></p>",
        "      <p class=\"status-note\">Independent media intelligence built for high-speed scanning, verified context, and actionable updates.</p>",
        "      <p class=\"status-note\">Copyright " + year + " Mediababa.</p>",
        "    </div>",
        "    <div class=\"stack-sm\">",
        "      <a href=\"" + pathPrefix + "index.html\">Homepage</a>",
        "      <a href=\"" + linkToCategory(pathPrefix, "Trending") + "\">Trending</a>",
        "      <a href=\"" + linkToCategory(pathPrefix, "Business") + "\">Business</a>",
        "      <a href=\"" + linkToCategory(pathPrefix, "Tech") + "\">Tech</a>",
        "    </div>",
        "  </div>",
        "</footer>"
      ].join("");
    } catch (error) {
      console.error("Footer render failed.", error);
    }
  }

  function renderHome(content, pathPrefix) {
    try {
      var target = document.getElementById("page-content");
      if (!target) {
        return;
      }

      var articles = content.articles || [];
      var featured = articles.find(function findFeatured(item) {
        return item.featured;
      }) || articles[0];

      var secondaryHeadlines = articles.filter(function filterFeatured(item) {
        return !featured || item.id !== featured.id;
      }).slice(0, 4);

      var picks = articles.filter(function filterFeatured(item) {
        return !featured || item.id !== featured.id;
      }).slice(0, 6);

      var pulseItems = (content.categories || []).slice(0, 4).map(function mapPulse(category) {
        var count = articles.filter(function filterCategory(article) {
          return article.category.toLowerCase() === category.toLowerCase();
        }).length;

        return [
          "<article class=\"pulse-chip\">",
          "  <p class=\"kicker\">" + escapeHtml(category) + "</p>",
          "  <strong>" + escapeHtml(String(count)) + " active stories</strong>",
          "  <p class=\"status-note\">Updated by editorial desk</p>",
          "</article>"
        ].join("");
      }).join("");

      var categoryHighlights = (content.categories || []).slice(0, 4).map(function mapCategory(category) {
        var topArticle = articles.find(function findByCategory(item) {
          return item.category.toLowerCase() === category.toLowerCase();
        });

        if (!topArticle) {
          return "";
        }

        return [
          "<article class=\"card\">",
          "  <p class=\"kicker\"><span class=\"badge\">" + escapeHtml(category) + "</span>Desk signal</p>",
          "  <h3 class=\"card-title\"><a href=\"" + linkToArticle(pathPrefix, topArticle.id) + "\">" + escapeHtml(topArticle.title) + "</a></h3>",
          "  <p class=\"status-note\">" + escapeHtml(topArticle.excerpt) + "</p>",
          "</article>"
        ].join("");
      }).join("");

      target.innerHTML = [
        "<section class=\"section home-lead-grid\">",
        "  <article class=\"lead-story fade-up\">",
        "    <p class=\"kicker\">Lead coverage | newsroom priority</p>",
        "    <h1 class=\"hero-title\">" + escapeHtml((content.site || {}).name || "Mediababa") + "</h1>",
        "    <p class=\"hero-sub\">" + escapeHtml((content.site || {}).tagline || "") + ". Built for fast decisions with clear context and less homepage noise.</p>",
        featured ? "    <h2 class=\"section-title\"><a href=\"" + linkToArticle(pathPrefix, featured.id) + "\">" + escapeHtml(featured.title) + "</a></h2>" : "",
        featured ? "    <p class=\"status-note\">" + escapeHtml(featured.excerpt) + "</p>" : "",
        featured ? "    <div class=\"lead-meta\">" + articleMeta(featured) + "</div>" : "",
        "    <div class=\"lead-cta\">",
        featured ? "      <a class=\"btn-primary\" href=\"" + linkToArticle(pathPrefix, featured.id) + "\">Read lead story</a>" : "",
        "      <a class=\"icon-btn\" href=\"" + linkToCategory(pathPrefix, "Trending") + "\">View trending desk</a>",
        "    </div>",
        "  </article>",
        "  <div class=\"headline-stack\">",
        "    <section class=\"headline-rail fade-up\" data-delay=\"1\">",
        "      <p class=\"kicker\">Top headlines</p>",
        "      " + secondaryHeadlines.map(function mapHeadline(article) {
          return compactHeadline(article, pathPrefix);
        }).join(""),
        "    </section>",
        "    <aside class=\"live-panel fade-up\" data-delay=\"2\">",
        "      <p class=\"kicker\">Live updates stream</p>",
        "      <div id=\"live-updates\" class=\"live-grid\"></div>",
        "    </aside>",
        "  </div>",
        "</section>",
        "<section class=\"section stack-md\">",
        "  <div class=\"section-head\">",
        "    <div class=\"stack-sm\">",
        "      <p class=\"kicker\">Editorial pulse</p>",
        "      <h2 class=\"section-title\">What is moving now</h2>",
        "    </div>",
        "    <p class=\"section-sub\">A quick macro snapshot from the desks with highest update velocity.</p>",
        "  </div>",
        "  <div class=\"quick-pulse\">",
        pulseItems,
        "  </div>",
        "</section>",
        "<section class=\"section stack-md\">",
        "  <div class=\"section-head\">",
        "    <div class=\"stack-sm\">",
        "      <p class=\"kicker\">Editors pick</p>",
        "      <h2 class=\"section-title\">Most relevant reads</h2>",
        "    </div>",
        "    <a class=\"pill-link\" href=\"" + linkToCategory(pathPrefix, "News") + "\">Open News Desk</a>",
        "  </div>",
        "  <div class=\"cards-grid\">",
        picks.map(function mapPick(article) {
          return articleCard(article, pathPrefix);
        }).join(""),
        "  </div>",
        "</section>",
        "<section class=\"section stack-md\">",
        "  <div class=\"section-head\">",
        "    <div class=\"stack-sm\">",
        "      <p class=\"kicker\">Section tracker</p>",
        "      <h2 class=\"section-title\">Signals by category</h2>",
        "    </div>",
        "    <p class=\"section-sub\">Each desk has one highlighted signal so readers can orient quickly.</p>",
        "  </div>",
        "  <div class=\"highlights-grid\">",
        categoryHighlights,
        "  </div>",
        "</section>",
        "<section class=\"section newsletter stack-sm\">",
        "  <p class=\"kicker\">Subscribe</p>",
        "  <h2 class=\"section-title\">Get the 5 biggest media moves each morning</h2>",
        "  <form id=\"newsletter-form\" class=\"newsletter-form\" novalidate>",
        "    <label for=\"newsletter-email\">Email address</label>",
        "    <input id=\"newsletter-email\" name=\"newsletter-email\" type=\"email\" required placeholder=\"you@example.com\" />",
        "    <label><input id=\"newsletter-consent\" type=\"checkbox\" required /> I agree to receive editorial updates from Mediababa.</label>",
        "    <button class=\"btn-primary\" type=\"submit\">Subscribe now</button>",
        "    <p id=\"newsletter-status\" class=\"status-note\" aria-live=\"polite\"></p>",
        "  </form>",
        "</section>",
        "<section class=\"section stack-sm\">",
        "  <p class=\"kicker\">Search results</p>",
        "  <div id=\"search-results\" class=\"search-results\"></div>",
        "</section>"
      ].join("");

      if (featured) {
        document.title = featured.title + " | Mediababa";
      }
    } catch (error) {
      console.error("Home render failed.", error);
    }
  }

  function renderCategory(content, pathPrefix) {
    try {
      var target = document.getElementById("page-content");
      if (!target) {
        return "";
      }

      var selected = getQueryParam("category") || "Trending";
      var articles = (content.articles || []).filter(function filterByCategory(article) {
        return article.category.toLowerCase() === selected.toLowerCase();
      });

      var featured = articles[0] || null;
      var cards = articles.length
        ? articles.map(function mapArticle(article) {
            return articleCard(article, pathPrefix);
          }).join("")
        : "<p class=\"status-note\">No stories found for this category yet.</p>";

      target.innerHTML = [
        "<section class=\"section stack-md\">",
        "  <article class=\"category-banner\">",
        "    <p class=\"kicker\">Category desk</p>",
        "    <h1 class=\"hero-title\">" + escapeHtml(selected) + " updates</h1>",
        "    <p class=\"hero-sub\">" + escapeHtml(String(articles.length)) + " published signals in this desk. Scan headlines, then drill down to full reports.</p>",
        featured ? "    <p class=\"status-note\">Lead in this desk: <a href=\"" + linkToArticle(pathPrefix, featured.id) + "\">" + escapeHtml(featured.title) + "</a></p>" : "",
        "  </article>",
        "  <div class=\"page-grid\">",
        "    <div class=\"cards-grid\">" + cards + "</div>",
        "    <aside class=\"related-stack\">",
        "      <div class=\"live-panel\">",
        "        <p class=\"kicker\">Live monitor</p>",
        "        <div id=\"live-updates\" class=\"live-grid\"></div>",
        "      </div>",
        "      <div class=\"headline-rail\">",
        "        <p class=\"kicker\">Quick jump</p>",
        "        <a class=\"pill-link\" href=\"" + pathPrefix + "index.html\">Return to homepage</a>",
        "      </div>",
        "    </aside>",
        "  </div>",
        "</section>",
        "<section class=\"section stack-sm\">",
        "  <p class=\"kicker\">Search inside " + escapeHtml(selected) + "</p>",
        "  <div id=\"search-results\" class=\"search-results\"></div>",
        "</section>"
      ].join("");

      document.title = selected + " | Mediababa";
      return selected;
    } catch (error) {
      console.error("Category render failed.", error);
      return "";
    }
  }

  function renderArticle(content, pathPrefix) {
    try {
      var target = document.getElementById("page-content");
      if (!target) {
        return "";
      }

      var articleId = getQueryParam("id");
      var article = (content.articles || []).find(function findArticle(item) {
        return item.id === articleId;
      });

      if (!article) {
        target.innerHTML = "<section class=\"section\"><p class=\"status-note\">Story not found.</p></section>";
        return "";
      }

      var summaryItems = (article.content || []).slice(0, 3).map(function mapPoint(point) {
        return "<li>" + escapeHtml(point) + "</li>";
      }).join("");

      var related = (content.articles || [])
        .filter(function filterRelated(item) {
          return item.id !== article.id && item.category === article.category;
        })
        .slice(0, 4);

      target.innerHTML = [
        "<section class=\"section stack-md\">",
        "  <article class=\"hero-card\">",
        "    " + articleMeta(article),
        "    <h1 class=\"hero-title\">" + escapeHtml(article.title) + "</h1>",
        "    <p class=\"hero-sub\">" + escapeHtml(article.excerpt) + "</p>",
        "    <div class=\"tags-row\">",
        (article.tags || []).map(function mapTag(tag) {
          return "<span class=\"badge\">" + escapeHtml(tag) + "</span>";
        }).join(""),
        "    </div>",
        "  </article>",
        "  <div class=\"article-summary-grid\">",
        "    <div class=\"headline-rail\">",
        "      <p class=\"kicker\">Summary</p>",
        "      <h2 class=\"section-title\">Key points in one minute</h2>",
        "      <ul class=\"summary-list\">" + summaryItems + "</ul>",
        "    </div>",
        "    <aside class=\"live-panel\">",
        "      <p class=\"kicker\">Live monitor</p>",
        "      <div id=\"live-updates\" class=\"live-grid\"></div>",
        "    </aside>",
        "  </div>",
        "  <div class=\"page-grid\">",
        "    <div class=\"card article-content\">",
        (article.content || []).map(function mapParagraph(paragraph) {
          return "<p>" + escapeHtml(paragraph) + "</p>";
        }).join(""),
        "    </div>",
        "    <aside class=\"related-stack\">",
        "      <div class=\"headline-rail\">",
        "        <p class=\"kicker\">Related from " + escapeHtml(article.category) + "</p>",
        related.length
          ? related.map(function mapRelated(item) {
              return compactHeadline(item, pathPrefix);
            }).join("")
          : "<p class=\"status-note\">No related stories yet.</p>",
        "      </div>",
        "    </aside>",
        "  </div>",
        "</section>",
        "<section class=\"section stack-sm\">",
        "  <p class=\"kicker\">Search more stories</p>",
        "  <div id=\"search-results\" class=\"search-results\"></div>",
        "</section>"
      ].join("");

      document.title = article.title + " | Mediababa";
      return article.category;
    } catch (error) {
      console.error("Article render failed.", error);
      return "";
    }
  }

  function bindSearch(content, pathPrefix, categoryFilter) {
    try {
      var input = document.getElementById("global-search");
      var resultsNode = document.getElementById("search-results");
      if (!input || !resultsNode || !window.MediababaSearch) {
        return;
      }

      function runSearch() {
        var results = window.MediababaSearch.searchArticles(content.articles || [], input.value, categoryFilter || "all");
        if (!input.value.trim()) {
          resultsNode.innerHTML = "<p class=\"status-note\">Type at least two characters to start searching.</p>";
          return;
        }

        window.MediababaSearch.renderSearchResults(resultsNode, results, pathPrefix);
      }

      input.addEventListener("input", runSearch);
      resultsNode.innerHTML = "<p class=\"status-note\">Type at least two characters to start searching.</p>";
    } catch (error) {
      console.error("Search bind failed.", error);
    }
  }

  function bindNewsletter() {
    try {
      var form = document.getElementById("newsletter-form");
      if (!form) {
        return;
      }

      var statusNode = document.getElementById("newsletter-status");
      var emailNode = document.getElementById("newsletter-email");
      var consentNode = document.getElementById("newsletter-consent");

      form.addEventListener("submit", function onSubmit(event) {
        event.preventDefault();

        var email = String(emailNode && emailNode.value ? emailNode.value : "").trim();
        var hasConsent = Boolean(consentNode && consentNode.checked);

        if (!email || !email.includes("@")) {
          if (statusNode) {
            statusNode.textContent = "Please enter a valid email address.";
          }
          return;
        }

        if (!hasConsent) {
          if (statusNode) {
            statusNode.textContent = "Please accept consent to subscribe.";
          }
          return;
        }

        if (statusNode) {
          statusNode.textContent = "Thanks. You are now subscribed to the Mediababa briefing.";
        }
        form.reset();
      });
    } catch (error) {
      console.error("Newsletter bind failed.", error);
    }
  }

  async function init() {
    try {
      if (window.MediababaTheme) {
        window.MediababaTheme.initTheme();
      }

      var pageType = document.body.getAttribute("data-page") || "home";
      var pathPrefix = getPathPrefix();
      var content = await loadContent(pathPrefix);
      var activeCategory = "";

      if (pageType === "category") {
        activeCategory = getQueryParam("category") || "";
      }

      renderHeader(content, activeCategory, pathPrefix);

      if (pageType === "category") {
        activeCategory = renderCategory(content, pathPrefix) || activeCategory;
      } else if (pageType === "article") {
        activeCategory = renderArticle(content, pathPrefix) || "";
      } else {
        renderHome(content, pathPrefix);
      }

      renderFooter(pathPrefix);

      var liveContainer = document.getElementById("live-updates");
      if (window.MediababaLive && liveContainer) {
        window.MediababaLive.renderLiveUpdates(liveContainer, content.liveUpdates || []);
      }

      bindSearch(content, pathPrefix, activeCategory || "all");
      bindNewsletter();
    } catch (error) {
      console.error("App init failed.", error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
