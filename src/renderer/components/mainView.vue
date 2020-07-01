<template lang="pug">
    el-container
        el-row
            side-in(@selected="selectedIn")
            mapping-view(
                :data_="data_"
                :input="input"
                :output="output"
                :options="options"
                :table="table"
                )
            side-out(
                @selected="selectedOut"
                )


</template>

<script>
    import SideIn from './SideIn'
    import SideOut from './SideOut'
    import MappingView from './MappingView'

export default {
      name: 'mainView',
      components: {
        SideIn,
        SideOut,
        MappingView
      },
      data () {
        return {
          input: [],
          output: [],
          options: {},
          data_: [],
          table: ''
        }
      },
      methods: {
        selectedIn (row, fields) {
          this.data_ = row
          this.input = fields
        },
        selectedOut (row, options, table) {
          this.table = table
          this.options = options
          this.output = row
        }
      }
    }
</script>

<style scoped>

</style>
