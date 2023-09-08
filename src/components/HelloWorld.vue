<script lang="jsx">
import { useRouter } from 'vue-router'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { Model } from '@/lib/model.mjs'
import { getChoices } from '@/lib/field.mjs'
import { Http } from '@/globals/Http'
import { Alioss } from '@/globals/Alioss'
import { useMyStore } from '@/store/store'
import TinymceEditorVue from './TinymceEditor.vue'

const deepcopy = (o) => JSON.parse(JSON.stringify(o))
export default {
  name: 'ModelForm',
  inheritAttrs: true,
  emits: ['submit', 'successPost', 'sendData'],
  props: {
    model: { type: [Object, Function], required: true },
    names: { type: Array },
    values: { type: Object, default: () => ({}) },
    errors: { type: Object, default: () => ({}) },
    syncValues: { type: Boolean, default: false },
    valuesHook: { type: Function, default: (data) => data },
    tableFieldDownloadUrl: { type: [Object, String, Function] },
    tableFieldUniqueKey: { type: [Object, String, Function] },
    actionUrl: { type: String, required: false },
    method: { type: String, default: 'POST' },
    successMessage: { type: String, default: '' },
    hideSubmitButton: { type: Boolean, default: false },
    scrollToFirstError: { type: Boolean, default: true },
    submitButtonText: { type: String },
    itemWidth: { type: String },
    successRoute: { type: [Object, String] },
    layout: { type: String, default: 'horizontal' }, // horizontal
    trigger: { type: String, default: 'blur' },
    labelCol: { type: Number, default: 3 }
  },
  setup(props, { attrs, slots, emit, expose }) {
    const router = useRouter()
    const model = ref(null)
    const values = props.syncValues ? reactive(props.values) : reactive(deepcopy(props.values))
    const errors = reactive(props.errors)
    const { loading } = storeToRefs(useMyStore())
    onBeforeMount(async () => {
      if (!props.model.__isModelClass__) {
        model.value = await Model.createModelAsync({
          disable_auto_primary_key: true,
          ...props.model
        })
      } else {
        model.value = props.model
      }
      Object.assign(values, model.value.toFormValue(values, model.value.names))
    })
    const formRef = ref()
    const formItemLayout = computed(() => {
      return props.layout === 'horizontal'
        ? {
            labelCol: { span: props.labelCol },
            wrapperCol: { span: 24 - props.labelCol }
          }
        : {}
    })
    const buttonItemLayout = computed(() => {
      return props.layout === 'horizontal'
        ? {
            wrapperCol: { span: 24 - props.labelCol, offset: props.labelCol }
          }
        : {}
    })
    const formError = ref('')
    const submiting = ref(false)
    const clearBackendErrors = () => {
      formError.value = ''
      for (const key in errors) {
        errors[key] = ''
      }
    }
    const onFinish = async (values) => {
      clearBackendErrors()
      const data = model.value.toPostValue(values, model.value.names)
      emit('submit', data)
      emit('sendData', data)
      if (!props.actionUrl) {
        return
      }
      try {
        submiting.value = true
        const { data: responseData } = await Http.post(props.actionUrl, props.valuesHook(data))
        emit('successPost', responseData)
        if (props.successRoute) {
          router.push(
            typeof props.successRoute == 'string'
              ? { path: props.successRoute }
              : props.successRoute
          )
        }
        Notice.success(props.successMessage || '提交成功')
      } catch (error) {
        if (error.name == 'AxiosError') {
          const { data, status } = error.response
          if (status == 422) {
            errors[data.name] = data.message
          } else {
            formError.value = typeof data == 'object' ? JSON.stringify(data) : data
          }
        } else {
          formError.value = error.message
        }
      } finally {
        submiting.value = false
      }
    }

    const onFinishFailed = ({ values, errorFields, outOfDate }) => {
      console.log('Failed:', { values, errorFields, outOfDate })
    }
    // const ruleTypes = {
    //   float: "float",
    //   integer: "integer",
    //   boolean: "boolean",
    //   email: "email",
    //   date: "date",
    // };
    const getAntdRule = (field) => {
      const rule = {
        whitespace: true,
        trigger: props.trigger,
        required: field.required
      }
      // validator定义了时, type会被忽略
      // const type = ruleTypes[field.type];
      // if (type) {
      //   rule.type = type;
      // }
      rule.validator = async (_rule, value) => {
        try {
          return Promise.resolve(field.validate(value))
        } catch (error) {
          return Promise.reject(error)
        }
      }
      // rule.validator = (_rule, value) => {
      //   field.validate(value);
      // };
      return rule
    }
    // { attrs, slots, emit, expose }
    const disableEnterKeyDown = (e) => e.keyCode === 13 && e.preventDefault()
    const Wigdet = ({ name, field, values }) => {
      const type = field.type
      const tag = field.tag
      if (type == 'boolean') {
        return (
          <a-radio-group v-model:value={values[name]} disabled={field.disabled}>
            {field.choices.map((c) => (
              <a-radio-button value={c.value}>{c.label}</a-radio-button>
            ))}
          </a-radio-group>
        )
      } else if (field.autocomplete) {
        const onSearch = async (text) => {
          if (!text) {
            return []
          }
          const matchRule = new RegExp(text.split('').join('.*'))
          if (typeof field.choices === 'function') {
            field.choices = await field.choices()
          }
          field.searchOptions = field.choices.filter((e) => {
            // 暂时只针对字符串过滤
            if (typeof e.label == 'string') {
              return e.label.includes(text) || matchRule.test(e.label)
            } else {
              return true
            }
          })
        }
        return (
          <a-auto-complete
            onKeydown={disableEnterKeyDown} //防止按enter选择时表单提交
            v-model:value={values[name]}
            v-slots={{
              option: ({ label, hint }) => (
                <div style="display: flex; justify-content: space-between">
                  {label}
                  <span>{hint}</span>
                </div>
              )
            }}
            options={field.searchOptions}
            onSearch={onSearch}
            disabled={field.disabled}
          ></a-auto-complete>
        )
      } else if (field.choices) {
        if (field.tag == 'radio' && typeof field.choices !== 'function') {
          return (
            <a-radio-group v-model:value={values[name]} disabled={field.disabled}>
              {field.choices.map((c) => (
                <a-radio-button value={c.value}>{c.label}</a-radio-button>
              ))}
            </a-radio-group>
          )
        } else {
          const eventsDict = {}
          if (typeof field.choices === 'function') {
            field._choices = field.choices
            field.choices = reactive([])
            if (!field.disabled) {
              let fetched = false
              eventsDict.onclick = async () => {
                if (!fetched) {
                  field.choices.push(...getChoices(await field._choices()))
                  fetched = true
                }
              }
            }
          }
          return (
            <a-select v-model:value={values[name]} {...eventsDict} disabled={field.disabled}>
              {field.choices.map((c) => (
                <a-select-option value={c.value}>{c.label}</a-select-option>
              ))}
            </a-select>
          )
        }
      } else if (tag == 'slider') {
        return (
          <a-slider
            v-model:value={values[name]}
            min={field.min}
            max={field.max}
            step={field.step}
            tooltipVisible={field.attrs.tooltipVisible}
            disabled={field.disabled}
          ></a-slider>
        )
      } else if (type.startsWith('alioss')) {
        // console.log("alioss value:", values[name]);
        const commonProps = {
          fileList: values[name],
          'onUpdate:fileList': (value) => {
            if (!errors[name]) values[name] = value
          },
          beforeUpload: (file) => {
            errors[name] = ''
            if (file.size > field.size) {
              errors[name] = `不能超过${field.size_arg}`
              return false
            }
          },
          data: Alioss.makeAntdDataCallback(field),
          action: field.upload_url || process.env.ALIOSS_URL,
          multiple: field.attrs.multiple ?? false,
          maxCount: field.limit
        }
        if (type == 'aliossImage' || type == 'alioss') {
          commonProps.maxCount = 1
        }
        switch (type) {
          case 'aliossImage':
          case 'aliossImageList':
            return (
              <a-upload
                {...commonProps}
                disabled={field.disabled}
                list-type={field.attrs?.listType || 'picture-card'}
              >
                <div>
                  <PlusOutlined />
                  <div>{field.attrs?.button_text || '上传图片'}</div>
                </div>
              </a-upload>
            )
          default:
            return (
              <a-upload {...commonProps} disabled={field.disabled}>
                <a-button>
                  <UploadOutlined></UploadOutlined>
                  {field.attrs?.button_text || '上传文件'}
                </a-button>
              </a-upload>
            )
        }
      } else if (type == 'date') {
        return (
          <a-date-picker
            v-model:value={values[name]}
            disabled={field.disabled}
            value-format={field.attrs?.valueFormat || 'YYYY-MM-DD'}
          />
        )
      } else if (type == 'yearMonth') {
        return (
          <a-date-picker
            v-model:value={values[name]}
            disabled={field.disabled}
            format={'YYYY.MM'}
            value-format={'YYYY.MM'}
            picker="month"
          />
        )
      } else if (type == 'year') {
        return (
          <a-date-picker
            value={String(values[name] || '')}
            onUpdate:value={(e) => (values[name] = e)}
            disabled={field.disabled}
            allowClear={false}
            format={'YYYY'}
            value-format={'YYYY'}
            picker="year"
          />
        )
      } else if (type == 'datetime') {
        const change = (date, datetime) => {
          values[name] = datetime
        }
        // 如果不使用dayjs,则time部分始终是00:00:00
        const localeValue = values[name] ? dayjs(values[name], 'YYYY-MM-DD HH:mm') : ''
        return (
          <a-date-picker
            value={localeValue}
            onUpdate:value={(e) => (values[name] = e)}
            disabled={field.disabled}
            show-time={{ format: field.attrs?.timeFormat || 'HH:mm' }}
            onChange={change}
            value-format={field.attrs?.valueFormat || 'YYYY-MM-DD'}
          />
        )
      } else if (type == 'password') {
        // https://github.com/yiminghe/async-validator#type
        return (
          <a-input-password
            v-model:value={values[name]}
            disabled={field.disabled}
            onKeydown={disableEnterKeyDown}
          ></a-input-password>
        )
      } else if (type == 'float' || type == 'integer') {
        return (
          <a-input-number
            v-model:value={values[name]}
            disabled={field.disabled}
            onKeydown={disableEnterKeyDown}
          ></a-input-number>
        )
      } else if (type == 'text' || field.input_type == 'textarea') {
        if (field.attrs?.rich) {
          return (
            <TinymceEditorVue
              v-model:modelValue={values[name]}
              size={field.attrs.size}
              height={field.attrs.height}
            />
          )
        } else {
          return (
            <a-textarea
              v-model:value={values[name]}
              disabled={field.disabled}
              auto-size={field.autoSize}
            ></a-textarea>
          )
        }
      } else {
        return (
          <a-input
            v-model:value={values[name]}
            disabled={field.disabled}
            onKeydown={disableEnterKeyDown}
          ></a-input>
        )
      }
    }
    return () => {
      if (!model.value) {
        return
      }
      return (
        <a-form
          {...formItemLayout.value}
          ref={formRef}
          layout={props.layout}
          scrollToFirstError={props.scrollToFirstError}
          model={values}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {(props.names || model.value.names).map((name) => {
            const field = model.value.fields[name]
            if (field.type === 'array') {
              const arr = values[name]
              return (
                <>
                  {arr.map((value, index) => (
                    <a-form-item
                      key={index}
                      label={index === 0 ? field.label : ''}
                      rules={[getAntdRule(field.array_field)]}
                      name={[name, index]}
                      {...(index === 0 ? {} : buttonItemLayout.value)}
                      extra={field.hint}
                      style="margin-bottom: 8px"
                    >
                      <Wigdet
                        style="width: 80%; margin-right: 8px"
                        field={field.array_field}
                        name={[index]}
                        values={arr}
                      ></Wigdet>
                      {arr.length > 0 && (
                        <MinusCircleOutlined
                          class="dynamic-delete-button"
                          disabled={arr === 1}
                          onClick={() => {
                            arr.splice(index, 1)
                          }}
                        />
                      )}
                    </a-form-item>
                  ))}
                  <a-form-item
                    {...(arr.length === 0 ? { label: field.label } : buttonItemLayout.value)}
                  >
                    <a-button
                      type="dashed"
                      style="width: 80%"
                      onClick={() => {
                        arr.push(field.getDefault())
                      }}
                    >
                      <PlusOutlined />
                      添加
                    </a-button>
                  </a-form-item>
                </>
              )
            } else if (field.type == 'table') {
              const downloadUrl = ((type) => {
                if (type == 'object') {
                  return props.tableFieldDownloadUrl[field.name]
                } else if (type == 'string') {
                  return props.tableFieldDownloadUrl
                } else if (type == 'function') {
                  return props.tableFieldDownloadUrl(values)
                } else {
                  return ''
                }
              })(typeof props.tableFieldDownloadUrl)
              const uniqueKey = ((type) => {
                if (type == 'object') {
                  return props.tableFieldUniqueKey[field.name]
                } else if (type == 'string') {
                  return props.tableFieldUniqueKey
                } else if (type == 'function') {
                  return props.tableFieldUniqueKey(values)
                } else {
                  return ''
                }
              })(typeof props.tableFieldUniqueKey)
              return (
                <a-form-item
                  name={field.name}
                  label={field.label}
                  required={field.required}
                  rules2={[getAntdRule(field)]}
                  extra={field.hint}
                >
                  <model-form-table-field
                    model={field.model}
                    modelValue={values[name]}
                    onUpdate:modelValue={(rows) => {
                      values[name] = rows
                      errors[name] = ''
                    }}
                    onRead={({ ok, rows }) => {
                      if (ok) errors[name] = ''
                    }}
                    onDeleteRow={(index) => {
                      values[name].splice(index, 1)
                    }}
                    downloadUrl={downloadUrl}
                    uniqueKey={uniqueKey}
                  ></model-form-table-field>
                  {errors[name] && (
                    <a-alert
                      message={errors[name]}
                      type="error"
                      show-icon
                      style="white-space: pre;"
                    />
                  )}
                </a-form-item>
              )
            } else {
              return (
                <a-form-item
                  name={name}
                  label={field.label}
                  rules={[getAntdRule(field)]}
                  extra={field.hint}
                  style={props.layout == 'inline' ? { 'min-width': '20%' } : {}}
                >
                  <Wigdet field={field} name={name} values={values}></Wigdet>
                  {errors[name] && (
                    <a-alert
                      message={errors[name]}
                      type="error"
                      show-icon
                      style="white-space: pre;"
                    />
                  )}
                </a-form-item>
              )
            }
          })}
          {formError.value && (
            <a-alert message="发生错误" description={formError.value} type="error" show-icon />
          )}
          {!props.hideSubmitButton && (
            <a-form-item {...buttonItemLayout.value}>
              <a-button
                disabled={submiting.value}
                type="primary"
                html-type="submit"
                loading={loading.value}
              >
                {props.submitButtonText || '提交'}
              </a-button>
            </a-form-item>
          )}
        </a-form>
      )
    }
  }
}
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: red;
}

:deep(.ant-input[disabled]) {
  color: rgba(0, 0, 0, 0.7);
  background-color: #f9f9f9;
}

:deep(.ant-select-disabled) {
  color: rgba(0, 0, 0, 0.7);
}

:deep(.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  color: rgba(0, 0, 0, 0.7);
}

:deep(.ant-select-disabled .ant-select-selection) {
  background: #f9f9f9;
  cursor: not-allowed;
}
</style>
