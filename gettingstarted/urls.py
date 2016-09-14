from django.conf.urls import include, url

from django.contrib import admin

from piano import views

admin.autodiscover()

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/performances/', views.performances),
    url(r'^admin/', include(admin.site.urls))
]
