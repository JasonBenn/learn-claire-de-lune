from __future__ import unicode_literals

from django.db import models
import uuid


class Play(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class PlayedChord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    play = models.ForeignKey(Play, db_index=True)
    total_ticks = models.IntegerField(db_index=True)
    delay = models.DateTimeField()
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)


class Bookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_location = models.BigIntegerField(db_index=True)
    end_location = models.BigIntegerField(db_index=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
