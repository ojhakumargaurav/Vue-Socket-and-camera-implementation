<template>
  <v-app id="inspire">
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Analyse Video</v-toolbar-title>
      <v-radio-group v-model="module_selected" row>
        <v-radio
          v-for="n in supported_modules"
          :key="n.id"
          :label="n.label"
          :value="n.value"
        ></v-radio>
      </v-radio-group>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col>
            <videoComponent :moduleSelected="module_selected" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import videoComponent from "../components/VideoComponent";
export default {
  name: "Home",
  components: { videoComponent },

  data: () => ({
    drawer: null,
    is_connected: false,
    downloadUrl: "",
    module_selected: "yolo",
    supported_modules: [
      { id: 1, label: "Recognize Face", value: "recognize_face" },
      { id: 2, label: "Run Yolov4", value: "yolo" },
    ],
  }),
  methods: {},
};
</script>