<template>
    <el-col :span="8" style="padding: 10px;">
        <el-row style="margin-bottom: 10px !important; text-align: center;">
            <el-col :span="14">
                <el-row>
                    <el-col :span="10">
                        <el-select size="small" v-model="side_in" placeholder="Откуда">
                            <el-option
                                    v-for="item in input"
                                    :label="item"
                                    :value="item"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                <el-select size="small" v-model="side_out" placeholder="Куда">
                    <el-option
                            v-for="item in output"
                            :label="item"
                            :value="item"
                    ></el-option>
                </el-select>
                    </el-col>
                    <el-col :span="4">
                    <el-button size="small" type="primary" @click="append(side_in, side_out)">Добавить</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px !important; text-align: center;">
            <el-col :span="14">
                <el-row>
                    <el-col :span="10">
                        <el-input
                                size="small"
                                placeholder="Свое значение"
                                v-model="const_value"
                                >
                        </el-input>
                    </el-col>
                    <el-col :span="10">
                        <el-select size="small" v-model="const_field" placeholder="Таблицы">
                            <el-option
                                    v-for="item in output"
                                    :label="item"
                                    :value="item"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="small" type="primary" @click="appendConst(const_value, const_field)">Добавить</el-button>
                    </el-col>
                </el-row>



            </el-col>
        </el-row>
        <el-row v-for="item in fields" style="margin-bottom: 10px !important; border: 1px #7d7b7b dashed;border-radius: 9px;">
            <el-col :span="10">

                    <span class="mapping"> {{item.in}}</span>
                </el-col>
            <el-col :span="1">
                <span class="mapping-arrow">⇢</span>
            </el-col>
            <el-col :span="10">
                <span class="mapping"> {{item.out}}</span>
           </el-col>
            <el-col :span="1">
                <span class="mapping-arrow" @click="deleteFields(item)"> ⤫</span>
            </el-col>
        </el-row>
        <el-row v-for="item in consts" style="margin-bottom: 10px !important; border: 1px #7d7b7b dashed;border-radius: 9px;">
            <el-col :span="10">
                <span class="mapping"> {{item.value}}</span>
            </el-col>
            <el-col :span="1">
                <span class="mapping-arrow">⇢</span>
            </el-col>
            <el-col :span="10">
                <span class="mapping"> {{item.field}}</span>
            </el-col>
            <el-col :span="1">
                <span class="mapping-arrow" @click="deleteConsts(item)"> ⤫</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button size="small" type="success" @click="uploading">Загрузить</el-button>
            </el-col>
        </el-row>
    </el-col>
</template>

<script>
    import { Client } from '../../../node_modules/pg'

    export default {
      name: 'MappingView',
      props: {
        input: {
          type: Array,
          default: () => []
        },
        table: {
          type: String,
          default: ''
        },
        data_: {
          type: Array,
          default: () => []
        },
        output: {
          type: Array,
          default: () => []
        },
        options: {
          type: Object,
          default: () => ({})
        }
      },
      data () {
        return {
          const_value: '',
          const_field: '',
          consts: [],
          side_in: '',
          side_out: '',
          fields: [],
          client: null
        }
      },
      methods: {
        deleteConsts (item) {
          this.consts = this.consts.filter(i => {
            return i !== item
          })
        },
        deleteFields (item) {
          this.fields = this.fields.filter(i => {
            return i !== item
          })
        },
        appendConst (in_, out_) {
          this.consts.push({field: out_, value: in_})
        },
        append (in_, out_) {
          this.fields.push({in: in_, out: out_})
        },
        uploading () {
          if (this.fields.length > 0) {
            this.client = new Client(this.options)
            this.client.connect(err => {
              if (err) {
                console.error('connection error', err.stack)
              } else {
                let query = ''
                this.data_.forEach(i => {
                  let params = []
                  let values = []
                  this.fields.forEach(v => {
                    params.push(v.out)
                    values.push(`'${i[v.in]}'`)
                  })
                  this.consts.forEach(y => {
                    params.push(y.field)
                    values.push(`'${y.value}'`)
                  })

                  query += `INSERT INTO ${this.table}(${params.join(',')}) VALUES (${values});`
                })
                // eslint-disable-next-line handle-callback-err
                this.client.query(query, (err, res) => {
                  debugger
                  this.client.end()
                })
              }
            })
          }
        }
      }
    }
</script>

<style scoped>
    .mapping{
        color: white;
    }
    .mapping-arrow{
        color: yellow;
    }
</style>
