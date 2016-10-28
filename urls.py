from django.conf.urls import include, url
from django.contrib import admin
from piano import views
from rest_framework import routers

from piano.views import PlayViewSet, PlayedChordViewSet

admin.autodiscover()

# # Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'plays', PlayViewSet)
router.register(r'played-chords', PlayedChordViewSet)

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/', include(router.urls)),
    # url(r'^admin/', include(admin.site.urls))
]
