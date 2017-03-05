# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20161212174138 on 2017-03-05 09:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipe_name', models.CharField(max_length=255)),
                ('recipe', models.CharField(max_length=10000)),
                ('priority', models.CharField(max_length=255)),
                ('total_duration', models.IntegerField()),
            ],
        ),
    ]