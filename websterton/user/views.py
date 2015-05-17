# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, request, session
from flask.ext.login import login_required

blueprint = Blueprint("user", __name__, url_prefix='/users',
                        static_folder="../static")


@blueprint.route("/")
@login_required
def members():
    return render_template("users/members.html")


@blueprint.route("/settings/")
@login_required
def settings():
	print session['user_id']
	return render_template("users/settings.html")
