var usersDB=[],currentUser=null,rateLimitMap={},simDelay=0;
    var authProjectCard=document.getElementById('auth-project-card'),authModal=document.getElementById('auth-modal'),closeModalBtn=document.getElementById('auth-modal-close'),loginForm=document.getElementById('login-form'),registerForm=document.getElementById('register-form'),forgotForm=document.getElementById('forgot-form'),dashboardView=document.getElementById('dashboard-view'),logoutBtn=document.getElementById('logout-btn'),authMessage=document.getElementById('auth-message'),userNameDisplay=document.getElementById('user-name-display'),simLog=document.getElementById('sim-log');
    var tabLogin = document.getElementById('tab-login'), tabRegister = document.getElementById('tab-register'), tabForgot = document.getElementById('tab-forgot');
    var sendOtpBtn = document.getElementById('send-otp-btn'), resetPwdBtn = document.getElementById('reset-pwd-btn'), forgotEmail = document.getElementById('forgot-email'), forgotCode = document.getElementById('forgot-code'), forgotPassword = document.getElementById('forgot-password'), forgotConfirm = document.getElementById('forgot-confirm');

    function openModal(){authModal.style.display='flex';if(!currentUser){showRegister();}else{updateView();}}
    function closeModal(){authModal.style.display='none';clearMsg();if(loginForm)loginForm.reset();if(registerForm)registerForm.reset();if(forgotForm)forgotForm.reset();resetForgotUI();}
    function resetForgotUI(){if(forgotCode){forgotCode.disabled=true;forgotCode.style.border='1px dashed #555';forgotCode.style.cursor='not-allowed';}if(resetPwdBtn){resetPwdBtn.disabled=true;resetPwdBtn.style.opacity='0.5';resetPwdBtn.style.cursor='not-allowed';}if(sendOtpBtn){sendOtpBtn.innerText='Send OTP';sendOtpBtn.disabled=false;}}
    if(authProjectCard)authProjectCard.addEventListener('click',openModal);
    if(closeModalBtn)closeModalBtn.addEventListener('click',closeModal);
    if(authModal)authModal.addEventListener('click',function(e){if(e.target===authModal)closeModal();});

    function updateView(){clearMsg();if(currentUser){if(loginForm)loginForm.style.display='none';if(registerForm)registerForm.style.display='none';if(forgotForm)forgotForm.style.display='none';dashboardView.style.display='block';userNameDisplay.innerText=currentUser.name;if(tabLogin)tabLogin.parentElement.style.display='none';}else{if(tabLogin)tabLogin.parentElement.style.display='flex';showLogin();}}
    function showLogin(){clearMsg();if(registerForm)registerForm.style.display='none';if(forgotForm)forgotForm.style.display='none';dashboardView.style.display='none';if(loginForm)loginForm.style.display='block';if(tabLogin){tabLogin.classList.add('active');tabRegister.classList.remove('active');tabForgot.classList.remove('active');}}
    function showRegister(){clearMsg();if(loginForm)loginForm.style.display='none';if(forgotForm)forgotForm.style.display='none';dashboardView.style.display='none';if(registerForm)registerForm.style.display='block';if(tabRegister){tabRegister.classList.add('active');tabLogin.classList.remove('active');tabForgot.classList.remove('active');}}
    function showForgot(){clearMsg();if(loginForm)loginForm.style.display='none';if(registerForm)registerForm.style.display='none';dashboardView.style.display='none';if(forgotForm)forgotForm.style.display='block';if(tabForgot){tabForgot.classList.add('active');tabLogin.classList.remove('active');tabRegister.classList.remove('active');}}

    if(tabLogin)tabLogin.addEventListener('click',function(e){e.preventDefault();showLogin();});
    if(tabRegister)tabRegister.addEventListener('click',function(e){e.preventDefault();showRegister();});
    if(tabForgot)tabForgot.addEventListener('click',function(e){e.preventDefault();showForgot();});

    function showMsg(msg,isErr){authMessage.textContent=msg;authMessage.style.color=isErr?'#f87171':'#4ade80';}
    function clearMsg(){authMessage.textContent='';}
    function clearSim(){simLog.innerHTML='';}

    var _delay = 0;
    function d(ms){_delay+=ms;return _delay;}
    function resetDelay(){_delay=0;}

    function addEntry(badge,bc,text,tc,delay){
      setTimeout(function(){
        var row=document.createElement('div');
        row.className='sim-entry';
        row.innerHTML='<span class="sim-badge '+bc+'">'+badge+'</span><span class="sim-'+tc+'">'+text+'</span>';
        simLog.appendChild(row);
        simLog.scrollTop=simLog.scrollHeight;
      },delay);
    }
    function addDivider(delay){
      setTimeout(function(){
        var hr=document.createElement('hr');
        hr.className='sim-divider';
        simLog.appendChild(hr);
      },delay);
    }

    // ─── Pipeline builders ─────────────────────────────────────────
    // Returns the delay offset after drawing all common prefix steps

    function pipelinePublicLimit(){
      addEntry('MW','mw','PublicLimit — 100 req / 1 min (global)','text',d(0));
      addEntry('MW','mw','PublicLimit — ✓ OK','ok',d(120));
    }

    function pipelineRateLogin(ok){
      addEntry('RL','mw','LoginLimit — 5 req / 15 min per IP','text',d(80));
      if(ok){addEntry('RL','mw','LoginLimit — ✓ within window','ok',d(180));}
      else{addEntry('RL','err','LoginLimit — ✗ BLOCKED 429 Too Many Requests','fail',d(180));}
    }
    function pipelineRateRegister(ok){
      addEntry('RL','mw','RegisterLimit — 3 req / 1 min per IP','text',d(80));
      if(ok){addEntry('RL','mw','RegisterLimit — ✓ within window','ok',d(180));}
      else{addEntry('RL','err','RegisterLimit — ✗ BLOCKED 429 Too Many Requests','fail',d(180));}
    }
    function pipelineRateForgot(ok){
      addEntry('RL','mw','ForgotPasswordLimit — 5 req / 10 min per IP','text',d(80));
      if(ok){addEntry('RL','mw','ForgotPasswordLimit — ✓ within window','ok',d(180));}
      else{addEntry('RL','err','ForgotPasswordLimit — ✗ BLOCKED 429 Too Many Requests','fail',d(180));}
    }
    function pipelineRateReset(ok){
      addEntry('RL','mw','ResetPasswordLimit — 10 req / 10 min per IP','text',d(80));
      if(ok){addEntry('RL','mw','ResetPasswordLimit — ✓ within window','ok',d(180));}
      else{addEntry('RL','err','ResetPasswordLimit — ✗ BLOCKED 429 Too Many Requests','fail',d(180));}
    }

    function pipelineGuestOnly(ok){
      addDivider(d(60));
      addEntry('MW','mw','GuestOnly — checking access_token cookie','text',d(60));
      if(ok){addEntry('MW','mw','GuestOnly — ✓ no active session, allowed','ok',d(160));}
      else{addEntry('MW','err','GuestOnly — ✗ ALREADY_LOGGED_IN 401','fail',d(160));}
    }

    function pipelineJoiStart(schema){
      addDivider(d(60));
      addEntry('JOI','joi','Validate('+schema+') — parsing req.body','text',d(60));
    }

    // ─── Build pipeline from server response ──────────────────────

    function buildLoginPipeline(res, data, email, password){
      clearSim();
      resetDelay();
      const msg = (typeof data === 'string' ? data : data?.message) || '';

      pipelinePublicLimit();

      // Rate limit blocked
      if(res.status===429){
        pipelineRateLogin(false);
        return;
      }
      pipelineRateLogin(true);
      pipelineGuestOnly(true);

      pipelineJoiStart('LoginSchema');
      // Joi error — detect from message
      const isJoiEmail = !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isJoiPassShort = password && password.length < 6;
      const isJoiPassLong  = password && password.length > 16;

      if(res.status===400 && (msg.toLowerCase().includes('email')||msg.toLowerCase().includes('password must'))){
        if(isJoiEmail){
          addEntry('JOI','joi','email — ✗ invalid email format','fail',d(180));
          addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        } else if(isJoiPassShort){
          addEntry('JOI','joi','password — ✗ min 6 characters required','fail',d(180));
          addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        } else if(isJoiPassLong){
          addEntry('JOI','joi','password — ✗ max 16 characters exceeded','fail',d(180));
          addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        } else {
          addEntry('JOI','joi','✗ Validation failed — '+msg,'fail',d(180));
          addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        }
        return;
      }
      addEntry('JOI','joi','LoginSchema — ✓ email & password valid','ok',d(180));
      addDivider(d(60));

      // Controller
      addEntry('CON','db','LoginController — findOne({ email }).select(+password +rl +IsBanned +IsActive +TokenVersion)','text',d(80));

      if(res.status===401 && (msg==='Invalid Email or Password' || msg==='401')){
        // Could be user not found OR pass mismatch — server always returns same generic message (timing-safe)
        addEntry('CON','db','DB query complete — ✓','ok',d(280));
        addEntry('CON','db','bcrypt.compare(password, user.hash) — dummy compare if not found','text',d(80));
        addEntry('CON','err','✗ Invalid credentials — 401 Unauthorized','fail',d(320));
        addEntry('SEC','mw','Note: dummy hash used when user not found (timing-safe)','text',d(60));
        return;
      }

      if(res.status===401 && msg==='ALREADY_LOGGED_IN'){
        pipelineGuestOnly(false);
        return;
      }

      if(res.ok){
        addEntry('CON','db','✓ User found & active','ok',d(280));
        addEntry('CON','db','bcrypt.compare(password, user.hash) — ✓ match','ok',d(340));
        addDivider(d(60));
        addEntry('JWT','jwt','crypto.randomBytes(32) — generate JTI','text',d(80));
        addEntry('JWT','jwt','jwt.sign({ UserId, type:access, role, TokenVersion, jti }, SECRET, { expiresIn })','text',d(100));
        addEntry('JWT','jwt','✓ JWT token issued','ok',d(200));
        addEntry('CK','mw','res.cookie("access_token", token, { httpOnly, sameSite:lax, secure, maxAge })','text',d(80));
        addEntry('CK','mw','✓ Cookie set','ok',d(120));
        addEntry('CSRF','mw','CreateCsrfToken(jti) — hmac(JTI, CSRF_SECRET)','text',d(60));
        addEntry('CSRF','mw','✓ csrfToken issued','ok',d(120));
        addEntry('OK','ok','200 OK — { message: "Logged in successfully!", csrfToken }','ok',d(80));
      }
    }

    function buildRegisterPipeline(res, data, username, email, password){
      clearSim();
      resetDelay();
      const msg = (typeof data === 'string' ? data : data?.message) || '';

      pipelinePublicLimit();

      if(res.status===429){
        pipelineRateRegister(false);
        return;
      }
      pipelineRateRegister(true);
      pipelineGuestOnly(true);

      pipelineJoiStart('RegisterSchema');

      // Detect Joi errors
      const isJoiUser = !username || username.length < 4;
      const isJoiUserLong = username && username.length > 16;
      const isJoiEmail = !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isJoiPassShort = password && password.length < 6;
      const isJoiPassLong  = password && password.length > 16;

      if(res.status===400 && msg !== 'Wrong informations'){
        if(isJoiUser){
          addEntry('JOI','joi','username — ✗ min 4 characters required','fail',d(180));
        } else if(isJoiUserLong){
          addEntry('JOI','joi','username — ✗ max 16 characters exceeded','fail',d(180));
        } else if(isJoiEmail){
          addEntry('JOI','joi','email — ✗ invalid email format','fail',d(180));
        } else if(isJoiPassShort){
          addEntry('JOI','joi','password — ✗ min 6 characters required','fail',d(180));
        } else if(isJoiPassLong){
          addEntry('JOI','joi','password — ✗ max 16 characters exceeded','fail',d(180));
        } else {
          addEntry('JOI','joi','✗ Validation failed — '+msg,'fail',d(180));
        }
        addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        return;
      }
      addEntry('JOI','joi','RegisterSchema — ✓ username, email & password valid','ok',d(180));
      addDivider(d(60));

      addEntry('CON','db','RegisterController — findOne({ email }) — duplicate check','text',d(80));

      if(res.status===400 && msg==='Wrong informations'){
        addEntry('CON','db','✗ Email already registered — 400 Bad Request','fail',d(260));
        return;
      }

      if(res.ok){
        addEntry('CON','db','✓ No duplicate found','ok',d(260));
        addEntry('CON','db','bcrypt.hash(password, saltRounds=10) — hashing password','text',d(80));
        addEntry('CON','db','✓ Hash computed — $2b$10$...','ok',d(300));
        addEntry('CON','db','UserSchema.create({ username, email, password:hash })','text',d(80));
        addEntry('CON','db','✓ User saved to MongoDB','ok',d(280));
        addDivider(d(60));
        addEntry('JWT','jwt','crypto.randomBytes(32) — generate JTI','text',d(80));
        addEntry('JWT','jwt','jwt.sign({ UserId, type:access, role, TokenVersion, jti }, SECRET, { expiresIn })','text',d(100));
        addEntry('JWT','jwt','✓ JWT token issued','ok',d(200));
        addEntry('CK','mw','res.cookie("access_token", token, { httpOnly, sameSite:lax, secure, maxAge })','text',d(80));
        addEntry('CK','mw','✓ Cookie set','ok',d(120));
        addEntry('CSRF','mw','CreateCsrfToken(jti) — hmac(JTI, CSRF_SECRET)','text',d(60));
        addEntry('CSRF','mw','✓ csrfToken issued','ok',d(120));
        addEntry('OK','ok','200 OK — { message: "Registered successfully!", csrfToken }','ok',d(80));
      }
    }

    function buildForgotPipeline(res, data, email){
      clearSim();
      resetDelay();
      const msg = (typeof data === 'string' ? data : data?.message) || '';

      pipelinePublicLimit();

      if(res.status===429){
        pipelineRateForgot(false);
        return;
      }
      pipelineRateForgot(true);
      pipelineGuestOnly(true);

      pipelineJoiStart('ForgotPasswordSchema (email only)');

      const isJoiEmail = !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(res.status===400){
        if(isJoiEmail){
          addEntry('JOI','joi','email — ✗ invalid email format','fail',d(180));
        } else {
          addEntry('JOI','joi','✗ '+msg,'fail',d(180));
        }
        addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        return;
      }

      if(res.status===401 && msg==='ALREADY_LOGGED_IN'){
        addEntry('JOI','joi','✓ email valid','ok',d(180));
        pipelineGuestOnly(false);
        return;
      }

      addEntry('JOI','joi','ForgotPasswordSchema — ✓ email valid','ok',d(180));
      addDivider(d(60));
      addEntry('CON','db','ForgotPasswordController — findOne({ email }).select(+email +rl +IsBanned +IsActive)','text',d(80));
      addEntry('CON','db','✓ DB query complete','ok',d(280));
      addEntry('SEC','mw','Note: server always returns same 200 response (hides user existence)','text',d(60));

      if(res.ok){
        addEntry('CON','db','User found, active & not banned — proceeding','ok',d(100));
        addDivider(d(60));
        addEntry('CON','db','crypto.randomInt(100000, 1000000) — generate 6-digit OTP','text',d(80));
        addEntry('CON','db','crypto.createHash("sha256").update(OTP) — hash OTP for storage','text',d(120));
        addEntry('CON','db','crypto.randomBytes(32) — generate reset session ID','text',d(80));
        addEntry('CON','db','crypto.createHash("sha256").update(sessionId) — hash session ID','text',d(120));
        addEntry('CON','db','FindUser.PassResetCode = hashedOTP (expires in 10 min, max 5 attempts)','text',d(80));
        addEntry('CON','db','FindUser.save() — persisted to MongoDB ✓','ok',d(260));
        addDivider(d(60));
        addEntry('MAIL','mw','sendEmail() — OTP dispatched to user inbox','text',d(80));
        addEntry('MAIL','mw','✓ Email sent successfully','ok',d(300));
        addEntry('CK','mw','res.cookie("reset_request_id", sessionId, { httpOnly, maxAge:10min })','text',d(60));
        addEntry('CK','mw','✓ Reset session cookie set','ok',d(100));
        addEntry('OK','ok','200 OK — { message: "If this email exists, a reset code was sent" }','ok',d(80));
      }
    }

    function buildConfirmResetPipeline(res, data){
      clearSim();
      resetDelay();
      const msg = (typeof data === 'string' ? data : data?.message) || '';

      pipelinePublicLimit();

      if(res.status===429 && msg.toLowerCase().includes('many requests')){
        pipelineRateReset(false);
        return;
      }
      pipelineRateReset(true);
      pipelineGuestOnly(true);

      pipelineJoiStart('ForgotPasswordSchema (email, code, newPassword, confirmNewPassword)');

      // Joi-level issues
      const isJoiCode = msg.toLowerCase().includes('code') && res.status===400;
      const isJoiPass = (msg.toLowerCase().includes('newpassword') || msg.toLowerCase().includes('6 characters') || msg.toLowerCase().includes('16 characters')) && res.status===400;
      const isPassMismatch = msg === 'Passwords do not match' && res.status===400;

      if(isPassMismatch && res.status===400){
        addEntry('JOI','joi','✓ schema valid','ok',d(180));
        addDivider(d(60));
        addEntry('CON','err','confirmNewPassword !== newPassword — ✗ Passwords do not match — 400','fail',d(80));
        return;
      }

      if(isJoiCode){
        addEntry('JOI','joi','code — ✗ must be exactly 6 digits','fail',d(180));
        addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        return;
      }

      if(isJoiPass){
        addEntry('JOI','joi','newPassword — ✗ '+msg,'fail',d(180));
        addEntry('JOI','err','Joi.ValidationError — 400 Bad Request','fail',d(80));
        return;
      }

      addEntry('JOI','joi','ForgotPasswordSchema — ✓ all fields valid','ok',d(180));
      addDivider(d(60));

      // Session cookie check
      addEntry('CK','mw','Reading reset_request_id cookie from request','text',d(80));
      if(msg==='Reset session invalid or expired' || msg==='Reset session expired'){
        addEntry('CK','err','✗ reset_request_id cookie missing or mismatched — 400','fail',d(160));
        return;
      }
      addEntry('CK','mw','✓ reset_request_id cookie present — hashing for DB comparison','ok',d(160));

      addDivider(d(60));
      addEntry('CON','db','ConfirmForgotPasswordController — findOne({ email })','text',d(80));

      if(msg==='Invalid or expired digits code' && res.status===400){
        addEntry('CON','db','✓ User found','ok',d(260));
        addEntry('CON','db','Checking PassResetCodeExp timestamp — code still valid','ok',d(80));
        addEntry('CON','db','PassResetAttempts < 5 — checking attempt count','ok',d(80));
        addEntry('CON','db','crypto.createHash("sha256").update(code) — hashing submitted code','text',d(80));
        addEntry('CON','err','✗ Hash mismatch — invalid OTP code — attempt logged','fail',d(220));
        addEntry('CON','db','FindUser.PassResetAttempts += 1 — saved to DB','text',d(80));
        addEntry('CON','err','400 — Invalid or expired digits code','fail',d(80));
        return;
      }

      if(msg==='Expired digits code'){
        addEntry('CON','db','✓ User found','ok',d(260));
        addEntry('CON','err','✗ PassResetCodeExp < now — OTP has expired','fail',d(160));
        addEntry('CON','db','Clearing PassResetCode, PassResetCodeExp, PassResetAttempts, PassResetReqId','text',d(80));
        addEntry('CON','db','FindUser.save() — reset data wiped','ok',d(200));
        addEntry('CK','mw','res.clearCookie("reset_request_id")','text',d(60));
        addEntry('CON','err','400 — Expired digits code','fail',d(80));
        return;
      }

      if(res.status===429 && msg.toLowerCase().includes('many invalid')){
        addEntry('CON','db','✓ User found','ok',d(260));
        addEntry('CON','db','PassResetAttempts >= 5 — limit reached','text',d(80));
        addEntry('CON','err','✗ Max OTP attempts exceeded — code invalidated','fail',d(160));
        addEntry('CON','db','Clearing all reset fields — FindUser.save()','text',d(80));
        addEntry('CK','mw','res.clearCookie("reset_request_id")','text',d(60));
        addEntry('CON','err','429 — Too many invalid attempts. Please request a new reset code','fail',d(80));
        return;
      }

      if(res.ok){
        addEntry('CON','db','✓ User found, active & not banned','ok',d(260));
        addEntry('CON','db','PassResetCodeExp > now — ✓ OTP not expired','ok',d(80));
        addEntry('CON','db','PassResetAttempts < 5 — ✓ within attempt limit','ok',d(80));
        addEntry('CON','db','crypto.createHash("sha256").update(code) — hashing submitted code','text',d(80));
        addEntry('CON','db','✓ Hash matches stored PassResetCode','ok',d(200));
        addDivider(d(60));
        addEntry('CON','db','bcrypt.hash(newPassword, saltRounds=10) — hashing new password','text',d(80));
        addEntry('CON','db','✓ New password hash computed','ok',d(300));
        addEntry('CON','db','FindUser.password = newHash','text',d(60));
        addEntry('CON','db','FindUser.PassResetCode/Exp/Attempts/ReqId = undefined — cleared','text',d(60));
        addEntry('CON','db','FindUser.PassChangedAt = now — session invalidation marker','text',d(60));
        addEntry('CON','db','FindUser.TokenVersion += 1 — invalidates all existing JWTs','text',d(60));
        addEntry('CON','db','FindUser.save() — ✓ persisted to MongoDB','ok',d(280));
        addEntry('CK','mw','res.clearCookie("reset_request_id") — session cleaned up','text',d(60));
        addEntry('OK','ok','200 OK — { message: "Password changed successfully" }','ok',d(80));
      }
    }

    // ─── Form handlers ─────────────────────────────────────────────

    if(registerForm)registerForm.addEventListener('submit',async function(e){
      e.preventDefault();
      var name=document.getElementById('reg-name').value.trim(),email=document.getElementById('reg-email').value.trim(),password=document.getElementById('reg-password').value;
      clearSim();
      addEntry('REQ','mw','→ POST /api/auth/register','text',0);
      try{
        const res=await fetch('https://store-eznk.onrender.com/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:name,email,password}),credentials:'include'});
        const data=await res.json().catch(()=>res.text().then(t=>t));
        buildRegisterPipeline(res,data,name,email,password);
        if(!res.ok){showMsg((typeof data==='string'?data:data?.message)||'Registration failed',true);}
        else{showMsg('Registration successful! Please login.');setTimeout(function(){registerForm.reset();showLogin();},1800);}
      }catch(err){clearSim();addEntry('ERR','err','Network error — could not reach server','fail',0);showMsg('Network error',true);}
    });

    if(loginForm)loginForm.addEventListener('submit',async function(e){
      e.preventDefault();
      var email=document.getElementById('login-email').value.trim(),password=document.getElementById('login-password').value;
      clearSim();
      addEntry('REQ','mw','→ POST /api/auth/login','text',0);
      try{
        const res=await fetch('https://store-eznk.onrender.com/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password}),credentials:'include'});
        const data=await res.json().catch(()=>res.text().then(t=>t));
        buildLoginPipeline(res,data,email,password);
        if(!res.ok){showMsg((typeof data==='string'?data:data?.message)||'Login failed',true);}
        else{currentUser={email,name:email.split('@')[0]};showMsg('Login successful!');setTimeout(function(){updateView();loginForm.reset();},1800);}
      }catch(err){clearSim();addEntry('ERR','err','Network error — could not reach server','fail',0);showMsg('Network error',true);}
    });

    if(logoutBtn)logoutBtn.addEventListener('click',function(){
      currentUser=null;
      clearSim();
      resetDelay();
      addEntry('CK','mw','Clearing local session state','text',d(0));
      addEntry('OK','ok','Logged out locally','ok',d(200));
      updateView();
      showMsg('Logged out.');
    });

    if(sendOtpBtn){
      sendOtpBtn.addEventListener('click',async function(e){
        e.preventDefault();
        var email=forgotEmail.value.trim();
        if(!email){showMsg('Please enter email first',true);return;}
        clearSim();
        addEntry('REQ','mw','→ POST /api/auth/forgot-password','text',0);
        sendOtpBtn.innerText='Sending...';
        sendOtpBtn.disabled=true;
        try{
          const res=await fetch('https://store-eznk.onrender.com/api/auth/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email}),credentials:'include'});
          const data=await res.json().catch(()=>res.text().then(t=>t));
          buildForgotPipeline(res,data,email);
          sendOtpBtn.innerText='Get OTP';
          sendOtpBtn.disabled=false;
          if(!res.ok){
            showMsg((typeof data==='string'?data:data?.message)||'Failed to send OTP',true);
          }else{
            showMsg('OTP sent! Check your email.',false);
            forgotCode.disabled=false;
            forgotCode.style.border='1px solid #2a2a2a';
            forgotCode.style.cursor='text';
            resetPwdBtn.disabled=false;
            resetPwdBtn.style.opacity='1';
            resetPwdBtn.style.cursor='pointer';
          }
        }catch(err){
          sendOtpBtn.innerText='Get OTP';
          sendOtpBtn.disabled=false;
          clearSim();
          addEntry('ERR','err','Network error — could not reach server','fail',0);
          showMsg('Network error',true);
        }
      });
    }

    if(forgotForm){
      forgotForm.addEventListener('submit',async function(e){
        e.preventDefault();
        var email=forgotEmail.value.trim(),code=forgotCode.value.trim(),newPassword=forgotPassword.value,confirmNewPassword=forgotConfirm.value;
        clearSim();
        addEntry('REQ','mw','→ POST /api/auth/confirm-forgot-password','text',0);
        resetPwdBtn.innerText='Resetting...';
        resetPwdBtn.disabled=true;
        try{
          const res=await fetch('https://store-eznk.onrender.com/api/auth/confirm-forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code,newPassword,confirmNewPassword}),credentials:'include'});
          const data=await res.json().catch(()=>res.text().then(t=>t));
          buildConfirmResetPipeline(res,data);
          resetPwdBtn.innerText='Reset Password';
          resetPwdBtn.disabled=false;
          if(!res.ok){
            showMsg((typeof data==='string'?data:data?.message)||'Failed to reset password',true);
          }else{
            showMsg('Password reset successfully! Please login.',false);
            setTimeout(function(){forgotForm.reset();resetForgotUI();showLogin();},1800);
          }
        }catch(err){
          resetPwdBtn.innerText='Reset Password';
          resetPwdBtn.disabled=false;
          clearSim();
          addEntry('ERR','err','Network error — could not reach server','fail',0);
          showMsg('Network error',true);
        }
      });
    }