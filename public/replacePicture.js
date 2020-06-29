window.addEventListener('DOMContentLoaded', function () {
  const picture = new URL(window.location).searchParams.get("picture");
  if (picture) {
    document.getElementById("picture").setAttribute('src', "output-images/" + picture + ".jpg");
  }
});