import '@mdi/font/css/materialdesignicons.css'
import Vue from "vue";
import Vuetify from "vuetify/lib";
import ar from "vuetify/lib/locale/ar";

Vue.use(Vuetify);

export default new Vuetify({
  rtl: true,
  icons: {
    iconfont: "mdi" // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
  lang: {
    locales: { ar },
    current: "ar",
  },
});
