# 基于资源的权限控制 (ABAC)

## prompt
```md
用多学校管理系统(学校,校长,班级,教师,学生,门卫，学生成绩，公告等)给我解释实现基于资源的权限控制 (Attribute-Based Access Control, ABAC) 是怎么设计和运行的。策略通过数据库来加载和管理。用户和角色是多对多关系（比如一个校长可能还兼任了教师). 给我所有相关表定义（基于pg,不要created_at和updated_at列)和controller（基于flask）来展示如何实现：
校长可以查看和编辑所在学校的所有资源。
教师可以管理自己所教班级的学生和学生成绩。
学生可以查看自己的个人信息、个人成绩。
门卫可以查看学生和教师的基本信息用于身份验证，但只有在工作时间 (例如 8:00-18:00) 。
```

## 1. 理解基于资源的权限控制 (ABAC)

ABAC 是一种权限控制模型，它基于资源的属性、用户的属性、操作的属性以及环境的属性来动态地决定是否允许用户执行某个操作。与传统的基于角色的权限控制 (RBAC) 不同，ABAC 更加细粒度和灵活。

* **主体 (Subject):**  尝试访问资源的用户或实体 (例如：校长、教师、学生、门卫)。主体拥有各种属性 (例如：角色、所属学校、所教班级、工作时间)。
* **资源 (Resource):**  被访问的对象 (例如：学校信息、班级列表、学生成绩、公告)。资源也拥有各种属性 (例如：资源类型、所属学校、所属班级)。
* **操作 (Action):**  主体尝试对资源执行的动作 (例如：查看、编辑、管理、删除)。
* **环境 (Environment):**  访问发生时的上下文环境 (例如：当前时间、地理位置、网络条件)。
* **策略 (Policy):**  定义在什么条件下允许或拒绝访问的规则。策略通常由一组属性和条件组成。

**ABAC 的优势在于：**

* **细粒度控制:** 可以基于各种属性组合来定义权限，实现更精细的访问控制。
* **灵活性:**  策略可以动态调整，适应不断变化的需求。
* **可扩展性:**  易于扩展到新的资源类型和属性。
* **审计性:**  基于属性的策略更易于理解和审计。

## 2. 学校管理系统中的 ABAC 设计

在这个学校管理系统中，我们需要根据以下需求设计 ABAC 策略：

* **校长:** 可以查看和编辑所在学校的所有资源。
* **教师:** 可以管理自己所教班级的学生和学生成绩。
* **学生:** 可以查看自己的个人信息、个人成绩。
* **门卫:** 可以查看学生和教师的基本信息用于身份验证，但只有在工作时间 (8:00-18:00)。

**我们需要定义以下属性：**

* **主体属性 (Subject Attributes):**
    * `user_id`: 用户 ID
    * `role`: 角色 (校长, 教师, 学生, 门卫)
    * `school_id`: 所属学校 ID (校长, 教师, 学生, 门卫)
    * `teacher_id`: 教师 ID (教师)
    * `class_ids`: 所教班级 ID 列表 (教师)
    * `work_hour`: 工作时间 (门卫)

* **资源属性 (Resource Attributes):**
    * `resource_type`: 资源类型 (school, class, teacher, student, student_grade, announcement, user)
    * `resource_id`: 资源 ID (例如 school.id, class.id, student.id)
    * `school_id`: 所属学校 ID (如果资源属于学校)
    * `class_id`: 所属班级 ID (如果资源属于班级)
    * `student_id`: 所属学生 ID (如果资源是学生成绩)

* **操作属性 (Action Attributes):**
    * `action`: 操作类型 (view, edit, manage)

* **环境属性 (Environment Attributes):**
    * `current_time`: 当前时间


## 3.最终的数据库表定义 (PostgreSQL):

```sql
-- 学校表
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 班级表
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    name VARCHAR(255) NOT NULL
);

-- 教师表
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    user_id INTEGER UNIQUE, -- 关联用户表
    name VARCHAR(255) NOT NULL
);

-- 教师-班级关联表 (多对多关系)
CREATE TABLE teacher_classes (
    teacher_id INTEGER NOT NULL REFERENCES teachers(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    PRIMARY KEY (teacher_id, class_id)
);

-- 学生表
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    user_id INTEGER UNIQUE, -- 关联用户表
    name VARCHAR(255) NOT NULL
);

-- 学生成绩表
CREATE TABLE student_grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    subject VARCHAR(255) NOT NULL,
    grade INTEGER
);

-- 公告表
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    title VARCHAR(255) NOT NULL,
    content TEXT
);

-- 门卫表
CREATE TABLE security_guards (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    user_id INTEGER UNIQUE, -- 关联用户表
    name VARCHAR(255) NOT NULL,
    work_start_time TIME,
    work_end_time TIME
);

-- 用户表 (移除 school_id 字段)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL
    -- 其他用户信息字段
);

-- 角色表
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- 角色名称 (例如: 校长, 教师, 学生, 门卫)
);

-- 用户-角色关联表 (多对多关系)
CREATE TABLE user_roles (
    user_id INTEGER NOT NULL REFERENCES users(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id) -- 联合主键
);

-- ABAC 策略表 (保持不变)
CREATE TABLE abac_policies (
    id SERIAL PRIMARY KEY,
    subject_role VARCHAR(50), -- 主体角色
    resource_type VARCHAR(50),
    action VARCHAR(50),
    conditions JSONB
);
```

## 4.最终的 Flask 代码 (app.py):

```python
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, time
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://your_user:your_password@your_host:your_port/your_database' # 替换为你的数据库连接信息
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 模型 (models.py)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users', lazy='dynamic'))

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class UserRole(db.Model):
    __tablename__ = 'user_roles'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), primary_key=True)

class School(db.Model):
    __tablename__ = 'schools'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

class Class(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)

class Teacher(db.Model):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    name = db.Column(db.String(255), nullable=False)
    classes = db.relationship('Class', secondary='teacher_classes', backref=db.backref('teachers', lazy='dynamic'))

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    name = db.Column(db.String(255), nullable=False)

class StudentGrade(db.Model):
    __tablename__ = 'student_grades'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    grade = db.Column(db.Integer)

class Announcement(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)

class SecurityGuard(db.Model):
    __tablename__ = 'security_guards'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    name = db.Column(db.String(255), nullable=False)
    work_start_time = db.Column(db.Time)
    work_end_time = db.Column(db.Time)

class AbacPolicy(db.Model):
    __tablename__ = 'abac_policies'
    id = db.Column(db.Integer, primary_key=True)
    subject_role = db.Column(db.String(50))
    resource_type = db.Column(db.String(50))
    action = db.Column(db.String(50))
    conditions = db.Column(db.JSONB)

# 权限检查函数
def check_permission(user, resource_type, resource, action):
    user_roles = [role.name for role in user.roles]
    for role_name in user_roles:
        policies = AbacPolicy.query.filter(
            AbacPolicy.subject_role == role_name,
            AbacPolicy.resource_type == resource_type,
            AbacPolicy.action == action
        ).all()

        for policy in policies:
            if evaluate_condition(policy.conditions, user, resource, action, user_roles):
                return True

    return False

# 条件评估函数
def evaluate_condition(condition, user, resource, action, user_roles):
    if not condition:
        return True

    for key, rule in condition.items():
        attribute_path = rule.get('attribute')
        operator = rule.get('operator')
        value_config = rule.get('value')

        subject_attrs = {
            'roles': user_roles,
            'school_id': get_user_school_id(user, user_roles), # 获取用户所属学校 ID
            'user_id': user.id,
            'class_ids': []
        }
        if '教师' in user_roles:
            teacher = Teacher.query.filter_by(user_id=user.id).first()
            if teacher:
                subject_attrs['class_ids'] = [c.id for c in teacher.classes]
        elif '学生' in user_roles:
            student = Student.query.filter_by(user_id=user.id).first()
            if student:
                subject_attrs['student_id'] = student.id

        resource_attrs = {}
        if resource:
            resource_attrs['resource_type'] = resource.__tablename__
            resource_attrs['resource_id'] = resource.id
            if hasattr(resource, 'school_id'):
                resource_attrs['school_id'] = resource.school_id
            if hasattr(resource, 'class_id'):
                resource_attrs['class_id'] = resource.class_id
            if hasattr(resource, 'student_id'):
                resource_attrs['student_id'] = resource.student_id
            if hasattr(resource, 'user_id'):
                resource_attrs['user_id'] = resource.user_id


        env_attrs = {
            'current_time': datetime.now().time()
        }

        attribute_value = resolve_attribute_path(attribute_path, subject_attrs, resource_attrs, env_attrs)
        expected_value = resolve_value(value_config, subject_attrs, resource_attrs, env_attrs)

        if operator == 'equals':
            if attribute_value != expected_value:
                return False
        elif operator == 'in':
            if attribute_value not in expected_value:
                return False
        elif operator == 'time_between':
            start_time = time.fromisoformat(expected_value['start'])
            end_time = time.fromisoformat(expected_value['end'])
            current_time = attribute_value
            if not (start_time <= current_time <= end_time):
                return False

    return True

# 获取用户所属学校 ID (根据角色判断)
def get_user_school_id(user, user_roles):
    if '校长' in user_roles or '教师' in user_roles: # 假设校长和教师都属于一个学校
        teacher = Teacher.query.filter_by(user_id=user.id).first() # 假设校长也记录在 teacher 表
        if teacher:
            return teacher.school_id
    elif '学生' in user_roles:
        student = Student.query.filter_by(user_id=user.id).first()
        if student:
            return student.school_id
    elif '门卫' in user_roles:
        security_guard = SecurityGuard.query.filter_by(user_id=user.id).first()
        if security_guard:
            return security_guard.school_id
    return None # 如果无法确定学校 ID

# 解析属性路径 (保持不变)
def resolve_attribute_path(path, subject_attrs, resource_attrs, env_attrs):
    parts = path.split('.')
    source = parts[0]
    attribute_name = parts[1]

    if source == 'subject':
        return subject_attrs.get(attribute_name)
    elif source == 'resource':
        return resource_attrs.get(attribute_name)
    elif source == 'environment':
        return env_attrs.get(attribute_name)
    return None

# 解析策略值配置 (保持不变)
def resolve_value(value_config, subject_attrs, resource_attrs, env_attrs):
    if isinstance(value_config, dict) and 'attribute' in value_config:
        return resolve_attribute_path(value_config['attribute'], subject_attrs, resource_attrs, env_attrs)
    else:
        return value_config

# 权限检查装饰器 (保持不变)
def require_permission(resource_type, action):
    def decorator(f):
        def decorated_function(*args, **kwargs):
            user = get_current_user()
            resource = get_resource(resource_type, kwargs)

            if not check_permission(user, resource_type, resource, action):
                return jsonify({'message': 'Forbidden'}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

# 获取当前用户 (保持不变)
def get_current_user():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return None
    user = User.query.options(db.joinedload(User.roles)).get(user_id)
    return user

# 获取资源 (保持不变)
def get_resource(resource_type, kwargs):
    if resource_type == 'school':
        school_id = kwargs.get('school_id')
        return School.query.get(school_id)
    elif resource_type == 'class':
        class_id = kwargs.get('class_id')
        return Class.query.get(class_id)
    elif resource_type == 'student':
        student_id = kwargs.get('student_id')
        return Student.query.get(student_id)
    elif resource_type == 'student_grade':
        grade_id = kwargs.get('grade_id')
        return StudentGrade.query.get(grade_id)
    elif resource_type == 'announcement':
        announcement_id = kwargs.get('announcement_id')
        return Announcement.query.get(announcement_id)
    elif resource_type == 'user':
        user_id = kwargs.get('user_id')
        return User.query.get(user_id)
    elif resource_type == 'teacher':
        teacher_id = kwargs.get('teacher_id')
        return Teacher.query.get(teacher_id)
    return None


# 示例 Controller (保持不变)

# 获取学校信息 (校长权限)
@app.route('/schools/<int:school_id>', methods=['GET'])
@require_permission(resource_type='school', action='view')
def get_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({'message': 'School not found'}), 404
    return jsonify({'id': school.id, 'name': school.name})

# 编辑学校信息 (校长权限)
@app.route('/schools/<int:school_id>', methods=['PUT'])
@require_permission(resource_type='school', action='edit')
def update_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({'message': 'School not found'}), 404
    data = request.get_json()
    school.name = data.get('name', school.name)
    db.session.commit()
    return jsonify({'message': 'School updated successfully'})

# 获取班级学生列表 (教师权限)
@app.route('/classes/<int:class_id>/students', methods=['GET'])
@require_permission(resource_type='student', action='view') # 注意这里资源类型是 student，因为要控制对学生的访问
def get_class_students(class_id):
    class_obj = Class.query.get(class_id)
    if not class_obj:
        return jsonify({'message': 'Class not found'}), 404
    students = Student.query.filter_by(class_id=class_id).all()
    student_list = [{'id': s.id, 'name': s.name} for s in students]
    return jsonify(student_list)

# 获取学生个人信息 (学生权限)
@app.route('/students/<int:student_id>', methods=['GET'])
@require_permission(resource_type='student', action='view')
def get_student_info(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    return jsonify({'id': student.id, 'name': student.name, 'class_id': student.class_id})

# 获取学生成绩 (学生权限)
@app.route('/students/<int:student_id>/grades', methods=['GET'])
@require_permission(resource_type='student_grade', action='view')
def get_student_grades(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    grades = StudentGrade.query.filter_by(student_id=student_id).all()
    grade_list = [{'subject': g.subject, 'grade': g.grade} for g in grades]
    return jsonify(grade_list)

# 门卫查看学生信息 (门卫权限，工作时间限制)
@app.route('/security/students/<int:student_id>', methods=['GET'])
@require_permission(resource_type='student', action='view')
def security_get_student_info(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404
    return jsonify({'id': student.id, 'name': student.name})

# 门卫查看教师信息 (门卫权限，工作时间限制)
@app.route('/security/teachers/<int:teacher_id>', methods=['GET'])
@require_permission(resource_type='teacher', action='view')
def security_get_teacher_info(teacher_id):
    teacher = Teacher.query.get(teacher_id)
    if not teacher:
        return jsonify({'message': 'Teacher not found'}), 404
    return jsonify({'id': teacher.id, 'name': teacher.name})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
```