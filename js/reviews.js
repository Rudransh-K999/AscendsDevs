(function () {
  'use strict';

  /* =============================================================
     CUSTOMER FEEDBACK — REVIEW DATA
     ---------------------------------------------------------
     Add, edit, or remove a review by editing this array only.
     Nothing else in this file needs to change.

     image  → path to the customer's photo. Drop real photos into
              assets/reviews/ and point `image` at them. Until a
              file exists at that path, the card automatically
              shows a set of initials instead — no broken image.
     name   → shown next to the photo.
     review → the review text (long text is clipped to 3 lines).
  ============================================================= */
  var REVIEWS = [
    {
      image: 'assets/reviews/customer-1.jpg',
      name: 'Bhupesh YT',
      review: '"AscendsDevs did a great job setting up my server and even helped with some additional things after the job was done. Highly recommended!"'
    },
    {
      image: 'assets/reviews/customer-2.jpg',
      name: 'GOD IV YT',
      review: '"2 Discord server setup by AscendDevs, Nice work!"'
    },
    {
      image: 'assets/reviews/customer-3.jpg',
      name: 'Rock / Graphic Designer',
      review: '"discord setup by AscendDevs, Nice Work."'
    },
    {
      image: 'assets/reviews/customer-4.jpg',
      name: 'Flexxy / Customer',
      review: '"Best Discord Setup with Moderation, Highly Recommended!"'
    },
    {
      image: 'assets/reviews/customer-5.jpg',
      name: 'R♡ozzieee🌺',
      review: '"W Minecraft Animation!!"'
    },
    {
      image: 'assets/reviews/customer-6.jpg',
      name: 'Mate_007',
      review: '"W Discord Setup with Moderation and Roles, Highly Recommended!"'
    }
  ];

  /* How many lanes to spread reviews across, and roughly how many
     seconds a card takes to cross the screen. Both are cosmetic —
     changing them doesn't require touching anything else. */
  var LANE_COUNT = 2;
  var BASE_DURATION = 26;

  function getInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(function (word) { return word.charAt(0); })
      .join('')
      .toUpperCase();
  }

  function buildCard(data) {
    var card = document.createElement('article');
    card.className = 'review-card';
    card.tabIndex = 0;

    var profile = document.createElement('div');
    profile.className = 'review-card__profile';

    var avatar = document.createElement('span');
    avatar.className = 'review-card__avatar';

    var initials = document.createElement('span');
    initials.className = 'review-card__avatar-initials';
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
    name.className = 'review-card__name';
    name.textContent = data.name;

    profile.appendChild(avatar);
    profile.appendChild(name);

    var text = document.createElement('p');
    text.className = 'review-card__text';
    text.textContent = data.review;

    card.appendChild(profile);
    card.appendChild(text);
    return card;
  }

  function init() {
    var lanes = document.querySelectorAll('.feedback__lane');
    if (!lanes.length || !REVIEWS.length) return;

    var laneCount = Math.min(LANE_COUNT, lanes.length) || 1;
    var perLane = [];
    var i;
    for (i = 0; i < laneCount; i++) perLane.push([]);
    REVIEWS.forEach(function (review, idx) {
      perLane[idx % laneCount].push(review);
    });

    lanes.forEach(function (lane, laneIndex) {
      var items = perLane[laneIndex] || [];
      var count = items.length;
      if (!count) return;

      // Slightly different duration per lane so lanes don't move in sync.
      var duration = BASE_DURATION + laneIndex * 5;

      items.forEach(function (data, idx) {
        var card = buildCard(data);
        // Negative delays stagger each card's starting point along its
        // own loop, so the section looks naturally in-motion immediately
        // instead of every card launching from the same spot at once.
        var delay = -((duration / count) * idx + laneIndex * (duration / (count * 2)));
        card.style.setProperty('--duration', duration + 's');
        card.style.setProperty('--delay', delay.toFixed(2) + 's');
        lane.appendChild(card);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
