// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const contentSections = document.querySelectorAll(".content-section");
  let currentOpenSection = null;

  // -----------------------------
  // Section Toggle Functions
  // -----------------------------

  function openContentSection(section) {
    section.style.display = "block";
    section.classList.add("show");
    currentOpenSection = section;
  }

  function closeContentSection(section) {
    section.classList.remove("show");
    // Wait for fade-out to complete
    setTimeout(() => {
      section.style.display = "none";
      if (currentOpenSection === section) {
        currentOpenSection = null;
      }
    }, 300);
  }

  function toggleContentSection(id) {
    const section = document.getElementById(id);
    if (!section) return;

    // If this section is already open → close it
    if (section.classList.contains("show")) {
      closeContentSection(section);
      return;
    }

    // Close any other open section
    if (currentOpenSection && currentOpenSection !== section) {
      closeContentSection(currentOpenSection);
    }

    // Open the selected section
    openContentSection(section);
  }

  // -----------------------------
  // Handle Clicks on Links
  // -----------------------------

  document.addEventListener("click", (e) => {
    const href = e.target.getAttribute("href");

    // If clicking outside nav links, ignore
    if (!href) return;

    // If a section is open and user clicks a nav link, just close it
    if (currentOpenSection && (href === "#about" || href === "#contact")) {
      e.preventDefault();
      e.stopPropagation();
      closeContentSection(currentOpenSection);
      return;
    }

    // Otherwise handle toggling
    if (href === "#about" || href === "#contact") {
      e.preventDefault();
      e.stopPropagation();
      toggleContentSection(href.substring(1)); // remove '#' from id
    }
  });

  // -----------------------------
  // Close Section on Section Click
  // -----------------------------
  contentSections.forEach((section) => {
    section.addEventListener("click", (e) => {
      // Prevent inner elements (like buttons) from triggering close
      if (e.target.closest(".inner-content, .copy-btn")) return;

      if (currentOpenSection === section) {
        closeContentSection(section);
      }
    });
  });

  // -----------------------------
  // Copy Email to Clipboard
  // -----------------------------
  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const email = copyBtn.getAttribute("data-email");
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
