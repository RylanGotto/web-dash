# -*- coding: utf-8 -*-
from flask import (Blueprint, request, render_template, flash, url_for,
                    redirect, session)
from flask.ext.login import login_required
from websterton.user.models import User
from random import randint
from forismatic import Forismatic
import os
import praw
import json


SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
blueprint = Blueprint("user_manager", __name__, url_prefix='/user_manager',
                        static_folder="../static")


@blueprint.route("/get_new_background")
@login_required
def get_new_background():
	user = load_user(session['user_id'])
	theme = user.current_theme
	path = os.path.join(SITE_ROOT, "../static", theme)
	print path
	backgrounds = os.listdir(path)[1:]
	new_background_num = randint(0,len(backgrounds)-1)
	return url_for('static', filename='%s/%s' % (theme, backgrounds[new_background_num]))


@blueprint.route("/save_user_settings", methods=["GET", "POST"])
@login_required
def save_user_settings():
	
	user_info = request.args.to_dict()
	user = load_user(session['user_id'])
	news_feed = {}
	user.current_theme = user_info.pop('theme')
	user.location = user_info.pop('location')
	print user_info
	for i, k in user_info.iteritems():
			news_feed.update({i:k})
	user.news_feed = news_feed
	user.save()
	return "theme changed"


@blueprint.route("/save_new_reddit", methods=["GET", "POST"])
@login_required
def save_new_reddit():
	info = request.args.to_dict()
	user = load_user(session['user_id'])
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
	info = request.args.to_dict()
	user = load_user(session['user_id'])

	monitored_reddits = json.loads(user.monitored_reddits)

	for i, k in info.iteritems():
		monitored_reddits.pop(i.strip())
	
	user.monitored_reddits = json.dumps(monitored_reddits)
	user.save()
	return "deleted"

@blueprint.route("/get_user_location", methods=["GET", "POST"])
@login_required
def get_user_location():
	return load_user(session['user_id']).location
	
@blueprint.route("/get_quote", methods=["GET", "POST"])
@login_required
def get_quote():
	# Initializing manager
	f = Forismatic()
	q = f.get_quote()
	quote = {'quote':q.quote, 'author': q.author}
	print quote
	return json.dumps(quote)
	

def load_user(id):
    return User.get_by_id(int(id))


