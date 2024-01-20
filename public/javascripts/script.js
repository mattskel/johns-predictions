window.onscroll = function() {
  // Check if the user has scrolled down enough to trigger the sticky behavior
  console.log('TEST');
  if (window.pageYOffset >= 50) {
    document.getElementById("navbar").classList.add("sticky");
  } else {
    document.getElementById("navbar").classList.remove("sticky");
  }
};
