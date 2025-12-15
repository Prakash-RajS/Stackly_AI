"""
URL configuration for my_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('appln.urls')) #used to connect url with appln/urls.py
]
"""
"""#Update this for wokinf with react.js
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),  # React index.html
]"""
"""from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Catch-all route for React - must be last
    path('', TemplateView.as_view(template_name='index.html')),
]

"""

from django.contrib import admin
from django.urls import path, include
from appln import views 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('auth/', include('appln.urls')), #for auth0
    path('auth/', include('social_django.urls')),  # For social authentication
    path('signup/', include('appln.urls')),
    # path('', views.signup_view, name='home'),  # Add this line for the root URL
    path('stackly_admin/', include('stackly_admin.urls')),
]
#check "auth0 update" comment
# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
