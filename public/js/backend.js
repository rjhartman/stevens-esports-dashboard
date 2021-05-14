const promoteIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-plus" class="svg-inline--fa fa-user-plus fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>`;
const demoteIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-minus" class="svg-inline--fa fa-user-minus fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208H432c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>`;

async function bindAccordions() {
  const collapsables = document.querySelectorAll(".collapsable");
  collapsables.forEach((section) => {
    const button = section.querySelector(".collapse-button");
    if (button) {
      button.addEventListener("click", () => {
        button.classList.toggle("closed");
        const closed = button.classList.contains("closed");
        const header = section.querySelector("header");
        button.innerHTML = closed ? "&plus;" : "&minus;";
        section.style.maxHeight = closed
          ? `${header.scrollHeight - 40}px`
          : null;
      });
    }
  });
}

function changeUserPermissions(user) {
  if (user.role !== "administrator")
    $.ajax({
      url: `/api/users/${user._id}/promote`,
      method: "POST",
      success: () => {
        fillUsersTable(document.getElementById("users"));
      },
      error: (xhr, status, e) => console.error(e),
    });
  else
    $.ajax({
      url: `/api/users/${user._id}/demote`,
      method: "POST",
      success: () => {
        fillUsersTable(document.getElementById("users"));
      },
      error: (xhr, status, e) => console.error(e),
    });
}

async function fillUsersTable(table) {
  // setTimeout(() => {
  // Get the field names based on the data-name attributes
  // in the table headers.

  // Clear existing entries
  body = table.querySelector("tbody");
  body.querySelectorAll("tr").forEach((el) => el.parentElement.removeChild(el));
  const fields = Array.from(table.querySelectorAll("th[data-name]")).map(
    (header) => header.dataset.name
  );

  // Get the array of all users
  $.get("api/users", (data) => {
    data.forEach((user) => {
      // For each user, loop the fields and add them to
      // a new row in the table.
      const row = document.createElement("tr");
      fields.forEach((field) => {
        // Check if the field exists before attempting
        // to add a column to the row.
        if (user[field]) {
          const column = document.createElement("td");
          column.innerText = user[field];
          row.appendChild(column);
        } else
          console.warn(
            `Users table: Header contained name ${field} which could not be found for the user ${user._id}.`
          );
      });

      // If the row isn't empty, append it to the table.
      if (row.children) {
        const column = document.createElement("td");
        const button = document.createElement("button");
        column.classList.add("center");

        button.classList.add("promote");
        button.innerHTML =
          user.role === "administrator" ? demoteIcon : promoteIcon;
        button.addEventListener("click", () => {
          changeUserPermissions(user);
        });
        column.appendChild(button);
        row.id = user._id;
        row.appendChild(column);
        body.appendChild(row);
      } else {
        console.warn(`
            User table: Did not add user ${user._id}, no fields matched the table headers.
          `);
      }
    });
  });
  const loader = table.closest("section").querySelector(".loader");
  loader.parentElement.removeChild(loader);
  table.classList.add("active");
  // }, 2000);
}

$(document).ready(() => {
  bindAccordions();

  const users = document.getElementById("users");
  if (users) fillUsersTable(users);
});
