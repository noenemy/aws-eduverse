"""
    Language Tutor Courses
    ~~~~~~~~~~~~~~~~~~~~~~~
    :created date: 10/22/21
    :description:
    :copyright: © 2021 written by soonkeunkim (noenemy@gmail.com)
    :copyright: © 2021 updated by sungshik (liks79@gmail.com)
    :license: BSD 3-Clause License, see LICENSE for more details.
"""
import json
from flask import current_app as app
from flask import Blueprint, make_response, jsonify
from werkzeug.exceptions import InternalServerError
from model import CourseModel, course_deserialize, lecture_deserialize, unit_deserialize

course = Blueprint('courses', __name__)


@course.route('/', methods=['GET'], strict_slashes=False)
def list_courses():

    try:
        result_it = CourseModel.course_order_index.scan(limit=30)
        courses = [course_deserialize(course) for course in result_it]
        response = make_response(jsonify({'listCourses': {'items': courses}}), 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve course list failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')


@course.route('/<course_id>', methods=['GET'], strict_slashes=False)
def get_course(course_id):

    try:
        result_it = CourseModel.get(course_id, 'course')
        course = course_deserialize(result_it)
        response = make_response(jsonify({'listCourses': {'items': course}}), 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve course information failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')


@course.route('/<req_id>/lectures', methods=['GET'], strict_slashes=False)
def list_lectures(req_id):

    try:
        result_it = CourseModel.lecture_order_index.scan(CourseModel.course_ref.startswith(req_id), limit=30)
        lectures = [lecture_deserialize(lecture) for lecture in result_it]
        response = make_response(jsonify({'listCourses': {'items': lectures}}), 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve lecture list failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')


@course.route('/<req_id>/lectures/<lec_id>', methods=['GET'], strict_slashes=False)
def get_lecture(req_id, lec_id):

    try:
        lecture = CourseModel.get(lec_id, 'lecture')
        response = make_response(jsonify({'listCourses': {'items': lecture_deserialize(lecture)}}), 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve lecture item failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')


@course.route('/<req_id>/lectures/<lec_id>/units', methods=['GET'], strict_slashes=False)
def list_units(req_id, lec_id):

    try:
        result_it = CourseModel.unit_order_index.scan(CourseModel.lecture_ref.startswith(lec_id), limit=30)
        units = [unit_deserialize(unit) for unit in result_it]
        response = make_response(jsonify({'listCourses': {'items': units}}), 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve unit list failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')


@course.route('/<req_id>/lectures/<lec_id>/units/<unit_id>/steps', methods=['GET'], strict_slashes=False)
def list_steps(req_id, lec_id, unit_id):

    try:
        steps = CourseModel.get(unit_id, 'unit')
        json_ = json.loads(steps.steps)

        response = make_response(json_, 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve unit list failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')



@course.route('/admin/steps/<unit_id>', methods=['GET'], strict_slashes=False)
def get_steps(unit_id):

    try:
        steps = CourseModel.get(unit_id, 'unit')
        data = str(steps.steps).replace('""', '"')

        # json_ = json.loads(data, strict=False)

        response = make_response(data, 200)
        return response

    except Exception as e:
        app.logger.error('Retrieve unit list failed: {0}'.format(e))
        raise InternalServerError('Something went wrong..')

