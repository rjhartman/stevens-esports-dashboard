const promoteIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-plus" class="svg-inline--fa fa-user-plus fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>`;
const demoteIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-minus" class="svg-inline--fa fa-user-minus fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208H432c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>`;
const editIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>`;
const deleteIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>`;

function getMatchFormElements() {
  return {
    form: document.getElementById("match-form"),
    date: document.getElementById("m-date"),
    team: document.getElementById("m-team"),
    game: document.getElementById("m-game"),
    opponent: document.getElementById("m-opponent"),
    result: document.getElementById("m-result"),
    stevensScore: document.getElementById("m-teams-score"),
    opponentsScore: document.getElementById("m-opponent-score"),
  };
}

function getTeamFormElements() {
  return {
    form: document.getElementById("team-form"),
    teamName: document.getElementById("m-teamName"),
    teamGame: document.getElementById("m-teamGame"),
    varsity: document.getElementById("m-varsity"),
  };
}

function getGameFormElements() {
  return {
    form: document.getElementById("game-form"),
    gameName: document.getElementById("m-gameName"),
    image: document.getElementById("m-image"),
  }
}

function addError(input, error) {
  const errorEl = input.closest(".row").querySelector(".error");
  errorEl.innerText = error;
  errorEl.classList.add("active");
}

function removeError(input) {
  const errorEl = input.closest(".row").querySelector(".error");
  errorEl.classList.remove("active");
}

function validateMatchForm() {
  const { stevensScore, opponentsScore, result, date } = getMatchFormElements();
  let valid = true;

  document
    .getElementById("match-form")
    .querySelectorAll("input, select, textarea")
    .forEach((el) => {
      if (!el.checkValidity()) {
        addError(el, el.validationMessage);
        valid = false;
      } else {
        removeError(el);
      }
    });

  // If the match date has already passed, then result and scores are required.
  if (date.valueAsDate) {
    if (date.valueAsDate < new Date()) {
      const stevensScoreVal = parseInt(stevensScore.value);
      const opponentsScoreVal = parseInt(opponentsScore.value);
      if (isNaN(stevensScoreVal)) {
        addError(stevensScore, "There must be a score.");
        valid = false;
      }
      if (isNaN(opponentsScoreVal)) {
        addError(opponentsScore, "There must be a score.");
        valid = false;
      }
      if (!result.value) {
        addError(result, "There must be a result.");
        valid = false;
      }
    }
  }

  return valid;
}

function validateTeamForm() {
  const { teamName, teamGame, varsity } = getTeamFormElements();
  let valid = true;

  document
    .getElementById("team-form")
    .querySelectorAll("input, select, textarea")
    .forEach((el) => {
      if (!el.checkValidity()) {
        addError(el, el.validationMessage);
        valid = false;
      } else {
        removeError(el);
      }
    });

  if (!teamName) {
    addError(teamName, "There must be a team name.");
    valid = false;
  }
  if (!teamGame) {
    addError(teamGame, "There must be a game.");
    valid = false;
  }
  if (!varsity) {
    addError(varsity, "There must be a varsity status.");
    valid = false;
  }

  return valid;
}

function validateGameForm() {
  const { gameName, image } = getGameFormElements();
  let valid = true;

  document
    .getElementById("game-form")
    .querySelectorAll("input, select, textarea")
    .forEach((el) => {
      if (!el.checkValidity()) {
        addError(el, el.validationMessage);
        valid = false;
      } else {
        removeError(el);
      }
    });

  if (!gameName) {
    addError(gameName, "There must be a game name.");
    valid = false;
  }
  if (!image) {
    addError(image, "There must be a cloudinary image URL.");
    valid = false;
  }

  return valid;
}

function disableMatchForm() {
  document.getElementById("match-form").classList.remove("visible");
}
function enableMatchForm() {
  document.getElementById("match-form").classList.add("visible");
  document
    .getElementById("match-form")
    .querySelectorAll(".error.active")
    .forEach((el) => el.classList.remove("active"));
}

function disableTeamForm() {
  document.getElementById("team-form").classList.remove("visible");
}
function enableTeamForm() {
  document.getElementById("team-form").classList.add("visible");
  document
    .getElementById("team-form")
    .querySelectorAll(".error.active")
    .forEach((el) => el.classList.remove("active"));
}

function disableGameForm() {
  document.getElementById("game-form").classList.remove("visible");
}
function enableGameForm() {
  document.getElementById("game-form").classList.add("visible");
  document
    .getElementById("game-form")
    .querySelectorAll(".error.active")
    .forEach((el) => el.classList.remove("active"));
}

function fillMatchForm(options) {
  enableMatchForm();
  const form = document.getElementById("match-form");
  form.querySelector("h2").innerText = options.create
    ? "Create Match"
    : "Edit Match";
  form.action = options.endpoint;
  form.dataset.method = options.create === true ? "POST" : "PATCH";

  Object.values(getMatchFormElements()).forEach(
    (el) => (el.required = options.create === true && el.type !== "number")
  );
  // Select team:
  const team = document.getElementById("m-team");
  let i = 0;
  for (option of team.children) {
    if (option.innerText === options.team) break;
    i++;
  }
  team.selectedIndex = i < team.children.length ? i : 0;

  // Fill opponent:
  const opponent = document.getElementById("m-opponent");
  opponent.value = options.opponent ? options.opponent : "";

  // Select game:
  const game = document.getElementById("m-game");
  const selectedGame = game.querySelector(`option[value='${options.game}']`);
  game.selectedIndex = selectedGame
    ? Array.from(game.children).indexOf(selectedGame)
    : 0;

  // Select date:
  try {
    document.getElementById("m-date").valueAsDate = new Date(options.date);
  } catch (e) {
    console.warn("Error when trying to fill match form's date field:", e);
  }

  // Select result:
  const result = document.getElementById("m-result");
  options.result = options.result && options.result.toLowerCase();
  result.selectedIndex =
    options.result === "win" ? 0 : options.result === "loss" ? 1 : 2;

  // Fill scores:
  const stevensScore = document.getElementById("m-teams-score");
  const opponentsScore = document.getElementById("m-opponent-score");
  stevensScore.value = options.teamsScore ? options.teamsScore : null;
  opponentsScore.value = options.opponentScore ? options.opponentScore : null;
}

function fillTeamForm(options) {
  enableTeamForm();
  const form = document.getElementById("team-form");
  form.querySelector("h2").innerText = options.create
    ? "Create Team"
    : "Edit Team";
  form.action = options.endpoint;
  form.dataset.method = options.create === true ? "POST" : "PATCH";

  Object.values(getTeamFormElements()).forEach(
    (el) => (el.required = options.create === true && el.type !== "number")
  );

  // Fill team name:
  const rosterName = document.getElementById("m-teamName");
  rosterName.value = options.name ? options.name : "";

  // Select game:
  const game = document.getElementById("m-teamGame");
  const selectedGame = game.querySelector(`option[value='${options.game}']`);
  game.selectedIndex = selectedGame
    ? Array.from(game.children).indexOf(selectedGame)
    : 0;

  // Fill team varsity status:
  const status = document.getElementById("m-varsity");
  status.value = options.status ? options.status : "";
}

function fillGameForm(options) {
  enableGameForm();
  const form = document.getElementById("game-form");
  form.querySelector("h2").innerText = options.create
    ? "Add Game (Upload a 96x96px logo image to Cloudinary -- Put link in the form)"
    : "Edit Game (Upload a 96x96px logo image to Cloudinary -- Put link in the form)";
  form.action = options.endpoint;
  form.dataset.method = options.create === true ? "POST" : "PATCH";

  Object.values(getGameFormElements()).forEach(
    (el) => (el.required = options.create === true && el.type !== "number")
  );

  // Fill game name:
  const gameName = document.getElementById("m-gameName");
  gameName.value = options.gameName ? options.gameName : "";

  // Fill cloudinary image link:
  const image = document.getElementById("m-image");
  image.value = options.image ? options.image : "";
}

function bindAccordions() {
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

function reloadDashboard(){
  $.ajax({
    url: `/dashboard`,
    method: "GET",
    success: () => {
      window.location.href = '/dashboard'
    },
    error: (xhr, status, e) => console.error(e),
  });
}

function submitMatchForm(e) {
  e.preventDefault();
  if (validateMatchForm()) {
    const { form } = getMatchFormElements();

    // Get form data in JSON format
    const data = {};
    new FormData(form).forEach((value, key) => (data[key] = value));

    $.ajax({
      url: form.action,
      method: form.dataset.method,
      data: data,
      success: () => {
        reloadDashboard();
      },
      error: (xhr, status, e) => console.error(e),
    });
  } else console.log("Error with inputs");
}

function submitTeamForm(e) {
  e.preventDefault();
  if (validateTeamForm()) {
    const { form } = getTeamFormElements();

    // Get form data in JSON format
    const data = {};
    new FormData(form).forEach((value, key) => (data[key] = value));

    $.ajax({
      url: form.action,
      method: form.dataset.method,
      data: data,
      success: () => {
        reloadDashboard();
      },
      error: (xhr, status, e) => console.error(e),
    });
  } else console.log("Error with inputs");
}

function submitGameForm(e) {
  e.preventDefault();
  if (validateGameForm()) {
    const { form } = getGameFormElements();

    // Get form data in JSON format
    const data = {};
    new FormData(form).forEach((value, key) => (data[key] = value));

    $.ajax({
      url: form.action,
      method: form.dataset.method,
      data: data,
      success: () => {
        reloadDashboard();
      },
      error: (xhr, status, e) => console.error(e),
    });
  } else console.log("Error with inputs");
}

function bindForms() {
  const matchesFormButton = document
    .getElementById("match-form")
    .querySelector("button:not(.close)");
  matchesFormButton.addEventListener("click", submitMatchForm);
  document
    .getElementById("match-form")
    .addEventListener("submit", submitMatchForm);
  document
    .getElementById("match-form")
    .querySelector("button.close")
    .addEventListener("click", (e) => {
      e.preventDefault();
      disableMatchForm();
    });
  document.getElementById("add-match-button").addEventListener("click", (e) => {
    fillMatchForm({
      create: true,
      endpoint: "api/match",
    });
  });

  const teamsFormButton = document
    .getElementById("team-form")
    .querySelector("button:not(.close)");
  teamsFormButton.addEventListener("click", submitTeamForm);
  document
    .getElementById("team-form")
    .addEventListener("submit", submitTeamForm);
  document
    .getElementById("team-form")
    .querySelector("button.close")
    .addEventListener("click", (e) => {
      e.preventDefault();
      disableTeamForm();
    });
  document.getElementById("add-team-button").addEventListener("click", (e) => {
    fillTeamForm({
      create: true,
      endpoint: "/teams/",
    });
  });

  const gameFormButton = document
    .getElementById("game-form")
    .querySelector("button:not(.close)");
  gameFormButton.addEventListener("click", submitGameForm);
  document
    .getElementById("game-form")
    .addEventListener("submit", submitGameForm);
  document
    .getElementById("game-form")
    .querySelector("button.close")
    .addEventListener("click", (e) => {
      e.preventDefault();
      disableGameForm();
    });
  document.getElementById("add-game-button").addEventListener("click", (e) => {
    fillGameForm({
      create: true,
      endpoint: "/game/",
    });
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

function deleteUserAsAdmin(user){
  $.ajax({
    url: `/api/users/${user._id}/delete`,
    method: "DELETE",
    success: () => {
      reloadDashboard();
    },
    error: (xhr, status, e) => console.error(e),
  });
}

function deleteMatch(match){
  $.ajax({
    url: `/api/matches/${match._id}/delete`,
    method: "DELETE",
    success: () => {
      reloadDashboard();
    },
    error: (xhr, status, e) => console.error(e),
  });
}

function deleteTeam(team){
  $.ajax({
    url: `/api/teams/${team._id}/delete`,
    method: "DELETE",
    success: () => {
      reloadDashboard();
    },
    error: (xhr, status, e) => console.error(e),
  });
}

function deleteGame(game){
  $.ajax({
    url: `/api/games/${game._id}/delete`,
    method: "DELETE",
    success: () => {
      reloadDashboard();
    },
    error: (xhr, status, e) => console.error(e),
  })
}

function fillUsersTable(table) {
  // Get the field names based on the data-name attributes
  // in the table headers.

  // Clear existing entries
  fBody = table.querySelector("tbody");
  fBody
    .querySelectorAll("tr")
    .forEach((el) => el.parentElement.removeChild(el));
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
        // Attaching promote/demote button
        const permcolumn = document.createElement("td");
        const permbutton = document.createElement("button");
        permcolumn.classList.add("center");

        permbutton.classList.add("promote");
        permbutton.innerHTML =
          user.role === "administrator" ? demoteIcon : promoteIcon;
        permbutton.addEventListener("click", () => {
          changeUserPermissions(user);
        });
        permcolumn.appendChild(permbutton);
        row.id = user._id;
        row.appendChild(permcolumn);

        // Attaching delete button
        const deleteCol = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteCol.classList.add("center");

        deleteButton.classList.add("promote");
        deleteButton.innerHTML = deleteIcon;
        deleteButton.addEventListener("click", () => {
          deleteUserAsAdmin(user);
        });
        deleteCol.appendChild(deleteButton);
        row.appendChild(deleteCol);

        fBody.appendChild(row);
      } else {
        console.warn(`
            User table: Did not add user ${user._id}, no fields matched the table headers.
          `);
      }
    });
  });
  const loader = table.closest("section").querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
  table.classList.add("active");
}

function fillMatchesTable(table) {
  const fBody = table.querySelector("tbody");
  fBody
    .querySelectorAll("tr")
    .forEach((el) => el.parentElement.removeChild(el));
  const fields = Array.from(table.querySelectorAll("th[data-name]")).map(
    (header) => header.dataset.name
  );
  $.get("api/matches", (data) =>
    data.forEach((match) => {
      const row = document.createElement("tr");
      fields.forEach((field) => {
        const column = document.createElement("td");
        if (field === "result") {
          column.innerText = match.result ? match.result : "N/A";
        } else if (field === "date") {
          column.innerText = moment(match.date).format("LL");
        } else if (match[field]) {
          column.innerText = match[field];
        } else if (field === "game.title") {
          column.innerText = match.game ? match.game.title : "N/A";
        } else if (field === "score") {
          column.innerText =
            typeof match.teamsScore === "number" &&
            typeof match.opponentScore === "number"
              ? `${match.teamsScore} - ${match.opponentScore}`
              : `N/A`;
        } else
          console.warn(
            `Matches table: Header contained name ${field} which could not be found for the match ${match._id}.`
          );

        if (column.innerText) row.appendChild(column);
      });

      if (row.children) {
        // Make and append a button to edit this match
        const column = document.createElement("td");
        const button = document.createElement("button");
        column.classList.add("center");

        button.classList.add("promote");
        button.innerHTML = editIcon;

        button.addEventListener("click", () => {
          fillMatchForm({
            team: match.team,
            opponent: match.opponent,
            game: match.game._id,
            date: match.date,
            result: match.result,
            teamsScore: match.teamsScore,
            opponentScore: match.opponentScore,
            endpoint: `api/matches/${match._id}/update`,
            method: "PUT",
          });
        });

        column.appendChild(button);
        row.appendChild(column);
        row.id = match._id;

        // Attaching delete button
        const deleteCol = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteCol.classList.add("center");

        deleteButton.classList.add("promote");
        deleteButton.innerHTML = deleteIcon;
        deleteButton.addEventListener("click", () => {
          deleteMatch(match);
        });
        deleteCol.appendChild(deleteButton);
        row.appendChild(deleteCol);

        fBody.appendChild(row);
      }
    })
  );

  const loader = table.closest("section").querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
  table.classList.add("active");
}

function fillTeamsTable(table){
  const fBody = table.querySelector("tbody");
  fBody
    .querySelectorAll("tr")
    .forEach((el) => el.parentElement.removeChild(el));
  const fields = Array.from(table.querySelectorAll("th[data-name]")).map(
    (header) => header.dataset.name
  );

  $.get("api/teams", (data) =>
    data.forEach((team) => {
      const row = document.createElement("tr");
      fields.forEach((field) => {
        const column = document.createElement("td");
        if (field === "name") {
          column.innerText = team.name ? team.name : "N/A";
        } else if (field === "status") {
          column.innerText = team.status ? team.status : "N/A";
        } else if (field === "game") {
          column.innerText = team.game ? team.game : "N/A";
        } else if (field === "players") {
          if(team.players.length == 0)
            column.innerText = "N/A";
          else{
            for(let i = 0; i < team.players.length; i++){
              column.innerText += "\n " + team.players[i].username;
            }
          }
        } else
          console.warn(
            `Teams table: Header contained name ${field} which could not be found for the team ${team._id}.`
          );

        if (column.innerText) row.appendChild(column);
      });

      if (row.children) {
        // Make and append a button to edit this team
        const column = document.createElement("td");
        const button = document.createElement("button");
        column.classList.add("center");

        button.classList.add("promote");
        button.innerHTML = editIcon;

        button.addEventListener("click", () => {
          fillTeamForm({
            name: team.name,
            status: team.status,
            game: team.game,
            endpoint: `api/teams/${team._id}/update`,
            method: "PUT",
          });
        });

        column.appendChild(button);
        row.appendChild(column);
        row.id = team._id;

        // Attaching delete button
        const deleteCol = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteCol.classList.add("center");

        deleteButton.classList.add("promote");
        deleteButton.innerHTML = deleteIcon;
        deleteButton.addEventListener("click", () => {
          deleteTeam(team);
        });
        deleteCol.appendChild(deleteButton);
        row.appendChild(deleteCol);

        fBody.appendChild(row);
      }
    })
  );

  const loader = table.closest("section").querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
  table.classList.add("active");
}

function fillGamesTable(table){
  const fBody = table.querySelector("tbody");
  fBody
    .querySelectorAll("tr")
    .forEach((el) => el.parentElement.removeChild(el));
  const fields = Array.from(table.querySelectorAll("th[data-name]")).map(
    (header) => header.dataset.name
  );

  $.get("api/games", (data) =>
    data.forEach((game) => {
      const row = document.createElement("tr");
      fields.forEach((field) => {
        const column = document.createElement("td");
        if (field === "title") {
          column.innerText = game.title ? game.title : "N/A";
        } else if (field === "logo") {
          column.innerText = game.logo ? game.logo : "N/A";
        } else
          console.warn(
            `Games table: Header contained name ${field} which could not be found for the game ${game._id}.`
          );

        if (column.innerText) row.appendChild(column);
      });

      if (row.children) {
        // Make and append a button to edit this game
        const column = document.createElement("td");
        const button = document.createElement("button");
        column.classList.add("center");

        button.classList.add("promote");
        button.innerHTML = editIcon;

        button.addEventListener("click", () => {
          fillGameForm({
            gameName: game.title,
            image: game.logo,
            endpoint: `api/games/${game._id}/update`,
            method: "PUT",
          });
        });

        column.appendChild(button);
        row.appendChild(column);
        row.id = game._id;

        // Attaching delete button
        const deleteCol = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteCol.classList.add("center");

        deleteButton.classList.add("promote");
        deleteButton.innerHTML = deleteIcon;
        deleteButton.addEventListener("click", () => {
          deleteGame(game);
        });
        deleteCol.appendChild(deleteButton);
        row.appendChild(deleteCol);

        fBody.appendChild(row);
      }
    })
  );

  const loader = table.closest("section").querySelector(".loader");
  if (loader) loader.parentElement.removeChild(loader);
  table.classList.add("active");
}

$(document).ready(() => {
  bindAccordions();
  bindForms();

  const users = document.getElementById("users");
  if (users) fillUsersTable(users);
  // if (users) setTimeout(() => fillUsersTable(users), 2000);

  const matches = document.getElementById("matches");
  if (matches) fillMatchesTable(matches);

  const teams = document.getElementById("teams");
  if (teams) fillTeamsTable(teams);

  const games = document.getElementById("games");
  if (games) fillGamesTable(games);
});
