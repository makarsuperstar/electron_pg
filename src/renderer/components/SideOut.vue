<template>
    <el-col :span="8" style="padding: 10px;">
        <div class="grid-content in-side" v-if="!connected">
            <el-input size="small" placeholder="host" v-model="host"></el-input>
            <el-input size="small" placeholder="port" v-model="port"></el-input>
            <el-input size="small" placeholder="database" v-model="database"></el-input>
            <el-input size="small" placeholder="user" v-model="user"></el-input>
            <el-input size="small" placeholder="password" v-model="password"></el-input>
            <el-button type="success" size="small"  @click="testing">Проверить</el-button>
        </div>
        <div class="grid-content" v-if="connected && !show">
            <el-select size="small" v-model="table" placeholder="Таблицы">
                <el-option
                        v-for="item in tables"
                        :label="item.tablename"
                        :value="item.tablename"
                ></el-option>
            </el-select>
            <el-button size="small" type="success" @click="selected">Выбрать</el-button>
        </div>
        <div class="grid-content" v-if="show">
            <span v-for="item in fields" style="color: white">{{ item }}<br/></span>
        </div>
    </el-col>
</template>

<script>
    import { Client } from '../../../node_modules/pg'

    export default {
      name: 'SideOut',
      data () {
        return {
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
          fields: []
        }
      },
      methods: {
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
              // eslint-disable-next-line handle-callback-err
              this.client.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname='public';`, (err, res) => {
                this.tables = res.rows
              })
            }
          })
        },
        setRows (rows) {
          if (rows.length > 0) {
            rows.forEach(i => {
              this.fields.push(i.name)
            })
            this.show = true
          }
        },
        selected () {
          // eslint-disable-next-line handle-callback-err
          this.client.query(`SELECT * FROM ${this.table};`, (err, res) => {
            this.setRows(res.fields)
            this.$emit('selected', this.fields, {
              host: this.host,
              port: this.port,
              user: this.user,
              password: this.password,
              database: this.database
            }, this.table)
            this.client.end()
          })
        }
      }
    }
</script>

<style scoped>
    .el-input{
        margin-bottom: 10px !important;
    }
</style>
