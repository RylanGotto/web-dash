# -*- coding: utf-8 -*-
from flask import (Blueprint, request, render_template, flash, url_for,
                    redirect, session)
from flask.ext.login import login_required
from websterton.user.models import User
from random import randint
import os
import praw
import json


SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
blueprint = Blueprint("user_manager", __name__, url_prefix='/user_manager',
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


@blueprint.route("/save_user_settings", methods=["GET", "POST"])
@login_required
def save_user_settings():
	
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


@blueprint.route("/save_new_reddit", methods=["GET", "POST"])
@login_required
def save_new_reddit():
	r = praw.Reddit(user_agent='a_new_app (By: Rylan Gotto)')
	info = request.args.to_dict()
	user = load_user(info['user_id'])
	info.pop('user_id')
	new_key = ""
	for i, k in info.iteritems():
		new_key = i
		upvote_limit = k

	monitored_reddits = json.loads(user.monitored_reddits)

	if monitored_reddits.has_key(new_key) and upvote_limit > 0:
		return "failed", 404
	else:
		for i, k in info.iteritems():
			monitored_reddits.update({i : k})

		user.monitored_reddits = json.dumps(monitored_reddits)
		user.save()
		return "success"


@blueprint.route("/remove_reddit", methods=["GET", "POST"])
@login_required
def remove_reddit():
	r = praw.Reddit(user_agent='a_new_app (By: Rylan Gotto)')
	info = request.args.to_dict()
	user = load_user(info['user_id'])
	info.pop('user_id')

	monitored_reddits = json.loads(user.monitored_reddits)

	for i, k in info.iteritems():
		monitored_reddits.pop(i)
	
	user.monitored_reddits = json.dumps(monitored_reddits)
	user.save()
	return "words"
	
	


def load_user(id):
    return User.get_by_id(int(id))


