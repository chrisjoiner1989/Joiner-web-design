// Main JavaScript file for Joiner Web Design
// Performance optimizations and loading animations
document.addEventListener("DOMContentLoaded", function () {
  // Add loading classes initially
  const elementsToAnimate = document.querySelectorAll(
    ".card, .hero-content, .faq-item, .benefit-card, .audit-content, .newsletter-content"
  );
  elementsToAnimate.forEach((el) => {
    el.classList.add("loading");
  });

  // Intersection Observer for loading animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("loading");
        entry.target.classList.add("loaded");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  elementsToAnimate.forEach((el) => {
    observer.observe(el);
  });

  // Enhanced mobile touch feedback
  const touchElements = document.querySelectorAll(".cta, .contact-link");
  touchElements.forEach((el) => {
    el.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.98)";
    });

    el.addEventListener("touchend", function () {
      this.style.transform = "";
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Performance: Preload critical resources
  const preloadLinks = [
    "https://fonts.googleapis.com/css2?family=Inter:ital,opsz@0,14..32;1,14..32&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
  ];

  preloadLinks.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    document.head.appendChild(link);
  });

  // Add loading state management
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");

    // Remove loading classes after page load
    setTimeout(() => {
      elementsToAnimate.forEach((el) => {
        el.classList.remove("loading");
        el.classList.add("loaded");
      });
    }, 100);
  });
});

// FAQ Accordion Functionality
const faqItems = document.querySelectorAll("[data-faq]");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    // Close other open items
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });
    // Toggle current item
    item.classList.toggle("active");
  });
});

// Back to Top Button Functionality
const backToTop = document.getElementById("backToTop");

// Show/hide button based on scroll position
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

// Smooth scroll to top when clicked
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Newsletter Form Functionality
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const emailError = document.getElementById("emailError");
const newsletterSubmit = document.getElementById("newsletterSubmit");
const buttonText = newsletterSubmit.querySelector(".button-text");
const buttonLoading = newsletterSubmit.querySelector(".button-loading");
const newsletterSuccess = document.getElementById("newsletterSuccess");

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show error message
function showError(message) {
  emailError.textContent = message;
  emailError.style.display = "block";
  newsletterEmail.setAttribute("aria-invalid", "true");
}

// Clear error message
function clearError() {
  emailError.textContent = "";
  emailError.style.display = "none";
  newsletterEmail.setAttribute("aria-invalid", "false");
}

// Real-time email validation
newsletterEmail.addEventListener("input", function () {
  const email = this.value.trim();

  if (email === "") {
    clearError();
    return;
  }

  if (!validateEmail(email)) {
    showError("Please enter a valid email address");
  } else {
    clearError();
  }
});

// Form submission
newsletterForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = newsletterEmail.value.trim();

  // Validate email
  if (!email) {
    showError("Please enter your email address");
    newsletterEmail.focus();
    return;
  }

  if (!validateEmail(email)) {
    showError("Please enter a valid email address");
    newsletterEmail.focus();
    return;
  }

  // Show loading state
  newsletterSubmit.disabled = true;
  buttonText.style.display = "none";
  buttonLoading.style.display = "flex";
  clearError();

  try {
    // Simulate API call (replace with actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Success - show success message
    newsletterForm.style.display = "none";
    newsletterSuccess.style.display = "block";

    // Reset form
    newsletterEmail.value = "";

    // Log subscription (you can replace this with actual API call)
    console.log("Newsletter subscription:", email);

    // Optional: Send to your email service
    // await fetch('/api/newsletter', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email })
    // });
  } catch (error) {
    // Error handling
    showError("Something went wrong. Please try again.");
    console.error("Newsletter subscription error:", error);
  } finally {
    // Reset button state
    newsletterSubmit.disabled = false;
    buttonText.style.display = "inline";
    buttonLoading.style.display = "none";
  }
});

// Reset form when clicking outside success message
document.addEventListener("click", function (e) {
  if (
    newsletterSuccess.style.display === "block" &&
    !newsletterSuccess.contains(e.target)
  ) {
    newsletterSuccess.style.display = "none";
    newsletterForm.style.display = "block";
  }
});

// Service Worker registration for performance (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js');
  });
}
