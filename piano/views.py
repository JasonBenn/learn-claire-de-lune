from django.shortcuts import render
from django.http import JsonResponse
from piano.models import Bookmark, Performance


def index(request):
    bookmarks = Bookmark.objects.all()
    return render(request, 'index.html', {
        'bookmarks': bookmarks
    })


# Create your views here.
