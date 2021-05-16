/**
 * Handles form submissions using AJAX.
 *
 * @param {HTMLFormElement} form    The form to be checked.
 *
 * @returns {boolean}               True if valid, false otherwise.
 */
function checkValidity(form) {
  const inputs = form.querySelectorAll("input, textarea, select");
  let valid = true;

  // For every input in the form:
  inputs.forEach((input) => {
    // Falsify the validity of the form if not valid
    valid = valid && input.checkValidity();
    const errorElement = input.parentElement.querySelector(".error");

    // If the input is not valid (according to HTML5)
    // and there is an error element, update the error to display the
    // HTML5 validation message.
    if (!input.checkValidity() && errorElement) {
      errorElement.innerText = input.validationMessage;
      errorElement.classList.add("active");
      errorElement.style.maxHeight = `${errorElement.scrollHeight}px`;
    } // Otherwise, if there is an error element, remove any styles that may have been added.
    else if (errorElement) {
      errorElement.classList.remove("active");
      errorElement.style.maxHeight = null;
    }
  });
  return valid;
}



/**
 * Handles form submissions using AJAX.
 *
 * @param {Event} e   The submit event.
 */
function onSubmit(e) {
  const form = e.target.closest("form");
  // If the form is valid, then just allow the browser to continue
  // on with the POST request.
  // If it is invalid, prevent the browser from continuing.
  if (!checkValidity(form)) {
    e.preventDefault();
  }
  else if(form.getAttribute("method") == 'POST' && form.getAttribute("action") == "/register"){
    // Construct formData object and send that in for POST route
    const uploadData = new FormData(form);
    fetch("/user", {
      method: 'PATCH',
      body: uploadData
    }).then(response => {
      if(response.ok)
        window.location.href = '/login';
    });
    e.preventDefault();
  }
  else if(form.getAttribute("method") == 'PATCH' && form.getAttribute("action") == "/user/"){
    // Construct formData object and send that in for PATCH route
    const uploadData = new FormData(form);
    let patchedData = new FormData();
    // Moves all populated pairs into a new form data object
    for(en of uploadData.entries()){
      if(uploadData.get(en[0]) !== '')
        patchedData.append(en[0], en[1]);
    }

    fetch("/user", {
      method: 'PATCH',
      body: patchedData
    }).then(response => {
      if(response.ok)
        window.location.href = '/login';
    });
    e.preventDefault();
  }
  else if(form.getAttribute("method") == 'PATCH' && form.getAttribute("action") == "/user/password"){
    // Construct formData object and send that in for PATCH route for password
    const uploadData = new FormData(form);
    let patchedData = new FormData();
    // Moves all populated pairs into a new form data object
    for(en of uploadData.entries()){
      if(uploadData.get(en[0]) !== '')
        patchedData.append(en[0], en[1]);
    }

    fetch("/user", {
      method: 'PATCH',
      body: patchedData
    }).then(response => {
      if(response.ok)
        window.location.href = '/login';
    });
    e.preventDefault();
  }
}

$(document).ready(() => {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) =>
    form
      .querySelector("button, input[type='submit']")
      .addEventListener("click", onSubmit)
  );
});
