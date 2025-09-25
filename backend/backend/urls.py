from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("intent/", include("intent.urls")),
    path("auth/", include("userAccounts.urls"))
]
