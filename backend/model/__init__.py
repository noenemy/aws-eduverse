import uuid
import config
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute, MapAttribute
from pynamodb.indexes import GlobalSecondaryIndex, LocalSecondaryIndex, IncludeProjection, AllProjection

AWS_REGION = config.AWS_REGION


class CourseTitleIndex(GlobalSecondaryIndex):
    """
    This class represents a local secondary index
    """

    class Meta:
        # All attributes are projected
        read_capacity_units = 10
        write_capacity_units = 10
        projection = AllProjection()

    _type = UnicodeAttribute(hash_key=True)
    course_title = UnicodeAttribute(range_key=True)


class CourseOrderIndex(GlobalSecondaryIndex):
    """
    This class represents a local secondary index
    """

    class Meta:
        # All attributes are projected
        read_capacity_units = 10
        write_capacity_units = 10
        projection = AllProjection()

    _type = UnicodeAttribute(hash_key=True)
    course_order = NumberAttribute(range_key=True)


class LectureIndex(GlobalSecondaryIndex):
    """
    This class represents a local secondary index
    """

    class Meta:
        # All attributes are projected
        read_capacity_units = 10
        write_capacity_units = 10
        projection = AllProjection()

    _type = UnicodeAttribute(hash_key=True)
    lecture_order = NumberAttribute(range_key=True)


class UnitIndex(GlobalSecondaryIndex):
    """
    This class represents a local secondary index
    """

    class Meta:
        # All attributes are projected
        read_capacity_units = 10
        write_capacity_units = 10
        projection = AllProjection()

    _type = UnicodeAttribute(hash_key=True)
    unit_order = NumberAttribute(range_key=True)


class CourseModel(Model):
    """
    Language Tutor Course Model
    """

    class Meta:
        table_name = 'Course'
        region = AWS_REGION

    id = UnicodeAttribute(hash_key=True)
    _type = UnicodeAttribute(range_key=True)

    course_title_index = CourseTitleIndex()
    course_title = UnicodeAttribute(null=True)

    course_order_index = CourseOrderIndex()
    course_order = NumberAttribute(null=True)

    icon = UnicodeAttribute(null=True)
    course_ref = UnicodeAttribute(null=True)
    lecture_title = UnicodeAttribute(null=True)
    lecture_order_index = LectureIndex()
    lecture_order = NumberAttribute(null=True)

    lecture_ref = UnicodeAttribute(null=True)
    unit_title = UnicodeAttribute(null=True)
    unit_order_index = UnitIndex()
    unit_order = NumberAttribute(null=True)

    tutor_character = UnicodeAttribute(null=True)
    tutor_gender = UnicodeAttribute(null=True)
    tutor_voice = UnicodeAttribute(null=True)
    language = UnicodeAttribute(null=True)

    # step_order = NumberAttribute(null=True)
    # steps = MapAttribute(default={})
    steps = UnicodeAttribute(null=True)


def course_deserialize(course):
    course_json = {}
    course_json['course_title'] = course.course_title
    course_json['id'] = course.id
    course_json['type'] = course._type
    course_json['icon'] = course.icon
    course_json['tutor_character'] = course.tutor_character
    course_json['tutor_gender'] = course.tutor_gender
    course_json['tutor_voice'] = course.tutor_voice
    course_json['language'] = course.language
    return course_json


def lecture_deserialize(lecture):
    lecture_json = {}
    lecture_json['lecture_title'] = lecture.lecture_title
    lecture_json['id'] = lecture.id
    lecture_json['lecture_order'] = lecture.lecture_order
    return lecture_json


def unit_deserialize(unit):
    unit_json = {}
    unit_json['unit_title'] = unit.unit_title
    unit_json['id'] = unit.id
    unit_json['unit_order'] = unit.unit_order
    return unit_json


if not CourseModel.exists():
    CourseModel.create_table(read_capacity_units=10, write_capacity_units=10, wait=True)