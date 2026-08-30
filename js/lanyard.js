/**
 * ==========================================================================
 * LANYARD DISCORD REALTIME INTEGRATION (WEBSOCKET + REST)
 * Discord User ID: 765917032281276426
 * ==========================================================================
 */

(function () {
  const config = window.PORTFOLIO_CONFIG || {};
  const DISCORD_USER_ID = config.discord?.userId || '765917032281276426';
  const LANYARD_REST_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
  const LANYARD_WS_URL = 'wss://api.lanyard.rest/socket';

  let socket = null;
  let heartbeatInterval = null;

  // DOM Elements
  const avatarImg = document.getElementById('avatarImg');
  const avatarDec = document.getElementById('avatarDecoration');
  const statusDot = document.getElementById('discordStatusDot');
  const statusBadge = document.querySelector('.status-badge span:last-child');

  /**
   * Updates DOM with fresh Lanyard data
   * @param {Object} data - Lanyard presence data
   */
  function updatePresenceUI(data) {
    if (!data) return;

    const { discord_user, discord_status, activities, spotify, avatar_decoration_data } = data;

    // 1. Update Discord Avatar directly via Lanyard API
    if (avatarImg && discord_user) {
      let avatarUrl = '';
      if (discord_user.avatar) {
        const isGif = discord_user.avatar.startsWith('a_');
        const ext = isGif ? 'gif' : 'png';
        avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${ext}?size=256`;
      } else {
        const defaultIndex = (BigInt(discord_user.id) >> 22n) % 6n;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
      }
      if (avatarUrl && avatarImg.src !== avatarUrl) {
        avatarImg.src = avatarUrl;
      }
    }

    // 2. Update Discord Avatar Decoration Preset
    if (avatarDec) {
      if (avatar_decoration_data && avatar_decoration_data.asset) {
        const decUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${avatar_decoration_data.asset}.png?size=256`;
        if (avatarDec.src !== decUrl) {
          avatarDec.src = decUrl;
        }
        avatarDec.style.display = 'block';
      } else {
        avatarDec.style.display = 'none';
      }
    }

    // 3. Update Status Dot & Streaming Detection
    const streamingActivity = activities ? activities.find((act) => act.type === 1) : null;

    if (statusDot) {
      if (streamingActivity) {
        statusDot.className = 'discord-status-dot streaming';
        statusDot.setAttribute('title', `Discord: Streaming ${streamingActivity.name || 'Live'}`);
      } else if (discord_status) {
        statusDot.className = `discord-status-dot ${discord_status}`;
        const statusMap = {
          online: 'Online',
          idle: 'Idle',
          dnd: 'Do Not Disturb',
          offline: 'Offline',
        };
        const statusLabel = statusMap[discord_status] || discord_status;
        statusDot.setAttribute('title', `Discord: ${statusLabel}`);
      }
    }

    // 4. Update Status Badge for Streaming
    if (statusBadge) {
      const badgeContainer = statusBadge.closest('.status-badge');
      if (streamingActivity) {
        if (badgeContainer) badgeContainer.classList.add('streaming');
        const streamTitle = streamingActivity.name ? `Streaming ${streamingActivity.name}` : 'Streaming Live';
        statusBadge.textContent = streamTitle;
      } else {
        if (badgeContainer) badgeContainer.classList.remove('streaming');
        statusBadge.textContent = 'Available for projects';
      }
    }
  }

  /**
   * Fallback: REST API Fetch
   */
  async function fetchREST() {
    try {
      const res = await fetch(LANYARD_REST_URL);
      const json = await res.json();
      if (json && json.success && json.data) {
        updatePresenceUI(json.data);
      }
    } catch (err) {
      console.warn('[Lanyard] REST Fallback error:', err);
    }
  }

  /**
   * Realtime WebSocket Connection
   */
  function connectWebSocket() {
    try {
      socket = new WebSocket(LANYARD_WS_URL);

      socket.onopen = () => {
        console.log('[Lanyard] Connected to real-time gateway');
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { op, d, t } = message;

          // Opcode 1: Hello -> Initialize Heartbeat & Subscribe
          if (op === 1) {
            const interval = d.heartbeat_interval;
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            heartbeatInterval = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ op: 3 }));
              }
            }, interval);

            // Subscribe to our Discord User ID
            socket.send(
              JSON.stringify({
                op: 2,
                d: {
                  subscribe_to_id: DISCORD_USER_ID,
                },
              })
            );
          }

          // Opcode 0: Event (INIT_STATE or PRESENCE_UPDATE)
          if (op === 0) {
            if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
              updatePresenceUI(d);
            }
          }
        } catch (err) {
          console.error('[Lanyard] Socket message parse error:', err);
        }
      };

      socket.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        console.warn('[Lanyard] Socket closed. Reconnecting in 5s...');
        setTimeout(connectWebSocket, 5000);
      };

      socket.onerror = () => {
        if (socket) socket.close();
      };
    } catch (err) {
      console.error('[Lanyard] Socket connection error:', err);
      setTimeout(connectWebSocket, 5000);
    }
  }

  // Initialize REST first for immediate load, then connect WebSocket for 0ms realtime updates
  fetchREST();
  connectWebSocket();
})();
