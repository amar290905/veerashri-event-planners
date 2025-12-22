document.addEventListener("DOMContentLoaded", function () {
  console.log("JavaScript Loaded!");

  // Initialize AOS Animation
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  } else {
    console.error("AOS library not found!");
  }

  // Back to top button functionality
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }
    });

    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop - 70, behavior: "smooth" });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });

  // Add active class to current section in navigation
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      if (window.pageYOffset >= section.offsetTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Form submission handling with loading state
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    if (!contactForm.dataset.listenerAttached) {
      contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Send to backend API
        const response = await fetch('/api/contact/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert(result.message);
          this.reset();
        } else {
          alert(result.message || "Sorry, there was an error sending your message. Please try again.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Sorry, there was an error sending your message. Please check your connection and try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
      });
      contactForm.dataset.listenerAttached = 'true';
    }
  }

  // Newsletter subscription with loading state
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    if (!newsletterForm.dataset.listenerAttached) {
      newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Subscribing...';
        
        const email = this.querySelector('input[type="email"]').value;
        
        // Send to backend API
        const response = await fetch('/api/newsletter/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert(result.message);
          this.reset();
        } else {
          alert(result.message || "Sorry, there was an error subscribing to the newsletter. Please try again.");
        }
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        alert("Sorry, there was an error subscribing to the newsletter. Please check your connection and try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
      });
      newsletterForm.dataset.listenerAttached = 'true';
    }
  }

  // Initialize carousels
  if (typeof bootstrap !== "undefined") {
    const servicesCarousel = document.getElementById("servicesCarousel");
    const testimonialCarousel = document.getElementById("testimonialCarousel");

    if (servicesCarousel) {
      new bootstrap.Carousel(servicesCarousel, { 
        interval: 5000, 
        wrap: true, 
        pause: "hover" 
      });
    }

    if (testimonialCarousel) {
      new bootstrap.Carousel(testimonialCarousel, { 
        interval: 6000, 
        wrap: true, 
        pause: "hover" 
      });
    }
  } else {
    console.error("Bootstrap library not found!");
  }

  // Video background functionality
  const videos = document.querySelectorAll(".bg-video");
  if (videos.length > 0) {
    let currentVideoIndex = 0;

    function playNextVideo() {
      videos[currentVideoIndex].pause();
      videos[currentVideoIndex].classList.remove("active");
      currentVideoIndex = (currentVideoIndex + 1) % videos.length;
      videos[currentVideoIndex].classList.add("active");
      videos[currentVideoIndex].play().catch(err => console.error("Video play error:", err));
    }

    // Start with first video
    videos[0].classList.add("active");
    videos[0].play().catch(err => console.error("First video play error:", err));
    videos[0].addEventListener("ended", playNextVideo);
  }

  // View counter functionality
  const viewCounter = document.getElementById("viewCounter");
  if (viewCounter) {
    let views = localStorage.getItem("pageViews") || 0;
    views = parseInt(views) + 1;
    localStorage.setItem("pageViews", views);
    viewCounter.textContent = `Viewed: ${views} times`;
  }

  // Preloader
  window.addEventListener("load", function () {
    const preloader = document.createElement("div");
    preloader.className = "preloader";
    preloader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(preloader);

    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => preloader.remove(), 500);
    }, 1000);
  });
});

        // Set same timing for all slides (adjust interval as needed)
        document.addEventListener("DOMContentLoaded", function() {
           var myCarousel = new bootstrap.Carousel(document.querySelector('#customCarousel'), {
              interval: 3000, // Change slide every 3 seconds
              wrap: true, // Loop back to first slide after last
              pause: 'hover' // Pause on hover
            });
          });
          
          document.addEventListener("DOMContentLoaded", () => {
            var videos = document.querySelectorAll(".bg-video");
           var current = 0;
        
            // Helper to switch to the next video
            function playNextVideo() {
              // Clean up current video
              videos[current].pause();
              videos[current].currentTime = 0;
              videos[current].classList.remove("active");
              videos[current].onended = null;
        
              // Move to the next one
              current = (current + 1) % videos.length;
        
              // Activate and play it
              var next = videos[current];
              next.classList.add("active");
              next.play().catch((err) => console.error("Video play error:", err));
              next.onended = playNextVideo;
            }
        
            // Start the first video manually
            var first = videos[current];
            first.classList.add("active");
            first.play().catch((err) => console.error("First video play error:", err));
            first.onended = playNextVideo;
          });

           document.addEventListener("DOMContentLoaded", () => {
    var videos = document.querySelectorAll(".bg-video");
    var nextBtn = document.getElementById("nextVideoBtn");
    var prevBtn = document.getElementById("prevVideoBtn");
   var current = 0;

    function playVideo(index) {
      // Stop and reset current video
      videos[current].pause();
      videos[current].currentTime = 0;
      videos[current].classList.remove("active");
      videos[current].onended = null;

      // Set new video index
      current = index;
      var video = videos[current];
      video.classList.add("active");

      // Play and listen for end
      video.play().catch(err => console.error("Video play error:", err));
      video.onended = playNextVideo;
    }

    function playNextVideo() {
      var nextIndex = (current + 1) % videos.length;
      playVideo(nextIndex);
    }

    function playPreviousVideo() {
      var prevIndex = (current - 1 + videos.length) % videos.length;
      playVideo(prevIndex);
    }

    // Event listeners for buttons
    nextBtn.addEventListener("click", playNextVideo);
    prevBtn.addEventListener("click", playPreviousVideo);

    // Start the slideshow
    playVideo(0);
  });


    // Load count from localStorage or start at 0
   var count = localStorage.getItem('pageViewCount') || 0;
    count++;
    localStorage.setItem('pageViewCount', count);

    // Update the view counter text
    document.getElementById('viewCounter').textContent = `Viewed: ${count} time${count != 1 ? 's' : ''}`;


// Make togglePanel globally available
function togglePanel() {
  const panel = document.getElementById("sidePanel");
  if (panel) {
    panel.classList.toggle("open");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // your existing script content...
});


function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminUsername');

  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('adminContent').style.display = 'none';

  document.body.classList.remove('admin-logged-in');
}
