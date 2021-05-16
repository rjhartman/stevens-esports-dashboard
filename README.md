# CS-546 Final Project

## About

### Introduction:

As a Non-RSO (Registered Student Organization) at Stevens Institute of Technology, Stevens Esports serves as the organizing body for intercollegiate competitive gaming on campus. The club aims to support its members by bolstering their competitive careers and providing an organized means of competing in amateur collegiate leagues. They currently host over 80 student players across a wide variety of titles and fosters teams that often place in the top 25% of schools across the nation. To help facilitate growth and maintain organization, the Stevens Esports Club is interested in a central means of organizing rosters, match schedules, and other logistical information for the club. Given this unique set of requirements, we propose building a dashboard that can offer the functionality the club requires, that can be deployed and put to use in a production environment after the conclusion of the semester.

### Motivation:

Currently, other than the official Stevens Esports Discord server, there is no centralized hub of information about Stevens Esports or its teams/games. This dashboard will serve as not only an information hub for the players, but it will also allow the club eBoard members to manage their rosters. This website will also allow users to sign up and submit an application should they want to play for a team in the club.
In addition, there is no one place that records the history of the games the teams play, nor is there a centralized schedule for upcoming matches. Oftentimes, players could be playing on teams for different games, and it’s a hassle to find information on upcoming matches so they can schedule around the games. With a centralized information hub, players will be able to view their upcoming matches and schedule events around the games ahead of time.

## Group Members:

- Jerry Chen;
- Jerry Cheng;
- Andrew Chuah;
- Ryan Hartman;
- Daniel Pekata;

## Getting Started

1. Install required dependencies

```bash
$ npm i
```

2. Seed database with minimum required documents

```bash
$ npm run seed
```

3. Start web application

```bash
$ npm start
```

## Overview

### Landing Page (/)

The landing page contains basic information about the Esports organization, and a sign up link.

### Rosters Page (/teams)

This contains all teams populated in the mongo database. Each team on this page links out to the individual players' profile pages. Each team only has two players when seeding the database, but there is no limitation to how many players can be on a roster.

### Player Profile (/player/:username)

All users have a "player profile" made for them by default. These show public facing elements, such as your profile picture and bio. It also shows their position on their team, as well if they are a captain on that team or not.

### Register (/register)

The register page allows anyone to sign up for an account. You can do so by inputting all required information, with an optional bio. Once registered, you will be able to sign in as a new user!

### Sign In (/login)

Logging in and viewing the website as an authenticated user unlocks more pages/functionality. To log in, either create an account or use these provided accounts:

- Username: **strider**, Password: **test** (Admin)
- Username: **achuah@stevens.edu**, password: **test**

The user `strider` is an administrator, a role that is given to the esports association's eboard. As an administrator, you can view the dashboard, where you can make edits to user permissions and manage match schedules.

As a normal user, you can edit your public facing profile.

This login form is not case sensitive for the username/email field, and either the user's email or username can be used to login. When an incorrect username is given, the user does not know if it was their password or username that was incorrect, by design to thwart brute force attacks. If a username is given that is unrecognized, the backend will **still compare a random string to a random password**. This makes sure that the user cannot tell that their username was the invalid piece of information entered based on the refresh time of the page.

### Dashboard (/dashboard) `authenticated`

This is an authenticated route; a non-authenticated user will be redirected to the home page. Here, administrators can edit user permissions and manage the match schedules.

To edit permissions, click the corresponding button next to the user in the users table. You can promote or demote, and the changes are reflected in realtime via an AJAX request. This is not a form, however.

Matches can be both edited and added in the match table. When adding a match, client-side javascript edits/fills the form that appears, and sets the `data-method` attribute to be `POST`. There is significant error checking on this form, as matches that are not played yet may not have a result, but matches that are completed must have a resulting score.

When editing an existing match (by hitting the red edit button in the table), the form is auto-filled with the current match's information. Similarly, the `data-method` attribute is set to be `PATCH`, as the form will submit to a patch route that will update parts of the match.

When submitting this form, the changes are submitted via AJAX and are reflected instantly in the table. The dashboard never needs to refresh, even to edit matches in the table that were added in the current session.

### Team Registration (/dashboard) `authenticated`

Normal users and admins alike can register for teams through a Google form on this page. This was made a Google form because the Eboard has specific requirements and dependencies that rely on using GoogleForms.

### Profile (/user-profile) `authenticated`

Here, users can view their current profile, as it would appear to the world if they were on a team. There are buttons to change their password, or edit their profile's appearance, as well as upload a custom profile picture.

### Edit Profile (/edit-profile) `authenticated`

Here, users can edit their profile through the provided form.

### Change Password (/change-password) `authenticated`

Here, users can edit their password through the provided form.
