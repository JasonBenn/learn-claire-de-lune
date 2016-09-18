from __future__ import unicode_literals

from django.core.validators import validate_comma_separated_integer_list
from django.db import models


class Performance(models.Model):
    start_location = models.BigIntegerField(db_index=True)
    end_location = models.BigIntegerField(db_index=True)
    total_seconds = models.SmallIntegerField()
    mistakes = models.TextField(validators=[validate_comma_separated_integer_list], null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class Bookmark(models.Model):
    start_location = models.BigIntegerField(db_index=True)
    end_location = models.BigIntegerField(db_index=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
