<template>
  <div id="app">
    <v-row class="row">
      <v-col class="col">
        <video ref="camera_video" crossorigin="anonymous" controls class="video_class" />
      </v-col>
      <v-col>
        <video ref="analysed_video" crossorigin="anonymous" controls class="video_class" />
      </v-col>
    </v-row>
    <v-row>
      <v-btn
        :loading="loading3"
        :disabled="loading3"
        color="blue-grey"
        class="ma-2 white--text"
        @click="start_camera_recording()"
      >
        Start Camera Recording
        <v-icon right dark>mdi-cloud-upload</v-icon>
      </v-btn>
      <v-btn
        :loading="loading3"
        :disabled="loading3"
        color="blue-grey"
        class="ma-2 white--text"
        @click="stop_camera_recording"
      >
        Stop and analyse
        <v-icon right dark>mdi-cloud-upload</v-icon>
      </v-btn>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "VideoComponent",
  data() {
    return {
      isConnected: false,
      socketMessage: "",
      recorded_chunks: [],
      mediaRecorder: {},
      is_started: false,
      chunks: [],
      loading3: false,
      downloadUrl: "",
      stream: {},
    };
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      console.log("connected to socket");
    },

    disconnect() {
      this.isConnected = false;
    },
    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
      console.log(this.socketMessage);
    },
    send_video(data) {
      var fullBlob = new Blob([data], { type: "video/webm" });
      this.downloadUrl = window.URL.createObjectURL(fullBlob);
      console.log(this.downloadUrl);
      this.$refs.analysed_video.src = this.downloadUrl;
      this.$refs.analysed_video.load();
      this.$refs.analysed_video
        .play()
        .then(() => {
          console.log("playing");
        })
        .catch((err) => {
          console.log(err);
        });
      // this.$refs.video.src = this.downloadUrl;
      // if (this.is_started) {
      //   // this.$refs.video.pause()
    },
  },

  mounted() {},

  methods: {
    start_camera_recording() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          // var options = { mimeType: "video/webm;codecs=vp9" };
          // this.stream = stream;

          var options = { mimeType: "video/webm", bitsPerSecond: 1000 };
          this.mediaRecorder = new MediaRecorder(stream, options);

          this.mediaRecorder.addEventListener(
            "dataavailable",
            (e) => {
              if (e.data && e.data.size > 0) {
                console.log("got it");
                this.chunks.push(e.data);
              }
            },
            true
          );
          // this.start_media_recorder(stream);
          this.mediaRecorder.start(100);
          this.$refs.camera_video.srcObject = stream;
          this.$refs.camera_video.play();
        });
      }
    },
    stop_camera_recording() {
      this.mediaRecorder.stop();

      this.send_packets();
      // this.stream.getTracks()[0].stop();
      this.$refs.camera_video.pause();
      this.loading3 = true;
    },
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit("pingServer", "PING!");
    },
    send_packets() {
      // this.mediaRecorder.stop();
      var fullBlob = new Blob(this.chunks, { type: "video/webm" });
      console.log(fullBlob);
      this.$socket.emit("video_frame", fullBlob);
    },
  },
};
</script>
<style scoped>
.row {
  width: 100%;
  height: 100%;
}
.col {
  width: 40%;
  height: 80%;
  padding-right: 5%;
}
.video_class {
  height: 100%;
  width: 100%;
}
</style>