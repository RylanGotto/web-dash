# -*- coding: utf-8 -*-
'''Public section, including homepage and signup.'''
from flask import (Blueprint, request, render_template, flash, url_for,
                    redirect, session)
from flask.ext.login import login_user, login_required, logout_user

from websterton.extensions import login_manager
from websterton.user.models import User
from websterton.public.forms import LoginForm
from websterton.user.forms import RegisterForm
from websterton.utils import flash_errors
from websterton.database import db
import websterton.oauth.google_oauth as google_oauth

import argparse
import httplib2
import os
import base64



blueprint = Blueprint('public', __name__, static_folder="../static")

@login_manager.user_loader
def load_user(id):
    return User.get_by_id(int(id))


@blueprint.route("/", methods=["GET", "POST"])
def home():
    form = LoginForm(request.form)
    return render_template("public/home.html", form=form)

@blueprint.route('/logout/')
@login_required
def logout():
    logout_user()
    flash('You are logged out.', 'info')
    return redirect(url_for('public.home'))

@blueprint.route("/goauth/", methods=['GET', 'POST'])
def oauth():
    return redirect(google_oauth.get_authorization_url('', 'active'))

@blueprint.route("/register/", methods=['GET', 'POST'])
def register():
    try:
        creds = google_oauth.get_credentials(request.args.get('code'), 'active')
        credential_storage = base64.b64encode(str(creds.to_json()))
        info = google_oauth.get_user_info(creds)
        print User.query.filter(User.email == info['email']).first()
        if User.query.filter(User.email == info['email']).first() is None:
            new_user = User.create(username=info['name'],
                            email=info['email'],
                            password='5*Hotel',
                            active=True,
                            credentials=credential_storage)
            login_user(new_user)
            flash(info['name'] + " thank you for registering.", 'success')
        else:
            user = User.query.filter(User.email == info['email']).first()
            login_user(user)
            flash("Hello, " + info['name'] + '!', 'success')
        return redirect(url_for("user.members"))
    except Exception, e:
        print e
        return redirect(url_for('public.home'))

@blueprint.route("/about/")
def about():
    form = LoginForm(request.form)
    return render_template("public/about.html", form=form)
