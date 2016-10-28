from django.shortcuts import render
from piano.models import Bookmark, PlayedChord
from rest_framework import serializers, viewsets


def index(request):
    bookmarks = Bookmark.objects.all().values_list('start_location', flat=True)
    return render(request, 'index.html', {
        'bookmarks': bookmarks
    })


class PlayedChordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PlayedChord
        exclude = ('created_on', 'updated_on')


class PlayedChordViewSet(viewsets.ModelViewSet):
    queryset = PlayedChord.objects.all()
    serializer_class = PlayedChordSerializer
