(function () {
  const picture = new URL(window.location).searchParams.get("picture");
  if (picture) {
    document.getElementById("picture").src = "output-images/" + picture + ".jpg";
  }
})();