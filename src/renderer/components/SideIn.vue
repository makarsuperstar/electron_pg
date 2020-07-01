<template lang="pug">
    el-col(:span="8")
        el-container
            el-row(v-if="!connected && !block")
                el-col(:span="24")
                    el-input(max="4" size="small" placeholder="host" v-model="host")
                el-col(:span="24" )
                    el-input(size="small" placeholder="port" v-model="port")
                el-col(:span="24" )
                    el-input( size="small" placeholder="database" v-model="database")
                el-col(:span="24" )
                    el-input(size="small" placeholder="user" v-model="user")
                el-col(:span="24" )
                    el-input(size="small" placeholder="password" v-model="password")
                el-col(:span="24" )
                    el-button(size="small" type="info" @click="testing") Подключить
            el-row(v-if="connected && !show && !block")
                el-col(:span="24")
                    el-select(size="small" v-model="table" placeholder="Таблицы")
                        el-option(
                            v-for="item in tables"
                            :label="item.tablename"
                            :value="item.tablename"
                        )
                el-col(:span="24" style="margin-top:10px;")
                    el-button(size="small" type="success" @click="selected") Выбрать
            el-row(v-if="show && !block")
                el-col(:span="10")
                    el-select(size="small" v-model="filter.field" placeholder="Таблицы" style="margin-bottom: 10px;")
                        el-option(v-for="item in fields" :label="item" :value="item")
                el-col(:span="10")
                    el-select(size="small" v-model="filter.value" placeholder="Таблицы" style="margin-bottom: 10px;")
                        el-option( v-for="item in getValue(filter.field)"
                            :label="item"
                            :value="item")
                el-col(:span="4")
                    el-button(icon="el-icon-plus" size="small" @click="addFilter(filter.field, filter.value)")
</template>

<script>
    import {Client} from '../../../node_modules/pg'

    export default {
      name: 'SideIn',
      data () {
        return {
          block: false,
          filter: {
            field: '',
            value: ''
          },
          data_: [],
          show: false,
          host: '',
          port: 0,
          user: '',
          password: '',
          database: '',
          client: null,
          table: '',
          tables: [],
          connected: false,
          fields: [],
          filters: []
        }
      },
      methods: {
        setLocalStorage () {
          localStorage.host = this.host
          localStorage.port = this.port
          localStorage.user = this.user
          localStorage.password = this.password
          localStorage.database = this.database
        },
        getLocalStorage () {
          this.host = localStorage.host
          this.port = localStorage.port
          this.user = localStorage.user
          this.password = localStorage.password
          this.database = localStorage.database
        },
        testing () {
          this.client = new Client({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database
          })
          this.client.connect(err => {
            if (err) {
              console.error('connection error', err.stack)
            } else {
              this.connected = true
              this.setLocalStorage()
              // eslint-disable-next-line handle-callback-err
              this.client.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname='public';`, (err, res) => {
                this.tables = res.rows
              })
            }
          })
        },
        getValue (col) {
          let list_ = []
          this.data_.forEach(i => {
            let value_ = i[col]
            if (list_.filter(v => {
              return v === value_
            }).length === 0) {
              list_.push(value_)
            }
          })
          return list_
        },
        setRows (rows) {
          if (rows.length > 0) {
            let row = rows[0]
            for (const item in row) {
              this.fields.push(item)
            }
            this.show = true
          }
        },
        addFilter (field, val) {
          this.filters.push({field: field, value: val})
          this.filter.field = ''
          this.filter.value = ''
        },
        deleteFilter (item) {
          this.filters = this.filters.filter(i => {
            return i !== item
          })
        },
        selected () {
          // eslint-disable-next-line handle-callback-err
          this.client.query(`SELECT * FROM ${this.table};`, (err, res) => {
            this.setRows(res.rows)
            this.data_ = res.rows
            this.$emit('selected', res.rows, this.fields)
          })
        },
        setFilter () {
          let filters_ = []
          this.filters.forEach(i => {
            filters_.push(`${i.field}='${i.value}'`)
          })
          if (this.filters.length > 0) {
            // eslint-disable-next-line handle-callback-err
            this.client.query(`SELECT * FROM ${this.table} WHERE ${filters_.join(' AND ')};`, (err, res) => {
              this.$emit('selected', res.rows, this.fields)
            })
          }
          this.block = true
        }
      },
      mounted () {
        this.getLocalStorage()
      }
    }
</script>

<style scoped>
    .el-input input {
        background: #20242A !important;
        border: 1px solid #2E3237 !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
        color: white;
    }

    .el-input input:hover {
        background: #20242A !important;
        border: 1px solid #2E3237 !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
        color: white;
    }

    .el-input {
        margin-bottom: 10px !important;
    }

    .yellow {
        background: #FED32C !important;
        border-radius: 13px;
        color: black;
        width: 190px;
        height: 36px;
        font-size: medium;
    }

    .fields {
        color: white;
        margin: 10px;
        font-size: 18px;
    }

</style>
