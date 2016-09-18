from django.shortcuts import render
from django.http import JsonResponse
from piano.models import Bookmark, Performance


def index(request):
    bookmarks = Bookmark.objects.all().values_list('start_location', flat=True)
    return render(request, 'index.html', {
        'bookmarks': bookmarks
    })


def performances(request):
    performances = Performance.objects.all()
    return JsonResponse(performances)

