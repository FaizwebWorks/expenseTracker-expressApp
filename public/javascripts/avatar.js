let avatarForm = document.querySelector(".avatar-form");
let avatarBtn = document.querySelector("#avatar-upload-btn");
let avatarInput = document.querySelector(".avatar-input");

avatarBtn.addEventListener("click", () => {
  avatarInput.click();
});

avatarInput.addEventListener("change", () => {
  avatarForm.submit();
});
