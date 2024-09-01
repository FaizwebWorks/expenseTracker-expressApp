document.addEventListener("DOMContentLoaded", function () {
  const toastMessage = document.getElementById("toast-message");

  if (toastMessage && !localStorage.getItem('toastShown')) {
    // Delay to ensure the element does not flash on screen
    setTimeout(() => {
      // Set display block only when the animation is ready
      toastMessage.style.display = "block";
      gsap.fromTo(
        toastMessage,
        { opacity: 0, y: -40 },
        {
          opacity: 1,
          delay: 0.5,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            setTimeout(() => {
              gsap.to(toastMessage, {
                opacity: 0,
                y: -40,
                delay: 0.5,
                ease: "power2.in",
                duration: 0.5,
                onComplete: () => {
                  // Hide the element again after animation
                  toastMessage.style.display = "none";
                  // Store flag to prevent showing the toast again
                  localStorage.setItem('toastShown', 'true');
                },
              });
            }, 500);
          },
        }
      );
    }, 10); // Small delay to prevent flash
  }

  const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('toastShown');
      });
    }
});