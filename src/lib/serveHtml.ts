import fs from "fs";
import path from "path";

export function serveHtml(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "public", "realtab.framer.website", filename);
    let html = fs.readFileSync(filePath, "utf8");

    // Replace static page links to remove the .html extension in URLs
    html = html.replace(/href=["']\/?about\.html["']/g, 'href="/about"');
    html = html.replace(/href=["']\/?contact\.html["']/g, 'href="/contact"');
    html = html.replace(/href=["']\/?property\.html["']/g, 'href="/properties"');
    html = html.replace(/href=["']\/?index\.html["']/g, 'href="/"');
    html = html.replace(/href=["']\/?service\.html["']/g, 'href="/service"');
    html = html.replace(/href=["']\/?team\.html["']/g, 'href="/team"');
    html = html.replace(/href=["']\/?blog\.html["']/g, 'href="/blog"');

    // Rebrand
    html = html.replace(/Realtab/g, "Mahesh Verse");

    // Inject CSS overrides inside <head> to hide sitemap sub-links, style pointers, and hide static property cards
    const customStyles = `
      <style>
        /* Hide all sublinks inside Categories sitemap dropdown columns */
        .framer-15kcdq4, .framer-1gphtik, .framer-1ccceom {
          display: none !important;
        }
        /* Make category headers look clickable */
        p.framer-styles-preset-1qh2mpa {
          cursor: pointer !important;
        }
        /* Hide original Framer static property card links */
        a[data-framer-name="Property Card"] {
          display: none !important;
        }
      </style>
    `;
    html = html.replace("</head>", `${customStyles}</head>`);

    // Inject JS click delegation script and dynamic property syncing inside <body>
    const clickScript = `
      <script>
        document.addEventListener("click", function(e) {
          var target = e.target;
          if (target && target.tagName === "P" && target.classList.contains("framer-styles-preset-1qh2mpa")) {
            var text = (target.innerText || target.textContent).trim();
            if (text === "Lands") {
              window.location.href = "/properties?category=Lands";
            } else if (text === "Flats") {
              window.location.href = "/properties?category=Flats";
            } else if (text === "Houses") {
              window.location.href = "/properties?category=Houses";
            }
          }
        });

        (async function() {
          try {
            const res = await fetch('/api/properties');
            if (!res.ok) return;
            const properties = await res.json();
            
            const params = new URLSearchParams(window.location.search);
            const categoryFilter = params.get('category');
            let filteredProperties = properties;
            if (categoryFilter) {
              filteredProperties = properties.filter(p => p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
            }
            
            // Cache of templates
            const templates = new Map();
            const gridWrappers = new Set();
            
            // Find grid wrappers and extract templates from the initial server-rendered HTML
            const initialLinks = document.querySelectorAll('a[href*="/properties/"]');
            initialLinks.forEach(link => {
              if (link.getAttribute('data-dynamic-card') === 'true') return;
              
              const cardWrapper = link.parentElement;
              const gridWrapper = cardWrapper ? cardWrapper.parentElement : null;
              if (gridWrapper && !templates.has(gridWrapper)) {
                const templateNode = cardWrapper.cloneNode(true);
                templateNode.removeAttribute('data-framer-name');
                const internalLink = templateNode.querySelector('a');
                if (internalLink) {
                  internalLink.removeAttribute('data-framer-name');
                  internalLink.setAttribute('data-dynamic-card', 'true');
                }
                
                templates.set(gridWrapper, templateNode);
                gridWrappers.add(gridWrapper);
              }
            });
            
            function applyDynamicCards() {
              gridWrappers.forEach(gridWrapper => {
                const template = templates.get(gridWrapper);
                if (!template) return;
                
                // Check if this grid wrapper has already been dynamically populated
                if (gridWrapper.getAttribute('data-dynamic-populated') === 'true') {
                  const staticLink = gridWrapper.querySelector('a:not([data-dynamic-card="true"])');
                  if (!staticLink) {
                    return;
                  }
                }
                
                // Clear children
                gridWrapper.innerHTML = '';
                
                // Render each property
                filteredProperties.forEach(prop => {
                  const newCardWrapper = template.cloneNode(true);
                  const link = newCardWrapper.querySelector('a');
                  if (!link) return;
                  
                  link.setAttribute('href', '/properties/' + prop.slug);
                  
                  const img = link.querySelector('img[alt="Image"]') || link.querySelector('[data-framer-name="Image"] img') || link.querySelector('img');
                  if (img) {
                    const imgUrl = (prop.images && prop.images.length > 0) ? prop.images[0] : '/images/placeholder.jpg';
                    img.setAttribute('src', imgUrl);
                    img.removeAttribute('srcset');
                  }
                  
                  const tagEl = link.querySelector('.framer-styles-preset-1r01e1o, [data-framer-name="Tag"] p');
                  if (tagEl) {
                    tagEl.innerText = prop.category;
                  }
                  
                  const locEl = link.querySelector('.framer-styles-preset-1jxfhkk, [data-framer-name="Title and Description"] p');
                  if (locEl) {
                    locEl.innerText = prop.location;
                  }
                  
                  const titleEl = link.querySelector('.framer-1ed5kga .framer-styles-preset-71a013') || link.querySelector('[data-framer-name="Title and Description"] h4') || link.querySelector('.framer-1ed5kga p');
                  if (titleEl) {
                    titleEl.innerText = prop.title;
                  }
                  
                  const priceParent = link.querySelector('.framer-qs72ki');
                  if (priceParent) {
                    const priceEl = priceParent.querySelector('.framer-styles-preset-71a013') || priceParent.querySelector('h4, p');
                    if (priceEl) {
                      const formattedPrice = typeof prop.price === 'number' ? 'INR ' + prop.price.toLocaleString('en-IN') : prop.price;
                      priceEl.innerText = formattedPrice;
                    }
                  }
                  
                  const bedsParent = link.querySelector('.framer-fpemvf');
                  if (bedsParent) {
                    const bedsEl = bedsParent.querySelector('p, .framer-styles-preset-184yj9y');
                    if (bedsEl) {
                      const ageVal = prop.specifications?.["Age of Property"] || prop.specifications?.["Year"] || "1";
                      bedsEl.innerText = ageVal;
                    }
                  }
                  
                  const bathsParent = link.querySelector('.framer-1omtc6m');
                  if (bathsParent) {
                    const bathsEl = bathsParent.querySelector('p, .framer-styles-preset-184yj9y');
                    if (bathsEl) {
                      const bathVal = prop.specifications?.["Bathrooms"] || "1";
                      bathsEl.innerText = bathVal;
                    }
                  }
                  
                  const areaParent = link.querySelector('.framer-1i3354u');
                  if (areaParent) {
                    const areaEl = areaParent.querySelector('p, .framer-styles-preset-184yj9y');
                    if (areaEl) {
                      const areaVal = prop.specifications?.["Super Area"] || prop.specifications?.["Plot Area"] || "1000 sq.ft";
                      areaEl.innerText = areaVal;
                    }
                  }
                  
                  gridWrapper.appendChild(newCardWrapper);
                });
                
                gridWrapper.setAttribute('data-dynamic-populated', 'true');
              });
            }
            
            applyDynamicCards();
            
            const observer = new MutationObserver(applyDynamicCards);
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
            
            window.addEventListener('load', applyDynamicCards);
            setInterval(applyDynamicCards, 800);
            
          } catch (error) {
            console.error('Dynamic cards replacement error:', error);
          }
        })();
      </script>
    `;
    html = html.replace("</body>", `${clickScript}</body>`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(`Error serving ${filename}:`, error);
    return new Response(`Template ${filename} not found`, { status: 404 });
  }
}
