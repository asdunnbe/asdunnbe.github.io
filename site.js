// ========== LOAD NAVIGATION ==========
function loadNavigation() {
  fetch("nav.html")
    .then(response => response.text())
    .then(html => {
      document.querySelectorAll("#nav-container").forEach(el => el.innerHTML = html);
      highlightNav();
      setupNavHover();
    });
}

// Highlight the nav link for the current page
function highlightNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav-container nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path || href === path + "#") {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
      link.classList.remove("dimmed");
    }
  });
}

// Set up hover behavior to dim active when others are hovered
function setupNavHover() {
  const links = document.querySelectorAll("#nav-container nav a");
  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const active = document.querySelector('#nav-container nav a.active');
      if (active && active !== e.target) {
        active.classList.add('dimmed');
      }
    });
    link.addEventListener('mouseleave', (e) => {
      const active = document.querySelector('#nav-container nav a.active');
      if (active) {
        active.classList.remove('dimmed');
      }
    });
  });
}



// ========== LOAD PROJECTS ==========
function loadProjects(sectionId = "project-grid", featuredOnly = false) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const container = section.querySelector(".projects-grid");
  if (!container) return;

  function getIconClass(label) {
    const l = label.toLowerCase();
    if (l.includes("demo"))         return "fa fa-video-camera";
    if (l.includes("presentation")) return "fa fa-file-powerpoint-o";
    // posters & papers, etc.
    return "fa fa-file-pdf-o";
  }

  fetch("projects/projects.json")
    .then(res => res.json())
    .then(data => {
      const list = featuredOnly ? data.filter(p => p.featured) : data;
      list.forEach(p => {
        const linksHtml = p.links
          .map(l => {
            const icon = getIconClass(l.label);
            return `<a href="${l.url}" target="_blank">
                      <i class="${icon}"></i> ${l.label}
                    </a>`;
          })
          .join("");

        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <img src="projects/${p.img}" alt="${p.title}">
            </div>
            <div class="flip-card-back">
              <h4>${p.title}</h4>
              <p style="font-size: 15px; text-align: left;">${p.desc || ""}</p>
              <div class="links">${linksHtml}</div>
            </div>
          </div>`;
        container.appendChild(card);
      });
    });
}


// ========== LOAD PAPERS ==========
function formatAuthors(authors) {
  const nameIndex = authors.indexOf('Andrea');
  if (nameIndex !== -1) {
    // find end of name (next comma) or end of string
    let commaIndex = authors.indexOf(',', nameIndex);
    if (commaIndex === -1) commaIndex = authors.length;
    const before = authors.slice(0, nameIndex);
    const namePart = authors.slice(nameIndex, commaIndex);
    const after = authors.slice(commaIndex);
    return `${before}<b><i>${namePart}</i></b>${after}`;
  }
  return authors;
}

// ========== LOAD PAPERS ==========
function loadPapers(preprintClass, publishedClass) {
  const preTable = document.querySelector(`table.${preprintClass}`);
  const pubTable = document.querySelector(`table.${publishedClass}`);
  if (!preTable || !pubTable) return;
  preTable.classList.add('papers');
  pubTable.classList.add('papers');
  fetch("papers/papers.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(paper => {
        const row = document.createElement("tr");
        // image cell
        const tdImg = document.createElement("td");
        tdImg.className = "thumbs";
        tdImg.style.width = "40%";
        const img = document.createElement("img");
        img.src = `papers/${paper.img}`;         
        img.alt = paper.title;
        img.style.width = "100%";
        img.style.height = "auto";
        tdImg.appendChild(img);
        // detail cell
        const tdDet = document.createElement("td");
        tdDet.className = "detail";
        let authorsHtml = formatAuthors(paper.authors);
        let html = `<p><b id=\"papertitle\">${paper.title}</b><br>${authorsHtml}<br><i>${paper.status}</i><br>`;
        html += paper.links.map(l => `[<a href=\"${l.url}\" target=\"_blank\">${l.label}</a>]`).join(' ');
        html += `</p>`;
        if (paper.summary) html += `<p><i>${paper.summary}</i></p>`;
        tdDet.innerHTML = html;
        row.appendChild(tdImg);
        row.appendChild(tdDet);
        if (paper.type === "preprint") preTable.appendChild(row);
        else if (paper.type === "published") pubTable.appendChild(row);
      });
    });
}

// ========== LOAD FEATURED PAPERS ==========
function loadFeaturedPapers(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.classList.add('papers');
  fetch("papers/papers.json")
    .then(res => res.json())
    .then(data => {
      data.filter(p => p.featured).forEach(paper => {
        const row = document.createElement("tr");
        const tdImg = document.createElement("td");
        tdImg.className = "thumbs";
        tdImg.style.width = "40%";
        const img = document.createElement("img");
        img.src = `papers/${paper.img}`; 
        img.alt = paper.title;
        img.style.width = "100%";
        img.style.height = "auto";
        tdImg.appendChild(img);
        const tdDet = document.createElement("td");
        tdDet.className = "detail";
        let authorsHtml = formatAuthors(paper.authors);
        let html = `<p><b id=\"papertitle\">${paper.title}</b><br>${authorsHtml}<br><i>${paper.status}</i><br>`;
        html += paper.links.map(l => `[<a href=\"${l.url}\" target=\"_blank\">${l.label}</a>]`).join(' ');
        html += `</p>`;
        if (paper.summary) html += `<p><i>${paper.summary}</i></p>`;
        tdDet.innerHTML = html;
        row.appendChild(tdImg);
        row.appendChild(tdDet);
        table.appendChild(row);
      });
    });
}


// ========== LOAD FEATURED PAPERS ==========
function loadFeaturedPapers(tableClass) {
  const table = document.querySelector(`table.${tableClass}`);
  if (!table) return;
  table.classList.add('papers');
  fetch("papers/papers.json")
    .then(res => res.json())
    .then(data => {
      data.filter(p=>p.featured).forEach(paper => {
        const row = document.createElement("tr");
        // image cell
        const tdImg = document.createElement("td");
        tdImg.className = "thumbs";
        tdImg.style.width = "40%";
        const img = document.createElement("img");
        img.src = `papers/${paper.img}`; 
        img.alt = paper.title;
        img.style.width = "100%"; img.style.height = "auto";
        tdImg.appendChild(img);
        // detail cell
        const tdDet = document.createElement("td");
        tdDet.className = "detail";
        let html = `<p><b id=\"papertitle\">${paper.title}</b><br>${paper.authors}<br><i>${paper.status}</i><br>`;
        html += paper.links.map(l=>`[<a href=\"${l.url}\" target=\"_blank\">${l.label}</a>]`).join(' ');
        html += `</p>`;
        if(paper.summary) html += `<p><i>${paper.summary}</i></p>`;
        tdDet.innerHTML = html;
        row.appendChild(tdImg);
        row.appendChild(tdDet);
        table.appendChild(row);
      });
    });
}

// ========== LOAD GALLERY ==========
function loadPhotoGallery(folder = 'gallery/', count = 25, ext = '.png') {
  const grid = document.getElementById('photoGrid');
  let placeLeft = true;

  for (let i = count; i > 0; i--) {
    const src = `${folder}${i}${ext}`;
    const img = new Image();
    img.src = src;
    img.alt = `Photo ${i}`;

    img.onload = () => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('photo-item');

      if (img.naturalWidth > img.naturalHeight) {
        wrapper.classList.add(placeLeft ? 'land-left' : 'land-right');
        placeLeft = !placeLeft;
      }

      wrapper.appendChild(img);
      grid.appendChild(wrapper);
    };

    img.onerror = () => {
      console.warn(`Skipping missing image: ${src}`);
    };
  }
}