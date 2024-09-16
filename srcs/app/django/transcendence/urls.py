from django.contrib import admin
from django.urls import path, include
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name = 'index'),
    path('test/', test),
    path('play/', selection, name = 'selection'),
    path('admin/', admin.site.urls),
    path('profiles/', include("userprofiles.urls")),
    path('pong/', include("pong.urls")),
    path('bomberman/', include("bomberman.urls")),
    path('sidebar/', load_sidebar, name='load_sidebar'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
