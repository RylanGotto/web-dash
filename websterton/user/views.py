# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, request, session
from flask.ext.login import login_required
from websterton.user.models import User
import json

blueprint = Blueprint("user", __name__, url_prefix='/users',
                        static_folder="../static")


@blueprint.route("/")
@login_required
def members():
    return render_template("users/members.html")


@blueprint.route("/settings/")
@login_required
def settings():
	user = load_user(session['user_id'])
	reddits = json.loads(user.monitored_reddits)
	print type(reddits)
	return render_template("users/settings.html", reddits=reddits)


def load_user(id):
    return User.get_by_id(int(id))