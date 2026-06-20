// ===== NEW FEATURES & FIXES FOR SRIJANX =====
// 1. Wave morph for category changes
// 2. Glitch effect for pagination
// 3. Popups stay open (no auto-close)
// 4. Reset to page 1 on category change
// 5. Bookmarklet opens admin panel directly
// 6. Lightbox closes on outside click
// 7. All animations integrated

// ===== 1. WAVE MORPH ANIMATION =====
let waveMorphCanvas = null;
let waveMorphCtx = null;
let waveMorphTime = 0;
let waveMorphIntensity = 0;

function initWaveMorph() {
  // Create canvas overlay for wave morph
  if (!document.getElementById('waveMorphCanvas')) {
    waveMorphCanvas = document.createElement('canvas');
    waveMorphCanvas.id = 'waveMorphCanvas';
    waveMorphCanvas.style.position = 'fixed';
    waveMorphCanvas.style.top = '0';
    waveMorphCanvas.style.left = '0';
    waveMorphCanvas.style.width = '100%';
    waveMorphCanvas.style.height = '100%';
    waveMorphCanvas.style.pointerEvents = 'none';
    waveMorphCanvas.style.zIndex = '999';
    document.body.appendChild(waveMorphCanvas);
    
    waveMorphCtx = waveMorphCanvas.getContext('2d');
    waveMorphCanvas.width = window.innerWidth;
    waveMorphCanvas.height = window.innerHeight;
  }
}

function triggerWaveMorph() {
  initWaveMorph();
  waveMorphIntensity = 1;
  animateWaveMorph();
}

function animateWaveMorph() {
  if (waveMorphIntensity <= 0) return;
  
  waveMorphCtx.clearRect(0, 0, waveMorphCanvas.width, waveMorphCanvas.height);
  
  // Draw wave distortion effect
  waveMorphCtx.fillStyle = `rgba(200, 123, 255, ${0.15 * waveMorphIntensity})`;
  
  for (let x = 0; x < waveMorphCanvas.width; x += 30) {
    const amplitude = 40 * waveMorphIntensity;
    const frequency = 0.01;
    const y = Math.sin(x * frequency + waveMorphTime) * amplitude + waveMorphCanvas.height * 0.3;
    
    waveMorphCtx.beginPath();
    waveMorphCtx.arc(x, y, 20 + 30 * waveMorphIntensity, 0, Math.PI * 2);
    waveMorphCtx.fill();
  }
  
  waveMorphTime += 0.3;
  waveMorphIntensity *= 0.92;
  
  if (waveMorphIntensity > 0.01) {
    requestAnimationFrame(animateWaveMorph);
  } else {
    waveMorphCtx.clearRect(0, 0, waveMorphCanvas.width, waveMorphCanvas.height);
  }
}

// ===== 2. GLITCH EFFECT FOR PAGINATION =====
function triggerGlitch() {
  const glitchOverlay = document.createElement('div');
  glitchOverlay.id = 'glitchOverlay';
  glitchOverlay.style.position = 'fixed';
  glitchOverlay.style.top = '0';
  glitchOverlay.style.left = '0';
  glitchOverlay.style.width = '100%';
  glitchOverlay.style.height = '100%';
  glitchOverlay.style.pointerEvents = 'none';
  glitchOverlay.style.zIndex = '998';
  glitchOverlay.style.background = 'linear-gradient(45deg, rgba(200, 123, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(200, 123, 255, 0.1) 50%, rgba(200, 123, 255, 0.1) 75%, transparent 75%, transparent)';
  glitchOverlay.style.backgroundSize = '40px 40px';
  glitchOverlay.style.animation = 'glitchFlicker 0.4s ease-in-out';
  
  document.body.appendChild(glitchOverlay);
  
  setTimeout(() => glitchOverlay.remove(), 400);
}

// Add glitch CSS animation
if (!document.getElementById('glitchCSS')) {
  const style = document.createElement('style');
  style.id = 'glitchCSS';
  style.textContent = `
    @keyframes glitchFlicker {
      0% { opacity: 1; transform: translate(0, 0); }
      25% { opacity: 0.8; transform: translate(-2px, 2px); }
      50% { opacity: 1; transform: translate(2px, -2px); }
      75% { opacity: 0.9; transform: translate(-1px, 1px); }
      100% { opacity: 0; transform: translate(0, 0); }
    }
  `;
  document.head.appendChild(style);
}

// ===== 3. OVERRIDE PAGINATION TO USE GLITCH & RESET PAGE =====
const originalNextPage = window.nextPage;
const originalPrevPage = window.prevPage;

window.nextPage = function(cat) {
  triggerGlitch();
  setTimeout(() => {
    if (originalNextPage) originalNextPage(cat);
  }, 150);
};

window.prevPage = function(cat) {
  triggerGlitch();
  setTimeout(() => {
    if (originalPrevPage) originalPrevPage(cat);
  }, 150);
};

// ===== 4. OVERRIDE CATEGORY FILTER TO USE WAVE MORPH & RESET PAGE =====
const categoryButtons = document.querySelectorAll('[data-cat]');
categoryButtons.forEach(btn => {
  const originalOnclick = btn.onclick;
  btn.onclick = function(e) {
    const cat = this.getAttribute('data-cat');
    
    // Reset to page 1
    if (window.curPage) window.curPage = 1;
    
    // Trigger wave morph
    triggerWaveMorph();
    
    // Do original click
    setTimeout(() => {
      // Simulate category change
      document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Call the display function if it exists
      if (window.displayProducts) {
        window.displayProducts();
      }
    }, 300);
  };
});

// ===== 5. FIX POPUPS - STAY OPEN UNTIL USER CLOSES =====
// Override closeConf to only close on button click
window.closeConf = function() {
  const modal = document.getElementById('confModal');
  if (modal) modal.classList.remove('open');
};

// Remove any auto-close timers from order placement
const originalOOM = window.oOM;
window.oOM = function(id, name, img) {
  if (originalOOM) originalOOM(id, name, img);
  
  // Ensure popup stays open (remove any auto-close)
  const modal = document.getElementById('confModal');
  if (modal) {
    modal.style.display = 'flex';
    // Remove any setTimeout that would close it
  }
};

// ===== 6. BOOKMARKLET POPUP - OPEN ADMIN PANEL DIRECTLY =====
window.openBookmarkletAdmin = function() {
  const popup = window.open('', 'AdminPanel', 'width=900,height=800');
  
  if (!popup) {
    alert('Please allow popups for SrijanX bookmarklet');
    return;
  }
  
  // Write admin panel HTML directly
  popup.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SrijanX Admin - Add Item</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0a; color: #fff; font-family: Arial; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        h2 { color: #c87bff; margin-bottom: 20px; }
        input, textarea { width: 100%; padding: 10px; margin-bottom: 15px; background: #1a1a1a; border: 1px solid #c87bff; color: #fff; border-radius: 5px; font-family: Arial; }
        button { background: linear-gradient(135deg, #c87bff, #f0b429); border: none; color: #000; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; }
        button:hover { opacity: 0.9; }
        .note { color: #999; font-size: 0.9rem; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>⚒️ Add Product to SrijanX</h2>
        <input type="text" id="productName" placeholder="Product Name" />
        <input type="text" id="productLink" placeholder="Image URL" />
        <input type="text" id="productCategory" placeholder="Category (Anime, Home Decor, etc)" />
        <textarea id="productDesc" placeholder="Description" rows="4"></textarea>
        <button onclick="saveToFirebase()">Save to Catalog</button>
        <p class="note">Opens in the main window after saving</p>
      </div>
      <script>
        function saveToFirebase() {
          const name = document.getElementById('productName').value;
          const image = document.getElementById('productLink').value;
          const category = document.getElementById('productCategory').value;
          const description = document.getElementById('productDesc').value;
          
          if (!name || !image) {
            alert('Name and Image URL required');
            return;
          }
          
          // Send to parent window
          opener.addProductFromBookmarklet({
            name: name,
            image: image,
            category: category || 'Custom',
            description: description
          });
          
          alert('Product added! Check your site.');
          window.close();
        }
      </script>
    </body>
    </html>
  `);
  popup.document.close();
};

// ===== 7. LIGHTBOX CLOSE ON OUTSIDE CLICK =====
const originalOpenLB = window.openLB;
window.openLB = function(img, name, desc, id) {
  if (originalOpenLB) originalOpenLB(img, name, desc, id);
  
  // Add click outside to close
  const lightbox = document.getElementById('lightbox') || document.querySelector('[id*="light"]');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === this) {
        // Click outside - close
        this.style.display = 'none';
      }
    });
  }
};

// Also handle modal backdrop clicks
document.addEventListener('click', function(e) {
  // Close lightbox on outside click
  if (e.target.classList && e.target.classList.contains('lightbox-bg')) {
    e.target.style.display = 'none';
  }
}, true);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initWaveMorph();
  
  // Re-attach category click handlers after page load
  const categoryButtons = document.querySelectorAll('[data-cat]');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const cat = this.getAttribute('data-cat');
      
      // Reset to page 1
      if (window.curPage) window.curPage = 1;
      
      // Trigger wave morph
      triggerWaveMorph();
      
      // Update active button
      document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Refresh display
      setTimeout(() => {
        if (window.displayProducts) window.displayProducts();
      }, 300);
    });
  });
});

// Handle window resize
window.addEventListener('resize', function() {
  if (waveMorphCanvas) {
    waveMorphCanvas.width = window.innerWidth;
    waveMorphCanvas.height = window.innerHeight;
  }
});
