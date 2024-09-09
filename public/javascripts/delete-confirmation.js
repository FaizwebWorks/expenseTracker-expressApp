document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmation-modal");
  const deleteLink = document.getElementById("delete-account-link");
  const closeModal = document.getElementById("close-modal");
  const confirmDelete = document.getElementById("confirm-delete");
  const cancelDelete = document.getElementById("cancel-delete");

  // Show the modal when the delete link is clicked
  deleteLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior
    modal.style.display = "block";
  });

  // Close the modal when the close button is clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirm deletion and redirect
  confirmDelete.addEventListener("click", () => {
    window.location.href = deleteLink.href;
  });

  // Cancel deletion
  cancelDelete.addEventListener("click", () => {
    modal.style.display = "none";
  });
});
