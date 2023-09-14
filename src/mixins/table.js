export default {
  data() {
    return {
      gTable: {
        attr: { stripe: true },
        columns: [],
        total: 0,
        list: [],
        query: {},
        listQuery: {
          page: 1,
          limit: 10
        }
      }
    }
  }
}
