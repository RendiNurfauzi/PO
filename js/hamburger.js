document.querySelector('.hamburger-menu').addEventListener('click', function() {
    var menu = document.querySelector('.front-end .menuItems');
    if (menu.style.opacity === '1') {
      menu.style.opacity = '0';
      setTimeout(function() {
        menu.style.display = 'none';
      }, 300); // Wait for the opacity transition to finish
    } else {
      menu.style.display = 'flex'; // Set display first without delay
      setTimeout(function() {
        menu.style.opacity = '1'; // Then start the opacity transition
      }, 10); // Short delay to ensure display change has taken effect
    }
    
  });