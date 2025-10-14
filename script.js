document.addEventListener("DOMContentLoaded", () => {
  const contentSections = document.querySelectorAll(".content-section");
  let currentOpenSection = null;

  // --- Toggle Section Functions ---
  function openContentSection(section) {
    section.style.display = "block";
    requestAnimationFrame(() => section.classList.add("show"));
    currentOpenSection = section;
  }

  function closeContentSection(section) {
    section.classList.remove("show");
    setTimeout(() => {
      section.style.display = "none";
      if (currentOpenSection === section) currentOpenSection = null;
    }, 300);
  }

  function toggleContentSection(id) {
    const section = document.getElementById(id);
    if (!section) return;

    if (section === currentOpenSection) {
      closeContentSection(section);
    } else {
      if (currentOpenSection) closeContentSection(currentOpenSection);
      openContentSection(section);
    }
  }

  // --- Navigation Clicks ---
  document.addEventListener("click", (e) => {
    const target = e.target;
    const href = target.getAttribute("href");
    if (!href) return;

    // Only handle #about / #contact
    if (href === "#about" || href === "#contact") {
      e.preventDefault();
      e.stopPropagation();

      // If a section is open and user taps same link → close it
      const id = href.substring(1);
      const section = document.getElementById(id);

      if (currentOpenSection && currentOpenSection === section) {
        closeContentSection(section);
      } else {
        toggleContentSection(id);
      }
    }
  });

  // --- Section Clicks (to close) ---
  contentSections.forEach((section) => {
    section.addEventListener("click", (e) => {
      // Ignore clicks inside inner content (e.g., text, buttons)
      if (e.target.closest(".inner-content, .copy-btn")) return;
      if (currentOpenSection === section) closeContentSection(section);
    });
  });

  // --- Copy to Clipboard (safe) ---
  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Don’t close the section
      const email = copyBtn.getAttribute("data-email") || "";
      if (!email) return;

      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      });
    });
  }
});
