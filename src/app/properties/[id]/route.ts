import { NextRequest } from "next/server";
import { dataService } from "@/lib/dataService";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.id;
    const property = await dataService.getPropertyById(slug);

    if (!property) {
      return new Response("Property not found", { status: 404 });
    }

    // Determine template file path
    // If a static HTML file matches this slug, load it. Otherwise fallback to beach-villa-for-lease.html.
    let templatePath = path.join(
      process.cwd(),
      "public",
      "realtab.framer.website",
      "property",
      `${slug}.html`
    );

    let isFallback = false;
    if (!fs.existsSync(templatePath)) {
      templatePath = path.join(
        process.cwd(),
        "public",
        "realtab.framer.website",
        "property",
        "beach-villa-for-lease.html"
      );
      isFallback = true;
    }

    let html = fs.readFileSync(templatePath, "utf8");

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

    // Dynamic field replacement if using the fallback template
    if (isFallback) {
      // Replace Title tag
      html = html.replace(/<title>[^<]+<\/title>/i, `<title>${property.title} | Mahesh Verse</title>`);
      
      // Replace Property Title in heading
      html = html.replace(/Beach villa for lease/g, property.title);
      
      // Replace Location
      html = html.replace(/101B, Palm Coast/g, property.location);
      
      // Replace Description
      const defaultDescRegex = /<p class="framer-text framer-styles-preset-g111es">[\s\S]*?<\/p>/i;
      html = html.replace(defaultDescRegex, `<p class="framer-text framer-styles-preset-g111es">${property.description}</p>`);
      
      // Replace Specs values
      const areaVal = property.specifications?.["Super Area"] || property.specifications?.["Plot Area"] || "";
      const bathVal = property.specifications?.["Bathrooms"] || "";
      const ageVal = property.specifications?.["Age of Property"] || property.specifications?.["Year"] || "";
      
      if (areaVal) {
        html = html.replace(/6,0000 sq\.ft/g, areaVal);
      }
      if (bathVal) {
        html = html.replace(/>5<\/h4>/g, `>${bathVal}</h4>`);
      }
      if (ageVal) {
        html = html.replace(/2024/g, ageVal);
      }

      // Replace Gallery images
      if (property.images && property.images.length > 0) {
        html = html.replace(/\/images\/Pmtlf2i0BsTx59OyI1lITu3GaE472b\.jpg/g, property.images[0]);
        if (property.images.length > 1) {
          html = html.replace(/\/images\/U0333cSYHujby9A7c46Fl9Ty1ecbda8\.jpg/g, property.images[1]);
        }
      }
    }

    // Dynamic Map embed replacement
    if (property.googleMapUrl) {
      html = html.replace(/src="https:\/\/maps\.google\.com\/maps\?q=[^"]+"/i, `src="${property.googleMapUrl}"`);
    }

    // Prepare custom components to inject (Video walkthrough, ROI Calculator, WhatsApp Widget)
    const videoHtml = property.videoUrl ? `
      <div style="margin-top: 40px; margin-bottom: 40px; background: #1c1f25; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); padding: 30px; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="font-family: Urbanist, sans-serif; font-size: 28px; color: #fff; margin: 0; font-weight: 600;">Video Walkthrough</h2>
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background: #000;">
          <iframe src="${property.videoUrl.replace("watch?v=", "embed/").replace("mixkit.co/videos/preview/", "mixkit.co/videos/embed/")}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>
      </div>
    ` : "";

    const roiHtml = `
      <div style="margin-top: 40px; margin-bottom: 40px; background: #1c1f25; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); padding: 30px; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="font-family: Urbanist, sans-serif; font-size: 28px; color: #fff; margin: 0; font-weight: 600;">Financial ROI Calculator</h2>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="color: #aab1bd; font-size: 14px;">Property Valuation (INR)</label>
            <input id="roi-valuation" type="number" value="${property.price || 15000000}" style="background: #121418; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px; border-radius: 6px; font-size: 16px;" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="color: #aab1bd; font-size: 14px;">Expected Annual Rental (INR)</label>
              <input id="roi-rental" type="number" value="${Math.round((property.price || 15000000) * 0.04)}" style="background: #121418; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px; border-radius: 6px; font-size: 16px;" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="color: #aab1bd; font-size: 14px;">Annual Appreciation (%)</label>
              <input id="roi-appreciation" type="number" value="8" style="background: #121418; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px; border-radius: 6px; font-size: 16px;" />
            </div>
          </div>
          <button onclick="calculateROI()" style="background: #de6040; color: #fff; border: 0; padding: 14px; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.2s;">Calculate Yield & ROI</button>
          
          <div id="roi-result" style="background: #121418; padding: 20px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px; border: 1px dashed rgba(255,255,255,0.08);">
            <div style="display: flex; justify-content: space-between;"><span style="color: #aab1bd;">Rental Yield:</span><strong id="res-yield" style="color: #ffa61e;">4.00%</strong></div>
            <div style="display: flex; justify-content: space-between;"><span style="color: #aab1bd;">Appreciation Yield:</span><strong id="res-appr" style="color: #ffa61e;">8.00%</strong></div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; font-size: 18px;"><span style="color: #fff; font-weight: bold;">Total Annual ROI:</span><strong id="res-total" style="color: #de6040; font-weight: bold;">12.00%</strong></div>
          </div>
        </div>
        <script>
          function calculateROI() {
            var val = parseFloat(document.getElementById('roi-valuation').value) || 0;
            var rent = parseFloat(document.getElementById('roi-rental').value) || 0;
            var appr = parseFloat(document.getElementById('roi-appreciation').value) || 0;
            if (val <= 0) return;
            var rentalYield = (rent / val) * 100;
            var totalRoi = rentalYield + appr;
            document.getElementById('res-yield').innerText = rentalYield.toFixed(2) + '%';
            document.getElementById('res-appr').innerText = appr.toFixed(2) + '%';
            document.getElementById('res-total').innerText = totalRoi.toFixed(2) + '%';
          }
        </script>
      </div>
    `;

    const whatsappHtml = `
      <div style="margin-top: 20px; margin-bottom: 40px; display: flex; justify-content: center;">
        <a href="https://wa.me/919999999999?text=Hi%20Mahesh,%20I%20am%20interested%20in%20the%20property%20%22${encodeURIComponent(property.title)}%22.%20Please%20share%20more%20details." target="_blank" style="background: #25d366; color: #fff; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px; border-radius: 10px; font-size: 18px; font-weight: bold; text-decoration: none; text-align: center; box-shadow: 0 4px 15px rgba(37,211,102,0.3); transition: transform 0.2s; font-family: Urbanist, sans-serif;">
          <svg style="width: 24px; height: 24px; fill: #fff;" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.022 14.07 1 11.478 1 6.04 1 1.62 5.37 1.614 10.8c-.001 1.7.464 3.36 1.347 4.807l-.98 3.57 3.666-.962zM17.47 14.93c-.3-.149-1.778-.878-2.077-.988-.299-.108-.517-.162-.734.162-.218.324-.844 1.059-1.036 1.275-.192.217-.384.243-.684.095-.3-.15-1.266-.467-2.41-1.485-.89-.794-1.49-1.775-1.665-2.07-.175-.299-.019-.46.131-.609.135-.134.3-.349.449-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.524-.075-.15-.734-1.767-1.006-2.422-.265-.636-.53-.55-.734-.56-.19-.01-.409-.011-.628-.011-.22 0-.576.082-.878.408-.3.324-1.148 1.122-1.148 2.735 0 1.613 1.176 3.172 1.34 3.393.164.22 2.313 3.53 5.6 4.947.781.337 1.39.539 1.86.688.784.249 1.498.214 2.062.13.629-.094 1.777-.726 2.027-1.43.25-.704.25-1.306.175-1.43-.075-.124-.275-.199-.575-.349z"/></svg>
           Enquire on WhatsApp
         </a>
       </div>
     `;

    // Inject before the Location block
    const locationDivStr = '<div class="framer-x0qnjb" data-framer-name="Location">';
    const injection = `${videoHtml}${roiHtml}${whatsappHtml}${locationDivStr}`;
    html = html.replace(locationDivStr, injection);

    // Inject PROPERTY_ID for form interception
    html = html.replace(/<body([^>]*)>/i, `<body$1><script>window.PROPERTY_ID = "${property._id.toString()}";</script>`);

    // Inject CSS overrides inside <head> to hide sitemap sub-links and style pointers
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
      </style>
    `;
    html = html.replace("</head>", `${customStyles}</head>`);

    // Inject JS click delegation script inside <body> to trigger redirects
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
      </script>
    `;
    html = html.replace("</body>", `${clickScript}</body>`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error serving property detail page:", error);
    return new Response("Property page not found", { status: 404 });
  }
}
