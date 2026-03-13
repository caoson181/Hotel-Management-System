document.addEventListener("DOMContentLoaded", function () {
  if (typeof applyRolePermissions === "function") {
    applyRolePermissions();
  }

  if (typeof setupAccountFeatures === "function") {
    setupAccountFeatures();
  }
});
