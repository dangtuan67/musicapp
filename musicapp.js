const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const toActive = $('.song.active')
const playlist = $('.playlist')
const app = {
    songs: [
        {
            name: 'Baby',
            singer: 'Justin bieber',
            path: './assets/songs/song1.mp3',
            img: './assets/img/img1.png'
        },
        {
            name: 'Qua dem nay',
            singer: 'Ha Anh Tuan',
            path: './assets/songs/song2.mp3',
            img: './assets/img/img2.jpg'
        },
        {
            name: 'Mua roi lang tham',
            singer: 'M4U',
            path: './assets/songs/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'Anh da quen vo co don',
            singer: 'Sobin',
            path: './assets/songs/song4.mp3',
            img: './assets/img/img4.jpg'
        },
        {
            name: 'Neu ngay ay',
            singer: 'Sobin',
            path: './assets/songs/song5.mp3',
            img: './assets/img/img5.jpg'
        }
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    render: function() {
       const htmls = this.songs.map((song, index) =>{
        return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <div class="thumb" 
          style="background-image: url('${song.img}');">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="ti-more-alt"></i>
        </div>
    </div>`
       })
       playlist.innerHTML = htmls.join('')
    },


    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },


    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xu ly dia quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xu ly phong to/thu nho
        document.onscroll = function() {
         const scrollTop = document.documentElement.scrollTop
         const newCdWidth = cdWidth - scrollTop
         cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0
         cd.style.opacity = newCdWidth/cdWidth
       }
        // Xu ly khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
            audio.onplay = function(){
                player.classList.add('playing')
                _this.isPlaying = true
                cdThumbAnimate.play()
            }
            audio.onpause = function(){
                player.classList.remove('playing')
                _this.isPlaying = false
                cdThumbAnimate.pause()
            }
        } 
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime/audio.duration * 100))
                progress.value = progressPercent
            }
        }

        // Khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function(){
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }  
            audio.play()  
            _this.render()
            _this.toActivesong()
        }

        // // Khi Prev song
        prevBtn.onclick = function(){
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }  
            audio.play()
            _this.render()
            _this.toActivesong()

        }

        // Khi random song
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Khi repeat song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Khi song ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Khi clicksong
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')
            if ( songNode || optionNode ) {
                _this.currentIndex = Number(songNode.getAttribute('data-index'))
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }

        
    },


    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
        
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    toActivesong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block : 'nearest',
            })
        }, 500)
    },



    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()