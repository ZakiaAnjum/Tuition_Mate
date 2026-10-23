/* TuitionMate demo app
   This is a front-end learning project. Data is stored in this browser's localStorage.
   Do not use real sensitive information. A production site needs a secure backend. */
const ADMIN_EMAIL = "admin@tuitionconnect.local";
const ADMIN_PASSWORD = "Admin@123";
const STORE = "tuitionConnect_v1";
let currentUser = null;
let currentView = "overview";
let registerRole = "guardian";
let toastTimer;

const $ = (s, root=document) => root.querySelector(s);
const app = $("#app");
const modalBackdrop = $("#modalBackdrop");
const modalContent = $("#modalContent");

function loadData(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORE));
    if(saved && Array.isArray(saved.users) && Array.isArray(saved.posts)) return saved;
  }catch(e){}
  return {users:[], posts:[], applications:[], activity:[]};
}
let db = loadData();
function saveData(){ localStorage.setItem(STORE, JSON.stringify(db)); }
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function id(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function money(v){return v ? "৳"+esc(v) : "Negotiable";}
function initials(name="User"){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600);}
function openModal(html){modalContent.innerHTML=html;modalBackdrop.classList.remove("hidden");}
function closeModal(){modalBackdrop.classList.add("hidden");modalContent.innerHTML="";}
$("#modalClose").addEventListener("click",closeModal);
modalBackdrop.addEventListener("click",e=>{if(e.target===modalBackdrop)closeModal();});
$("#navLogin").onclick=()=>showLogin();
$("#heroLogin").onclick=()=>showLogin();
$("#navRegister").onclick=()=>showRegister();
$("#heroRegister").onclick=()=>showRegister();
$("#brandHome").onclick=e=>{e.preventDefault();if(currentUser)renderDashboard();else renderHome();};

function renderHome(){
 currentUser=null;currentView="overview";
 $("#navActions").innerHTML='<button class="btn btn-ghost" id="navLogin">Log in</button><button class="btn btn-primary" id="navRegister">Create account</button>';
 $("#navLogin").onclick=showLogin;$("#navRegister").onclick=showRegister;
 app.innerHTML=`<section class="hero"><div class="hero-copy"><span class="eyebrow">A smarter way to find the right tutor</span><h1>Good learning starts at <em>home.</em></h1><p>TuitionMate brings guardians and caring teachers together. Find the right tuition match with clear preferences, helpful profiles and a simple process.</p><div class="hero-actions"><button class="btn btn-primary btn-large" id="heroRegister2">Create account <span>→</span></button><button class="btn btn-outline btn-large" id="heroLogin2">I already have an account</button></div><div class="trust-row"><span>✓ Guardian & teacher accounts</span><span>✓ Tuition criteria matching</span><span>✓ Contact after acceptance</span></div></div><div class="hero-visual hero-illustration"><div class="illustration-glow"></div><img src="tuitionmate-hero.png" alt="A tutor helping a student study at home"/><div class="illustration-caption"><span>✦</span><div><b>Better learning starts at home</b><small>Find the right tuition match</small></div></div></div></section><section class="how-section"><div class="section-heading"><span class="eyebrow">HOW IT WORKS</span><h2>One place for better learning.</h2><p>A simple way for guardians and teachers to find each other.</p></div><div class="feature-grid"><article class="feature-card"><div class="feature-icon lavender">♧</div><h3>For guardians</h3><p>Post tuition needs, review interested teachers and accept the right match.</p></article><article class="feature-card"><div class="feature-icon mint">✎</div><h3>For teachers</h3><p>Share your teaching criteria and discover tuition opportunities that suit you.</p></article><article class="feature-card"><div class="feature-icon peach">♡</div><h3>Contact with care</h3><p>After a guardian accepts a teacher, both sides can view the contact details needed to coordinate tuition.</p></article></div></section><footer class="footer"><span>© 2026 TuitionMate</span><span>Learn. Teach. Succeed.</span></footer>`;
 $("#heroRegister2").onclick=showRegister;$("#heroLogin2").onclick=showLogin;
}

function showLogin(){
 openModal(`<span class="eyebrow">WELCOME BACK</span><h2>Log in to TuitionMate</h2><p class="subtext">Access your dashboard and continue finding the right match.</p><form id="loginForm"><div class="field"><label>Email address</label><input name="email" type="email" required placeholder="you@example.com"></div><div class="field"><label>Password</label><input name="password" type="password" required placeholder="Enter your password"></div><button class="btn btn-primary" style="width:100%;margin-top:5px">Log in</button></form><div class="form-foot"><span class="subtext" style="margin:0">New here?</span><button class="link-btn" id="toRegister">Create an account</button></div>`);
 $("#toRegister").onclick=showRegister;
 $("#loginForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const email=String(f.get("email")).trim().toLowerCase(),pass=String(f.get("password"));if(email===ADMIN_EMAIL&&pass===ADMIN_PASSWORD){currentUser={id:"admin",name:"Main Admin",email,role:"admin"};closeModal();renderDashboard();return;}const user=db.users.find(u=>u.email===email&&u.password===pass);if(!user){showToast("Email or password is incorrect.");return;}if(user.status==="blocked"){showToast("This account has been blocked by admin.");return;}currentUser=user;closeModal();renderDashboard();};
}
function showRegister(){
 registerRole="guardian";
 openModal(`<span class="eyebrow">JOIN TUITIONMATE</span><h2>Create your account</h2><p class="subtext">Choose how you want to use the platform. You can complete your details next.</p><div class="role-choice"><button type="button" class="role-option selected" data-role="guardian"><span class="role-emoji">👨‍👩‍👧</span><strong>I'm a Guardian</strong><small>Looking for a teacher for my child</small></button><button type="button" class="role-option" data-role="teacher"><span class="role-emoji">👩‍🏫</span><strong>I'm a Teacher</strong><small>Looking for tuition opportunities</small></button></div><form id="registerForm"><div class="form-grid"><div class="field"><label>Full name *</label><input name="name" required maxlength="80" placeholder="Your full name"></div><div class="field"><label>Mobile number *</label><input name="phone" required maxlength="25" placeholder="01XXXXXXXXX"></div><div class="field full"><label>Email address *</label><input name="email" type="email" required maxlength="120" placeholder="you@example.com"></div><div class="field"><label>Password *</label><input name="password" type="password" required minlength="6" placeholder="At least 6 characters"></div><div class="field"><label>Confirm password *</label><input name="confirm" type="password" required minlength="6" placeholder="Repeat password"></div></div><button class="btn btn-primary" style="width:100%">Create account</button></form><div class="form-foot"><span class="subtext" style="margin:0">Already registered?</span><button class="link-btn" id="toLogin">Log in</button></div>`);
 modalContent.querySelectorAll("[data-role]").forEach(b=>b.onclick=()=>{registerRole=b.dataset.role;modalContent.querySelectorAll("[data-role]").forEach(x=>x.classList.toggle("selected",x===b));});
 $("#toLogin").onclick=showLogin;
 $("#registerForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const name=String(f.get("name")).trim(),phone=String(f.get("phone")).trim(),email=String(f.get("email")).trim().toLowerCase(),password=String(f.get("password"));if(password!==f.get("confirm")){showToast("Passwords do not match.");return;}if(email===ADMIN_EMAIL||db.users.some(u=>u.email===email)){showToast("This email is already registered.");return;}const u={id:id(),name,phone,email,password,role:registerRole,status:"active",createdAt:new Date().toISOString(),address:"",city:"",school:"",college:"",university:"",degree:"",gpa:"",subjects:"",classes:"",experience:"",bio:"",preferredLocation:"",preferredTime:"",days:"",salary:""};db.users.push(u);db.activity.unshift({id:id(),text:`New ${registerRole} account registered: ${name}`,date:new Date().toISOString()});saveData();currentUser=u;closeModal();renderDashboard();showToast("Account created successfully!");};
}

function renderDashboard(){
 if(!currentUser){renderHome();return;}
 $("#navActions").innerHTML=`<span style="align-self:center;font-size:12px;color:#777;margin-right:8px">Signed in as ${esc(currentUser.role)}</span><button class="btn btn-ghost" id="topLogout">Log out</button>`;
 $("#topLogout").onclick=logout;
 app.innerHTML=`<div class="dashboard"><aside class="sidebar"><div class="side-user"><div class="side-avatar">${currentUser.role==="admin"?"⚙":esc(initials(currentUser.name))}</div><div><strong>${esc(currentUser.name)}</strong><small>${esc(currentUser.email)}</small></div></div><nav class="side-nav" id="sideNav"></nav></aside><section class="dash-main" id="dashContent"></section></div>`;
 const nav=currentUser.role==="admin"?[["overview","Overview"],["users","Manage users"],["posts","Manage posts"],["activity","Activity log"]]:currentUser.role==="guardian"?[["overview","Overview"],["my-posts","My tuition posts"],["new-post","Post a tuition"],["teachers","Find teachers"],["applications","Interested teachers"],["profile","My profile"]]:[["overview","Overview"],["find-tuition","Find tuition"],["my-posts","My tuition posts"],["new-post","Post teacher criteria"],["applications","My applications"],["profile","My profile"]];
 $("#sideNav").innerHTML=nav.map(([v,label])=>`<button data-view="${v}" class="${currentView===v?"active":""}">${label}</button>`).join("")+`<button class="logout" id="sideLogout">↪ Log out</button>`;
 $("#sideNav").querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{currentView=b.dataset.view;renderDashboard();});
 $("#sideLogout").onclick=logout;
 renderView();
}
function logout(){currentUser=null;currentView="overview";renderHome();showToast("You have logged out.");}
function setView(view){currentView=view;renderDashboard();}
function renderView(){
 const c=$("#dashContent");
 if(currentUser.role==="admin") return renderAdminView(c);
 if(currentView==="profile") return renderProfile(c);
 if(currentView==="new-post") return renderPostForm(c);
 if(currentView==="my-posts") return renderMyPosts(c);
 if(currentView==="teachers") return renderListings(c,"guardian");
 if(currentView==="find-tuition") return renderListings(c,"teacher");
 if(currentView==="browse-all") return renderBrowseAll(c);
 if(currentView==="applications") return renderApplications(c);
 renderOverview(c);
}
function pageHeader(title,desc,action=""){return `<div class="dash-top"><div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;}
function activePosts(){return db.posts.filter(p=>p.status==="active");}
function myPosts(){return db.posts.filter(p=>p.userId===currentUser.id);}
function renderOverview(c){
 const own=myPosts(),apps=db.applications.filter(a=>currentUser.role==="teacher"?a.teacherId===currentUser.id:own.some(p=>p.id===a.postId));
 const welcome=currentUser.role==="guardian"?"Find a teacher who fits your child's learning needs.":"Discover tuition opportunities that fit your subjects and schedule.";
 c.innerHTML=pageHeader(`Hello, ${esc(currentUser.name.split(" ")[0])} 👋`,welcome,`<button class="btn btn-primary" id="quickPost">${currentUser.role==="guardian"?"＋ Post a tuition":"＋ Post teacher criteria"}</button>`)+
 `<div class="stats-grid"><div class="stat-card"><small>MY POSTS</small><strong>${own.length}</strong></div><div class="stat-card"><small>${currentUser.role==="guardian"?"TEACHER INTEREST":"MY APPLICATIONS"}</small><strong>${apps.length}</strong></div><div class="stat-card"><small>AVAILABLE POSTS</small><strong>${activePosts().filter(p=>p.userId!==currentUser.id).length}</strong></div></div>
 <div class="notice"><b>Quick tip:</b> Complete your profile to help the other side understand your needs and background. Never share your account password with anyone.</div>
 <div class="panel"><div class="panel-head"><h3>Latest posts from guardians & teachers</h3><button class="link-btn" id="browseAll">Browse all →</button></div><div id="overviewListings"></div></div>
 <div class="panel"><div class="panel-head"><h3>Get started</h3></div><div class="detail-list"><div class="detail-item"><small>STEP 01</small><strong>Complete your profile</strong><p style="font-size:11px;color:#777">Add location and relevant information.</p><button class="link-btn" data-goto="profile">Edit profile →</button></div><div class="detail-item"><small>STEP 02</small><strong>${currentUser.role==="guardian"?"Post your tuition requirements":"Set your teaching criteria"}</strong><p style="font-size:11px;color:#777">Add class, subject, schedule and budget.</p><button class="link-btn" data-goto="new-post">Create a post →</button></div></div></div>`;
 $("#quickPost").onclick=()=>setView("new-post");$("#browseAll").onclick=()=>setView("browse-all");c.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>setView(b.dataset.goto));
 const list=activePosts().filter(p=>p.userId!==currentUser.id).slice(0,2);
 $("#overviewListings").innerHTML=list.length?`<div class="listing-grid">${list.map(postCard).join("")}</div>`:`<div class="empty-state"><strong>No matching posts yet</strong>New opportunities will appear here when users publish posts.</div>`;
 bindPostActions($("#overviewListings"));
}
function renderBrowseAll(c){
 c.innerHTML=pageHeader("Browse all posts","Explore the latest tuition requests and teacher criteria in one place.",`<button class="btn btn-outline" id="backOverview">← Overview</button>`)+`<div id="allPostListings"></div>`;
 $("#backOverview").onclick=()=>setView("overview");
 const list=activePosts().filter(p=>p.userId!==currentUser.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
 $("#allPostListings").innerHTML=list.length?`<div class="listing-grid">${list.map(postCard).join("")}</div>`:`<div class="panel empty-state"><strong>No posts available yet</strong>New posts will appear here when users publish them.</div>`;
 bindPostActions($("#allPostListings"));
}
function renderPostForm(c){
 const isGuardian=currentUser.role==="guardian";
 c.innerHTML=pageHeader(isGuardian?"Post a tuition requirement":"Post your teaching criteria",isGuardian?"Tell teachers what kind of tutor your child needs.":"Tell guardians what kind of student and tuition you are looking for.")+
 `<div class="panel"><form id="postForm"><div class="form-grid">
 <div class="field"><label>Student class / level *</label><select name="studentClass" required><option value="">Choose class</option>${["Play","Nursery","KG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","HSC / College","Admission","University","Other"].map(x=>`<option>${x}</option>`).join("")}</select></div>
 <div class="field"><label>Subject(s) *</label><input name="subjects" required placeholder="e.g. Mathematics, Physics"></div>
 <div class="field"><label>Preferred days per week</label><select name="days"><option value="">Select days</option>${["1 day","2 days","3 days","4 days","5 days","6 days","7 days","Negotiable"].map(x=>`<option>${x}</option>`).join("")}</select></div>
 <div class="field"><label>Preferred time</label><input name="time" placeholder="e.g. 3 PM–5 PM or negotiable"></div>
 <div class="field"><label>Monthly salary (৳)</label><input name="salary" type="number" min="0" placeholder="e.g. 5000"></div>
 <div class="field"><label>Salary flexibility</label><select name="salaryType"><option>Negotiable</option><option>Fixed</option><option>Depends on experience</option></select></div>
 <div class="field"><label>Location / area *</label><input name="location" required placeholder="e.g. Agrabad, Chattogram"></div>
 <div class="field"><label>Tuition mode</label><select name="mode"><option>Home tuition</option><option>Online</option><option>Either</option><option>Coaching / group</option></select></div>
 <div class="field"><label>${isGuardian?"Preferred teacher gender":"Gender"}</label><select name="gender">${isGuardian?'<option>No preference</option>':''}<option>Male</option><option>Female</option><option>Others</option></select></div>
 ${isGuardian?`<div class="field"><label>Experience preference</label><input name="experience" placeholder="e.g. 2 years+, beginner accepted, no preference"></div>`:`<div class="field"><label>Experience</label><input name="experience" required placeholder="e.g. Beginner, 2 years+, 5 years+"> </div>`}
 <div class="field"><label>Curriculum / Version</label><select name="curriculum" required><option value="" disabled selected hidden>e.g. Bangla Version</option><option>Bangla Version</option><option>English Version (NC)</option><option>British Curriculum (BC)</option></select></div>
 <div class="field full"><label>Additional details / message</label><textarea name="message" placeholder="Mention student's needs, start date or anything else..."></textarea></div>
 </div><button class="btn btn-primary">Publish ${isGuardian?"tuition request":"teacher criteria"}</button> <button type="button" class="btn btn-outline" id="cancelPost">Cancel</button></form></div>`;
 $("#cancelPost").onclick=()=>setView("overview");
 $("#postForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const p={id:id(),userId:currentUser.id,role:currentUser.role,studentClass:String(f.get("studentClass")),subjects:String(f.get("subjects")).trim(),days:String(f.get("days")),time:String(f.get("time")).trim(),salary:String(f.get("salary")).trim(),salaryType:String(f.get("salaryType")),location:String(f.get("location")).trim(),mode:String(f.get("mode")),gender:String(f.get("gender")),experience:String(f.get("experience")),curriculum:String(f.get("curriculum")||""),message:String(f.get("message")).trim(),status:"active",createdAt:new Date().toISOString()};db.posts.unshift(p);db.activity.unshift({id:id(),text:`${currentUser.name} published a ${currentUser.role==="guardian"?"tuition request":"teacher criteria"} post`,date:new Date().toISOString()});saveData();showToast("Your post is now published.");setView("my-posts");};
}
function postCard(p){
 const owner=db.users.find(u=>u.id===p.userId);const ownerName=owner?owner.name:"User";const guardianPost=p.role==="guardian";
 const primaryAction=currentUser.role==="guardian"?(guardianPost?"details":"interest"):(guardianPost?"interest":"details");
 const primaryLabel=currentUser.role==="guardian"?(guardianPost?"View details":"View teacher"):(guardianPost?"I'm interested":"View details");
 return `<article class="listing-card"><div class="card-tags"><span class="tag">${esc(p.studentClass)}</span><span class="tag green">${guardianPost?"Guardian request":"Teacher criteria"}</span></div><h3>${esc(p.subjects)}</h3><p>${esc(p.message||"No additional message provided.")}</p><div class="listing-meta"><span>📍 Location<b>${esc(p.location)}</b></span><span>📅 Schedule<b>${esc(p.days||"Flexible")}</b></span><span>🕒 Preferred time<b>${esc(p.time||"Negotiable")}</b></span><span>৳ Monthly salary<b>${p.salary?money(p.salary):"Negotiable"} · ${esc(p.salaryType)}</b></span><span>📘 Curriculum<b>${esc(p.curriculum||"Not specified")}</b></span></div><p><b style="color:#44465a">Posted by:</b> ${esc(ownerName)} · ${new Date(p.createdAt).toLocaleDateString()}</p><div class="card-actions"><button class="btn btn-primary btn-sm" data-action="${primaryAction}" data-id="${p.id}">${primaryLabel}</button><button class="btn btn-outline btn-sm" data-action="details" data-id="${p.id}">View details</button></div></article>`;
}
function renderListings(c,mode){
 const wantRole=mode==="guardian"?"teacher":"guardian";
 c.innerHTML=pageHeader(mode==="guardian"?"Find teachers":"Find tuition opportunities",mode==="guardian"?"Browse teacher criteria and choose who you would like to contact.":"Search guardian requests that fit your teaching preferences.")+
 `<div class="filter-row"><select id="filterClass"><option value="">All classes</option>${["Play","Nursery","KG",...Array.from({length:10},(_,i)=>`Class ${i+1}`),"HSC / College","Admission","University","Other"].map(x=>`<option>${x}</option>`).join("")}</select><input id="filterSubject" placeholder="Search subject..."><input id="filterLocation" placeholder="Search area..."><button class="btn btn-outline" id="clearFilters">Clear filters</button></div><div id="listingResults"></div>`;
 function refresh(){const cls=$("#filterClass").value,sub=$("#filterSubject").value.toLowerCase(),loc=$("#filterLocation").value.toLowerCase();const list=activePosts().filter(p=>p.userId!==currentUser.id&&p.role===wantRole&&(!cls||p.studentClass===cls)&&(!sub||p.subjects.toLowerCase().includes(sub))&&(!loc||p.location.toLowerCase().includes(loc)));$("#listingResults").innerHTML=list.length?`<div class="listing-grid">${list.map(postCard).join("")}</div>`:`<div class="panel empty-state"><strong>No posts match these filters</strong>Try a different class, subject or area. New posts may be added later.</div>`;bindPostActions($("#listingResults"));}
 ["filterClass","filterSubject","filterLocation"].forEach(id=>$("#"+id).addEventListener(id==="filterSubject"||id==="filterLocation"?"input":"change",refresh));
 $("#clearFilters").onclick=()=>{$("#filterClass").value="";$("#filterSubject").value="";$("#filterLocation").value="";refresh();};refresh();
}
function bindPostActions(root){
 root.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{const p=db.posts.find(x=>x.id===b.dataset.id);if(!p)return;if(b.dataset.action==="details")return showPostDetails(p);if(currentUser.role==="guardian"&&p.role==="teacher")return showTeacherDetails(p);applyToPost(p);});
}
function showPostDetails(p){
 const owner=db.users.find(u=>u.id===p.userId);
 const isOwner=!!currentUser&&p.userId===currentUser.id;
 openModal(`<span class="eyebrow">POST DETAILS</span><h2>${esc(p.subjects)} · ${esc(p.studentClass)}</h2><p class="subtext">${p.role==="guardian"?"Guardian tuition request":"Teacher's preferred criteria"} · ${new Date(p.createdAt).toLocaleDateString()}</p><div class="detail-list"><div class="detail-item"><small>LOCATION</small><strong>${esc(p.location)}</strong></div><div class="detail-item"><small>MONTHLY SALARY</small><strong>${p.salary?money(p.salary):"Negotiable"} · ${esc(p.salaryType)}</strong></div><div class="detail-item"><small>SCHEDULE</small><strong>${esc(p.days||"Flexible")} · ${esc(p.time||"Negotiable")}</strong></div><div class="detail-item"><small>MODE</small><strong>${esc(p.mode)}</strong></div><div class="detail-item"><small>${p.role==="guardian"?"PREFERRED TEACHER GENDER":"GENDER"}</small><strong>${esc(p.gender||"Not specified")}</strong></div><div class="detail-item"><small>${p.role==="guardian"?"EXPERIENCE PREFERENCE":"EXPERIENCE"}</small><strong>${esc(p.experience||"Not specified")}</strong></div><div class="detail-item"><small>CURRICULUM / VERSION</small><strong>${esc(p.curriculum||"Not specified")}</strong></div></div><div class="panel" style="margin-top:16px"><b>Additional message</b><p style="color:#777;font-size:13px;line-height:1.7">${esc(p.message||"No extra message.")}</p><p style="font-size:12px">Posted by ${esc(owner?.name||"User")}</p></div>${isOwner?'<button class="btn btn-primary" id="editOwnPost">Edit post</button>':(currentUser.role==="guardian"&&p.role==="teacher"?'<button class="btn btn-primary" id="detailInterest">View teacher profile</button>':(currentUser.role==="teacher"&&p.role==="guardian"?"<button class=\"btn btn-primary\" id=\"detailInterest\">I'm interested</button>":''))}`);
 const editBtn=$("#editOwnPost");if(editBtn)editBtn.onclick=()=>{closeModal();editPost(p);};
 const interestBtn=$("#detailInterest");if(interestBtn)interestBtn.onclick=()=>{closeModal();if(currentUser.role==="guardian"&&p.role==="teacher")showTeacherDetails(p);else applyToPost(p);};
}
function showTeacherDetails(p){
 const u=db.users.find(x=>x.id===p.userId);if(!u)return showPostDetails(p);
 const accepted=db.applications.some(a=>a.teacherId===u.id&&a.guardianId===currentUser.id&&a.status==="accepted");
 const contactMarkup=accepted
  ? `<div class="detail-item"><small>MOBILE</small><strong>${esc(u.phone||"Not provided")}</strong></div><div class="detail-item"><small>EMAIL</small><strong>${esc(u.email||"Not provided")}</strong></div><div class="detail-item"><small>ADDRESS</small><strong>${esc(u.address||u.city||"Not provided")}</strong></div>`
  : `<div class="notice" style="grid-column:1/-1">Teacher contact details will be visible only after the related application is accepted.</div>`;
 openModal(`<span class="eyebrow">TEACHER PROFILE</span><div class="profile-summary"><div class="profile-big">${esc(initials(u.name))}</div><div><h3>${esc(u.name)}</h3><p>${esc(u.subjects||p.subjects||"Subjects not added")} · ${esc(u.city||p.location||"Location not added")}</p></div></div><div class="detail-list">${contactMarkup}<div class="detail-item"><small>SCHOOL / COLLEGE</small><strong>${esc([u.school,u.college].filter(Boolean).join(" / ")||"Not provided")}</strong></div><div class="detail-item"><small>UNIVERSITY / DEGREE</small><strong>${esc([u.university,u.degree].filter(Boolean).join(" / ")||"Not provided")}</strong></div><div class="detail-item"><small>GPA / CGPA</small><strong>${esc(u.gpa||"Not provided")}</strong></div><div class="detail-item"><small>EXPERIENCE</small><strong>${esc(u.experience||"Not provided")}</strong></div></div><div class="panel" style="margin-top:16px"><b>About the teacher</b><p style="color:#777;font-size:13px;line-height:1.7">${esc(u.bio||"The teacher has not added a short introduction yet.")}</p></div><button class="btn btn-primary" id="contactTeacher">${accepted?"Application accepted":"Express interest"}</button>`);
 if(accepted){$("#contactTeacher").disabled=true;$("#contactTeacher").textContent="Application accepted";}
 else $("#contactTeacher").onclick=()=>{closeModal();applyToPost(p);};
}
function applyToPost(p){
 if(p.userId===currentUser.id){showToast("You cannot express interest in your own post.");return;}
 if(currentUser.role===p.role){showToast("This post is not for your account type.");return;}
 const existing=db.applications.find(a=>a.postId===p.id&&a.teacherId===(currentUser.role==="teacher"?currentUser.id:p.userId)&&a.guardianId===(currentUser.role==="guardian"?currentUser.id:p.userId));
 if(existing){showToast("You have already expressed interest in this post.");return;}
 const guardianId=currentUser.role==="guardian"?currentUser.id:p.userId;
 const teacherId=currentUser.role==="teacher"?currentUser.id:p.userId;
 db.applications.unshift({id:id(),postId:p.id,guardianId,teacherId,fromUserId:currentUser.id,status:"pending",createdAt:new Date().toISOString()});saveData();showToast("Interest sent! Check your applications panel.");
}
function editPost(p){
 if(!p||p.userId!==currentUser.id){showToast("You can only edit your own post.");return;}
 const classes=["Play","Nursery","KG",...Array.from({length:10},(_,i)=>`Class ${i+1}`),"HSC / College","Admission","University","Other"];
 const days=["1 day","2 days","3 days","4 days","5 days","6 days","7 days","Negotiable"];
 const select=(name,items,val)=>`<select name="${name}">${items.map(x=>`<option ${x===val?'selected':''}>${esc(x)}</option>`).join("")}</select>`;
 openModal(`<span class="eyebrow">EDIT POST</span><h2>Edit your post</h2><form id="editPostForm"><div class="form-grid"><div class="field"><label>Student class / level *</label>${select("studentClass",classes,p.studentClass)}</div><div class="field"><label>Subject(s) *</label><input name="subjects" required value="${esc(p.subjects)}"></div><div class="field"><label>Preferred days</label>${select("days",["",...days],p.days||"")}</div><div class="field"><label>Preferred time</label><input name="time" value="${esc(p.time||"")}" placeholder="e.g. 3 PM–5 PM"></div><div class="field"><label>Monthly salary (৳)</label><input name="salary" type="number" min="0" value="${esc(p.salary||"")}" placeholder="e.g. 5000"></div><div class="field"><label>Salary flexibility</label>${select("salaryType",["Negotiable","Fixed","Depends on experience"],p.salaryType||"Negotiable")}</div><div class="field"><label>Location / area *</label><input name="location" required value="${esc(p.location||"")}"></div><div class="field"><label>Tuition mode</label>${select("mode",["Home tuition","Online","Either","Coaching / group"],p.mode||"Home tuition")}</div><div class="field"><label>${p.role==="guardian"?"Preferred teacher gender":"Gender"}</label>${select("gender",p.role==="guardian"?["No preference","Male","Female","Others"]:["Male","Female","Others"],p.gender||"Male")}</div><div class="field"><label>${p.role==="guardian"?"Experience preference":"Experience"}</label><input name="experience" value="${esc(p.experience||"")}" placeholder="e.g. 2 years+, beginner"></div><div class="field"><label>Curriculum / Version</label>${select("curriculum",["Bangla Version","English Version (NC)","British Curriculum (BC)"],p.curriculum||"Bangla Version")}</div><div class="field full"><label>Additional details / message</label><textarea name="message">${esc(p.message||"")}</textarea></div></div><div class="card-actions"><button class="btn btn-primary">Save changes</button><button type="button" class="btn btn-outline" id="cancelEditPost">Cancel</button></div></form>`);
 $("#cancelEditPost").onclick=()=>{closeModal();showPostDetails(p);};
 $("#editPostForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);Object.assign(p,{studentClass:String(f.get("studentClass")),subjects:String(f.get("subjects")).trim(),days:String(f.get("days")),time:String(f.get("time")).trim(),salary:String(f.get("salary")).trim(),salaryType:String(f.get("salaryType")),location:String(f.get("location")).trim(),mode:String(f.get("mode")),gender:String(f.get("gender")),experience:String(f.get("experience")).trim(),curriculum:String(f.get("curriculum")),message:String(f.get("message")).trim(),updatedAt:new Date().toISOString()});saveData();closeModal();renderDashboard();showToast("Post updated successfully.");};
}
function renderMyPosts(c){
 const list=myPosts();
 c.innerHTML=pageHeader("My posts","Manage the tuition requests or teaching criteria you have published.",`<button class="btn btn-primary" id="createPost">＋ Create post</button>`)+
 (list.length?`<div class="listing-grid">${list.map(p=>`<article class="listing-card"><div class="card-tags"><span class="tag">${esc(p.studentClass)}</span><span class="tag green">${esc(p.status)}</span></div><h3>${esc(p.subjects)}</h3><p>${esc(p.message||"No additional message.")}</p><div class="listing-meta"><span>📍 Location<b>${esc(p.location)}</b></span><span>📅 Days<b>${esc(p.days||"Flexible")}</b></span><span>🕒 Time<b>${esc(p.time||"Negotiable")}</b></span><span>৳ Salary<b>${p.salary?money(p.salary):"Negotiable"}</b></span></div><div class="card-actions"><button class="btn btn-outline btn-sm" data-post-details="${p.id}">View details</button><button class="btn btn-primary btn-sm" data-edit-post="${p.id}">Edit post</button><button class="btn btn-danger btn-sm" data-delete-post="${p.id}">Delete post</button></div></article>`).join("")}</div>`:`<div class="panel empty-state"><strong>You haven't published any posts yet</strong>Create your first post to get started.</div>`);
 $("#createPost").onclick=()=>setView("new-post");
 c.querySelectorAll("[data-post-details]").forEach(b=>b.onclick=()=>showPostDetails(db.posts.find(p=>p.id===b.dataset.postDetails)));
 c.querySelectorAll("[data-edit-post]").forEach(b=>b.onclick=()=>editPost(db.posts.find(p=>p.id===b.dataset.editPost)));
 c.querySelectorAll("[data-delete-post]").forEach(b=>b.onclick=()=>{if(confirm("Delete this post? This cannot be undone.")){db.posts=db.posts.filter(p=>p.id!==b.dataset.deletePost);db.applications=db.applications.filter(a=>a.postId!==b.dataset.deletePost);saveData();renderDashboard();showToast("Post deleted.");}});
}
function renderApplications(c){
 let list=db.applications.filter(a=>currentUser.role==="teacher"?a.teacherId===currentUser.id: a.guardianId===currentUser.id);
 c.innerHTML=pageHeader(currentUser.role==="guardian"?"Interested teachers":"My applications",currentUser.role==="guardian"?"Review teachers interested in your tuition post and manage their status.":"Track your applications and manage guardians interested in your teacher post.")+
 (list.length?`<div class="panel"><div class="table-wrap"><table><thead><tr><th>Post</th><th>${currentUser.role==="guardian"?"Teacher":"Guardian"}</th><th>Location</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>${list.map(a=>{const p=db.posts.find(x=>x.id===a.postId),other=db.users.find(u=>u.id===(currentUser.role==="guardian"?a.teacherId:a.guardianId));const teacherOwnsPost=currentUser.role==="teacher"&&p&&p.role==="teacher"&&p.userId===currentUser.id;const guardianOwnsPost=currentUser.role==="guardian"&&p&&p.role==="guardian"&&p.userId===currentUser.id;const canManage=guardianOwnsPost||teacherOwnsPost;return `<tr><td>${esc(p?.subjects||"Post deleted")}<br><small>${esc(p?.studentClass||"")}</small></td><td>${esc(other?.name||"User")}</td><td>${esc(p?.location||"—")}</td><td>${new Date(a.createdAt).toLocaleDateString()}</td><td><span class="status ${a.status==="accepted"?"active":""}">${esc(a.status)}</span></td><td>${canManage?`<button class="btn btn-outline btn-sm" data-manage-app="${a.id}">Manage / view contact</button>`:a.status==="accepted"?`<button class="btn btn-primary btn-sm" data-view-contact="${a.id}">View contact</button>`:`<button class="btn btn-outline btn-sm" data-withdraw="${a.id}">Withdraw</button>`}</td></tr>`;}).join("")}</tbody></table></div></div>`:`<div class="panel empty-state"><strong>No applications yet</strong>When someone expresses interest in a post, it will appear here.</div>`);
 c.querySelectorAll("[data-manage-app]").forEach(b=>b.onclick=()=>{
   const a=db.applications.find(x=>x.id===b.dataset.manageApp);if(!a)return;
   const p=db.posts.find(x=>x.id===a.postId);
   const canManage=currentUser.role==="guardian"?!!p&&p.role==="guardian"&&p.userId===currentUser.id:!!p&&p.role==="teacher"&&p.userId===currentUser.id;
   if(!canManage){showToast("You cannot manage this application.");return;}
   const otherId=currentUser.role==="guardian"?a.teacherId:a.guardianId;
   const u=db.users.find(x=>x.id===otherId);
   const contact=a.status==="accepted"?`<div class="detail-list"><div class="detail-item"><small>MOBILE</small><strong>${esc(u?.phone||"Not provided")}</strong></div><div class="detail-item"><small>EMAIL</small><strong>${esc(u?.email||"Not provided")}</strong></div>${currentUser.role==="teacher"?`<div class="detail-item"><small>ADDRESS</small><strong>${esc(u?.address||"Not provided")}</strong></div><div class="detail-item"><small>AREA / CITY</small><strong>${esc(u?.city||"Not provided")}</strong></div>`:""}</div>`:`<div class="notice">Contact details stay hidden until you accept this application.</div>`;
   openModal(`<span class="eyebrow">APPLICATION MANAGEMENT</span><h2>${esc(u?.name|| (currentUser.role==="guardian"?"Teacher":"Guardian"))}</h2><p class="subtext">Current status: <b>${esc(a.status)}</b></p>${contact}<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><button class="btn btn-primary" id="acceptApp">Accept</button><button class="btn btn-danger" id="rejectApp">Reject</button><button class="btn btn-outline" id="pendingApp">Pending</button></div>`);
   $("#acceptApp").onclick=()=>updateApplicationStatus(a,"accepted");$("#rejectApp").onclick=()=>updateApplicationStatus(a,"rejected");$("#pendingApp").onclick=()=>updateApplicationStatus(a,"pending");
 });
 c.querySelectorAll("[data-view-contact]").forEach(b=>b.onclick=()=>{
   const a=db.applications.find(x=>x.id===b.dataset.viewContact);if(!a||a.status!=="accepted"){showToast("Contact details are available only after acceptance.");return;}
   const otherId=currentUser.role==="guardian"?a.teacherId:a.guardianId;const u=db.users.find(x=>x.id===otherId);if(!u)return;
   openModal(`<span class="eyebrow">CONTACT DETAILS</span><h2>${esc(u.name)}</h2><p class="subtext">This application has been accepted.</p><div class="detail-list"><div class="detail-item"><small>MOBILE</small><strong>${esc(u.phone||"Not provided")}</strong></div><div class="detail-item"><small>EMAIL</small><strong>${esc(u.email||"Not provided")}</strong></div><div class="detail-item"><small>ADDRESS</small><strong>${esc(u.address||"Not provided")}</strong></div><div class="detail-item"><small>AREA / CITY</small><strong>${esc(u.city||"Not provided")}</strong></div></div>`);
 });
 c.querySelectorAll("[data-withdraw]").forEach(b=>b.onclick=()=>{if(confirm("Withdraw this application?")){db.applications=db.applications.filter(a=>a.id!==b.dataset.withdraw);saveData();renderDashboard();}});
}
function updateApplicationStatus(application,status){application.status=status;saveData();closeModal();renderDashboard();showToast(`Application status changed to ${status}.`);}
function renderProfile(c){
 const u=currentUser;
 c.innerHTML=pageHeader("My profile","Keep your information up to date. Only share details you are comfortable sharing.")+
 `<div class="panel"><form id="profileForm"><div class="form-grid"><div class="field"><label>Full name *</label><input name="name" required value="${esc(u.name)}"></div><div class="field"><label>Mobile number *</label><input name="phone" required value="${esc(u.phone||"")}"></div><div class="field"><label>Email address</label><input value="${esc(u.email)}" disabled></div><div class="field"><label>Address</label><input name="address" value="${esc(u.address||"")}" placeholder="House, road, area"></div><div class="field"><label>City / area</label><input name="city" value="${esc(u.city||"")}" placeholder="e.g. Chattogram"></div>${u.role==="teacher"?`<div class="field"><label>School</label><input name="school" value="${esc(u.school||"")}"></div><div class="field"><label>College</label><input name="college" value="${esc(u.college||"")}"></div><div class="field"><label>University</label><input name="university" value="${esc(u.university||"")}"></div><div class="field"><label>Degree / department</label><input name="degree" value="${esc(u.degree||"")}" placeholder="e.g. BSc in CSE"></div><div class="field"><label>GPA / CGPA</label><input name="gpa" value="${esc(u.gpa||"")}"></div><div class="field"><label>Subjects you teach</label><input name="subjects" value="${esc(u.subjects||"")}" placeholder="Math, English..."></div><div class="field"><label>Classes / levels</label><input name="classes" value="${esc(u.classes||"")}" placeholder="Class 6–10, HSC..."></div><div class="field"><label>Teaching experience</label><input name="experience" value="${esc(u.experience||"")}" placeholder="e.g. 2 years"></div><div class="field"><label>Preferred teaching time</label><input name="preferredTime" value="${esc(u.preferredTime||"")}"></div><div class="field"><label>Preferred days</label><input name="days" value="${esc(u.days||"")}"></div><div class="field"><label>Expected monthly salary</label><input name="salary" value="${esc(u.salary||"")}"></div>`:""}<div class="field full"><label>About me / additional information</label><textarea name="bio" placeholder="Write a short introduction...">${esc(u.bio||"")}</textarea></div></div><button class="btn btn-primary">Save profile</button></form></div>`;
 $("#profileForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);for(const [k,v] of f.entries())u[k]=String(v).trim();saveData();showToast("Profile saved.");renderDashboard();};
}
function renderAdminView(c){
 if(currentView==="users")return adminUsers(c);
 if(currentView==="posts")return adminPosts(c);
 if(currentView==="activity")return adminActivity(c);
 c.innerHTML=pageHeader("Admin overview","Manage accounts and keep tuition posts safe and organised.")+
 `<div class="stats-grid"><div class="stat-card"><small>REGISTERED USERS</small><strong>${db.users.filter(u=>u.status!=="blocked").length}</strong></div><div class="stat-card"><small>ACTIVE POSTS</small><strong>${activePosts().length}</strong></div><div class="stat-card"><small>EXPRESSIONS OF INTEREST</small><strong>${db.applications.length}</strong></div></div><div class="notice"><b>Admin controls:</b> Review suspicious content, block accounts when necessary, and remove posts that break platform rules. This demo has no server-side security.</div><div class="panel"><div class="panel-head"><h3>Recent activity</h3><button class="link-btn" id="allActivity">View activity →</button></div>${db.activity.length?db.activity.slice(0,6).map(a=>`<div class="detail-item" style="margin-bottom:8px"><strong>${esc(a.text)}</strong><small style="margin-top:5px">${new Date(a.date).toLocaleString()}</small></div>`).join(""):`<div class="empty-state">No activity yet.</div>`}</div><div class="panel"><div class="panel-head"><h3>Quick management</h3></div><button class="btn btn-outline" id="manageUsers">Manage users</button> <button class="btn btn-outline" id="managePosts">Manage / delete posts</button> <p class="subtext" style="margin-top:12px">Admin can remove any guardian tuition post or teacher criteria post from Manage posts.</p>`;
 $("#allActivity").onclick=()=>setView("activity");$("#manageUsers").onclick=()=>setView("users");$("#managePosts").onclick=()=>setView("posts");
}
function adminUsers(c){
 c.innerHTML=pageHeader("Manage users","Review registered guardians and teachers. Blocking prevents login.")+`<div class="panel"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Mobile</th><th>Status</th><th>Action</th></tr></thead><tbody>${db.users.length?db.users.map(u=>`<tr><td>${esc(u.name)}</td><td>${esc(u.role)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td><span class="status ${u.status==="active"?"active":""}">${esc(u.status)}</span></td><td><button class="btn ${u.status==="blocked"?"btn-outline":"btn-danger"} btn-sm" data-block="${u.id}">${u.status==="blocked"?"Unblock":"Block"}</button></td></tr>`).join(""):`<tr><td colspan="6">No registered users yet.</td></tr>`}</tbody></table></div></div>`;
 c.querySelectorAll("[data-block]").forEach(b=>b.onclick=()=>{const u=db.users.find(x=>x.id===b.dataset.block);if(!u)return;u.status=u.status==="blocked"?"active":"blocked";db.activity.unshift({id:id(),text:`Admin ${u.status} user ${u.name}`,date:new Date().toISOString()});saveData();renderDashboard();});
}
function adminPosts(c){
 c.innerHTML=pageHeader("Manage posts","Review or remove posts published by guardians and teachers.")+`<div class="panel"><div class="table-wrap"><table><thead><tr><th>Owner</th><th>Post type</th><th>Class</th><th>Subject</th><th>Location</th><th>Status</th><th>Action</th></tr></thead><tbody>${db.posts.length?db.posts.map(p=>{const u=db.users.find(x=>x.id===p.userId);return `<tr><td>${esc(u?.name||"User")}</td><td>${esc(p.role)}</td><td>${esc(p.studentClass)}</td><td>${esc(p.subjects)}</td><td>${esc(p.location)}</td><td><span class="status ${p.status==="active"?"active":""}">${esc(p.status)}</span></td><td><button class="btn btn-danger btn-sm" data-admin-delete="${p.id}">Delete post</button></td></tr>`;}).join(""):`<tr><td colspan="7">No posts available.</td></tr>`}</tbody></table></div></div>`;
 c.querySelectorAll("[data-admin-delete]").forEach(b=>b.onclick=()=>{if(confirm("Remove this post and its applications?")){const p=db.posts.find(x=>x.id===b.dataset.adminDelete);db.posts=db.posts.filter(x=>x.id!==b.dataset.adminDelete);db.applications=db.applications.filter(a=>a.postId!==b.dataset.adminDelete);db.activity.unshift({id:id(),text:`Admin removed a post by ${p?.role||"user"}`,date:new Date().toISOString()});saveData();renderDashboard();showToast("Post removed.");}});
}
function adminActivity(c){
 c.innerHTML=pageHeader("Activity log","A simple record of key actions in this browser demo.")+`<div class="panel">${db.activity.length?db.activity.map(a=>`<div class="detail-item" style="margin-bottom:9px"><strong>${esc(a.text)}</strong><small style="margin-top:6px">${new Date(a.date).toLocaleString()}</small></div>`).join(""):`<div class="empty-state">No activity to show yet.</div>`}</div>`;
}
renderHome();
