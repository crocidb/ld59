// Text utils
const repltxt = (t, vs) => {
  vs.forEach((e, i) => (t = t.replace("%" + (i + 1), e)));
  return t;
};

// Math utils
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const clamp01 = (val) => clamp(val, 0, 1);
const lerp = (a, b, t) => a + (b - a) * clamp01(t);
const smoothstep = (v1, v2, x) => {
  x = clamp((x - v1) / (v2 - v1), 0.0, 1.0);
  return x * x * x * (x * (6.0 * x - 15.0) + 10.0);
};

// Array utils
const rangeArray = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Randoms
const randnum = (v = 1) => Math.random() * v;
const randrange = (n1, n2) => n1 + randnum(n2 - n1);
const randint = (v) => Math.round(randnum(v));
const randsig = () => (randint(10) % 2 == 0 ? 1 : -1);
const randweight = (c, p) => {
  let sum = c.map(p).reduce((l, r) => l + r);
  let rand = randint(sum);
  return c.filter((e) => {
    rand = rand - p(e);
    return rand <= 0;
  })[0];
};
const randweightsqrd = (c, p) => randweight(c, (v) => p(v) * p(v));

// Coroutine
const co = (f) => {
  let g = f();

  const next = () => {
    let result = g.next();
    if (!result.done) {
      setTimeout(next, result.value * 1000);
    }
  };

  next();
};

// Mobile
const mobile = () => navigator.userAgent.match("Mobile");

// Audio stuff
let AUDIO = true;
let AUDIO_VOLUME = 10.0;
const SFX_VOLUME = 0.01;
const playaudiodelay = (a, d) => {
  setTimeout(() => playaudio(a), d);
};
const playaudio = (a) => {
  if (AUDIO) {
    if (!("count" in a)) a["count"] = 0;
    else a["count"] = (a["count"] + 1) % a.length;

    let sound = sfxr.toAudio(a[a.count]);
    sound.setVolume(AUDIO_VOLUME * SFX_VOLUME);
    sound.play();
  }
};

const AUDIO_DATA = {
  emit0: [
    "79KvwJHokTYomwrKRdULCXvqfbamneryTDRLtJreeX3nM4cxR5HbKPVTtvrEzAZdU3VfsR4gZ5rwhJyRwHwDzxMndTp9hEr4sQZ9Q61azrdK4Fu4bcCsV7rJK",
  ],
  emit1: [
    "79KvwJHokTYomwrKRdULCXuyGUYHpLsEhdXZ7PG9WjY21iXSjJiD47KgQrvqTnNHkjhddKrMH1pgxqnxet4AEwpGDp8BRKu6HuLWTKxak4RNTR3QbWPoLSxo1",
  ],
  emit2: [
    "79KvwJHokTYomwrKRdULCXv3ynEWTYWS492WJAhAzhnmBxZi4qCUQxB7SDn2vKPmjgC1AC9tw9H7SwZpMARG2gJtZwXzLoQS1BvQ7wRVAdPyjJxQaGWDzYsnX",
  ],
  hit: [
    "7xZZDfJMABgRXRVQqwA7Ht1WbkHpnVAMuwYzibwPhTMmBoxaJLZKzCszs3m7kjLd59XaT47eWrsAbW7jmKJxd19aB3JsdHRfF9Vr53E4oAWbEa81jUHaVZDeF",
    "7xZZDfJMABgRXRVQqwA7HsyywjTFMM4DYy5cdnEzJkkARbZtHatoNijEpmHr8vr6dBa3pm55jy41Yro5Ki4hg6YYiEE17rzZY2jhM7mdU7nxKGy5PZzwMzK6o",
    "7xZZDfJMABgRXRVQqwA7HszeD32DJVxjP5ezvW3CzPwYKfacUs7FRPkAhLf6aZ7uYJ8ETBNYkoMKzL9radF3x1kJxstybBYDj2eBMk5Q1yQ1ACCu6P5XcguRy",
  ],
  destroy: [
    "7BMHBGQJJ9TJ7ZhS1xaPK9mxeEBv2o6kpzazrqTTqraeya4zy7uYVXjM8eMuPG8fijKgrGBTzchoavcA9NyqVA37EbsEy5wDPVXZK9A4xT4X5R47AzTg5iRom",
    "7BMHBGQJJ9TJ7ZhS1xaPK9p7jM57QQ4XxFPB85Xgfskt79viK6qECJAFQV5V3CLk9GsAVHdRQgrQJVP7HxfhpLnBcgksphVpt7Y8UsVV73asBcxyH1rbX1EbR",
  ],
  swap: [
    "71hYbwbKMvRBGhuuKzZzfffx79QMJJAEpENE3kmQ7SFhitwpHRWrP36sYqZ4SmdHJrL9SiQhLDKEorjBNjMF91diZ9LdV1NtLxiWvxrcBK8reMWNoSpbd7Zfu",
    "71hYbwbKMvRBGhuuKzZzfffU878JkrmCFE3qoSk13JbVvzDWwWQgbfWgRKoHkt3D5oJ4odXSMgLzFrtz1n9YWdA9YHPKWo2Q5RLJbqxw3AVWT6fvWtEYsA3YB",
    "71hYbwbKMvRBGhuuKzZzffdFV6b2vn7zp5nmNDtJkb3721iXyrNRcBfwNhhd1hFbcEiWtvKppCRCqR31mtPu3fsSUU3CbPwMGw2UteykPWx5AHpLYPXy947HH",
  ],
  shoot: [
    "7BMHBGPyPrwEeKXKciwjcPziBQsBwFEMU9YKMGAFvoh5itYxMUffveBHZE3FP6z2eKz3jwakBqyi9Ax8NxDf92uYe7cyrmMYAa3ZhSA264VDoQqSFyy7nobVZ",
    "7BMHBGPyPrwEeKXKcsTxSBL8g49ppXGF8td5tURVvzLCwrTp4yMdGBMBCSwdz5txLGa9v2sraZm8fjrDc7bFqBj8DgvQspfs47aJZh8wk7s4ExRNqp5kby1fd",
    "7BMHBGPyPrwEeKXKcsTxSBL8g49ppXGF8td5tURVvzLCwrTp4yMdGBMBCSwdz5txLGa9v2sraZm8fjrDc7bFqBj8DgvQsrVWmYhqT5ggREkkXGZsF2CeyZnX1",
  ],
  shoot_deep: [
    "57uBnWUQ6mM5LxEu8N8FuifG1E1aBWPUMt4AYLYWHpshXBcu3acFcUCgnRAQeud4B8wJKrhkXD8i3A7HSiuT91rAMoYuAQpA25sqAkmgNYnYnwtLF9wnHoqo5",
  ],
  absorb: [
    "5n2k2MJ8WLH8mpnfsc9pW6HYeFyyfJh7zFc6xQsRrP5G4zk1FoPYdRn1Rzu9PV6S7xsrMPExjTBpovRP5exhhiSiXYVr2GvNQxYcKCKL4ZD4uwSTNPghRjubm",
  ],
  move: [
    "7isEKpUAssFzWaERKoAzVf8co4RFBSQPZWLJJxpPzhtJTNgx92ZeJqZ1SWQn2QBE7yUKqFAy8KqWRuyYuY5QpQYFX4WPaFq2vSVv7oE17R9UzhtcZQX7jtXBm"
  ],
  rotate: [
    "58uruJViyHq1nYLGf5dg1NiV3Uti6ch9Lak8LzPaxdj1PxB9dJCu4FqyBUmJ34Lm3xtmUVGtNgUDJ6HsQbXnpfMKmeSqksQWUuXFUmLMtbfy8zDZuqR4WP5Us"
  ]
};

const play = (aname) => playaudio(AUDIO_DATA[aname]);

export {
  repltxt,
  clamp,
  clamp01,
  lerp,
  smoothstep,
  rangeArray,
  shuffleArray,
  randnum,
  randrange,
  randint,
  randsig,
  randweight,
  randweightsqrd,
  co,
  mobile,
  AUDIO,
  AUDIO_VOLUME,
  SFX_VOLUME,
  playaudiodelay,
  playaudio,
  play,
};
