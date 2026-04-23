(function searchModule() {
  "use strict";

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .trim();
  }

  function rankResult(article, query) {
    var haystack = [article.title, article.excerpt, article.category, (article.tags || []).join(" ")]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(query)) {
      return 0;
    }

    var score = 1;
    if (String(article.title || "").toLowerCase().includes(query)) {
      score += 2;
    }

    if (String(article.category || "").toLowerCase().includes(query)) {
      score += 1;
    }

    return score;
  }

  function searchArticles(articles, query, activeCategory) {
    try {
      var normalizedQuery = normalizeText(query);
      if (normalizedQuery.length < 2) {
        return [];
      }

      var normalizedCategory = normalizeText(activeCategory);
      return (articles || [])
        .map(function mapArticle(article) {
          return {
            article: article,
            score: rankResult(article, normalizedQuery)
          };
        })
        .filter(function filterByScore(entry) {
          if (entry.score <= 0) {
            return false;
          }

          if (!normalizedCategory || normalizedCategory === "all") {
            return true;
          }

          return normalizeText(entry.article.category) === normalizedCategory;
        })
        .sort(function sortByScore(a, b) {
          return b.score - a.score;
        })
        .slice(0, 8)
        .map(function unwrap(entry) {
          return entry.article;
        });
    } catch (error) {
      console.error("Search failed.", error);
      return [];
    }
  }

  function renderSearchResults(container, results, linkPrefix) {
    try {
      if (!container) {
        return;
      }

      if (!results.length) {
        container.innerHTML = "<p class=\"status-note\">No matching stories yet. Try another keyword.</p>";
        return;
      }

      container.innerHTML = results
        .map(function toResultItem(item) {
          return [
            "<article class=\"card fade-up\">",
            "<p class=\"kicker\"><span class=\"badge\">" + item.category + "</span>" + item.date + "</p>",
            "<h3 class=\"card-title\"><a href=\"" + linkPrefix + "pages/article.html?id=" + encodeURIComponent(item.id) + "\">" + item.title + "</a></h3>",
            "<p class=\"status-note\">" + item.excerpt + "</p>",
            "</article>"
          ].join("");
        })
        .join("");
    } catch (error) {
      console.error("Search render failed.", error);
    }
  }

  window.MediababaSearch = {
    searchArticles: searchArticles,
    renderSearchResults: renderSearchResults
  };
})();
