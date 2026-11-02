/* ==========================================================================
   Krist — interactions
   Vanilla JS, no dependencies. Progressive: the page still reads fine
   without it, but the project grid is rendered here from projects.js.
   ========================================================================== */

(function () {
  "use strict";

  var reductions = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReduced = reductions.matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------------------------------------------------------- utils */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  var toastEl = $("#toast");
  var toastTimer = null;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-on");
    }, 2600);
  }

  /* ------------------------------------------------------------- projects */
  var projects = window.KRIST_PROJECTS || [];
  var grid = $("#projectGrid");
  var empty = $("#gridEmpty");

  function coverMarkup(project) {
    if (project.image) {
      return '<img class="card__img" src="' + escapeHTML(project.image) +
        '" alt="" loading="lazy" decoding="async">';
    }
    var colors = project.colors || [];
    var style = "";
    if (colors[0]) style += "--a:" + escapeHTML(colors[0]) + ";";
    if (colors[1]) style += "--b:" + escapeHTML(colors[1]) + ";";
    var art = Math.min(6, Math.max(1, Number(project.art) || 1));
    return '<div class="art art--' + art + '" style="' + style + '"></div>';
  }

  /* Museum wall labels: "live" pieces are on display, the rest wait in
     storage. Kept tiny and mono so they read like plaque captions. */
  var STATUS_LABELS = { live: "On display", wip: "In progress", stored: "In storage" };

  function plaqueMarkup(project, index) {
    var role = project.role || "";
    var stack = project.stack || "";
    var status = project.status ||
      (/^https?:\/\//i.test(project.href || "") ? "live" : "stored");
    var statusLabel = STATUS_LABELS[status] || STATUS_LABELS.stored;

    var rows = "";
    if (project.medium) {
      rows += '<div><dt>Medium</dt><dd>' + escapeHTML(project.medium) + "</dd></div>";
    }
    if (role) rows += '<div><dt>Role</dt><dd>' + escapeHTML(role) + "</dd></div>";
    if (stack) rows += '<div><dt>Stack</dt><dd>' + escapeHTML(stack) + "</dd></div>";
    if (!rows) return "";

    return '' +
      '<div class="card__plaque">' +
        '<div class="plaque__head">' +
          '<span class="plaque__no">Exhibit №' + pad(index + 1) + "</span>" +
          '<span class="plaque__status">' + statusLabel + "</span>" +
        "</div>" +
        '<dl class="plaque__rows">' + rows + "</dl>" +
      "</div>";
  }

  function cardMarkup(project, index) {
    var tags = project.tags || [];
    var external = /^https?:\/\//i.test(project.href || "");
    var href = project.href || "#";

    return '' +
      '<article class="card" style="--i:' + (index % 2) + '" data-tags="' + escapeHTML(tags.join(" ")) + '">' +
        '<a class="card__link" href="' + escapeHTML(href) + '"' +
          (external ? ' target="_blank" rel="noopener noreferrer"' : "") + '>' +
          '<div class="card__cover">' +
            coverMarkup(project) +
            '<span class="card__index">' + pad(index + 1) + '</span>' +
            '<span class="card__open">View <span aria-hidden="true">↗</span></span>' +
          '</div>' +
          '<div class="card__meta">' +
            '<h3 class="card__title">' + escapeHTML(project.title) + '</h3>' +
            '<span class="card__year">' + escapeHTML(project.year || "") + '</span>' +
          '</div>' +
          (project.blurb ? '<p class="card__blurb">' + escapeHTML(project.blurb) + '</p>' : "") +
          plaqueMarkup(project, index) +
          (tags.length
            ? '<ul class="card__tags">' + tags.map(function (tag) {
                return "<li>" + escapeHTML(tag) + "</li>";
              }).join("") + "</ul>"
            : "") +
        '</a>' +
      '</article>';
  }

  if (grid) {
    grid.innerHTML = projects.map(cardMarkup).join("");

    // Filter counts
    $$("[data-count]").forEach(function (el) {
      var key = el.getAttribute("data-count");
      var count = key === "all"
        ? projects.length
        : projects.filter(function (project) {
            return (project.tags || []).indexOf(key) !== -1;
          }).length;
      el.textContent = pad(count);

      var chip = el.closest ? el.closest(".chip") : null;
      if (chip && key !== "all" && count === 0) chip.hidden = true;
    });

    // With only a couple of projects, filters get in the way
    var filterBar = $(".filters");
    if (filterBar && projects.length < 3) filterBar.hidden = true;

    var workNote = $("#workNote");
    if (workNote) {
      workNote.textContent = projects.length === 1
        ? "1 exhibit — permanent collection"
        : projects.length + " exhibits — permanent collection";
    }
  }

  /* -------------------------------------------------------------- filters */
  var chips = $$(".chip");

  function applyFilter(filter) {
    var shown = 0;

    $$(".card", grid).forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").split(" ");
      var visible = filter === "all" || tags.indexOf(filter) !== -1;
      card.classList.toggle("is-hidden", !visible);
      if (visible) shown += 1;
    });

    chips.forEach(function (chip) {
      var active = chip.getAttribute("data-filter") === filter;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      applyFilter(chip.getAttribute("data-filter") || "all");
    });
  });

  /* --------------------------------------------------------------- reveal */
  var revealTargets = $$("[data-reveal]").concat($$(".card", grid));

  if ("IntersectionObserver" in window && !prefersReduced) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* --------------------------------------------------------- header/scroll */
  var header = $("#siteHeader");
  var progressBar = $("#progressBar");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-stuck", y > 10);

    if (progressBar) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, y / max) : 0;
      progressBar.style.width = (ratio * 100).toFixed(2) + "%";
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* -------------------------------------------------------------- magnets */
  if (finePointer && !prefersReduced) {
    $$(".magnet").forEach(function (el) {
      var frame = null;

      el.addEventListener("pointermove", function (event) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var rect = el.getBoundingClientRect();
          var x = (event.clientX - rect.left - rect.width / 2) * 0.14;
          var y = (event.clientY - rect.top - rect.height / 2) * 0.22;
          el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
          frame = null;
        });
      });

      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------ copy email */
  var copyBtn = $("#copyEmail");

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try { document.execCommand("copy"); } catch (error) { /* noop */ }
    document.body.removeChild(field);
  }

  if (copyBtn) {
    // The address is stored reversed in the markup and put back together here,
    // so it never appears as plain text for scrapers to harvest.
    var email = (copyBtn.getAttribute("data-email-parts") || "").split("").reverse().join("");
    var emailLabel = $("#emailText");
    if (email && emailLabel) emailLabel.textContent = email;

    copyBtn.addEventListener("click", function () {
      if (!email) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () {
          toast("Copied — " + email);
        }).catch(function () {
          legacyCopy(email);
          toast("Copied — " + email);
        });
      } else {
        legacyCopy(email);
        toast("Copied — " + email);
      }
    });
  }

  /* ------------------------------------------------------ placeholder links */
  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest('a[href="#"]') : null;
    if (!link) return;
    event.preventDefault();
    toast("Link coming soon.");
  });

  /* ----------------------------------------------------------------- year */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
