document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("textarea").forEach((element) => {
    element.addEventListener("input", () => {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    });
  });

  const taskTypeSelect = document.getElementById("taskTypeSelect");
  const roomSelect = document.getElementById("taskRoomSelect");
  const roomHint = document.getElementById("taskRoomHint");

  if (taskTypeSelect && roomSelect) {
    const roomOptions = Array.from(roomSelect.options).slice(1);

    const syncRoomOptions = () => {
      const isHousekeeping = taskTypeSelect.value === "HOUSEKEEPING";
      let hasVisibleOption = false;

      roomOptions.forEach((option) => {
        const housekeepingEligible = option.dataset.housekeepingEligible === "true";
        const shouldShow = !isHousekeeping || housekeepingEligible;

        option.hidden = !shouldShow;
        option.disabled = !shouldShow;

        if (shouldShow) {
          hasVisibleOption = true;
        }
      });

      const selectedOption = roomSelect.selectedOptions[0];
      if (selectedOption && selectedOption.value && (selectedOption.hidden || selectedOption.disabled)) {
        roomSelect.value = "";
      }

      if (roomHint) {
        roomHint.textContent = isHousekeeping
          ? "Housekeeping tasks only show rooms that are Checked-out or Housekeeping."
          : hasVisibleOption
            ? "All rooms are available for this task type."
            : "No room matches this task type right now.";
      }
    };

    taskTypeSelect.addEventListener("change", syncRoomOptions);

    roomSelect.addEventListener("change", () => {
      const selectedOption = roomSelect.selectedOptions[0];
      if (!selectedOption || !selectedOption.value) {
        syncRoomOptions();
        return;
      }

      if (selectedOption.dataset.housekeepingEligible === "true" && taskTypeSelect.value !== "HOUSEKEEPING") {
        taskTypeSelect.value = "HOUSEKEEPING";
      }

      syncRoomOptions();
    });

    syncRoomOptions();
  }
});
