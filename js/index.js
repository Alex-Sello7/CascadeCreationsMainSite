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

/* SPLASH SCREEN */
  window.addEventListener("load", () => {
    // Set cursor to wait for the entire page during splash
    document.body.style.cursor = 'wait';
    
    setTimeout(() => {
      const splash = document.getElementById('splash');
      splash.style.animation = "fadeOut 1s forwards";
      
      // Immediately restore default cursor when splash starts fading
      document.body.style.cursor = 'default';
      
      setTimeout(() => {
        splash.style.display = "none";
      }, 1000);
    }, 1000);
  });

window.addEventListener("scroll", () => {
  const line = document.querySelector(".navbar .navbar-collapse::before"); 
  // Pseudo elements can’t be directly selected, so apply it to a wrapper

  const nav = document.querySelector(".navbar .navbar-collapse");
  const scrollY = window.scrollY;

  // Example: Move line relative to scroll
  nav.style.setProperty("--line-shift", scrollY * 0.2 + "px");
});


document.addEventListener("mousemove", (e) => {
  const trail = document.createElement("div");
  trail.className = "trail";
  trail.style.left = `${e.pageX}px`;
  trail.style.top = `${e.pageY}px`;
  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 1000);
});




/* ---------------- SLIDESHOW ---------------- */
let slideIndex = 0;
const slides = document.querySelectorAll(".slideshow-slide");
const overlay = document.getElementById('overlaySlideshow');
const overlayImg = document.getElementById('overlaySlideshowImg');
const closeOverlay = document.getElementById('closeOverlaySlideshow');
let slideInterval;

// Function to show slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.opacity = "0";
        slide.style.display = "none";
        slide.style.transition = "opacity 1s ease-in-out";
    });

    slides[index].style.display = "block";
    setTimeout(() => {
        slides[index].style.opacity = "1";
    }, 50); // ensures fade-in applies
}

// Next/Previous
function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
}

// Start slideshow with interval
function startSlideShow() {
    showSlide(slideIndex); // show initial slide
    slideInterval = setInterval(nextSlide, 7000); // 7s per slide
}

// Reset interval on manual navigation
function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 7000);
}

// Navigation buttons
document.querySelector('.next').addEventListener('click', () => {
    nextSlide();
    resetSlideInterval();
});
document.querySelector('.prev').addEventListener('click', () => {
    prevSlide();
    resetSlideInterval();
});

// Overlay on click
slides.forEach(slide => {
    slide.querySelector("img").addEventListener("click", () => {
        overlay.style.display = 'flex';
        overlayImg.src = slide.querySelector("img").src;
    });
});

closeOverlay.addEventListener('click', () => {
    overlay.style.display = 'none';
});
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
});

// Initialize slideshow
startSlideShow();

/* ---------------- GOOGLE MAP ---------------- */
let mapInitialized = false;

function initMap() {
    // Prevent multiple initializations
    if (mapInitialized) return;
    mapInitialized = true;
    
    const mapDiv = document.getElementById("map");
    const errorDiv = document.getElementById("map-error");

    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        if (errorDiv) {
            errorDiv.innerText = "Google Maps API failed to load.";
            errorDiv.style.display = "block";
        }
        console.error("Google Maps API not loaded");
        return;
    }

    // Gijima location in Centurion - coordinates for Gijima's office
    const gijimaLocation = { lat: -25.8600, lng: 28.1600 };
    
    // Company work area coordinates (near Gijima)
    const companyWorkArea = { lat: -25.8580, lng: 28.1580 };

    try {
        const map = new google.maps.Map(mapDiv, {
            zoom: 15,
            center: companyWorkArea,
            mapTypeControl: true,
            streetViewControl: false,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#99ccff"}, {"visibility": "on"}]
                }
            ]
        });

        // Marker for Gijima location
        const gijimaMarker = new google.maps.Marker({
            position: gijimaLocation,
            map: map,
            title: "Gijima",
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });

        // Marker for company work area
        const companyMarker = new google.maps.Marker({
            position: companyWorkArea,
            map: map,
            title: "Our Work Area",
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
        });

        // Circle to show work area around the company location
        const workAreaCircle = new google.maps.Circle({
            strokeColor: "#356ba2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#99ccff",
            fillOpacity: 0.35,
            map: map,
            center: companyWorkArea,
            radius: 500 // 500 meters radius
        });

        // Info window for Gijima
        const gijimaInfoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 10px 0; color: #356ba2;">Gijima</h3>
                    <p style="margin: 0;">Technology Solutions Company</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        Nearby technology partner
                    </p>
                </div>
            `
        });

        // Info window for company work area
        const companyInfoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 10px 0; color: #356ba2;">Our Work Area</h3>
                    <p style="margin: 0;">Centurion, Gauteng</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        Serving clients in this area<br>
                        Radius: 500 meters
                    </p>
                </div>
            `
        });

        // Add click listeners to markers
        gijimaMarker.addListener('click', () => {
            companyInfoWindow.close();
            gijimaInfoWindow.open(map, gijimaMarker);
        });

        companyMarker.addListener('click', () => {
            gijimaInfoWindow.close();
            companyInfoWindow.open(map, companyMarker);
        });

        // Open company info window by default
        setTimeout(() => {
            companyInfoWindow.open(map, companyMarker);
        }, 1000);

        // Try to get user's location but focus on company area
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Add user location marker but keep focus on company area
                    const userMarker = new google.maps.Marker({
                        position: userPos,
                        map: map,
                        title: "Your Location",
                        icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        }
                    });

                    const userInfoWindow = new google.maps.InfoWindow({
                        content: `<div style="padding: 10px;"><p>You are here</p></div>`
                    });

                    userMarker.addListener('click', () => {
                        userInfoWindow.open(map, userMarker);
                    });

                },
                (error) => {
                    if (errorDiv) {
                        errorDiv.innerText = "Location access denied. Showing our work area in Centurion.";
                        errorDiv.style.display = "block";
                        setTimeout(() => {
                            errorDiv.style.display = "none";
                        }, 5000);
                    }
                },
                { timeout: 10000 } // 10 second timeout
            );
        }

    } catch (error) {
        console.error("Google Maps initialization error:", error);
        if (errorDiv) {
            errorDiv.innerText = "Failed to initialize Google Maps. Please refresh the page.";
            errorDiv.style.display = "block";
        }
    }
}

// Fallback in case the API doesn't load within a reasonable time
setTimeout(() => {
    if (!mapInitialized && typeof google === 'undefined') {
        const errorDiv = document.getElementById("map-error");
        if (errorDiv) {
            errorDiv.innerText = "Google Maps is taking too long to load. Please check your connection.";
            errorDiv.style.display = "block";
        }
    }
}, 10000);

// Make initMap globally available for the Google Maps API callback
window.initMap = initMap;

/* ---------------- CONTACT FORM ---------------- */
/* ---------------- CONTACT FORM ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    // populate subject line and smooth scroll
    const cardLinks = document.querySelectorAll(".cards-container .card a");
    const subjectInput = document.querySelector("input[name='subject']");

    cardLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const cardTitle = link.closest(".card").querySelector("h3").textContent;
            if (subjectInput) {
                subjectInput.value = cardTitle.trim();
            }
            document.querySelector("#section-6").scrollIntoView({ behavior: "smooth" });
        });
    });

    // Improved validation function for names
    function isValidName(name) {
        // Allows letters, spaces, hyphens, and common accented characters
        return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s\-']*$/.test(name);
    }

    // Function to check if server is running
    async function checkServerStatus() {
        try {
            // Simple HEAD request to check server availability
            await fetch('http://localhost:3000', { 
                method: 'HEAD',
                mode: 'no-cors', // Bypass CORS for status check
                cache: 'no-store'
            });
            return true;
        } catch (error) {
            console.warn('Server not running:', error);
            return false;
        }
    }

    // Function to save form data to localStorage
    function saveFormDataLocally(formData) {
        // Get existing pending forms or create empty array
        const pendingForms = JSON.parse(localStorage.getItem('pendingContactForms') || '[]');
        
        // Add new form data with timestamp
        pendingForms.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        
        // Save back to localStorage
        localStorage.setItem('pendingContactForms', JSON.stringify(pendingForms));
        
        return pendingForms.length; // Return count of pending forms
    }

    // Function to try sending all pending forms
    async function retryPendingSubmissions() {
        const pendingForms = JSON.parse(localStorage.getItem('pendingContactForms') || '[]');
        
        if (pendingForms.length === 0) return;
        
        const successfulSubmissions = [];
        
        for (const [index, formData] of pendingForms.entries()) {
            try {
                const res = await fetch('http://localhost:3000/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (res.ok) {
                    successfulSubmissions.push(index);
                }
            } catch (error) {
                console.error('Failed to retry submission:', error);
            }
        }
        
        // Remove successfully submitted forms
        if (successfulSubmissions.length > 0) {
            const updatedPendingForms = pendingForms.filter((_, index) => 
                !successfulSubmissions.includes(index)
            );
            localStorage.setItem('pendingContactForms', JSON.stringify(updatedPendingForms));
            
            console.log(`Successfully submitted ${successfulSubmissions.length} pending forms`);
        }
    }

    // Check server status on page load and retry any pending submissions
    checkServerStatus().then(isRunning => {
        if (isRunning) {
            retryPendingSubmissions();
        }
    });

    // contact form submission with auto-reset
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = e.target;

        // Get name values using the new input names
        const firstName = form.fname.value.trim();
        const lastName = form.lname.value.trim();

        // Validate names with better error messages
        if (!firstName) {
            alert('Please enter your first name.');
            form.fname.focus();
            return;
        }

        if (!isValidName(firstName)) {
            alert('First name can only contain letters, spaces, hyphens, or apostrophes.');
            form.fname.focus();
            return;
        }

        if (!lastName) {
            alert('Please enter your last name.');
            form.lname.focus();
            return;
        }

        if (!isValidName(lastName)) {
            alert('Last name can only contain letters, spaces, hyphens, or apostrophes.');
            form.lname.focus();
            return;
        }

        const loader = document.getElementById('formLoader');
        const popup = document.getElementById('thankYouPopup');

        // Show loader
        loader.style.display = 'block';

        const formData = {
            firstName: firstName,
            lastName: lastName,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        try {
            const res = await fetch('http://localhost:3000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // Check if response is OK (status 200-299)
            if (!res.ok) {
                throw new Error(`Server returned ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            loader.style.display = 'none';

            if (data.success) {
                form.reset();
                popup.style.display = 'block';
                setTimeout(() => { popup.style.display = 'none'; }, 3000);
                
                // Show notification if there were pending forms that got submitted
                const pendingCount = JSON.parse(localStorage.getItem('pendingContactForms') || '[]').length;
                if (pendingCount > 0) {
                    console.log(`Server is back online. ${pendingCount} pending forms will be retried.`);
                }
            } else {
                alert(data.message || 'Failed to send message. Please try again.');
            }

        } catch (err) {
            loader.style.display = 'none';
            console.error('Form submission error:', err);
            
            // Check if it's a connection error
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                // Offer to save data locally
                if (confirm('Server is unavailable. Would you like to save your message locally and try again when the server is back online?')) {
                    const pendingCount = saveFormDataLocally(formData);
                    alert(`Message saved locally. You have ${pendingCount} pending message(s). They will be sent automatically when the server is available.`);
                    form.reset();
                }
            } else {
                alert('Failed to send message. Please try again.');
            }
        }
    });

    // Periodically check server status and retry submissions (every 2 minutes)
    setInterval(() => {
        checkServerStatus().then(isRunning => {
            if (isRunning) {
                retryPendingSubmissions();
            }
        });
    }, 120000); // 120000 ms = 2 minutes
});