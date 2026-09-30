/**
 * YOUTUBE ULTRA - CORE HANDCRAFTED APPLICATION CONTROLLER
 * Full Dynamic Interactive YouTube Clone
 */

document.addEventListener("DOMContentLoaded", () => {
  // App State Initialization
  const state = {
    videos: loadStoredVideos(),
    shorts: [...INITIAL_SHORTS],
    currentVideo: null,
    currentShortIndex: 0,
    history: JSON.parse(localStorage.getItem("yt_history") || "[]"),
    watchLater: JSON.parse(localStorage.getItem("yt_watch_later") || "[]"),
    likedVideos: JSON.parse(localStorage.getItem("yt_liked") || "[]"),
    subscriptions: JSON.parse(localStorage.getItem("yt_subscriptions") || "[]"),
    activeCategory: "All",
    isDarkMode: true,
    isSidebarCollapsed: false,
    ambientEngine: null
  };

  // DOM Elements Selection
  const elements = {
    app: document.getElementById("app"),
    sidebar: document.getElementById("sidebar"),
    menuBtn: document.getElementById("menuBtn"),
    brandLogo: document.getElementById("brandLogo"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    
    // Search
    searchForm: document.getElementById("searchForm"),
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    micBtn: document.getElementById("micBtn"),
    
    // Upload & Modals
    createBtn: document.getElementById("createBtn"),
    uploadModal: document.getElementById("uploadModal"),
    closeUploadModal: document.getElementById("closeUploadModal"),
    uploadForm: document.getElementById("uploadForm"),
    
    voiceModal: document.getElementById("voiceModal"),
    closeVoiceModal: document.getElementById("closeVoiceModal"),
    
    shortcutsModal: document.getElementById("shortcutsModal"),
    closeShortcutsModal: document.getElementById("closeShortcutsModal"),
    
    // Views
    filterBar: document.getElementById("filterBar"),
    heroBanner: document.getElementById("heroBanner"),
    videoGrid: document.getElementById("videoGrid"),
    
    // Watch Page
    watchPage: document.getElementById("watchPage"),
    watchVideoPlayer: document.getElementById("watchVideoPlayer"),
    mainVideo: document.getElementById("mainVideo"),
    ambientCanvas: document.getElementById("ambientCanvas"),
    audioCanvas: document.getElementById("audioCanvas"),
    
    watchTitle: document.getElementById("watchTitle"),
    watchChannelAvatar: document.getElementById("watchChannelAvatar"),
    watchChannelTitle: document.getElementById("watchChannelTitle"),
    watchSubsCount: document.getElementById("watchSubsCount"),
    subscribeBtn: document.getElementById("subscribeBtn"),
    
    likeBtn: document.getElementById("likeBtn"),
    likeCountText: document.getElementById("likeCountText"),
    dislikeBtn: document.getElementById("dislikeBtn"),
    shareBtn: document.getElementById("shareBtn"),
    saveWatchLaterBtn: document.getElementById("saveWatchLaterBtn"),
    
    descriptionMeta: document.getElementById("descriptionMeta"),
    descriptionText: document.getElementById("descriptionText"),
    
    // Comments
    commentsCount: document.getElementById("commentsCount"),
    commentInput: document.getElementById("commentInput"),
    submitCommentBtn: document.getElementById("submitCommentBtn"),
    cancelCommentBtn: document.getElementById("cancelCommentBtn"),
    commentsList: document.getElementById("commentsList"),
    
    // Watch Sidebar
    watchSidebarVideos: document.getElementById("watchSidebarVideos"),
    
    // Shorts
    shortsNavBtn: document.getElementById("shortsNavBtn"),
    shortsPage: document.getElementById("shortsPage"),
    shortsContainer: document.getElementById("shortsContainer"),
    
    // Mini Player
    miniPlayer: document.getElementById("miniPlayer"),
    miniVideo: document.getElementById("miniVideo"),
    closeMiniPlayerBtn: document.getElementById("closeMiniPlayerBtn"),
    expandMiniPlayerBtn: document.getElementById("expandMiniPlayerBtn"),
    
    // Player Overlay Controls
    playPauseBtn: document.getElementById("playPauseBtn"),
    progressBarContainer: document.getElementById("progressBarContainer"),
    progressBarFilled: document.getElementById("progressBarFilled"),
    timeDisplay: document.getElementById("timeDisplay"),
    volumeBtn: document.getElementById("volumeBtn"),
    volumeSlider: document.getElementById("volumeSlider"),
    audioVisualizerBtn: document.getElementById("audioVisualizerBtn"),
    pipBtn: document.getElementById("pipBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    
    toastContainer: document.getElementById("toastContainer")
  };

  // Initialize Ambient Light Engine
  if (elements.mainVideo) {
    state.ambientEngine = new AmbientEngine(
      elements.mainVideo,
      elements.ambientCanvas,
      elements.audioCanvas
    );
  }

  /* ==========================================================================
     LOCAL STORAGE & SETUP
     ========================================================================== */
  function loadStoredVideos() {
    const custom = JSON.parse(localStorage.getItem("yt_custom_videos") || "[]");
    return [...custom, ...INITIAL_VIDEOS];
  }

  function saveCustomVideo(videoObj) {
    const custom = JSON.parse(localStorage.getItem("yt_custom_videos") || "[]");
    custom.unshift(videoObj);
    localStorage.setItem("yt_custom_videos", JSON.stringify(custom));
    state.videos.unshift(videoObj);
    renderHomeFeed();
    showToast("Video published to feed successfully!");
  }

  /* ==========================================================================
     ROUTING & VIEW MANAGEMENT
     ========================================================================== */
  function showHomeView() {
    elements.watchPage.classList.remove("active");
    elements.shortsPage.classList.remove("active");
    elements.heroBanner.style.display = "flex";
    elements.filterBar.parentElement.style.display = "flex";
    elements.videoGrid.style.display = "grid";

    // Pause watch video if playing and show mini player if requested
    if (elements.mainVideo && !elements.mainVideo.paused) {
      showMiniPlayer();
    }

    renderHomeFeed();
    updateActiveNavItem("home");
  }

  function showWatchView(videoId) {
    const video = state.videos.find(v => v.id === videoId) || state.videos[0];
    state.currentVideo = video;

    // Hide Mini Player if open
    hideMiniPlayer();

    // Hide Home Elements
    elements.heroBanner.style.display = "none";
    elements.filterBar.parentElement.style.display = "none";
    elements.videoGrid.style.display = "none";
    elements.shortsPage.classList.remove("active");

    // Show Watch Page
    elements.watchPage.classList.add("active");

    // Update History
    if (!state.history.includes(video.id)) {
      state.history.unshift(video.id);
      localStorage.setItem("yt_history", JSON.stringify(state.history));
    }

    // Load Video Content
    elements.mainVideo.src = video.videoUrl;
    elements.mainVideo.play().catch(() => {});

    // Details Update
    elements.watchTitle.textContent = video.title;
    elements.watchChannelAvatar.src = video.channelAvatar;
    elements.watchChannelTitle.textContent = video.channel;
    elements.watchSubsCount.textContent = `${video.subscribers} subscribers`;

    // Subscribe Button State
    updateSubscribeButtonState(video.channel);

    // Like State
    elements.likeCountText.textContent = video.likes;
    const isLiked = state.likedVideos.includes(video.id);
    elements.likeBtn.style.color = isLiked ? "var(--accent-red)" : "inherit";

    // Description
    elements.descriptionMeta.textContent = `${video.views} views • ${video.timestamp}`;
    elements.descriptionText.textContent = video.description;

    // Comments
    renderComments(video.comments || []);

    // Related Sidebar Videos
    renderWatchSidebar(video.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showShortsView() {
    elements.watchPage.classList.remove("active");
    elements.heroBanner.style.display = "none";
    elements.filterBar.parentElement.style.display = "none";
    elements.videoGrid.style.display = "none";

    elements.shortsPage.classList.add("active");
    renderActiveShort();
    updateActiveNavItem("shorts");
  }

  function updateActiveNavItem(type) {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    if (type === "home") {
      document.querySelector('[data-nav="home"]')?.classList.add("active");
    } else if (type === "shorts") {
      elements.shortsNavBtn?.classList.add("active");
    }
  }

  /* ==========================================================================
     HOME FEED RENDERING
     ========================================================================== */
  function renderHomeFeed() {
    renderFilterChips();

    let filtered = state.videos;

    if (state.activeCategory === "Liked Videos") {
      filtered = state.videos.filter(v => state.likedVideos.includes(v.id));
    } else if (state.activeCategory === "Watch Later") {
      filtered = state.videos.filter(v => state.watchLater.includes(v.id));
    } else if (state.activeCategory !== "All") {
      filtered = state.videos.filter(v => v.category === state.activeCategory);
    }

    const searchQuery = elements.searchInput.value.trim().toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchQuery) || 
        v.channel.toLowerCase().includes(searchQuery) ||
        v.category.toLowerCase().includes(searchQuery)
      );
    }

    elements.videoGrid.innerHTML = "";

    if (filtered.length === 0) {
      elements.videoGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--text-secondary);">
          <svg style="width: 64px; height: 64px; fill: var(--text-muted); margin-bottom: 16px;" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h2>No videos found</h2>
          <p style="margin-top: 8px;">Try searching for another topic or explore categories.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(video => {
      const card = document.createElement("div");
      card.className = "video-card";

      const isSaved = state.watchLater.includes(video.id);

      card.innerHTML = `
        <div class="thumbnail-container">
          <img class="thumbnail-img" src="${video.thumbnail}" alt="${video.title}" loading="lazy">
          <video class="scrub-preview" src="${video.videoUrl}" loop muted preload="none"></video>
          <div class="scrub-bar"></div>
          <span class="duration-badge">${video.duration}</span>
          <div class="card-quick-actions">
            <button class="quick-action-btn watch-later-toggle" title="${isSaved ? 'Remove from Watch Later' : 'Watch Later'}" data-id="${video.id}">
              <svg style="width:18px;height:18px;fill:currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="video-details-row">
          <div class="channel-avatar">
            <img src="${video.channelAvatar}" alt="${video.channel}">
          </div>
          <div class="video-meta">
            <h3 class="video-card-title">${escapeHTML(video.title)}</h3>
            <div class="channel-name">
              ${escapeHTML(video.channel)}
              ${video.verified ? `
                <svg class="verified-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              ` : ''}
            </div>
            <div class="stats-info">${video.views} views • ${video.timestamp}</div>
          </div>
        </div>
      `;

      // Card Click -> Open Watch View
      card.addEventListener("click", (e) => {
        if (e.target.closest(".quick-action-btn")) return;
        showWatchView(video.id);
      });

      // Hover Video Preview Scrubbing Animation
      const thumbContainer = card.querySelector(".thumbnail-container");
      const previewVideo = card.querySelector(".scrub-preview");
      const scrubBar = card.querySelector(".scrub-bar");

      let scrubTimer = null;
      thumbContainer.addEventListener("mouseenter", () => {
        scrubTimer = setTimeout(() => {
          previewVideo.classList.add("active");
          previewVideo.play().catch(() => {});
        }, 300);
      });

      thumbContainer.addEventListener("mousemove", (e) => {
        if (!previewVideo.duration) return;
        const rect = thumbContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, mouseX / rect.width));
        scrubBar.style.width = `${percent * 100}%`;
        previewVideo.currentTime = percent * previewVideo.duration;
      });

      thumbContainer.addEventListener("mouseleave", () => {
        clearTimeout(scrubTimer);
        previewVideo.classList.remove("active");
        previewVideo.pause();
        scrubBar.style.width = "0%";
      });

      // Quick Action Watch Later
      card.querySelector(".watch-later-toggle").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWatchLater(video.id);
      });

      elements.videoGrid.appendChild(card);
    });
  }

  function renderFilterChips() {
    elements.filterBar.innerHTML = "";
    CATEGORIES.forEach(cat => {
      const chip = document.createElement("button");
      chip.className = `chip ${cat === state.activeCategory ? 'active' : ''}`;
      chip.textContent = cat;
      chip.addEventListener("click", () => {
        state.activeCategory = cat;
        renderHomeFeed();
      });
      elements.filterBar.appendChild(chip);
    });
  }

  /* ==========================================================================
     WATCH PAGE & PLAYER LOGIC
     ========================================================================== */
  function renderWatchSidebar(currentId) {
    elements.watchSidebarVideos.innerHTML = "";
    const related = state.videos.filter(v => v.id !== currentId);

    related.forEach(video => {
      const item = document.createElement("div");
      item.className = "sidebar-video-card";
      item.innerHTML = `
        <div class="sidebar-thumbnail-container">
          <img class="sidebar-thumbnail-img" src="${video.thumbnail}" alt="${video.title}">
          <span class="duration-badge">${video.duration}</span>
        </div>
        <div class="sidebar-video-info">
          <h4 class="sidebar-video-title">${escapeHTML(video.title)}</h4>
          <div class="channel-name">${escapeHTML(video.channel)}</div>
          <div class="stats-info">${video.views} views</div>
        </div>
      `;

      item.addEventListener("click", () => showWatchView(video.id));
      elements.watchSidebarVideos.appendChild(item);
    });
  }

  function renderComments(comments) {
    elements.commentsCount.textContent = `${comments.length} Comments`;
    elements.commentsList.innerHTML = "";

    comments.forEach(comment => {
      const item = document.createElement("div");
      item.className = "comment-item";
      item.innerHTML = `
        <img class="comment-author-avatar" src="${comment.avatar}" alt="${comment.author}">
        <div class="comment-content">
          <div class="comment-author-name">
            ${escapeHTML(comment.author)}
            <span class="comment-time">${comment.time}</span>
          </div>
          <div class="comment-text-body">${escapeHTML(comment.text)}</div>
          <div class="comment-item-actions">
            <button class="icon-btn comment-like-btn" style="width:28px;height:28px;">
              <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>${comment.likes || 0}</span>
            </button>
            <button class="icon-btn" style="width:28px;height:28px;">
              <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L8.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
              </svg>
            </button>
            <button class="pill-btn" style="padding:4px 8px;font-size:12px;">Reply</button>
          </div>
        </div>
      `;
      elements.commentsList.appendChild(item);
    });
  }

  // Comment Submission
  elements.submitCommentBtn?.addEventListener("click", () => {
    const text = elements.commentInput.value.trim();
    if (!text || !state.currentVideo) return;

    const newComment = {
      id: "c_" + Date.now(),
      author: "You (Pro Member)",
      avatar: "images/channel-1.jpeg",
      text: text,
      time: "Just now",
      likes: 0
    };

    state.currentVideo.comments = state.currentVideo.comments || [];
    state.currentVideo.comments.unshift(newComment);
    elements.commentInput.value = "";
    renderComments(state.currentVideo.comments);
    showToast("Comment posted!");
  });

  // Custom Video Player Controls
  if (elements.mainVideo) {
    elements.playPauseBtn.addEventListener("click", togglePlayPause);
    elements.mainVideo.addEventListener("click", togglePlayPause);

    elements.mainVideo.addEventListener("timeupdate", () => {
      if (!elements.mainVideo.duration) return;
      const pct = (elements.mainVideo.currentTime / elements.mainVideo.duration) * 100;
      elements.progressBarFilled.style.width = `${pct}%`;
      elements.timeDisplay.textContent = `${formatTime(elements.mainVideo.currentTime)} / ${formatTime(elements.mainVideo.duration)}`;
    });

    elements.progressBarContainer.addEventListener("click", (e) => {
      const rect = elements.progressBarContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      elements.mainVideo.currentTime = pos * elements.mainVideo.duration;
    });

    elements.volumeSlider.addEventListener("input", (e) => {
      elements.mainVideo.volume = e.target.value;
    });

    elements.audioVisualizerBtn.addEventListener("click", () => {
      if (state.ambientEngine) {
        const isActive = state.ambientEngine.toggleAudioVisualizer();
        elements.audioVisualizerBtn.style.color = isActive ? "var(--accent-blue)" : "inherit";
        showToast(isActive ? "Audio Visualizer Activated 🎵" : "Audio Visualizer Off");
      }
    });

    elements.fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        elements.watchVideoPlayer.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  function togglePlayPause() {
    if (elements.mainVideo.paused) {
      elements.mainVideo.play();
      elements.playPauseBtn.innerHTML = `
        <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
    } else {
      elements.mainVideo.pause();
      elements.playPauseBtn.innerHTML = `
        <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  }

  /* ==========================================================================
     SHORTS VIEW RENDERING
     ========================================================================== */
  function renderActiveShort() {
    const short = state.shorts[state.currentShortIndex];
    if (!short) return;

    elements.shortsContainer.innerHTML = `
      <div class="short-card">
        <video class="short-video" src="${short.videoUrl}" loop autoplay playsinline></video>
        <div class="short-overlay-info">
          <div class="short-channel-row">
            <img class="short-channel-avatar" src="${short.channelAvatar}" alt="${short.channel}">
            <span style="font-weight:700;">${escapeHTML(short.channel)}</span>
            <button class="short-subscribe-btn">Subscribe</button>
          </div>
          <p class="short-title">${escapeHTML(short.title)}</p>
        </div>
        <div class="short-actions-sidebar">
          <div class="short-action-item">
            <button class="short-action-btn short-like-btn">
              <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
            </button>
            <span>${short.likes}</span>
          </div>
          <div class="short-action-item">
            <button class="short-action-btn">
              <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>
            <span>${short.commentsCount}</span>
          </div>
          <div class="short-action-item">
            <button class="short-action-btn">
              <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
            <span>Share</span>
          </div>
        </div>
      </div>
    `;

    // Short Like Button Toggle
    const likeBtn = elements.shortsContainer.querySelector(".short-like-btn");
    likeBtn.addEventListener("click", () => {
      likeBtn.classList.toggle("liked");
      showToast(likeBtn.classList.contains("liked") ? "Added to Liked Shorts ❤️" : "Unliked Short");
    });
  }

  /* ==========================================================================
     INTERACTIONS: SUBSCRIBE, LIKES, WATCH LATER, MINI PLAYER
     ========================================================================== */
  function updateSubscribeButtonState(channelName) {
    const isSubscribed = state.subscriptions.includes(channelName);
    if (isSubscribed) {
      elements.subscribeBtn.textContent = "Subscribed";
      elements.subscribeBtn.classList.add("subscribed");
    } else {
      elements.subscribeBtn.textContent = "Subscribe";
      elements.subscribeBtn.classList.remove("subscribed");
    }
  }

  elements.subscribeBtn?.addEventListener("click", () => {
    if (!state.currentVideo) return;
    const channel = state.currentVideo.channel;
    const idx = state.subscriptions.indexOf(channel);
    if (idx > -1) {
      state.subscriptions.splice(idx, 1);
      showToast(`Unsubscribed from ${channel}`);
    } else {
      state.subscriptions.push(channel);
      triggerConfetti();
      showToast(`Subscribed to ${channel}! 🎉`);
    }
    localStorage.setItem("yt_subscriptions", JSON.stringify(state.subscriptions));
    updateSubscribeButtonState(channel);
  });

  elements.likeBtn?.addEventListener("click", () => {
    if (!state.currentVideo) return;
    const id = state.currentVideo.id;
    const idx = state.likedVideos.indexOf(id);
    if (idx > -1) {
      state.likedVideos.splice(idx, 1);
      elements.likeBtn.style.color = "inherit";
      showToast("Removed from Liked Videos");
    } else {
      state.likedVideos.push(id);
      elements.likeBtn.style.color = "var(--accent-red)";
      showToast("Added to Liked Videos 👍");
    }
    localStorage.setItem("yt_liked", JSON.stringify(state.likedVideos));
  });

  function toggleWatchLater(videoId) {
    const idx = state.watchLater.indexOf(videoId);
    if (idx > -1) {
      state.watchLater.splice(idx, 1);
      showToast("Removed from Watch Later");
    } else {
      state.watchLater.push(videoId);
      showToast("Saved to Watch Later 🕒");
    }
    localStorage.setItem("yt_watch_later", JSON.stringify(state.watchLater));
    renderHomeFeed();
  }

  elements.saveWatchLaterBtn?.addEventListener("click", () => {
    if (state.currentVideo) {
      toggleWatchLater(state.currentVideo.id);
    }
  });

  elements.shareBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Video link copied to clipboard! 📋");
  });

  // Mini Player
  function showMiniPlayer() {
    if (!state.currentVideo) return;
    elements.miniVideo.src = elements.mainVideo.src;
    elements.miniVideo.currentTime = elements.mainVideo.currentTime;
    elements.miniVideo.play().catch(() => {});
    elements.miniPlayer.classList.add("active");
  }

  function hideMiniPlayer() {
    elements.miniVideo.pause();
    elements.miniPlayer.classList.remove("active");
  }

  elements.closeMiniPlayerBtn?.addEventListener("click", hideMiniPlayer);
  elements.expandMiniPlayerBtn?.addEventListener("click", () => {
    if (state.currentVideo) {
      showWatchView(state.currentVideo.id);
    }
  });

  /* ==========================================================================
     MODALS & HEADER EVENTS
     ========================================================================== */
  // Sidebar Toggle
  elements.menuBtn.addEventListener("click", () => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    elements.sidebar.classList.toggle("collapsed", state.isSidebarCollapsed);
    elements.app.querySelector(".content-area").classList.toggle("sidebar-collapsed", state.isSidebarCollapsed);
  });

  // Dark/Light Theme Toggle
  elements.themeToggleBtn.addEventListener("click", () => {
    state.isDarkMode = !state.isDarkMode;
    document.body.setAttribute("data-theme", state.isDarkMode ? "dark" : "light");
    showToast(state.isDarkMode ? "Dark Theme Enabled" : "Light Theme Enabled");
  });

  // Upload Video Modal
  elements.createBtn.addEventListener("click", () => {
    elements.uploadModal.classList.add("active");
  });
  elements.closeUploadModal.addEventListener("click", () => {
    elements.uploadModal.classList.remove("active");
  });

  elements.uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("upTitle").value;
    const channel = document.getElementById("upChannel").value || "Custom Creator";
    const category = document.getElementById("upCategory").value;
    const videoUrl = document.getElementById("upVideoUrl").value || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    const thumbUrl = document.getElementById("upThumbUrl").value || "images/thumbnail-1.webp";
    const desc = document.getElementById("upDesc").value;

    const newVid = {
      id: "custom_" + Date.now(),
      title,
      channel,
      channelAvatar: "images/channel-1.jpeg",
      subscribers: "10K",
      verified: true,
      thumbnail: thumbUrl,
      videoUrl: videoUrl,
      views: "1 view",
      timestamp: "Just now",
      category,
      duration: "03:45",
      likes: "1",
      dislikes: "0",
      description: desc,
      comments: []
    };

    saveCustomVideo(newVid);
    elements.uploadModal.classList.remove("active");
    elements.uploadForm.reset();
  });

  // Voice Search Simulation Modal
  elements.micBtn.addEventListener("click", () => {
    elements.voiceModal.classList.add("active");
    setTimeout(() => {
      elements.searchInput.value = "HTML & CSS";
      elements.voiceModal.classList.remove("active");
      renderHomeFeed();
      showToast("Voice search result: 'HTML & CSS'");
    }, 2500);
  });
  elements.closeVoiceModal.addEventListener("click", () => {
    elements.voiceModal.classList.remove("active");
  });

  // Search Submit & Live Search
  elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showHomeView();
  });

  elements.searchInput.addEventListener("input", () => {
    elements.clearSearchBtn.style.display = elements.searchInput.value ? "block" : "none";
    renderHomeFeed();
  });

  elements.clearSearchBtn.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.clearSearchBtn.style.display = "none";
    renderHomeFeed();
  });

  // Brand Logo Click -> Reset Home
  elements.brandLogo.addEventListener("click", () => {
    state.activeCategory = "All";
    elements.searchInput.value = "";
    showHomeView();
  });

  // Keyboard Shortcuts Modal Guide (`?`) & Hotkeys
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "k" || e.key === " ") {
      e.preventDefault();
      if (elements.watchPage.classList.contains("active")) {
        togglePlayPause();
      }
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      if (elements.watchPage.classList.contains("active")) {
        elements.fullscreenBtn.click();
      }
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      if (elements.mainVideo) {
        elements.mainVideo.muted = !elements.mainVideo.muted;
        showToast(elements.mainVideo.muted ? "Muted 🔇" : "Unmuted 🔊");
      }
    } else if (e.key === "?") {
      elements.shortcutsModal.classList.add("active");
    }
  });

  elements.closeShortcutsModal.addEventListener("click", () => {
    elements.shortcutsModal.classList.remove("active");
  });

  /* ==========================================================================
     UTILITY FUNCTIONS (TOASTS, CONFETTI, TIME FORMAT)
     ========================================================================== */
  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg style="width:20px;height:20px;fill:var(--accent-blue)" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>${escapeHTML(msg)}</span>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function triggerConfetti() {
    // Canvas confetti burst effect
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "5000";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4,
        size: Math.random() * 8 + 4,
        color: ['#ff0000', '#3ea6ff', '#ffcc00', '#2ba640'][Math.floor(Math.random() * 4)],
        life: 1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; // gravity
          p.life -= 0.02;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      });
      if (alive) requestAnimationFrame(animate);
      else canvas.remove();
    }
    animate();
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Navigation Links Binding
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      if (target === "home") showHomeView();
      else if (target === "shorts") showShortsView();
      else if (target === "liked") {
        state.activeCategory = "Liked Videos";
        showHomeView();
      } else if (target === "watch-later") {
        state.activeCategory = "Watch Later";
        showHomeView();
      }
    });
  });

  // Initial Render
  showHomeView();
});
