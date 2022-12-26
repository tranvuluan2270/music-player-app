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
var volumePercent = 100;

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isPlaylistActive: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Starboy",
      singer: "The Weeknd",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Save Your Tears",
      singer: "The Weeknd",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Out Of Time",
      singer: "The Weeknd",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Skyline",
      singer: "Khalid",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Satellite",
      singer: "Khalid",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Qué Más Pues?",
      singer: "J Balvin, Maria Becerra",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Bandoleros",
      singer: "Don Omar, Tego Calderón",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "MIA",
      singer: "Bad Bunny, Drake",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "It's My Life",
      singer: "Bon Jovi",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.jpg",
    },
    {
      name: "Snowman",
      singer: "Sia",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.jpg",
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
    volume.oninput = function (e) {
      volumePercent = e.target.value / 100;
      audio.volume = volumePercent;
      if (volumePercent === 0) {
        volumeOn.classList.remove("block");
        volumeMute.classList.add("block");
      } else {
        volumeMute.classList.remove("block");
        volumeOn.classList.add("block");
      }
    };

    volumeOn.onclick = function () {
      volumeOn.classList.remove("block");
      volumeMute.classList.add("block");
      audio.volume = 0;
      volume.value = 0;
    };

    volumeMute.onclick = function () {
      volumeMute.classList.remove("block");
      volumeOn.classList.add("block");
      audio.volume = 1;
      volume.value = 100;
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

    // Hien thi trang thai ban dau cua button repeat & random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
    playlistBtn.classList.toggle("active", this.isPlaylistActive);
    playlist.classList.toggle("active", this.isPlaylistActive);
    dashboard.classList.toggle("active", this.isPlaylistActive);
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
