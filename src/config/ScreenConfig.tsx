export const screenConfig = {
  home: {
    text: "idle",
    petImage: require("@/assets/images/dog/gif/dog_state_home.gif"),
    buttons: ["stats", "startActivity", "shop"],
  },

  ready: {
    text: "idle",
    petImage: require("@/assets/images/dog/gif/dog_activity_ready.gif"),
    buttons: ["back", "start"],
  },

  running: {
    text: "active",
    petImage: require("@/assets/images/dog/gif/dog_activity_running.gif"),
    buttons: ["pause", "finish"],
  },

  paused: {
    text: "active",
    petImage: require("@/assets/images/dog/gif/dog_activity_pause.gif"),
    buttons: ["continue", "finish"],
  },

  finished: {
    text: "finished",
    petImage: require("@/assets/images/dog/gif/dog_activity_done.gif"),
    buttons: ["back"],
  },
} as const;
