// ==UserScript==
// @name         Moderneopets Item Links Everywhere (Accessible)
// @namespace    https://moderneopets.com/
// @version      1.5
// @description  Adds accessible Safety Deposit and Shop Wizard links to jobs, faerie quests, and Kadoatery
// @match        https://www.moderneopets.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ✅ Your custom icons
    const SD_ICON  = 'https://raw.githubusercontent.com/Arduqq/petsite-scripts/refs/heads/main/images/sdb.png';
    const WIZ_ICON = 'https://raw.githubusercontent.com/Arduqq/petsite-scripts/refs/heads/main/images/wizard.png';

    function createIconLink(href, iconUrl, label) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', label);
        a.title = label;
        a.style.marginLeft = '6px';

        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = label;
        img.setAttribute('role', 'img');
        img.style.height = '16px';
        img.style.verticalAlign = 'middle';

        a.appendChild(img);
        return a;
    }

    function injectLinksAfterElement(el, itemName) {
        if (!itemName || el.dataset.itemLinksAdded) return;

        const encoded = encodeURIComponent(itemName);

        el.appendChild(
            createIconLink(
                `https://www.moderneopets.com/safetydeposit?search=${encoded}`,
                SD_ICON,
                `Search Safety Deposit for ${itemName}`
            )
        );

        el.appendChild(
            createIconLink(
                `https://www.moderneopets.com/market/wizard?term=${encoded}&shop_type=1&search_items=2`,
                WIZ_ICON,
                `Search Shop Wizard for ${itemName}`
            )
        );

        el.dataset.itemLinksAdded = 'true';
    }

    function processJobs() {
        document.querySelectorAll('.job-listing p').forEach(p => {
            const match = p.textContent.match(/Find\s+\d+\s+of:\s*(.+)/i);
            if (match) {
                injectLinksAfterElement(p, match[1].trim());
            }
        });
    }

function processFaerieQuests() {
    // Main quest item: "Where is my <b>Item Name</b>?"
    document.querySelectorAll('p b').forEach(b => {
        const text = b.textContent.trim();

        // Skip generic or numeric bolds (e.g. "one", "two", "3")
        if (!text || text.length < 3 || /^[0-9]+$/.test(text) || text.toLowerCase() === 'one') {
            return;
        }

        const p = b.closest('p');
        if (!p) return;

        // Must be a question asking for the item
        if (!p.textContent.includes('Where is my')) return;

        injectLinksAfterElement(b, text);
    });

    // Alternative items (explicit container, safe)
    document.querySelectorAll('.quest-item b').forEach(b => {
        const text = b.textContent.trim();
        if (text) {
            injectLinksAfterElement(b, text);
        }
    });
}


    function processKadoatery() {
        document.querySelectorAll('.unfed div b').forEach(b => {
            const parentText = b.parentElement?.textContent || '';
            if (parentText.includes('You should give it')) {
                injectLinksAfterElement(b, b.textContent.trim());
            }
        });
    }

    function runAll() {
        processJobs();
        processFaerieQuests();
        processKadoatery();
    }

    runAll();

    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });
})();
