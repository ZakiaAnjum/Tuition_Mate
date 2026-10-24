TUITIONMATE — BEGINNER PROJECT GUIDE
=======================================

WHAT THIS PROJECT INCLUDES
- Landing page with a clean responsive design
- Guardian and teacher registration
- Login and logout
- One demo admin account
- Guardian profile and tuition-request posting
- Teacher academic profile and teacher-criteria posting
- Search by class, subject and area
- Overview shows the two latest posts from guardians and teachers; Browse all opens a separate page with all posts and does not redirect to Find Teachers / Find Tuition
- Teacher criteria includes Gender (Male, Female, Others), an Experience dropdown (Beginner, 1 year+, 2 years+, 3 years+, 5 years+, 7 years+, 10 years+), and curriculum/version selection
- Both guardian tuition posts and teacher criteria posts can select Bangla Version, English Version (NC), or British Curriculum (BC)
- After a guardian accepts a teacher, the guardian can view the teacher contact details and the accepted teacher can view guardian phone, email, address and area in the applications panel. Guardians can change an application to accepted, rejected, or pending
- Admin registered-user count excludes blocked accounts; admin can delete guardian or teacher posts
- Post details and teacher profile view
- Express-interest/application tracking
- User blocking and post removal from admin dashboard
- Data stored in this browser using localStorage

IMPORTANT DEMO LIMITATION
This project uses only HTML, CSS and JavaScript, so it is a front-end demo.
Passwords and data are stored in the browser and are NOT secure. The admin
password is visible in app.js. Do not publish this version as a real service,
and do not enter real sensitive personal information. A real public website
needs a backend, database, secure password hashing, server-side authorization,
input validation, and a safer contact/privacy workflow.

DEMO ADMIN LOGIN
Email:    admin@tuitionconnect.local
Password: Admin@123

HOW TO RUN IN VS CODE (WINDOWS)
1. Download and extract TuitionMate_Updated.zip.
2. Open Visual Studio Code.
3. Choose File > Open Folder.
4. Select the extracted "TuitionConnect" project folder.
5. In the Explorer panel, confirm these files are present:
   - index.html
   - style.css
   - app.js
   - README.txt
6. If Live Server is installed: right-click index.html > Open with Live Server.
   If it is not installed: open Extensions (Ctrl+Shift+X), search "Live Server"
   by Ritwick Dey, install it, then repeat step 6.
7. The website should open in your browser.

HOW TO TEST THE PROJECT
1. Register a guardian account using an email you have not used before.
2. Fill the profile and use "Post a tuition" to publish a sample request.
3. Log out.
4. Register a teacher account with a different email.
5. Complete the teacher profile and browse "Find tuition".
6. Search by class, subject or area and express interest in a request.
7. Log out and log back in as the guardian to see interested teachers.
8. Log in as admin using the demo credentials above to manage users and posts.

DATA / RESET
The demo saves data in the browser's localStorage. To reset the demo, open the
site, press F12, open the Console tab and run:
localStorage.removeItem("tuitionConnect_v1");
Then refresh the page. This clears demo accounts and posts for this site.

FOLDER STRUCTURE
TuitionMate project folder/
  index.html    Main page and modal container
  style.css     Layout, colors, responsive styling
  app.js        Registration, login, posts, search, dashboards and admin logic
  README.txt    This guide
https://zakiaanjum.github.io/Tuition_Mate/
