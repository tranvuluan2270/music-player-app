const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const background = $("#video");
const player = $(".player");
const playlistBtn = $(".playlist-btn");
const playlist = $(".playlist");
const dashboard = $(".dashboard");
const cd = $(".cd");
const songName = $("header h2");
const songArtist = $("header p");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const volume = $("#volume");
const volumeOn = $(".volume-icon");
const volumeMute = $(".mute-icon");
const trackCurrentTime = $(".progress-time-current");
const trackDurationTime = $(".progress-time-duration");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,

  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
    currentVolume: 100,
    isUnMuted: true,
    isMuted: false,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isPlaylistActive: false,
  },
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Waltz No.2",
      singer: "Cihat Askin",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Nocturne Op. 9 No. 2",
      singer: "Alessandro Clerici, Elena Brunello",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Waltz in A minor",
      singer: "Chopin",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Mariage d'amour",
      singer: "Richard Clayderman",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Merry-Go-Round of Life",
      singer: "Joe Hisaishi",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "A Town with an Ocean View",
      singer: "Joe Hisaishi",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Reprise",
      singer: "Joe Hisaishi",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "One Summer's Day",
      singer: "Joe Hisaishi",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "Married Life",
      singer: "Michael Giacchino",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.jpg",
    },
    {
      name: "Le Festin",
      singer: "Michael Giacchino",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.jpg",
    },
    {
      name: "Raindrop Waltz No. 1",
      singer: "Joshua Kyan Aalampour",
      path: "./assets/music/song11.mp3",
      image: "./assets/img/song11.jpg",
    },
    {
      name: "Waltz Katzen Blut",
      singer: "Yuji Nomi",
      path: "./assets/music/song12.mp3",
      image: "./assets/img/song12.jpg",
    },
    {
      name: "Paris Loves Lovers",
      singer: "Cole Porter",
      path: "./assets/music/song13.mp3",
      image: "./assets/img/song13.jpg",
    },
    {
      name: "The Promise of the World",
      singer: "Yuka",
      path: "./assets/music/song14.mp3",
      image: "./assets/img/song14.jpg",
    },
    {
      name: "Vivaldi Variation",
      singer: "Florian Christl",
      path: "./assets/music/song15.mp3",
      image: "./assets/img/song15.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                        background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // Xu ly CD quay / dung
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //  10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Khi click btn playlist
    playlistBtn.onclick = function () {
      playlistBtn.classList.toggle("active");
      playlist.classList.toggle("active");
      playlist.classList.remove("non-active");
      dashboard.classList.toggle("active");
      dashboard.classList.remove("non-active");
      _this.isPlaylistActive = !_this.isPlaylistActive;
      _this.setConfig("isPlaylistActive", _this.isPlaylistActive);
    };

    // Xu ly phong to / thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xu ly khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      background.play();
    };

    // Khi song bi pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
      background.pause();
    };

    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
      // Hien thi elapsed time
      let current_minutes = Math.floor(audio.currentTime / 60);
      let current_seconds = Math.floor(
        audio.currentTime - current_minutes * 60
      );
      if (current_minutes < 10) {
        current_minutes = `0${current_minutes}`;
      }
      if (current_seconds < 10) {
        current_seconds = `0${current_seconds}`;
      }
      trackCurrentTime.innerText = `${current_minutes}:${current_seconds}`;
    };

    // Hien thi song duration
    audio.onloadedmetadata = function () {
      let duration_minutes = Math.floor(audio.duration / 60);
      let duration_seconds = Math.floor(audio.duration - duration_minutes * 60);

      if (duration_minutes < 10) {
        duration_minutes = `0${duration_minutes}`;
      }
      if (duration_seconds < 10) {
        duration_seconds = `0${duration_seconds}`;
      }
      trackDurationTime.innerText = `${duration_minutes}:${duration_seconds}`;
    };

    // Khi click next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActivesong();
    };

    // Khi click prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActivesong();
    };

    // Xu ly bat / tat random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xu ly repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xu ly next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lang nghe hanh vi click vao playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xu ly khi click vao song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xu ly khi click vao song option
        if (e.target.closest(".option")) {
        }
      }
    };

    // Xu ly khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Xu ly volume
    volumeOn.onclick = function () {
      audio.volume = 0;
      volume.value = 0;
      _this.setConfig("currentVolume", 0);
      _this.isMuted = !_this.isMuted;
      if (_this.isMuted === _this.isMuted) {
        _this.setConfig("isMuted", true);
        _this.setConfig("isUnMuted", false);
      }

      volumeOn.classList.remove("block", _this.isMuted);
      volumeMute.classList.add("block", _this.isMuted);
    };

    volumeMute.onclick = function () {
      audio.volume = 1;
      volume.value = 100;
      _this.setConfig("currentVolume", 100);
      _this.isUnMuted = !_this.isUnMuted;
      if (_this.isUnMuted === _this.isUnMuted) {
        _this.setConfig("isMuted", false);
        _this.setConfig("isUnMuted", true);
      }
      volumeMute.classList.remove("block", _this.isUnMuted);
      volumeOn.classList.add("block", _this.isUnMuted);
    };

    volume.oninput = function (e) {
      _this.currentVolume = e.target.value / 100;
      audio.volume = _this.currentVolume;
      _this.setConfig("currentVolume", _this.currentVolume * 100);

      if (_this.currentVolume === 0) {
        volumeOn.classList.remove("block");
        volumeMute.classList.add("block");
        _this.setConfig("isMuted", true);
        _this.setConfig("isUnMuted", false);
      } else {
        volumeMute.classList.remove("block");
        volumeOn.classList.add("block");
        _this.setConfig("isMuted", false);
        _this.setConfig("isUnMuted", true);
      }
    };
  },

  scrollToActivesong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    songName.textContent = this.currentSong.name;
    songArtist.textContent = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.isPlaylistActive = this.config.isPlaylistActive;
    this.currentVolume = this.config.currentVolume;
    this.isMuted = this.config.isMuted;
    this.isUnMuted = this.config.isUnMuted;

    // Hien thi trang thai da luu trong storage
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
    playlistBtn.classList.toggle("active", this.isPlaylistActive);
    playlist.classList.toggle("active", this.isPlaylistActive);
    dashboard.classList.toggle("active", this.isPlaylistActive);

    if (this.isMuted === true) {
      audio.volume = 0;
      volume.value = 0;
      volumeOn.classList.remove("block");
      volumeMute.classList.add("block");
    } else {
      audio.volume = this.currentVolume / 100;
      volume.value = this.currentVolume;
      volumeMute.classList.remove("block");
      volumeOn.classList.add("block");
    }
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Gan cau hinh tu config vao app
    this.loadConfig();

    // Dinh nghia cac thuoc tinh cho object
    this.defineProperties();

    // Lang nghe / xu ly cac su kien (DOM events)
    this.handleEvents();

    // Tai thong tin bai hat dau tien vao UI khi chay app
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
