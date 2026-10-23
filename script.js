(function () {
  var canvas = document.getElementById("rain");
  var ctx = canvas.getContext("2d");
  var chars = "01ABCDEF<>/{}[]#$%&*+=-".split("");
  var size = 16;
  var drops = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var cols = Math.ceil(canvas.width / size);
    drops = [];
    for (var i = 0; i < cols; i++) {
      drops.push(Math.random() * -50);
    }
  }

  function drawRain() {
    ctx.fillStyle = "rgba(5, 3, 3, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = size + "px monospace";
    for (var i = 0; i < drops.length; i++) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.96 ? "#ff6a6a" : "#c40000";
      ctx.fillText(ch, i * size, drops[i] * size);
      if (drops[i] * size > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(drawRain, 55);
  }

  var phrases = [
    "Understand the system.",
    "Think like an attacker.",
    "Defend like a professional.",
    "Break it. Learn it. Fix it."
  ];
  var typedEl = document.getElementById("typed");
  var pIndex = 0;
  var cIndex = 0;
  var deleting = false;

  function type() {
    var current = phrases[pIndex];
    if (!deleting) {
      cIndex++;
      typedEl.textContent = current.slice(0, cIndex);
      if (cIndex === current.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
      setTimeout(type, 70);
    } else {
      cIndex--;
      typedEl.textContent = current.slice(0, cIndex);
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  type();

  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + "ms";
    revealObserver.observe(el);
  });

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("en-US");
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString("en-US");
      }
    }
    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) {
    countObserver.observe(el);
  });

  var barObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll("i").forEach(function (bar) {
            bar.style.width = bar.getAttribute("data-w") + "%";
          });
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  var skills = document.querySelector(".skills");
  if (skills) barObserver.observe(skills);

  document.querySelectorAll(".hat").forEach(function (hat) {
    hat.addEventListener("click", function () {
      var wasOpen = hat.classList.contains("open");
      document.querySelectorAll(".hat").forEach(function (h) {
        h.classList.remove("open");
      });
      if (!wasOpen) hat.classList.add("open");
    });
  });

  var sections = document.querySelectorAll("main section[id]");
  var links = document.querySelectorAll("#navLinks a");
  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (s) {
    spy.observe(s);
  });

  var termBody = document.getElementById("termBody");
  var termOut = document.getElementById("termOut");
  var termIn = document.getElementById("termIn");
  var history = [];
  var hIndex = 0;

  var commands = {
    help: [
      "Available commands:",
      "  help      show this list",
      "  about     what this site is",
      "  whoami    who you are right now",
      "  hats      the hacker hat system",
      "  history   a few hacking milestones",
      "  tips      stay safe online",
      "  ethics    the golden rule",
      "  date      current date and time",
      "  banner    show the banner",
      "  clear     clear the screen"
    ].join("\n"),
    about:
      "REDSHELL is an educational site about hacking culture and cybersecurity.\nNothing here touches a real system. It is all for learning.",
    whoami: "guest - a curious visitor with a bright future in security.",
    hats:
      "white : authorized defenders\ngrey  : unauthorized but well-meaning researchers\nblack : criminals",
    history:
      "1960s  MIT hackers\n1971   phone phreaking\n1988   Morris Worm\n1993   DEF CON\n2010s  bug bounties go mainstream",
    tips:
      "1. Unique passwords + a password manager\n2. Multi-factor authentication everywhere\n3. Update your software\n4. Think before you click\n5. Back up your data",
    ethics:
      "Never test a system without explicit written permission.\nSkill with consent is a career. Skill without it is a crime.",
    banner: [
      " ____  _____ ____  ____  _   _ _____ _     _     ",
      "|  _ \\| ____|  _ \\/ ___|| | | | ____| |   | |    ",
      "| |_) |  _| | | | \\___ \\| |_| |  _| | |   | |    ",
      "|  _ <| |___| |_| |___) |  _  | |___| |___| |___ ",
      "|_| \\_\\_____|____/|____/|_| |_|_____|_____|_____|"
    ].join("\n")
  };

  function print(text, cls) {
    var div = document.createElement("div");
    div.className = cls || "out";
    div.textContent = text;
    termOut.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function run(raw) {
    var cmd = raw.trim().toLowerCase();
    print("guest@redshell:~$ " + raw, "cmd");
    if (!cmd) return;
    history.push(raw);
    hIndex = history.length;
    if (cmd === "clear") {
      termOut.innerHTML = "";
      return;
    }
    if (cmd === "date") {
      print(new Date().toString());
      return;
    }
    if (commands[cmd]) {
      print(commands[cmd], cmd === "banner" ? "out ok" : "out");
      return;
    }
    if (cmd.indexOf("sudo") === 0) {
      print("Nice try. This guest account has no power here.");
      return;
    }
    print("command not found: " + cmd + ". Type 'help' for options.");
  }

  print(commands.banner, "out ok");
  print("Welcome, guest. Type 'help' to begin.");

  termIn.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      run(termIn.value);
      termIn.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hIndex > 0) {
        hIndex--;
        termIn.value = history[hIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex < history.length - 1) {
        hIndex++;
        termIn.value = history[hIndex];
      } else {
        hIndex = history.length;
        termIn.value = "";
      }
    }
  });

  termBody.addEventListener("click", function () {
    termIn.focus();
  });
})();
