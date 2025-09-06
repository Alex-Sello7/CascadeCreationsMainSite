jQuery(document).ready(function() {
  "use strict";
  
  $(".navbar-button").click(function(e){
      e.stopPropagation();
      $(".header").toggleClass("open");
      $(".navbar-button").toggleClass("collapsed");
  });

  function closeMenu() {
    $(".header").removeClass("open");
    $(".navbar-button").addClass("collapsed"); 
  }

  $(".navbar .navbar-nav > .nav-item > a.nav-link").click(function(e){
    e.stopPropagation();
    closeMenu();     
  });

  $("html").click(function(e) {
    closeMenu();
  });

  $('.single-page-nav').singlePageNav({
      filter: ':not(.external)',
      updateHash: true
  });
});

const slideshowImages = [
  "imgs/webapp1.png",
  "imgs/onepage.png",
  "imgs/dashboard.png",
  "imgs/e-commerce.png",
  "imgs/events.png"
];

let currentIndex = 0;
const slideshowImg = document.getElementById('slideshowImg');

// Function to show current image
function showSlide(index) {
  slideshowImg.src = slideshowImages[index];
}

// Initial display
showSlide(currentIndex);

// Next/Previous functions
function nextSlide() {
  currentIndex = (currentIndex + 1) % slideshowImages.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slideshowImages.length) % slideshowImages.length;
  showSlide(currentIndex);
}

// Auto-slide every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Navigation buttons
document.querySelector('.next').addEventListener('click', () => {
  nextSlide();
  resetInterval();
});
document.querySelector('.prev').addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

// Pause and reset interval on manual navigation
function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}

// Overlay on click
const overlay = document.getElementById('overlaySlideshow');
const overlayImg = document.getElementById('overlaySlideshowImg');
const closeOverlay = document.getElementById('closeOverlaySlideshow');

slideshowImg.addEventListener('click', () => {
  overlay.style.display = 'flex';
  overlayImg.src = slideshowImg.src;
});

closeOverlay.addEventListener('click', () => {
  overlay.style.display = 'none';
});

// Close overlay if clicked outside image
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.style.display = 'none';
});


//gallery
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");
    document.querySelectorAll(".gallery-item").forEach(item => {
      item.style.display = (filter === "all" || item.classList.contains(filter)) ? "block" : "none";
    });
  });
});

//map
function initMap() {
    const mapDiv = document.getElementById("map");
    const errorDiv = document.getElementById("map-error");
    const defaultPos = { lat: -25.7479, lng: 28.2293 }; // Pretoria

    const map = new google.maps.Map(mapDiv, {
        zoom: 14,
        center: defaultPos
    });

    const marker = new google.maps.Marker({
        position: defaultPos,
        map: map,
        title: "Default location"
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                map.setCenter(pos);
                marker.setPosition(pos);
            },
            () => {
                errorDiv.innerText = "Location access denied. Showing default.";
                errorDiv.style.display = "block";
            }
        );
    } else {
        errorDiv.innerText = "Geolocation not supported.";
        errorDiv.style.display = "block";
    }
}

function mapLoadError() {
    const errorDiv = document.getElementById("map-error");
    errorDiv.innerText = "Cannot load Google Maps.";
    errorDiv.style.display = "block";
}

//populate subject line and smooth scroll
document.addEventListener("DOMContentLoaded", () => {
    const cardLinks = document.querySelectorAll(".cards-container .card a");
    const subjectInput = document.querySelector("#section-5 input[name='subject']");

    cardLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // prevent default anchor jump
            const cardTitle = link.closest(".card").querySelector("h3").textContent;
            if(subjectInput){
                subjectInput.value = cardTitle;
            }
            document.querySelector("#section-5").scrollIntoView({ behavior: "smooth" });
        });
    });
});

//contact form submission with auto-reset
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;

    const loader = document.getElementById('formLoader');
    const popup = document.getElementById('thankYouPopup');

    // Show loader
    loader.style.display = 'block';

    const formData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
    };

    try {
        // Simulate 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const res = await fetch('http://localhost:3000/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        loader.style.display = 'none'; // hide loader

        if(data.success){
            form.reset();
            // Show thank-you popup
            popup.style.display = 'block';
            setTimeout(() => { popup.style.display = 'none'; }, 3000); // fade out after 3s
        } else {
            alert(data.message || 'Failed to send message.');
        }

    } catch (err) {
        loader.style.display = 'none';
        alert('Failed to send message. Please try again.');
        console.error(err);
    }
});

