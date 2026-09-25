(function () {
  'use strict';

  /* =============================================================
     ASCENDDEVS TEAM — ORBIT DATA
     ---------------------------------------------------------
     Add, edit, or remove a team member by editing this array
     only. Nothing else in this file needs to change — members
     are spaced evenly around the orbit automatically, however
     many there are.

     image → path to their photo. Drop real photos into
             assets/team/ and point `image` at them. Until a file
             exists at that path, a circular initials placeholder
             is shown instead — no broken image.
     name  → shown under their photo.
  ============================================================= */
  var TEAM = [
    { name: 'Frustrated Finn', image: 'assets/team/finn.jpg' },
    { name: 'Rudransh',        image: 'assets/team/rudransh.jpg' }
  ];

  var ORBIT_DURATION = 22; // seconds for one full loop

  function getInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0); })
      .join('')
      .toUpperCase();
  }

  function buildMember(data) {
    var member = document.createElement('div');
    member.className = 'orbit-member';
    member.tabIndex = 0;

    var avatar = document.createElement('span');
    avatar.className = 'orbit-member__avatar';

    var initials = document.createElement('span');
    initials.className = 'orbit-member__initials';
    initials.textContent = getInitials(data.name);
    avatar.appendChild(initials);

    if (data.image) {
      var img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      // If the placeholder file doesn't exist yet, fall back to initials
      // instead of showing a broken image icon.
      img.addEventListener('error', function () { img.remove(); });
      img.src = data.image;
      avatar.appendChild(img);
    }

    var name = document.createElement('span');
    name.className = 'orbit-member__name';
    name.textContent = data.name;

    member.appendChild(avatar);
    member.appendChild(name);
    return member;
  }

  function init() {
    var orbit = document.querySelector('.about__orbit');
    if (!orbit || !TEAM.length) return;

    var count = TEAM.length;
    TEAM.forEach(function (data, i) {
      var member = buildMember(data);
      // Evenly spaced around the loop — two members land ~180° apart,
      // three would land ~120° apart, and so on, automatically.
      var delay = -((ORBIT_DURATION / count) * i);
      member.style.setProperty('--duration', ORBIT_DURATION + 's');
      member.style.setProperty('--delay', delay.toFixed(2) + 's');
      orbit.appendChild(member);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
