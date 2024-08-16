# prompts for model defination code of lua-resty-model

## souce code

````md
现在我要给定一些近似自然语言的数据库表的描述, 你要把它转换为 luajit 语法的代码, 具体描述如下:

# 语法

形如:

```
表名1(列名1, 列名2:列属性1, ...)
表名2(列名1, 列名2:列属性1|列属性2, ...)
```

具体约定:

- 多个列名由逗号`,`连接
- `列属性`的描述格式是`VALUE`或者`KEY=VALUE`, 多个属性由`|`连接.列属性可以是:
  - `type=[TYPE]`, 表示列类型, 包括: foreignkey, string, integer, float, date, datetime, year, year_month, alioss_image,alioss_image_list 等
  - `choices=[...]`, 表示该列的值限定为一系列的值`...`
  - `maxlength=[NUMBER]`, 表示字符串最大长度
  - `min=[NUMBER]`,表示数字的最小值
  - `unique`,表示唯一
  - `index`, 表示索引该列
  - `reference==[MODEL]`, 表示外键引用的模型
- 列名有前缀`#`时,表示该列的类型为`integer`, 例如: `#年级`和`年级:type=integer`是等效的
- 列名有前缀`~`时,表示该列是唯一的, 例如: `~列名`和`列名:unique`是等效的
- 列名有前缀`@`时,表示该列是外键, 输出的 luajit 代码中的中文列名需省略`@`,并加上后缀`ID`. 如果是`@表名/别名`这种形式,例如`@用户/创建者`则等效于`{name = 'usr_id', label = '创建者', reference = Usr}`
- 列名有后缀`!`时, 表示该列是必填的, 例如`列名!` 和 `列名:required=true`是等效的
- 形如`列名[x,y,z]`的列名表示值限定在['x','y','z'], 它和描述`列名:choices=[x,y,z]`是等效的.
- 形如`#列名[1,2,3]`的列名表示类型为 integer, 且值限定在[1,2,3], 它和描述`列名:type=integer|choices=[1,2,3]`是等效的.
- 形如`列名(10)`的列名表示类型为 string, 且最大长度为 10, 它和描述`列名:type=string|maxlength=10`是等效的.
- 形如`#列名(10)`的列名表示类型为 integer, 且最大值为 10, 它和描述`列名:type=integer|max=10`是等效的.
- 形如`#列名(2,10)`的列名表示类型为 integer, 且最大值为 10, 最小值为 2,它和描述`列名:type=integer|max=10|min=2`是等效的.
- 当没有明确提供type且前面的规则也无法确定type的时候,你应该尽量从列名的含义推断出来,比如`头像`或`图片`,type推断为`alioss_image`; 又如`出生日期`推断为`date`, `会议时间` 推断为`datetime`, `出生年月`推断为`year_month`, `试卷年份`推断为`year`等等. 实在推断不出来的, 类型为string.且可以省略

# 输出格式要求

- 你只需要输出 luajit 代码, 不要说其他废话
- 把中文表名和列名翻译为对应英文,要能符合主流.如果对应英文单词太长,则尽量使用简写形式. 比如`Department`写为`Dept`, `Organization`写为`Org`
- `table_name`使用英文, 且使用单数+snake 的形式, `label`使用中文; 表的变量名的英文使用单数+首字母大写的 Camel 的形式
- 列类型默认是字符串string
- 字符串类型没有提供 `maxlength` 的时候, 默认为 `255`, 列属性应该加上`maxlength=255`
- 外键`所属XX`对应的英文应该为`XX`表名的 snake 形式加上后缀`_id`, 比如`所属用户`对应`usr_id`, 列属性应该加上`reference=Usr`
- 当列类型是字符串或者列属性指定了 `reference` 时, 列属性`type` 可以省略
- 由于`user`是 postgresql 的关键字, 最后输出的 luajit 代码中的变量或字符串字面量如果包含`user`, 需要替换为`usr`, `User`需要替换为`Usr`
- 如果翻译为`Record`, 请替换为`Log`

# 举例:

## 给定描述

```
用户(~名称(10),密码,性别[男,女]:index,#年龄(1,10))
机构(~名称(10))
机构管理员(@用户/管理员,@机构)
```

## 输出 luajit 代码:

```lua
---@class Usr
local Usr = Model {
  table_name = 'usr',
  label = '用户',
  {name = "name", label = '名称', maxlength=10,  unique=true},
  {name = "password", label = '密码', maxlength=255},
  {name = "sex", label = "性别", choices={'男', '女'},index=true},
  {name = "age", label = '年龄', type='integer', min=1, max=10},
}

---@class Org
local Org = Model {
  table_name = 'org',
  label = '机构',
  {name = "name", label = "名称", unique=true, maxlength=10},
}

---@class OrgAdmin
local OrgAdmin = Model {
  table_name = 'org_admin',
  label = '机构管理员',
  {name = 'usr_id', label = '管理员', reference = Usr},
  {name = 'org_id', label = '机构ID', reference = Org},
}

return {
 Usr = Usr,
 Org = Org,
 OrgAdmin = OrgAdmin,
}
```
````
