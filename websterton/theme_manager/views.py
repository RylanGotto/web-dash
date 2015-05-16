# -*- coding: utf-8 -*-
from flask import (Blueprint, request, render_template, flash, url_for,
                    redirect, session)
from flask.ext.login import login_required
from websterton.user.models import User
from random import randint
import os

SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
blueprint = Blueprint("theme_manager", __name__, url_prefix='/theme_manager',
                        static_folder="../static")


@blueprint.route("/get_new_background")
@login_required
def get_new_background():
	user_id = request.args.get('user_id')
	theme = request.args.get('current_theme')
	path = os.path.join(SITE_ROOT, "../static", theme)
	print path
	backgrounds = os.listdir(path)[1:]
	new_background_num = randint(0,len(backgrounds)-1)
	return url_for('static', filename='%s/%s' % (theme, backgrounds[new_background_num]))


@blueprint.route("/test", methods=["GET", "POST"])
@login_required
def test():
	
	user_info = request.args.to_dict()
	user = load_user(user_info['user_id'])
	print user.news_feed
	news_feed = {}
	for i, k in user_info.iteritems():
		if i == 'theme':
			user.current_theme = k
		elif i != 'theme' and i != 'user_id':
			news_feed.update({i:k})
	
	user.news_feed = news_feed
	user.save()
	return "theme changed"



def load_user(id):
    return User.get_by_id(int(id))


