from __future__ import unicode_literals

from django.db import models
import uuid


class PlayedChord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.UUIDField(default=uuid.uuid4, editable=False)
    total_ticks = models.IntegerField(db_index=True)
    delay = models.IntegerField()
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class Bookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_location = models.BigIntegerField(db_index=True)
    end_location = models.BigIntegerField(db_index=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
