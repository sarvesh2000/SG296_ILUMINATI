# SG296_ILUMINATI
Repo for SIH 2020. Problem Statement SG296. Team ILUMINATI

This is a web application to enable smart file tracking system for easy tracking of files and to also monitor the movement of each file, provide timely information and notifications through messaging services such as telegram. Data analysis is also used to predict the workflow and to improve the quality of work

## Folder Legend

* **assets folder** conatains the images that we've used for this project.
* **css folder** conatins the CSS files required for the pages.
* **fonts folder** contains the fonts used for the project.
* **js folder** contains the script files used for the pages.
* **vendor folder** contains the library files used for this project.

## Modules
### Officer Dashboard
The officer dashboard consists of a home page where the officer can view the new, existing and completed jobs.

File for officer dashboard is **dashboard.html**

### Admin Dashboard
The admin dashboard contains all the features of the officer dashboard along with admin access. Here the admin can reassign jobs to different officers as well as track any file.

File for admin dashboard is **dashboard2.html**

### Newly Assigned Jobs
This module contains the newly assigned jobs along with the name of the person, file id, file description, job priority, delivery date, and job type. The officer can choose to start a job on this list.

File for newly assigned jobs is **newjobs.html**

### Reassigned Jobs
Here admin can track a file by file ID and reassign it to any officer who has handled the file.

File for reassigning and tracking files is **table.html**

### Existing Jobs
This module displays the jobs that the officer is currently working on. Once officer has completed the job he can mark the job as finished here. 

File for existing jobs is **existing_jobs.html**

### Completed Jobs
This module displays the jobs that have been completed along with the file details, delivery date and completed date.

File for completed jobs is **jobs_history.html**

### Telegram Notification system
This module sends a notification about the job status and pending work via telegram. It also informs the officer of upcoming deadlines and higher priority jobs. A notification is sent once every three hours regarding the job status.

We have included the code for the notification system in a seperate repo as it is deployed in cloud. Please find the repo link of that bot below. Its is a public repository and can be viewed by anyone. The repo is owned by the team leader of our team **Sarvesh S.**

Repo Link: https://github.com/sarvesh2000/SIH-telegram-bot

Repo Owner: @sarvesh2000 (Sarvesh S.) Team Leader - ILUMINATI.

### SMS Notification system
This module sends a notification about the job status and pending work via SMS. It also informs the officer of upcoming deadlines and higher priority jobs. A notification is sent once every three hours regarding the job status.

We have included the code for the notification system in a seperate repo as it is deployed in cloud. Please find the repo link of that bot below. Its is a public repository and can be viewed by anyone. The repo is owned by the team leader of our team **Sarvesh S.**

Repo Link: https://github.com/sarvesh2000/SIH-SMS-Bot

Repo Owner: @sarvesh2000 (Sarvesh S.) Team Leader - ILUMINATI.

### Email Notification system
This module sends a notification about the job status and pending work via email. It also informs the officer of upcoming deadlines and higher priority jobs. A notification is sent once every three hours regarding the job status.

We have included the code for the notification system in a seperate repo as it is deployed in cloud. Please find the repo link of that bot below. Its is a public repository and can be viewed by anyone. The repo is owned by the team leader of our team **Sarvesh S.**

Repo Link: https://github.com/sarvesh2000/SIH-Email-Bot

Repo Owner: @sarvesh2000 (Sarvesh S.) Team Leader - ILUMINATI.
