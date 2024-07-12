
  document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');

    form.addEventListener('keydown', function(event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default Enter key behavior
        form.submit(); // Manually submit the form
      }
    });
  });
