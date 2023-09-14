import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      gVisible: {}
    }
  },
  computed: {
    gLoadings: mapGetters(['loadings']).loadings
  },
  methods: {
    changeGVisible(key, sta = true) {
      const obj = {}
      if (typeof key === 'string') {
        obj[key] = sta
      } else {
        for (const i in key) {
          obj[key[i]] = sta
        }
      }
      this.gVisible = {
        ...this.gVisible,
        ...obj
      }
    }
  }
}
