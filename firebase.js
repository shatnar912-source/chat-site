// ===============================
// K3-Z | firebase.js
// Layer 4 - Firebase Adapter
// ===============================

(function () {
  "use strict";

  const FirebaseAdapter = {
    ready: false,
    app: null,
    db: null,
    auth: null,
    config: null,
    hasSdk: false,

    init(config) {
      this.config = config || window.K3_FIREBASE_CONFIG || window.firebaseConfig || null;
      this.hasSdk = typeof window.firebase !== "undefined";

      // Safely handle "no Firebase SDK / no config" mode
      if (!this.hasSdk || !this.config) {
        this.ready = false;
        this.reportStatus(false);
        this.hookEvents();
        return false;
      }

      try {
        // Firebase SDK v9 compat / older style support
        if (window.firebase.apps && window.firebase.apps.length === 0) {
          this.app = window.firebase.initializeApp(this.config);
        } else if (window.firebase.apps && window.firebase.apps.length > 0) {
          this.app = window.firebase.app();
        } else {
          this.app = window.firebase.initializeApp(this.config);
        }

        this.db = window.firebase.firestore ? window.firebase.firestore() : null;
        this.auth = window.firebase.auth ? window.firebase.auth() : null;

        this.ready = true;
        this.reportStatus(true);
        this.hookEvents();
        this.applyRuntimeState();
        return true;
      } catch (err) {
        console.warn("K3 Firebase init failed:", err);
        this.ready = false;
        this.reportStatus(false);
        this.hookEvents();
        return false;
      }
    },

    reportStatus(isReady) {
      // Optional support for state manager / health monitor
      try {
        if (window.K3_HEALTH && typeof window.K3_HEALTH === "object") {
          window.K3_HEALTH.firebase = !!isReady;
        }

        if (window.K3_HEALTH_API && typeof window.K3_HEALTH_API.mark === "function" && isReady) {
          window.K3_HEALTH_API.mark("firebase");
        }

        if (window.K3_STATE && typeof window.K3_STATE.update === "function") {
          window.K3_STATE.update({
            firebase_connected: !!isReady,
            last_update: Date.now()
          });
        }

        if (window.K3Z_STATE && typeof window.K3Z_STATE.update === "function") {
          window.K3Z_STATE.update({
            firebase_connected: !!isReady,
            last_update: Date.now()
          });
        }
      } catch (_) {}
    },

    applyRuntimeState() {
      // Push a light sync state once Firebase is ready
      try {
        if (window.K3_STATE && typeof window.K3_STATE.update === "function") {
          window.K3_STATE.update({
            firebase_connected: this.ready,
            last_update: Date.now()
          });
        }

        if (window.K3Z_STATE && typeof window.K3Z_STATE.update === "function") {
          window.K3Z_STATE.update({
            firebase_connected: this.ready,
            last_update: Date.now()
          });
        }
      } catch (_) {}
    },

    hookEvents() {
      // Hook the event system if present, but keep file safe if it isn't
      const canListen = window.K3_SYSTEM && typeof window.K3_SYSTEM.on === "function";
      const canEmit = window.K3_SYSTEM && typeof window.K3_SYSTEM.emit === "function";

      if (!canListen) return;

      try {
        // Incoming message from main.js or any feature module
        window.K3_SYSTEM.on("message:send", async (message) => {
          if (!message) return;

          const saved = await this.sendMessage(message);
          if (canEmit) {
            window.K3_SYSTEM.emit("message:saved", {
              ok: saved,
              message
            });
          }
        });

        // Presence hook
        window.K3_SYSTEM.on("user:online", async (payload) => {
          await this.setOnlineUser(payload);
        });

        // Profile visit hook
        window.K3_SYSTEM.on("profile:visited", async (payload) => {
          await this.saveProfileVisit(payload);
        });
      } catch (err) {
        console.warn("K3 Firebase event hook failed:", err);
      }
    },

    async sendMessage(message) {
      // Fallback mode: store nothing if Firebase is unavailable, but keep app stable
      if (!this.ready || !this.db) {
        this.applyLocalBackup("messages", message);
        return false;
      }

      try {
        // Example collection path
        await this.db.collection("messages").add({
          ...message,
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp
            ? window.firebase.firestore.FieldValue.serverTimestamp()
            : Date.now()
        });
        return true;
      } catch (err) {
        console.warn("sendMessage failed:", err);
        this.applyLocalBackup("messages", message);
        return false;
      }
    },

    async setOnlineUser(payload) {
      if (!this.ready || !this.db) {
        this.applyLocalBackup("users_online", payload);
        return false;
      }

      try {
        const userId = String(payload?.id || payload?.uid || "anonymous");
        await this.db.collection("users_online").doc(userId).set({
          ...payload,
          updatedAt: Date.now()
        }, { merge: true });
        return true;
      } catch (err) {
        console.warn("setOnlineUser failed:", err);
        this.applyLocalBackup("users_online", payload);
        return false;
      }
    },

    async saveProfileVisit(payload) {
      if (!this.ready || !this.db) {
        this.applyLocalBackup("profile_visits", payload);
        return false;
      }

      try {
        await this.db.collection("profile_visits").add({
          ...payload,
          createdAt: Date.now()
        });
        return true;
      } catch (err) {
        console.warn("saveProfileVisit failed:", err);
        this.applyLocalBackup("profile_visits", payload);
        return false;
      }
    },

    applyLocalBackup(bucket, payload) {
      // Tiny safe fallback so the project does not break without Firebase
      try {
        const key = `K3Z_FALLBACK_${bucket}`;
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        saved.push({
          payload,
          at: Date.now()
        });
        localStorage.setItem(key, JSON.stringify(saved.slice(-50)));
      } catch (_) {}
    },

    getStatus() {
      return {
        ready: this.ready,
        hasSdk: this.hasSdk,
        hasConfig: !!this.config
      };
    }
  };

  // Auto init if config exists
  document.addEventListener("DOMContentLoaded", () => {
    FirebaseAdapter.init(window.K3_FIREBASE_CONFIG || window.firebaseConfig || null);
  });

  // Public API
  window.K3_FIREBASE = FirebaseAdapter;
})();
