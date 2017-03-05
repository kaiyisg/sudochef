from django.shortcuts import render
from django.shortcuts import get_object_or_404, render, render_to_response, redirect
from django.http import  HttpResponseRedirect, HttpResponse
from django.views import generic
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout
from frontend.models import *


import json

# Create your views here.

def home(request):
	return HttpResponse("hello!")

class LoginView(generic.TemplateView):
	model = User
	template_name = 'frontend/login.html'

def login_user(request):
	logout(request)
	username = password = ''
	if request.POST:
		username = request.POST['userid'].lower()
		password = request.POST['password']
		next = request.POST['next']
		user = authenticate(username=username, password=password)

		if user is not None:
			login(request, user)
			if next == "":
				return HttpResponseRedirect('/frontend/recipe')
			else:
				return HttpResponseRedirect(next)
			#return redirect(request.POST.get('next','/'))

	return HttpResponseRedirect(reverse('frontend:login'))

def logout_user(request):
	logout(request)
	return HttpResponseRedirect(reverse('frontend:login'))

def recipe(request):
	with open('recipes.json') as json_data:
		data = json.load(json_data) 
	url_lst = data['recipes']
	recipe_lst = []
	for lst in url_lst:
		recipe = Recipe.objects.create(recipe_name=lst['recipe_name'],
									   recipe = lst['recipe'],
									   priority = lst['priority'],
									   total_duration = int(lst['total_duration']))
		recipe_lst.append(recipe)


	return render(request, 'frontend/recipe.html', {'json': recipe_lst})

