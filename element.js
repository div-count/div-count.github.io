// **************************************************************************** <div-count>
// count all DIvs
// list all DIVs with attributes
customElements.define('div-count', class extends HTMLElement {
    // ======================================================================== connectedCallback
    connectedCallback() {
        // -------------------------------------------------------------------- find DIVs
        const tagList = this.findtags(document, "DIV");
        const tagCount = tagList.length;
        // -------------------------------------------------------------------- create HTML
        const tagHTML = tagList.map(div => {
            return `<li>&lt;div ${Array
                .from(div.attributes)
                .map(attr => `${attr.name}="${attr.value}"`).join(' ') || ''}&gt;</li>`
        }).join('');
        // -------------------------------------------------------------------- inject HTML
        (this.attachShadow({ mode: 'open' }) || this.shadowRoot).innerHTML =
            "<style>" +
            ":host{display:block;font:16px arial}" +
            "</style>" +
            "<div-report>" +
            "Alas, this page has " + tagCount + " DIVs" +
            "<ul>" + tagHTML + "</ul>" +
            "</div-report>";
    }

    // ======================================================================== findtags
    // Recursively find all <div> elements, including those in shadow roots
    findtags(root, tagName) {
        let tags = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT, {
            acceptNode: (node) => node.tagName === tagName
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP
        });
        // --------------------------------------------------------------------
        let node = walker.nextNode();
        while (node) {
            tags.push(node);
            if (node.shadowRoot) tags = tags.concat(this.findtags(node.shadowRoot));
            node = walker.nextNode();
        }
        // --------------------------------------------------------------------
        // Also check for shadow roots on non-div elements
        if (root instanceof ShadowRoot || root instanceof Document || root instanceof DocumentFragment) {
            Array.from(root.querySelectorAll('*')).forEach(el => {
                if (el.shadowRoot) {
                    tags = tags.concat(this.findtags(el.shadowRoot));
                }
            });
        }
        return tags;
    } // findtags
    // ========================================================================
}); // define