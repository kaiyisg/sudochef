from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Recipe(models.Model):
	recipe_name = models.CharField(max_length = 255)
	recipe = models.CharField(max_length = 10000)
	priority = models.CharField(max_length = 255)
	total_duration = models.IntegerField()

	def __str__(self):
		return "Recipe[%d] - %s" %(self.id,self.recipe_name)

# class Ingredient(model.models):
# 	recipe = models.ForeignKey("Recipe", on_delete=models.DO_NOTHING)