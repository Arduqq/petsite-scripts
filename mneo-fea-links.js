// ==UserScript==
// @name         Moderneopets Job Item Links (Accessible Icons)
// @namespace    https://moderneopets.com/
// @version      1.3
// @description  Adds accessible Safety Deposit and Shop Wizard icon links next to job item names
// @match        https://www.moderneopets.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 🔧 Replace with your preferred icons
    const SD_ICON  = 'https://www.moderneopets.com/images/user/wishlist//safetydeposit.gif';
    const WIZ_ICON = '/workspaces/petsite-scripts/images/wizard.png';

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
        img.setAttribute('aria-hidden', 'false');
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.verticalAlign = 'middle';

        a.appendChild(img);
        return a;
    }

    function addLinks() {
        document.querySelectorAll('.job-listing p').forEach(p => {
            if (p.dataset.itemLinksAdded) return;

            const match = p.textContent.match(/Find\s+\d+\s+of:\s*(.+)/i);
            if (!match) return;

            const itemName = match[1].trim();
            const encodedName = encodeURIComponent(itemName);

            const sdHref  = `https://www.moderneopets.com/safetydeposit?search=${encodedName}`;
            const wizHref = `https://www.moderneopets.com/market/wizard?term=${encodedName}&shop_type=1&search_items=2`;

            p.appendChild(
                createIconLink(
                    sdHref,
                    SD_ICON,
                    `Search Safety Deposit for ${itemName}`
                )
            );

            p.appendChild(
                createIconLink(
                    wizHref,
                    WIZ_ICON,
                    `Search Shop Wizard for ${itemName}`
                )
            );

            p.dataset.itemLinksAdded = 'true';
        });
    }

    addLinks();

    const observer = new MutationObserver(addLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
